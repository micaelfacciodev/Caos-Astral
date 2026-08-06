# Caos Astral, Front estático

Site multi-página estático (HTML + CSS puro, sem framework/build step).
Feito pra ser fácil de qualquer agente de código plugar dado dinâmico.

## Estrutura
- `assets/style.css`, design system único, compartilhado por todas as páginas. Não duplicar tokens inline.
- `assets/flash-decor.js`, puxa arte decorativa de `simbolos_astrologicos` (Supabase) em qualquer página
- `assets/iching-engine.js`, motor do Oráculo
- `index.html`, landing
- `manifesto.html`, `intento.html`, filosofia
- `ritual-de-entrada.html`, onboarding, antes do Kit
- `kit.html`, `retorno.html`, `ressonancia.html`, `ancora.html`, produto astrológico (motor principal)
- `deriva.html`, diário/laboratório fenomenológico
- `aura_flow.html`, componente visual (canvas de partículas/vórtice), carregado em overlay de dentro de `deriva.html` via `?layer=`. Não é página de navegação, não tem e não deve ter menu.
- `oraculo.html`, I Ching; vocabulário isolado do kit por decisão de projeto, identidade visual já unificada com o resto do site (ver glossário)
- `raizes.html` + `raizes-magia-do-caos.html`, `raizes-astrologia.html`, `raizes-i-ching.html`, `raizes-cena-do-grau.html`, `raizes-berilo-faccio.html`, história/proveniência
- `enciclopedia.html` + `enciclopedia-simbolo.html`, `-mapa`, `-previsao`, `-arquetipo`, `-pratica`, `-crenca`, `-consciencia`, `-interpretacao`, verbetes por pergunta fundamental, não por tradição (stub, alta prioridade de aprofundamento)
- `blog.html` + `blog-eco.html` (exemplo), conteúdo
- `diario.html`, área privada (requer auth)
- `planos.html`, pricing
- `admin-simbolos.html`, `admin-iching.html`, hub de admin, uso interno (não faz parte do fluxo de usuário)
- `graus-caos-astral/`, dados brutos (JSON) das 360 cenas de grau, por signo
- `supabase/migrations/`, schema do banco, ver `CLAUDE.md` seção 4 pra ordem de execução e regra de deploy via GitHub

## Onde plugar o engine
Toda página de produto tem um comentário `<!-- ENGINE: ... -->` marcando exatamente
onde o dado calculado (Supabase) deve substituir o placeholder estático.
Ver também `glossario-caos-astral.md` e `arquitetura-conteudo-caos-astral.md` no
repositório para nomenclatura oficial e mapa de navegação completo.

## Não fazer
- Não renomear termos do glossário sem atualizar o glossário primeiro.
- Não misturar vocabulário do kit com o do Oráculo (I Ching), são tradições
  deliberadamente separadas, ver `oraculo.html` e `raizes-i-ching.html`.

## Progresso — 01/08 a 04/08

Projeto Supabase antigo (EUA) foi deletado e recriado no Brasil
(`pibwwyqjrsdwnzsiremx`). Isso disparou uma reconstrução grande de schema
+ uma sequência de bugs em produção, todos resolvidos nesta janela.
Detalhe completo de cada item (com testes, validação contra Swiss
Ephemeris, harness Node pra Edge Functions, etc.) está no `claude.md`,
seção 9 — isto aqui é só o resumo.

**Front-end unificado**
- Header, footer e o CTA de login/cadastro deixaram de ser hardcoded por
  página e viraram fonte única (`assets/site-chrome.js`) — menu, footer e
  estado de sessão (Entrar vs. e-mail logado) iguais em toda página.
- Widget fixo "Céu agora" (`assets/ceu-agora.js`): posição de todos os
  planetas + Quíron + Lilith verdadeira + aspectos ativos, calculado no
  navegador, sem depender de nenhum backend.
- `kit.html`: o mapa astral deixou de ser um SVG decorativo (glifos em
  posição de pixel fixa) e passou a desenhar o mapa real — ascendente,
  casas, planetas e linhas de aspecto, tudo a partir do dado calculado.

**Schema Supabase reconstruído do zero**
- `0001_schema.sql` até `0016`: todo o schema base (profiles,
  natal_charts, planets, houses, aspects, cenas_grau, daily_readings,
  synastry_readings, solar_returns) mais `simbolos_astrologicos` e
  `enciclopedia_simbolos`, nenhum dos quais tinha sido versionado neste
  repo antes (só existiam em prosa na documentação).
- As 360 cenas de grau e os primeiros verbetes da enciclopédia não
  precisaram ser reescritos — já estavam salvos como JSON no repo
  (`graus-caos-astral/`, `lote_001_enciclopedia.json`), só nunca tinham
  virado seed SQL.

**Bugs de produção resolvidos, em cadeia**
1. RLS de `profiles` sem policy de UPDATE (upsert do ritual de entrada
   falhava silenciosamente).
2. GRANT ausente pra `authenticated`/`anon` em todas as tabelas novas
   (Postgres exige isso antes mesmo de RLS entrar em ação).
3. RLS de `profiles` sem policy de INSERT (upsert vira `INSERT ... ON
   CONFLICT DO UPDATE` por baixo, precisa de policy de INSERT mesmo
   quando o resultado é um update).
4. **Bug de 180° no cálculo do Ascendente** dentro da Edge Function
   `compute-natal-chart` — a fórmula devolvia o Descendente. Achado e
   corrigido depois de validar contra Swiss Ephemeris (`pyswisseph`) em
   3 casos independentes. Afetava o ascendente e as 12 casas de todo
   mapa já calculado, não só um rótulo.
5. `compute-daily-window` retornando 500 sem log de erro: causa era
   CPU Time da Edge Function estourando o limite de 2000ms do plano
   free (fetch desnecessário da tabela `cenas_grau` inteira). Otimizado
   pra buscar só as linhas necessárias.
6. Coluna errada em `daily_readings` (`janela` em vez de `leitura`) —
   último bloqueio antes da Janela do dia calcular de ponta a ponta.

**Estado atual**: cadastro → cálculo do mapa natal → mapa visual no kit
→ janela do dia no dashboard, tudo funcionando de ponta a ponta no
projeto novo.
