# ADENDO CLAUDE.md, Sincronização pós-auditoria (Front ↔ Engine ↔ I Ching)

Cole este bloco no topo do CLAUDE.md existente, ou substitua as seções
correspondentes (1, 4, 7) pelo conteúdo abaixo. Motivo: auditoria do repo
encontrou deriva de vocabulário entre o front (já alinhado com o glossário
oficial) e o CLAUDE.md do engine (ainda usando termos antigos ou inventando
sinônimos não aprovados).

---

## Correção 1, Vocabulário oficial (substituir a tabela da seção 1)

A tabela de vocabulário atual tem três problemas: usa "sigilo" (deveria
ser **âncora de intenção**, decidido há várias sessões), inventa sinônimos
não aprovados ("tensão de eixo", "corrente leve", "fusão"), e não lista
Retorno, O Terceiro, Território de ofício e Cena do grau, que já existem
no glossário oficial.

**Tabela corrigida, usar exatamente estes termos, sem variação:**

| Termo tradicional | Termo Caos Astral |
|---|---|
| Signo solar | **núcleo** |
| Signo lunar | **fome** |
| Ascendente | **máscara** |
| Aspecto tenso (quadratura/oposição) | **fricção** |
| Aspecto harmônico (trígono/sextil) | **corrente** |
| Conjunção | *(sem termo próprio ainda, tratar como caso especial de fricção/corrente conforme os planetas envolvidos, não usar "fusão")* |
| Trânsito do dia | **janela** |
| Trânsito semanal/mensal/anual | **janela estendida** |
| Casa astrológica | **território** |
| Recorte vocacional/carreira (casa 6/10) | **território de ofício** |
| Retrogradação | **eco** |
| Quíron | **cicatriz** |
| Revolução solar (mapa do ano) | **retorno** |
| Compatibilidade / sinastria | **câmara de ressonância** |
| Mapa composto (pontos médios, duas pessoas) | **o terceiro** |
| Interpretação autoral por grau exato (1º-30º) | **cena do grau**, NUNCA "símbolo sabiano" ou "sabian" em qualquer lugar |
| Sigilo / símbolo de intenção | **âncora de intenção**, NUNCA "sigilo" em código, schema ou UI |

Se surgir necessidade de um termo novo, ele **não entra em uso** até ser
adicionado ao `glossario-caos-astral.md` primeiro. Nenhum agente cria
sinônimo próprio, mesmo que pareça mais preciso.

---

## Correção 2, Renomear tabela e referências de sigilo (seção 4)

`sigil_journal` deve ser renomeada. Sugestão: `intent_anchors`.

Isso implica:
- Migration de rename (ou nova tabela + migração de dado, se já houver
  linhas em produção).
- Atualizar toda referência a "sigilo"/"sigil" no texto do CLAUDE.md,
  nomes de coluna, comentários de código e Edge Functions.
- A ferramenta de geração do símbolo em si continua externa ao Supabase
  (como já documentado), só o nome do armazenamento muda.

---

## Correção 3, Renomear tabela de graus (seção 4)

`graus_simbolicos` deve virar **`cenas_grau`** (ou equivalente), para
bater com o nome fechado no glossário (**Cena do grau**, não "Símbolos
Sabianos" nem "graus simbólicos" genérico). Campos internos (`signo`,
`grau`, `decanato`, `tempero`, `imagem`, `leitura`, `versao`) continuam
os mesmos, é renomeação de tabela, não de schema interno.

Confirmar que a pasta `graus-caos-astral/` no repo (fonte dos JSONs) já
segue essa nomenclatura nos textos gerados, o nome do diretório em si
pode ficar como está, o que importa é a tabela final no Supabase e
qualquer rótulo exposto ao usuário.

---

## Correção 4, Tabelas pendentes: Retorno e O Terceiro

O schema atual cobre `natal_charts` (kit) e `synastry_readings` (câmara
de ressonância), mas não tem cobertura explícita para:

- **Retorno** (revolução solar): precisa de tabela própria ou de lógica
  de recálculo anual dentro de uma tabela existente, uma linha por
  usuário por ano, recalculada automaticamente na data em que o núcleo
  natal é recruzado. Sugestão de nome: `solar_returns`
  (`user_id`, `ano`, `data_exata`, `planetas` jsonb, `aspectos` jsonb,
  RLS privado).
- **O Terceiro** (mapa composto): diferente de sinastria, usa pontos
  médios entre dois mapas, não sobreposição direta. Precisa de Edge
  Function própria e, provavelmente, uma tabela própria ou campo
  adicional dentro de `synastry_readings` (ex: coluna `composite_chart`
  jsonb). Decidir com o time se cabe na mesma tabela ou merece tabela
  própria antes de implementar.

Ambas ainda **não têm Edge Function**. Adicionar à lista de pendências
da seção 7.

---

## Correção 5, Oráculo (I Ching): decisão de identidade visual [ATUALIZADO]

**Decisão revertida em sessão posterior**: o Oráculo (tanto a ferramenta de
consulta quanto a página de história) **não mantém mais identidade visual
própria**. Ambos agora usam o design system padrão do site
(`assets/style.css`, fundo preto, IBM Plex + Unbounded, tokens
`--bg`/`--accent`/`--ink` etc.), com apenas CSS específico de widget
(moedas, timeline, cards) em `<style>` escopado por página, mesmo padrão
usado em outras páginas do site. A paleta papel/tinta/cinábrio foi
descartada.

Nomes de arquivo definitivos (correção do que estava escrito antes):
- **`oraculo.html`** é a ferramenta funcional real (não `i-ching.html`,
  que foi apagado). Contém o motor de lançamento de moedas + hexagramas.
  Engine em `assets/iching-engine.js`, dados em
  `iching_legge_oracular_text.json`, imagens das moedas em
  `assets/cara.webp` / `assets/coroa.webp`.
- **`raizes-i-ching.html`** é a página de história (lendas, linha do
  tempo, métodos de consulta, citação do "Homem Superior"), já fundida
  anteriormente, apenas restilizada para o tema escuro padrão nesta
  sessão. `origens-do-iching.html` foi apagado (estava duplicado).
- "I Ching" não aparece no nome de arquivo além destes dois, no resto
  (alt text, comentários) pode aparecer normalmente.



---

## Correção 6, Limpeza de arquivo obsoleto

Apagar `caos-astral-landing.html` (versão single-file antiga da
landing). `index.html` + `assets/style.css` são a fonte de verdade
atual, dois arquivos de landing coexistindo é fonte de confusão sobre
qual é o real.

---

## Correção 7, Login com Google já está configurado (Supabase Auth)

**Google OAuth está habilitado e funcionando no nível do projeto Supabase**
(Authentication → Providers → Google, com Client ID/Secret reais gerados
no Google Cloud Console, projeto "Caos Astral"). Isso não é mais um
placeholder, qualquer página do site pode chamar
`supabase.auth.signInWithOAuth({ provider: 'google' })` e o login
funciona de verdade, sem precisar configurar mais nada no lado do
Google/Supabase.

Implementação de referência: `oraculo.html` já usa isso, tem barra de
login/logout própria (`assets/iching-engine.js` expõe um hook
`window.onIChingCastComplete` chamado ao final de cada consulta, que
`oraculo.html` usa pra salvar em `iching_readings` quando há sessão
ativa). Quem for implementar o login em outras páginas (ex:
`ritual-de-entrada.html`, que ainda tem só o comentário placeholder) pode
seguir o mesmo padrão de `oraculo.html`: mesmo `SUPABASE_URL` e
`SUPABASE_ANON_KEY`, mesma chamada de `signInWithOAuth`.

Callback URL registrada no Google Cloud (não mexer nela sem atualizar
também no Supabase): `https://pvgeramqsatltnvkkpvf.supabase.co/auth/v1/callback`.

Tabela de histórico do Oráculo (`iching_readings`, migration 0006), rodar a migration no SQL Editor se ainda não tiver sido rodada; sem ela,
o login funciona mas o salvamento da consulta falha silenciosamente
(mostra "não foi possível salvar" na tela, sem quebrar a consulta em si).

---

- [ ] Substituir tabela de vocabulário na seção 1 do CLAUDE.md
- [ ] Renomear `sigil_journal` → `intent_anchors` (+ migration)
- [ ] Renomear `graus_simbolicos` → `cenas_grau` (+ migration)
- [ ] Criar tabela/lógica para `solar_returns` (Retorno)
- [ ] Decidir e implementar armazenamento de O Terceiro (tabela própria
      ou coluna em `synastry_readings`)
- [x] Apagar `origens-do-iching.html` (substituído pela versão fundida
      de `raizes-i-ching.html`)
- [x] Decidir destino de `oraculo.html` (resolvido: `oraculo.html` é a
      ferramenta funcional definitiva; `i-ching.html` foi apagado)
- [ ] Apagar `caos-astral-landing.html`
- [ ] Confirmar se a migration `0006_iching_readings.sql` já foi
      rodada no Supabase (login com Google já funciona; falta só isso
      pro histórico do Oráculo salvar de verdade)
- [ ] Adicionar Edge Functions pendentes (sinastria já estava
      pendente; agora também Retorno e O Terceiro) à seção 7
