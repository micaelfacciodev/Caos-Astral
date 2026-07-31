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

## Correção 8, Modelo de preços grátis/avulso/assinatura [NOVO]

Auditoria de CTA encontrou promessas conflitantes entre `planos.html`,
`index.html`, `kit.html` e `ressonancia.html` sobre o que é grátis, o que
é avulso e o que é assinatura. Modelo abaixo é a versão final, decidida
nesta sessão, e já aplicada nos quatro arquivos citados. Qualquer agente
mexendo em copy, pricing ou lógica de acesso deve usar exatamente esta
referência, não inventar variação.

**Kit (grátis, sempre):**
- Mapa astral **calculado por completo** (posições, Quíron incluso), mas
  **leitura em texto resumida**. Distinção importante: o cálculo nunca é
  parcial no grátis, só a interpretação escrita é truncada. Não usar
  "mapa completo" sozinho como benefício do grátis, gera ambiguidade,
  usar "mapa calculado" + "leitura resumida" como dois itens separados.
- Janela diária resumida
- 1 fricção e 1 corrente principais
- Diário de gnose (sem limite conhecido/definido ainda)
- I Ching: 2 perguntas
- Âncoras de intenção: até 2
- Câmara de ressonância + O Terceiro: resultado resumido (corrente ou
  fricção predominante), sem custo

**Assinatura (R$14,90/mês ou R$99/ano):**
- Leitura completa do mapa astral (o cálculo já era completo no grátis,
  aqui libera é a interpretação)
- Janela completa + notificações
- Todos os territórios, frições e correntes
- Cicatriz completa
- Retorno, o mapa do ano
- Câmara de ressonância + O Terceiro: **3 leituras de par por mês**
  inclusas, cada leitura vale para um par específico de pessoas (não é
  compatibilidade genérica, é por par). Depois da 3ª do mês, cobra
  avulso normalmente.
- Âncoras de intenção ilimitadas
- I Ching ilimitado

**Avulsos (sem assinatura, pagamento único):**
- Cicatriz completa: R$19,90
- Câmara de ressonância + O Terceiro, leitura completa: R$24,90 **por
  par de pessoas**. Assinante que já usou as 3 leituras do mês também
  paga esse valor pela 4ª em diante.

**Implicação de schema/engine (adicionar à seção 4/7 quando for
implementar):**
- `synastry_readings` (ou onde ficar O Terceiro, ver Correção 4) precisa
  de contador de uso mensal por usuário assinante, pra saber quando as 3
  leituras gratuitas do mês acabaram e a próxima cobra avulso. Resetar
  no ciclo de cobrança da assinatura, não no calendário civil.
- Cada linha de leitura de par precisa registrar **os dois lados do
  par** (ex: `user_id` + `partner_id` ou `partner_natal_chart_id`), não
  só um id de sessão, porque o mesmo assinante pode ter várias leituras
  de pares diferentes no mesmo mês e cada uma consome uma unidade das 3.
- Pagamento avulso (Cicatriz e O Terceiro) precisa de fluxo de cobrança
  separado do fluxo de assinatura recorrente no gateway escolhido
  (Mercado Pago, Conta Negócio ativada em CPF por ora). Ver histórico da
  conversa de precificação/gateway pra contexto, não repetir aqui.

**Escopo de O Terceiro/Câmara de ressonância, atualização:** não é
sinastria romântica apenas. Cobre qualquer par de pessoas (trabalho,
amizade, família etc.). O copy de `ressonancia.html` já era neutro
("duas pessoas se encontram"), não precisou reescrita, só a nota de
acesso/preço foi corrigida.

**Pendente, ainda não implementado:** opção de calcular mapa de uma
pessoa não cadastrada no site (terceiro), a partir de data, hora e local
de nascimento informados na hora, sem precisar dela ter conta. Necessário
pra O Terceiro/Câmara de ressonância funcionar com quem não é usuário do
Caos Astral. Precisa de formulário próprio e decisão de onde esse "mapa
de terceiro avulso" fica salvo (tabela própria, sem RLS de usuário
dono, ou vinculado só ao criador da consulta).

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
- [ ] Implementar contador mensal de leituras de par (3/mês incluídas na
      assinatura) em `synastry_readings`, resetando no ciclo de
      cobrança do assinante
- [ ] Implementar fluxo de cobrança avulsa (Cicatriz R$19,90, O Terceiro
      R$24,90/par) separado do fluxo de assinatura recorrente
- [ ] Construir formulário de "mapa de terceiro não cadastrado" (data,
      hora, local) pra Câmara de ressonância/O Terceiro funcionar com
      quem não tem conta no site

---

## Anexo, Comparativo com concorrente (Astrolink.com.br), 30/07

Auditoria de 26 telas do Astrolink (referência comercial mainstream)
contra o estado atual do repo, pra identificar o que já existe e pode
ser aproveitado, o que existe mas em formato diferente (por causa do
vocabulário/posicionamento próprios do Caos Astral), e o que é lacuna
real. **Não é recomendação de copiar o tom do Astrolink** — o
posicionamento do Caos Astral é deliberadamente o oposto da astrologia
preditiva comercial (seção 1 do CLAUDE.md); isto é um mapeamento
funcional, não estético.

### O que já existe e pode ser aproveitado como está

| Recurso no Astrolink | Equivalente no Caos Astral | Status |
|---|---|---|
| Formulário de cadastro (cidade/data/hora de nascimento) | `ritual-de-entrada.html` (onboarding) | existe, login Google já funcional |
| Resumo rápido no topo (signo/ascendente/lua) | Cards Núcleo/Máscara/Fome em `kit.html` e `dashboard.html` | existe, vocabulário próprio |
| Roda do mapa astral (wheel chart) | `#kit-wheel-svg` em `kit.html` | existe (placeholder SVG, ver `ENGINE:` linha 78) |
| Posição dos astros (lista planeta/grau/signo) | Bloco `ENGINE:` em `kit.html` linha 105 (Núcleo/Máscara/Fome/Territórios) | existe, aguarda plugue do cálculo real |
| Trânsito do dia / influências ativas | "Janela do dia", `daily_readings` + `compute-daily-window` | existe, calculado de verdade |
| Trânsitos de médio prazo | "Janela estendida" | vocabulário já fechado, sem Edge Function ainda (ver seção 5) |
| Aspectos planetários com orbe | `aspects` table + `rotulo_caos` (fricção/corrente) | existe no motor |
| Casas astrológicas | `houses` table, "território" | existe no motor |
| Retrogradação | "Eco" | vocabulário fechado, ver seção 5 |
| Quíron | "Cicatriz" | existe, embutido nas 4 Edge Functions |
| Sinastria/compatibilidade | "Câmara de ressonância", `compute-synastry` | existe, mas só com dados manuais do parceiro (pendência de consentimento pra conta↔conta, seção 7) |
| Mapa composto (pontos médios) | "O Terceiro" | existe, ponto médio + ascendente composto |
| Revolução solar (mapa do ano) | "Retorno", `compute-solar-return` | existe, reescrito do zero em 30/07 |
| Dashboard/hub central com menu lateral | `dashboard.html` | existe, cards de produto + prévia do Diário |
| Diário pessoal | `diario.html` / `diario_gnose` | existe |
| Blog institucional | `blog.html`, `blog-eco.html` | existe |
| Conteúdo educativo por conceito (não por tradição) | `enciclopedia*.html` (9 páginas) | existe como stub, alta prioridade de aprofundamento (ver README) |
| Página de preços | `planos.html` | existe, modelo grátis/assinatura/avulso fechado (Correção 8) |
| Exclusão de conta | Edge Function `delete-account` | existe (Astrolink nem mostra isso nas 26 telas — ponto a favor do Caos Astral) |

### O que existe só em parte, ou em formato diferente

- **Distribuição energética (gráfico de Elementos/Qualidades/Polaridade)**
  do Astrolink não tem equivalente direto — o Caos Astral tem os
  ingredientes (planetas, signos, temperamento em `planets.temperamento`)
  mas não uma visualização agregada desse tipo. Se fizer sentido pro
  produto, dá pra construir em cima do dado que já existe no motor, sem
  Edge Function nova — é só agregação do que `compute-natal-chart` já
  devolve. **Decisão de produto pendente**, não codar sem validar se
  cabe no tom "ferramenta, não personalidade" do Caos Astral (risco de
  virar leitura de traço fixo, o que o produto evita deliberadamente).
- **Horóscopo diário com categorias (Amor, Carreira, Família, Saúde)**:
  a Janela do dia existe e é calculada de verdade, mas não é
  segmentada por área da vida como no Astrolink — hoje é texto único.
  Segmentar por território (casa) já daria essa granularidade sem
  reinventar o motor, mas também é decisão de produto/copy, não só
  técnica.
- **Cena do grau** (interpretação por grau exato, 1º–30º) é uma
  vantagem que o Astrolink **não tem** nas 26 telas analisadas — nenhum
  concorrente mainstream comum oferece isso, é diferencial autoral
  próprio do Caos Astral (360 graus já escritos).

### Lacunas reais (Astrolink tem, Caos Astral não tem e não está no roadmap)

- **Recursos sociais** (visitantes do perfil, "quem me curtiu", buscar
  pessoas, rede de amigos): zero equivalente no Caos Astral. Não consta
  em nenhuma seção do CLAUDE.md como pendência — é ausência por
  posicionamento (produto individual/introspectivo), não esquecimento.
  Só adicionar se for decisão de produto explícita, não é lacuna
  técnica a fechar.
- **App mobile nativo**: Astrolink tem banner fixo de Google
  Play/App Store. Caos Astral é site estático, sem menção a app em
  nenhum lugar do repo. Fora de escopo atual.
- **Contador de urgência / oferta com timer regressivo**: tática de
  conversão do Astrolink, sem equivalente e sem menção no modelo de
  pricing já fechado (Correção 8). Coerente não ter — tom de urgência
  artificial destoa do "tom de voz: nunca 'você vai'" da seção 1.
- **Gate "recurso bloqueado com cadeado + desbloquear"** como padrão
  visual recorrente: o Caos Astral tem paywall (Correção 8), mas não
  necessariamente esse padrão visual específico de grid de barras
  cinzas com cadeado. Se o Front-end quiser usar visualização parecida
  pra sinalizar conteúdo pago (ex: nas frições/correntes extras), é
  decisão de UI a validar com o design system existente
  (`assets/style.css`), não puxar CSS do Astrolink.

### Item aprovado pra spec, Modo claro/escuro (30/07) — IMPLEMENTADO (30/07)

Feedback direto do fundador: gostaria de um **modo claro**, onde a
nebulosa (`#space-bg .nebula`, `assets/style.css` linhas ~299-311) é
substituída por um céu de amanhecer — não é só inverter texto/fundo
(padrão "dark mode" convencional), é trocar o cenário todo mantendo a
mesma metáfora (o céu como pano de fundo do produto, ver seção 1 do
CLAUDE.md).

**Feito nesta sessão (30/07), aplicado nas 33 páginas com o header
padrão (`nav class="wrap"`):**
- Bloco `:root[data-theme="light"]` em `assets/style.css` com paleta
  clara própria (não é a escura com opacidade ajustada): fundo
  `#fbf1e6`, painéis brancos, tinta escura `#2a2016`, accent
  recalibrado (`#c1503f`/`#e0654f`) pra manter contraste sobre claro.
- Nebulosa clara: mesmo seletor CSS puro (`[data-theme="light"] #space-bg
  .nebula`), gradientes radiais em tons de pêssego/rosa/lavanda de
  amanhecer sobre `#fbe4cf`, mesma animação `nebula-drift`, só trocando
  os stops de cor.
- Estrelas (`.stars-static` e `#space-canvas`) ficam com `opacity:0` no
  modo claro — não fazem sentido contra céu de dia. `space-bg.js`
  também pausa o loop de desenho do canvas quando o tema é claro (não
  só esconde visualmente, evita gasto de CPU à toa desenhando algo
  invisível), reagindo tanto ao estado inicial quanto a um evento
  customizado `caosastral:theme` disparado no toggle.
- **`assets/theme-toggle.js`** (novo arquivo): aplica o tema salvo
  (`localStorage`, chave `caosastral-theme`) ou o preferido do sistema
  (`prefers-color-scheme`) assim que o script roda; expõe o toggle via
  botão `#themeToggle`; persiste a escolha manual, que passa a
  sobrepor a preferência do sistema.
- **Snippet anti-flash**: inline `<script>` síncrono inserido logo após
  `<head>` em cada página (antes de qualquer CSS/imagem carregar), lê
  `localStorage`/`prefers-color-scheme` e já aplica `data-theme="light"`
  no `<html>` antes da primeira pintura — evita o flash de escuro→claro
  na carga da página. `theme-toggle.js` (com `defer`) faz a mesma
  checagem depois, de forma idempotente, e cuida da parte interativa
  (clique no botão).
- Botão de alternância (`.theme-toggle`, ícone lua/sol) adicionado no
  header de todas as 33 páginas, ao lado do CTA existente, antes do
  fechamento de `</nav>`.
- `body{ transition: background .4s ease, color .4s ease; }` e
  transições equivalentes na nebulosa/estrelas, pra troca suave entre
  os dois modos em vez de corte seco.

**Não incluído nesta rodada, ainda em aberto:**
- Ícones decorativos do `flash-decor.js` (arte de `simbolos_astrologicos`
  no Supabase) não foram auditados visualmente contra o fundo claro —
  conferir se a arte atual funciona nos dois modos ou precisa de
  variante própria.
- `aura_flow.html` (overlay de canvas dentro de `deriva.html`) não usa o
  header padrão (`nav class="wrap"`) e não foi tocado — não tem botão
  de toggle próprio; herda o `data-theme` do documento pai via CSS
  (`:root[data-theme="light"]`) se estiver na mesma página, mas não foi
  testado especificamente.
- Sem validação de contraste formal (WCAG AA) feita nesta sessão — as
  cores foram escolhidas visualmente, vale conferir com uma ferramenta
  de contraste antes de considerar definitivo.

---

### Item aprovado pra spec, "O céu no momento" (30/07)

Feedback direto do fundador: gostou do widget do Astrolink que mostra a
posição atual de todos os planetas em tempo real (independente do mapa
natal de quem está olhando — é o céu de agora, não a Janela do dia
pessoal). Sem equivalente hoje no Caos Astral. Diferença importante pra
não confundir escopo:

- **Janela do dia** (já existe) = como o céu de agora *conversa com o
  mapa natal da pessoa* — é pessoal, uma linha por usuário por dia,
  `daily_readings`.
- **O céu no momento** (novo, ainda não nomeado no glossário oficial)
  = só a fotografia atual do céu, sem cruzar com ninguém — mesmo dado
  pra qualquer visitante, não precisa de conta nem de mapa natal
  calculado. Pode aparecer solto (ex: sidebar do Dashboard, do Kit, ou
  até da landing pra visitante não logado) como "isca" de conteúdo
  sempre fresco.

**Pendências antes de implementar:**
- Nome oficial em vocabulário Caos Astral — não usar "céu no momento"
  como rótulo final sem passar pelo glossário primeiro (mesma regra da
  seção 1 do CLAUDE.md: nenhum termo novo entra em uso sem entrar no
  `glossario-caos-astral.md` antes). Sugestões a validar com o
  fundador, não decidir sozinho: "O agora", "Céu vivo", "Trânsito
  aberto" — evitar "trânsito" puro porque já é usado tecnicamente em
  outros contextos do produto.
- Tecnicamente é o mais simples de todo o motor: não depende de dado de
  usuário nenhum, só `Astronomy.GeoVector` + `Ecliptic` pros 10-11
  corpos já cobertos, calculado pro instante exato da requisição. Não
  precisa de tabela nova nem de persistência — pode ser Edge Function
  sem estado (`compute-sky-now` ou nome equivalente) ou até calculado
  direto no client se for aceitável expor a lógica de efemérides no
  front (a definir com o time, considerando que o resto do motor já é
  server-side).
- Puxando do Astrolink como referência de exibição (não de nome): lista
  planeta → grau → signo, com destaque pra Lua (fase atual, já que o
  Caos Astral não tem página de Ciclo Lunar ainda — outra lacuna que
  não estava no comparativo original, mas fica próxima o suficiente
  desse widget pra valer registrar aqui: **Ciclo Lunar/fase da lua
  atual é outro item do Astrolink sem equivalente hoje no Caos
  Astral**, adicionar à lista de lacunas reais acima).

---

### Recomendação de próximo passo

Nenhum item acima de "lacuna real" parece urgente ou alinhado ao
posicionamento do produto — a maior parte do valor do Astrolink já tem
equivalente funcional no Caos Astral, só com vocabulário e tom
diferentes (o que é intencional, não gap). O ganho de comparar os dois
é mais **validação** (o roadmap já cobre o essencial de um produto de
mapa astral) do que uma lista nova de tarefas. Os dois itens que valem
avaliação de produto antes de codar são o gráfico de distribuição
energética e a segmentação da Janela do dia por área de vida — ambos
apoiados em dado que o motor já calcula, sem exigir Edge Function nova.
