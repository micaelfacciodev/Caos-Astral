# Caos Astral — Front estático

Site multi-página estático (HTML + CSS puro, sem framework/build step).
Feito pra ser fácil de qualquer agente de código plugar dado dinâmico.

## Estrutura
- `assets/style.css` — design system único, compartilhado por todas as páginas. Não duplicar tokens inline.
- `assets/flash-decor.js` — puxa arte decorativa de `simbolos_astrologicos` (Supabase) em qualquer página
- `assets/iching-engine.js` — motor do Oráculo
- `index.html` — landing
- `manifesto.html`, `intento.html` — filosofia
- `ritual-de-entrada.html` — onboarding, antes do Kit
- `kit.html`, `retorno.html`, `ressonancia.html`, `ancora.html` — produto astrológico (motor principal)
- `deriva.html` — diário/laboratório fenomenológico
- `aura_flow.html` — componente visual (canvas de partículas/vórtice), carregado em overlay de dentro de `deriva.html` via `?layer=`. Não é página de navegação — não tem e não deve ter menu.
- `oraculo.html` — I Ching; vocabulário isolado do kit por decisão de projeto, identidade visual já unificada com o resto do site (ver glossário)
- `raizes.html` + `raizes-magia-do-caos.html`, `raizes-astrologia.html`, `raizes-i-ching.html`, `raizes-cena-do-grau.html`, `raizes-berilo-faccio.html` — história/proveniência
- `enciclopedia.html` + `enciclopedia-simbolo.html`, `-mapa`, `-previsao`, `-arquetipo`, `-pratica`, `-crenca`, `-consciencia`, `-interpretacao` — verbetes por pergunta fundamental, não por tradição (stub, alta prioridade de aprofundamento)
- `blog.html` + `blog-eco.html` (exemplo) — conteúdo
- `diario.html` — área privada (requer auth)
- `planos.html` — pricing
- `admin-simbolos.html`, `admin-iching.html` — hub de admin, uso interno (não faz parte do fluxo de usuário)
- `graus-caos-astral/` — dados brutos (JSON) das 360 cenas de grau, por signo
- `supabase/migrations/` — schema do banco, ver `CLAUDE.md` seção 4 pra ordem de execução e regra de deploy via GitHub

## Onde plugar o engine
Toda página de produto tem um comentário `<!-- ENGINE: ... -->` marcando exatamente
onde o dado calculado (Supabase) deve substituir o placeholder estático.
Ver também `glossario-caos-astral.md` e `arquitetura-conteudo-caos-astral.md` no
repositório para nomenclatura oficial e mapa de navegação completo.

## Não fazer
- Não renomear termos do glossário sem atualizar o glossário primeiro.
- Não misturar vocabulário do kit com o do Oráculo (I Ching) — são tradições
  deliberadamente separadas, ver `oraculo.html` e `raizes-i-ching.html`.
