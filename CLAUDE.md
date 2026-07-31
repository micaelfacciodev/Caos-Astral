# CLAUDE.md — Caos Astral

Documento vivo. Atualizar sempre que uma decisão de arquitetura, schema
ou convenção for tomada por qualquer um dos três agentes. Nenhum agente
deve alterar schema compartilhado sem registrar aqui primeiro.

**Fonte de verdade de nomenclatura**: `glossario-caos-astral.md`.
Se um termo não está lá, ele não existe oficialmente — debater antes
de codar, nunca inventar sinônimo próprio.

---

## 1. O que é o produto

**Caos Astral** é o oposto da astrologia comercial preditiva. Não faz
horóscopo genérico nem tenta adivinhar eventos ("você vai brigar com
um amigo hoje"). A base filosófica é a Magia do Caos: crença como
ferramenta, não como verdade. Trânsitos e posições planetárias não
determinam destino — representam correntes de energia e ingredientes
disponíveis. O produto ensina a pessoa a operar essas energias (gnose,
força de vontade, âncoras de intenção, decisão ativa), nunca a esperar
passivamente que elas aconteçam.

### Vocabulário oficial (fonte: glossário — versão corrigida pós-ADENDO)

| Termo tradicional | Termo Caos Astral | Status |
|---|---|---|
| Signo solar | **núcleo** | fechado |
| Ascendente | **máscara** | fechado |
| Signo lunar | **fome** | fechado |
| Casa astrológica | **território** | fechado |
| Lilith Negra (verdadeira/oscilante) | **exílio** | fechado — nome; cálculo em `lilith.ts`, falta integrar |
| Recorte vocacional (casa 6/10) | **território de ofício** | pendente |

> **Ordem de apresentação canônica (29/07): Núcleo, Máscara, Fome,
> Território.** Vale em qualquer lugar que liste as peças em sequência —
> `kit.html` (tabela e cards), `ritual-de-entrada.html` (painel de
> resumo), glossário. Não é ordem alfabética nem de "importância", é a
> ordem decidida pelo autor; manter consistente em conteúdo novo.
> Cicatriz (Quíron) e Exílio (Lilith) são peças complementares, fora
> dessa sequência principal — entram depois, não substituem a ordem
> das quatro centrais.
| Aspecto tenso (quadratura **e** oposição) | **fricção** | fechado |
| Aspecto harmônico (trígono **e** sextil) | **corrente** | fechado |
| Conjunção | **sem termo fixo** — decidida caso a caso (ver seção 5) | fechado conceitualmente, algoritmo provisório |
| Trânsito do dia | **janela** | fechado |
| Trânsito semanal/mensal/anual | **janela estendida** | fechado |
| Retrogradação | **eco** | fechado |
| Quíron | **cicatriz** | fechado |
| Revolução solar (mapa do ano) | **retorno** | fechado |
| Compatibilidade / sinastria | **câmara de ressonância** | fechado |
| Mapa composto (pontos médios) | **o terceiro** | fechado |
| Interpretação autoral por grau exato (1°–30°) | **cena do grau** — nunca "símbolo sabiano"/"sabian" | fechado, 360 escritos |
| Sigilo / símbolo de intenção | **âncora de intenção** — nunca "sigilo" | fechado |
| Marcos (trânsitos lentos: Saturno/Urano/Plutão) | **marcos** | pendente — sem spec técnica |
| Deriva | (ferramenta própria, ver seção 9 — vocabulário/conceito ainda não descrito no glossário oficial) | pendente — confirmar entrada no glossário |

Tom de voz: nunca "você vai" ou "isso significa que você é". Sempre
**ferramenta + escolha em aberto**. Nenhuma conclusão moral fechada.

**Cosmologia** (manifesto/intento, não em UI de produto): Advaita
Vedanta, Hermetismo, Jung, Neoplatonismo como tradições convergentes,
citadas como padrão transcultural, nunca como sistema fechado emprestado.
"**Intento**" (Castaneda) é candidato à mesma seção — **pendente**, não
usar em código ou copy até decisão formal.

**Fora de escopo, por decisão de posicionamento**: Tarot, runas, outros
oráculos (rejeitado). Numerologia: standby, fase futura.

**Monetização**: pendente de desenho (ex: preview parcial de ~15% do
texto na conta grátis, cogitado mas não decidido). Não bloqueia o
trabalho de engine/schema em curso — só entra quando explicitamente
priorizado.

---

## 2. Os três agentes

| Agente | Responsabilidade | Não deve fazer |
|---|---|---|
| **Este agente (Claude — "a máquina")** | Schema Supabase, RLS, SQL, Edge Functions, motor de cálculo astrológico, dados de referência (cenas do grau) | Front-end, telas, I Ching |
| **Agente de Front-end** | Site estático (HTML/CSS puro, sem build step), fluxo de onboarding (`ritual-de-entrada.html`), conectar telas às Edge Functions nos pontos `<!-- ENGINE: ... -->`, agora com **acesso de escrita ao repo** (commita direto — ver seção 9) | Schema do banco, cálculo astrológico |
| **Agente de I Ching** | `iching_readings` (tabela própria), tradução de Legge (1882, domínio público) | Alterar tabelas do Caos Astral diretamente, usar vocabulário do kit (núcleo/fricção/território etc.) |

### Mapa do site (referência: `arquitetura-conteudo-caos-astral.md`)
```
/ (landing) · /manifesto · /intento · /raizes (+ 4 subpáginas de proveniência)
/ritual-de-entrada (onboarding) · /kit · /retorno · /ressonancia · /ancora
/deriva · /oraculo (tema escuro padrão) · /diario · /blog · /planos
```
Menu canônico atual (12 itens): Kit, Retorno, O Terceiro, Âncora, Deriva,
Oráculo, Diário, Raízes, Blog, Manifesto, Intento, Planos.

### Pendências de UI abertas pro front
- `/retorno` precisa de um campo de **localização do ano** ("onde você vai
  passar esse ano") — não é a mesma coisa que a cidade de nascimento.
  Reaproveitar a mesma busca de cidade (Nominatim) já usada no onboarding.
  Sem isso preenchido, `compute-solar-return` recusa calcular (ver seção 5).
- **Câmara de ressonância / O Terceiro**: `compute-synastry` já existe
  (seção 5), mas só aceita dados manuais do parceiro por enquanto — tela
  de `/ressonancia` precisa de formulário de nascimento do parceiro, não
  de busca por usuário já cadastrado (ver pendência de consentimento,
  seção 7).
- **Âncora de Intenção**: o gerador de selo já está real no front (seção
  9), mas ainda não persiste em `intent_anchors` — integração de
  salvamento ainda não fechada com o agente da máquina.
- **Dashboard (novo, 30/07)**: página ainda não existe. `ritual-de-
  entrada.html` step 4 hoje aponta pra `kit` direto (botão "Ver meu
  kit →") — precisa passar a apontar pro Dashboard novo, que vira o hub
  central (cards de produto + Janela do dia + prévia do Diário). Ver
  glossário e seção 8 pra definição completa.

---

## 3. Propriedade intelectual — regras já resolvidas, não reabrir

- **Cena do grau**: sistema 100% autoral do Caos Astral. **Não deriva do
  mapeamento grau-a-grau de nenhuma fonte histórica** — Jones (1953) e
  Rudhyar (1936) permanecem protegidos por direito autoral, e não existe
  confirmação segura de uma publicação isolada de 1925 que seja domínio
  público (channeling privada ≠ publicação). Apenas o *formato* geral
  (uma cena simbólica por grau) segue a tradição do gênero — isso sim é
  livre. **Nunca usar "sabian"/"símbolo sabiano" em código, schema,
  comentário ou copy.** Já escrito e semeado: 360 graus, tabela
  `cenas_grau`.
- **I Ching**: tradução de James Legge (1882/1899), domínio público
  confirmado (autor morto em 1897). Fonte deve ser texto limpo (ex:
  sacred-texts.com), não PDF escaneado sem verificação — já conferido:
  o texto em uso bate estilisticamente com o Legge original.
- Antes de usar qualquer material histórico de terceiros como fonte de
  dado — nem como "inspiração" de estrutura grau-a-grau — verificar
  status de domínio público pela data de **publicação real**, não de
  criação/canalização.

---

## 4. Schema Supabase — estado atual

```
supabase/
  migrations/
    0000_reset.sql                            -- teardown completo (usar só se precisar zerar tudo de novo)
    0001_schema.sql                            -- tabelas base + RLS + trigger
    0002_natal_charts_unique.sql               -- unique(user_id) em natal_charts
    0003_adendo_vocabulario_e_tabelas.sql       -- renomes + solar_returns + O Terceiro + temperamento
    0004_solar_return_localizacao.sql           -- latitude/longitude/cidade em solar_returns
    0005_simbolos_astrologicos.sql              -- tabela + bucket pro admin hub de símbolos (spec do front, seção 9)
    0006_simbolos_admin_restrito.sql             -- CORREÇÃO DE SEGURANÇA: restringe escrita ao admin (auth.uid()), não a qualquer autenticado
    0007_intent_anchors.sql                      -- Âncora de Intenção, criada do zero (30/07), só era descrita em prosa até aqui
    0008_diario.sql                              -- Diário (diario_gnose), criada do zero (30/07), escopo já ampliado pra qualquer experiência
    0009_exilio_planeta.sql                      -- Exílio (Lilith) em `planets` — renomeada de 0007 pra 0009 (30/07) por colisão de numeração, ver seção 8
  seed/
    seed_0001_planets_houses_aspects.sql       -- 11 planetas, 12 casas, 5 aspectos
    seed_0002_graus_simbolicos.sql             -- 360 cenas de grau (nome do arquivo desatualizado,
                                                --   tabela final é cenas_grau após o rename da 0003)
  functions/
    compute-natal-chart/index.ts                  -- Exílio e Quíron EMBUTIDOS direto no arquivo (30/07) — sem `_shared/`, ver nota abaixo
    compute-daily-window/index.ts                 -- idem, embutido
    compute-solar-return/index.ts                 -- reescrito do zero (30/07) — Exílio e Quíron embutidos desde o início
    compute-synastry/index.ts                     -- Exílio integrado (30/07), embutido
    delete-account/index.ts                       -- auto-exclusão de conta (30/07), exceção controlada de service_role, ver seção 8
```

> **Nota importante sobre esse diagrama (30/07) — CORREÇÃO de uma
> suposição errada registrada aqui antes:** uma versão anterior deste
> documento descrevia `_shared/lilith.ts` como arquivo separado dentro
> de cada function, com `compute-natal-chart` supostamente já
> funcionando assim. **Isso nunca foi confirmado no ar e, na prática,
> não funciona**: tentativa real de deploy com `_shared/lilith.ts`
> quebrou com erro `"Module not found"` no editor do Dashboard do
> Supabase, em duas functions diferentes (`compute-daily-window` e
> `compute-synastry`), no mesmo dia. **Causa**: o editor de Edge
> Function usado aqui (colar direto, sem terminal) não resolve import
> de arquivo extra dentro da mesma function. **Correção aplicada**: as
> quatro functions foram revisadas pra ter Quíron e Exílio **embutidos
> diretamente em cada `index.ts`**, sem nenhum import de arquivo
> próprio — mesmo que isso duplique a mesma lógica (`computeTrueLilith`,
> `chironGeocentricEclipticLongitude`) nas quatro. **Regra daqui pra
> frente, sem exceção**: nenhuma Edge Function deste projeto usa
> arquivo `_shared/` — todo código auxiliar fica embutido no único
> `index.ts` que é de fato colado no editor do painel.

**Ordem de execução manual (só relevante se a integração GitHub↔Supabase
estiver fora do ar por algum motivo — normalmente 0007 em diante aplica
sozinha via commit em `main`, ver "Integração GitHub ↔ Supabase" abaixo)**:
`0001_schema.sql` → `seed_0001_planets_houses_aspects.sql` →
`seed_0002_graus_simbolicos.sql` → `0002_natal_charts_unique.sql` →
`0003_adendo_vocabulario_e_tabelas.sql` → `0004_solar_return_localizacao.sql`
→ `0005_simbolos_astrologicos.sql` → `0006_simbolos_admin_restrito.sql`

Se precisar zerar tudo de novo por qualquer motivo: rodar `0000_reset.sql`
primeiro (não apaga `simbolos_astrologicos`/bucket — só as tabelas do
motor astrológico; se precisar zerar isso também, apagar manualmente).

### Tabelas — dicionário (RLS: leitura pública, escrita só service_role)
- `planets` — chave, nome_astro, rotulo_caos, glifo, nunca_retrograda, ordem, `temperamento` (benefico/malefico/neutro — só usado pra decidir tom de conjunção, seção 5)
- `houses` — numero (1-12), tema, rotulo_caos
- `aspects` — chave, angulo, orbe, rotulo_caos (**nullable** — null pra conjunção), classe_cor
- `cenas_grau` *(antiga `graus_simbolicos`, renomeada)* — signo, grau (1-30), decanato, tempero, imagem, leitura, versao

### Tabelas — dado de usuário (RLS: privado, `auth.uid()`)
- `profiles` — 1:1 com `auth.users`, criado automaticamente via trigger no primeiro login Google. **Atenção — chave é `id`, não `user_id`** (confirmado via `compute-natal-chart`, que filtra com `.eq("id", user.id)`) — diferente de `natal_charts`/`solar_returns`/etc., que usam `user_id`. Já causou um bug real (30/07): o primeiro rascunho do upsert de `profiles` em `ritual-de-entrada.html` usava `user_id`, corrigido pra `id`. Checar essa chave sempre que escrever query nova contra `profiles`.
- `natal_charts` — uma linha por usuário (upsert). ascendente, meio_ceu, planetas (jsonb), aspectos (jsonb).
- `daily_readings` — uma linha por usuário por dia. `iching_convite_aceito` pro handoff com I Ching (seção 6).
- `synastry_readings` — sinastria (câmara de ressonância). `composite_chart` jsonb é onde O Terceiro vive. **Tem Edge Function: `compute-synastry`** — só funciona com dados manuais do parceiro por enquanto (ver seção 5 e pendência de consentimento, seção 7).
- `solar_returns` — retorno (revolução solar). `user_id`, `ano` (unique juntos), `data_exata`, `latitude`/`longitude`/`cidade` do ano em questão (não é a de nascimento). **Tem Edge Function: `compute-solar-return`.**
- `intent_anchors` *(antiga `sigil_journal`, separada)* — a âncora de intenção em si. **Tabela criada em `0007_intent_anchors.sql` (30/07)** — existe agora como migration real, mas o gerador de selo no front (`ancora.html`) ainda não foi conectado pra gravar nela (integração de salvamento ainda pendente, ver seção 2).
- `diario_gnose` *(antiga `sigil_journal`, separada)* — registro livre de prática, com FK opcional pra `daily_readings` e pra `intent_anchors`. **Tabela criada em `0008_diario.sql` (30/07)**, já com o escopo ampliado (qualquer experiência, `produto_relacionado` nullable, `tipo_experiencia` livre) — ver decisão do fundador na seção 8.

### Tabelas/recursos do admin hub de símbolos (novo, seção 9)
- `simbolos_astrologicos` — galeria de arte pra decoração do site. `titulo`, `image_url`, `tags` (text[]), `decor` (boolean), `created_at`. RLS: **SELECT público** (consultado anonimamente por `flash-decor.js` em qualquer página); INSERT/UPDATE/DELETE só `auth.role() = 'authenticated'` — admin único, sem multi-tenant por enquanto.
- Bucket de Storage `simbolos` — público pra leitura, upload restrito ao admin (ver correção de segurança abaixo). Mesma lógica de RLS aplicada em `storage.objects` filtrando por `bucket_id = 'simbolos'`.
- **Correção de segurança (0006)**: a policy original (`auth.role() = 'authenticated'`) liberava escrita pra QUALQUER usuário cadastrado no site — não só o admin. Como o Caos Astral tem cadastro aberto (Google OAuth) pro produto principal, isso deixaria qualquer cliente comum apagar/subir símbolo na galeria. Corrigido pra `auth.uid() = '<uuid do admin>'::uuid`, tanto na tabela quanto no bucket. **Regra geral daqui pra frente: nunca usar `auth.role() = 'authenticated'` como controle de admin em nenhuma tabela nova — isso significa "qualquer usuário logado", não "o dono do site". Pra admin único, sempre `auth.uid() = <uuid fixo>`.**
- Projeto Supabase: `https://pvgeramqsatltnvkkpvf.supabase.co`. A chave publicável (anon key) está hardcoded em `admin-simbolos.html` e `assets/flash-decor.js` — **isso é seguro**, é a chave protegida por RLS, não a `service_role`; não reabrir essa discussão sem motivo novo.

### Autenticação
Login via Google OAuth nativo do Supabase Auth. Config manual no
Dashboard (Authentication → Providers → Google). Não é SQL.

### Deploy sem terminal
SQL Editor pra migrations/seeds; Edge Functions → Deploy a new function
→ **Via Editor** (colar o `index.ts` inteiro) → Deploy. Usuário responsável
não usa terminal (iMac 2011) — todo caminho de deploy deve assumir
navegador, nunca CLI como único caminho.

### Integração GitHub ↔ Supabase (deploy automático de migrations)

Ativado em Project Settings → Integrations → GitHub, com "Deploy to
production" ligado, branch de produção `main`, working directory `.`.

**Regra a partir de agora: todo schema muda primeiro no repo.**
- Qualquer alteração de tabela/coluna/RLS/policy nasce como um arquivo
  `.sql` novo em `supabase/migrations/`, seguindo a numeração sequencial já
  usada (`0007_...`, `0008_...`).
- O arquivo vai pro GitHub via commit na branch `main`. O Supabase aplica
  sozinho no banco de produção quando o commit chega lá — não precisa mais
  colar SQL manualmente no SQL Editor pra rodar migration nova.
- O commit em si passa a ser o log: quem mudou o quê e quando fica no
  histórico do GitHub, não só na cabeça de quem rodou.
- **SQL Editor do painel Supabase vira só leitura/depuração** (`SELECT`,
  checar dado, testar query pontual) — não é mais onde uma mudança de
  schema é decidida e aplicada sem deixar rastro em lugar nenhum.

**Limitações a ter em mente (plano Free, sem terminal):**
- Não existe branch de preview/staging aqui — sem plano Pro, qualquer
  migration que chegar na `main` vai direto pra produção, sem ambiente
  intermediário de teste. Revisar o `.sql` com cuidado antes do commit
  importa mais ainda por causa disso.
- Isso não é retroativo: só cobre migrations novas a partir de agora.
  Mudança feita direto no painel (Table Editor ou SQL Editor, sem virar
  arquivo) continua sem registro em lugar nenhum — e recuperar isso depois
  exigiria `supabase db diff` via CLI, que não é o fluxo padrão deste
  projeto (ver "Deploy sem terminal" acima).

---

## 5. Motor de cálculo astrológico

- **Efemérides reais** via `astronomy-engine`. Usar `GeoVector` + `Ecliptic`
  (geocêntrico) — **nunca `EclipticLongitude`** (heliocêntrica, quebra pro Sol).
- **Quíron**: fora da astronomy-engine. Kepleriana de dois corpos
  (elementos JPL SBDB, época 2021-Jul-01). Sem correção de perturbação —
  aceitável pra uso pessoal.
- **Lilith → "Exílio" (30/07): integrado nas quatro Edge Functions,
  embutido em cada uma.** Nome de vocabulário fechado. Código
  (`computeTrueLilith`) embutido direto em cada `index.ts`
  (`compute-natal-chart`, `compute-daily-window`, `compute-solar-return`,
  `compute-synastry`) — **nenhum import de `_shared/lilith.ts`** (ver
  correção na seção 4: esse padrão de arquivo separado quebrava o
  deploy). Requer a migration `0009_exilio_planeta.sql` (linha `exilio`
  em `planets`, temperamento `neutro`) — sem ela, rótulos ficam
  `undefined`. Método: apogeu osculador via vetores de estado da Lua
  (`GeoMoonState`, rotacionado pra eclíptica) + GM combinado Terra+Lua
  (`MassProduct(Body.EMB)`) — é o mesmo conceito da "True Lilith" (h21) da
  Swiss Ephemeris, não a versão média. **Validado**: método bate com a
  definição padrão; excentricidade calculada fica na faixa física real
  (~0.026–0.077); movimento retrógrado mensal confirmado em teste de 60
  dias. **Não validado**: comparação grau-a-grau contra efeméride de
  referência publicada (ex: astro.com, código h21) pra uma data
  específica — fazer isso antes de considerar pronto pra produção, erro
  esperado de poucos minutos de arco, erro de vários graus = bug.
- **Ascendente/Meio-do-Céu**: GMST + obliquidade + latitude, cálculo real,
  exige hora de nascimento exata.
- **Casas**: signo inteiro (decisão deliberada).
- **Grau em andamento**: `floor(grau_na_casa) + 1` — não `ceil` puro, não
  arredondamento pro mais próximo (14°20' já completou 14°, cursa o 15°).
  Bug de `ceil` já corrigido, não reintroduzir.
- **Aspectos**: conjunção (0°/8°), sextil (60°/5°), quadratura (90°/7°),
  trígono (120°/7°), oposição (180°/8°).
- **Rótulo de fricção/corrente**: quadratura e oposição são ambas
  "fricção"; trígono e sextil são ambas "corrente" — **não existem**
  "tensão de eixo" nem "corrente leve" como termos.
- **Conjunção — algoritmo provisório, não fechado**: sem termo fixo por
  decisão do glossário. Implementado em `compute-daily-window`,
  `compute-solar-return` e `compute-synastry` como: os dois planetas
  benéficos clássicos (Vênus, Júpiter) → tom de corrente; os dois
  maléficos clássicos (Marte, Saturno) → tom de fricção; qualquer
  combinação envolvendo planeta neutro, ou um benéfico + um maléfico →
  sem categoria forçada. **Interpretação minha, não decisão fechada do
  time** — revisar antes de considerar definitivo.
- **Fuso horário da janela do dia (corrigido)**: `compute-daily-window`
  agora calcula "hoje" deslocando o relógio pelo `utc_offset` salvo no
  perfil (mesmo dado de nascimento), não pela data UTC crua do servidor.
  Isso evita a janela virar de dia horas antes/depois do calendário local
  de quem tem fuso diferente de UTC. Limitação conhecida: usa o fuso de
  NASCIMENTO como proxy do fuso ATUAL — não perfeito se a pessoa se mudou
  de fuso depois, mas é o melhor dado disponível sem pedir fuso separado.
  O cálculo astronômico em si (posição real dos planetas) sempre usa o
  instante exato (`agora`), só a *etiqueta do dia* (chave de idempotência
  em `daily_readings.data`) usa o horário deslocado.
- **Retorno (revolução solar) — reescrito do zero (29/07).** O
  `compute-solar-return` que estava no ar **não existia de fato**: o
  `index.ts` continha só o snippet de exemplo de invocação do
  front-end (`supabase.functions.invoke(...)`), sem handler nenhum —
  nunca tinha sido implementado, só documentado aqui. Reescrito
  reaproveitando o motor do `compute-natal-chart` (mesmos planetas,
  Quíron, Exílio, casas, aspectos, cenas_grau). Usa
  `Astronomy.SearchSunLongitude` (função pronta da lib, testada — bate
  no grau do Sol até a 4ª casa decimal) em vez de busca binária
  artesanal. **Schema real de `solar_returns` confirmado via
  `information_schema.columns`**: `id, user_id, ano, data_exata,
  planetas, aspectos, computado_em, latitude, longitude, cidade` — **não
  existem colunas `ascendente`/`meio_ceu`** aqui (diferente de
  `natal_charts`); esses dois valores continuam calculados e voltam na
  resposta da function, só não são persistidos como coluna própria.
  **Simplificação assumida numa versão anterior, agora implementada
  (30/07)**: `ano` é opcional no body — se não vier, calcula o retorno
  mais recente já ocorrido (compara a longitude atual do Sol com a
  natal; se o retorno deste ano civil ainda não ocorreu, usa o do ano
  anterior). Busca do instante exato via busca binária (~40 iterações,
  Sol nunca retrograda) sobre `GeoVector`+`Ecliptic`, mesmas primitivas
  já usadas no resto do motor.
  A localização usada pro ascendente/casas do mapa de retorno é a de
  ONDE A PESSOA VAI PASSAR aquele ano — não a de nascimento;
  `compute-solar-return` exige `latitude`/`longitude` no corpo da
  requisição e recusa calcular sem isso.
- **Sinastria e O Terceiro**: `compute-synastry` calcula o mapa do
  parceiro na hora a partir de dados manuais (não lê `natal_charts` de
  outro usuário — ver pendência na seção 7), cruza aspectos entre os dois
  mapas completos (câmara de ressonância), e monta O Terceiro por ponto
  médio de cada planeta (arco mais curto) + ascendente composto = ponto
  médio dos dois ascendentes natais. O composto tem aspectos internos
  próprios, calculados do mesmo jeito que um mapa natal.
- **Rótulos vêm do banco** (`planets.rotulo_caos`, `aspects.rotulo_caos`),
  não hardcoded — editável sem redeploy. `compute-daily-window`,
  `compute-solar-return` e `compute-synastry` já seguem isso;
  `compute-natal-chart` só grava a chave do aspecto (`square`, `trine`
  etc.), o rótulo é decidido por quem lê depois via `aspects`.

---

## 6. Contrato Caos Astral ↔ I Ching

- Tabela própria do I Ching (`iching_readings` ou equivalente), RLS
  privada, mesmo padrão do resto.
- Coluna opcional `daily_reading_id uuid references public.daily_readings(id)`.
- Fluxo: `compute-daily-window` retorna o `id` da leitura → se o usuário
  aceitar o convite ("que tal ver o que o acaso traz"), front passa esse
  id pro fluxo do I Ching → ao salvar a tiragem, grava o id junto →
  `update daily_readings set iching_convite_aceito = true where id = ...`
  (já coberto pela RLS existente).
- I Ching **nunca** usa vocabulário do kit (núcleo, fricção, território
  etc.) — tradição deliberadamente separada. **Identidade visual**: já
  convertida pro tema escuro padrão do site (ver seção 9) — não é mais
  visualmente separada, só o vocabulário continua sendo.
- Nenhum agente altera schema do outro diretamente.

---

## 7. Pendências conhecidas

- [ ] **Sinastria entre duas contas registradas**: hoje `compute-synastry`
      só aceita dados manuais do parceiro — RLS de `natal_charts` bloqueia
      ler o mapa de outro usuário. Precisa de mecanismo de consentimento
      (ex: tabela de convites aceitos + policy adicional) antes de
      suportar `partner_user_id` de verdade.
- [ ] Migrar rótulos hardcoded de `compute-natal-chart` pra buscar do
      banco, se algo vier a depender de rótulo de planeta/aspecto ali
      (hoje só grava a chave do aspecto, não é urgente).
- [ ] Confirmar/ajustar o algoritmo provisório de conjunção (seção 5) com o time.
- [ ] Território de ofício, Marcos, Intento: specs técnicas pendentes, não codar ainda.
- [ ] Confirmar entrada de "Deriva" no glossário oficial — ferramenta já
      existe no front (seção 9), mas não está descrita no
      `glossario-caos-astral.md` ainda.
- [ ] UI do front: campo de "localização do ano" em `/retorno`, formulário
      de nascimento do parceiro em `/ressonancia`, persistência real da
      Âncora de Intenção (ver seção 2).
- [ ] **Itens de arquivo do front**: `caos-astral-landing.html` e
      `raizes-simbolos-sabianos.html` já foram removidos (ver seção 9).
      Ainda em aberto: destino de `oraculo.html` caso tenha ficado
      duplicado após a fusão de identidade visual — conferir.
- [ ] Monetização (paywall, preview parcial, assinatura) — desenho não
      iniciado, ver seção 1.
- [x] **Integrar "Exílio" (Lilith) na function restante** — feito
      (30/07). As quatro functions (`compute-natal-chart`,
      `compute-daily-window`, `compute-solar-return`, `compute-synastry`)
      têm Exílio e Quíron embutidos diretamente no `index.ts`, sem
      arquivo `_shared/` (ver correção na seção 4).
- [x] Implementar o fallback de `ano` opcional em `compute-solar-return`
      — feito (30/07), calcula o retorno mais recente já ocorrido se
      `ano` não vier.
- [ ] **Deployar as quatro Edge Functions revisadas em 30/07** e testar
      com uma data de nascimento real antes de considerar confiável —
      inclui colar o `compute-solar-return` novo (ainda pode não ter
      sido deployado até o momento desta edição) e confirmar que os
      outros três (`compute-natal-chart`, `compute-daily-window`,
      `compute-synastry`) foram atualizados pra versão sem `_shared/`.
- [ ] **LGPD (30/07)**: `termos.html` e `privacidade.html` criadas com
      placeholders que só o fundador preenche: razão social/CNPJ ou CPF,
      e-mail do encarregado (DPO), cidade/comarca de foro. Revisão
      jurídica de verdade recomendada antes de lançar, principalmente a
      isenção de responsabilidade sobre conteúdo relacionado a
      substâncias/saúde (seção 2 dos termos).
- [x] **Exclusão de conta/dados (LGPD art. 18, VI)**: implementada em
      30/07 — `supabase/functions/delete-account/index.ts` + botão em
      `dashboard.html`. **Ainda em aberto**: confirmar se `profiles`,
      `natal_charts`, `daily_readings`, `synastry_readings` e
      `solar_returns` têm FK "on delete cascade" pra `auth.users` (não
      versionadas no repo pra conferir) — sem isso, a exclusão pode
      deixar dado órfão ou falhar.
- [ ] Rodapé com links pra `/termos` e `/privacidade` só foi adicionado
      nas duas páginas novas — as outras 31 páginas do site ainda têm o
      rodapé antigo sem esses links (mesma pendência de propagação já
      registrada pro link de Dashboard, ver seção 9).

---

## 8. Histórico de decisões (não reabrir sem motivo novo)

- Google OAuth via Supabase Auth nativo.
- RLS obrigatório em toda tabela, sem exceção.
- Edge Functions de usuário nunca usam `service_role` — atuam com o JWT
  do próprio usuário, RLS decide. Só seed/admin usa service_role, via
  SQL Editor do painel.
- `sigil_journal` foi separada em `intent_anchors` + `diario_gnose`.
- `graus_simbolicos` renomeada pra `cenas_grau`.
- O Terceiro vive como coluna em `synastry_readings`, não tabela própria.
- Retorno usa localização do ano informada pelo usuário, nunca a de
  nascimento — decisão confirmada explicitamente, sem exceção.
- Sinastria/O Terceiro implementados juntos numa function só
  (`compute-synastry`) — decisão de escopo, já que O Terceiro depende
  dos mesmos dois mapas calculados pra sinastria.
- **Identidade visual**: decisão do usuário foi **padronizar o layout
  completamente** — não é mais fase posterior, é decisão ativa. Oráculo
  (I Ching) já convertido pro tema escuro padrão. **Deriva unificada
  (29/07)**: paleta de cores realinhada aos tokens reais do
  `assets/style.css` (`--red`→`--accent-bright` #c14a3c, `--sand`/
  `--paper`→`--ink` #e9e4d8, `--stone`→`--ink-dim` #978f80, `--ghost`→
  `--line` #2b2822; `--bg` já era idêntico), fontes trocadas de EB
  Garamond/JetBrains Mono pra Unbounded/IBM Plex Sans/IBM Plex Mono, `h1`
  ganhou `font-family:Unbounded` explícito, logo do menu ganhou o ícone
  de estrela em SVG igual às outras páginas. **Feito editando só o
  `:root` do `<style>` inline** (arquivo continua self-contained, não
  passou a linkar `assets/style.css`) — todo o resto do CSS (2200+
  linhas) usa `var(--red)` etc., então a realinhagem de paleta se
  propagou sem precisar tocar em cada regra. Cores do canvas de
  `aura_flow.html`/camadas visuais não foram tocadas — são conteúdo
  artístico, não chrome do site. **Âncora de Intenção unificada (29/07)**:
  já linkava `assets/style.css` e já usava o nav padrão (só faltava a
  paleta/tipografia inline). Trocado Cinzel/EB Garamond por
  Unbounded/IBM Plex Sans/IBM Plex Mono; paleta dourado/osso realinhada
  aos tokens reais (`--gold`→`--accent-bright` #c14a3c, `--bone`→`--ink`
  #e9e4d8, `--muted`→`--ink-dim` #978f80, `--panel`/`--panel-2`/`--hair`→
  tokens equivalentes). **Não mexido de propósito**: os gradientes do
  `.stage`/`.stage.paper` (fundo onde o selo é desenhado, incluindo o
  tom de pergaminho) — são o "papel" onde a arte acontece, tratados como
  conteúdo, não chrome, mesma lógica aplicada ao canvas da Deriva.
  **Ponto em aberto que só dá pra confirmar olhando renderizado**:
  `letter-spacing` de `.eyebrow`/`label`/`.btn`/`summary` foi calibrado
  pra Cinzel (serifada, mais estreita) e pode ficar largo demais agora
  com IBM Plex Mono — conferir visualmente antes de considerar
  fechado.
- **Bug corrigido (29/07): autofill do Chrome preenchendo campo errado
  no `ritual-de-entrada.html`.** Nenhum input tinha `autocomplete`
  definido e não havia `<form>` envolvendo o fluxo — o Chrome detectava
  o campo de senha do passo 3 (auth) como cadastro de conta e
  autopreenchia o campo de nome (passo 0, `input type="text"` sem pista
  nenhuma) com o e-mail salvo no gerenciador de senha. Corrigido
  adicionando `autocomplete` correto em todos os campos: `name` (nome),
  `bday` (data de nascimento), `off` (cidade e hora, sem token padrão
  aplicável), `email` (e-mail), `new-password` (senha — esse é o mais
  importante, sinaliza que é cadastro novo, não login, o que evita o
  Chrome tratar o formulário inteiro como tela de sign-in).
- **Bug corrigido (29/07): `ritual-de-entrada.html` mostrando signo
  ERRADO pro usuário.** O painel de resumo usava dados propositalmente
  falsos (o próprio código dizia isso: `FAKE_NUCLEO`, comentário "trocar
  por dado real do engine" — nunca foi trocado). Núcleo vinha de
  `new Date(data).getMonth()` indexando direto no array de signos — não
  é assim que signo funciona (os cortes de data não alinham com início
  de mês), então dava errado sistematicamente pra quem nasce depois do
  dia de corte do mês (foi assim que apareceu "Leão" pra alguém de
  Gêmeos). Fome/Máscara vinham de `hora+3`/`hora+7` no mesmo array, e
  Território do **tamanho do texto digitado no nome da cidade** — nenhum
  dos três tinha qualquer relação com astrologia real.
  **Corrigido**: Núcleo agora usa tabela de datas de corte real (só
  precisa da data, é 100% preciso, não depende de hora/local). Território/
  Fome/Máscara **não dão mais pra calcular direito só com o que esse
  formulário coleta** (Território precisa do mapa completo; Fome precisa
  de horário UTC preciso; Máscara precisa de lat/long reais, que exigiriam
  geocodificação da cidade em texto — não implementada) — em vez de
  continuar chutando um signo específico e arriscando errar nesses três
  também, o reveal agora mostra "no seu Kit ✦" (honesto, sem fingir
  precisão que não existe nessa etapa).
- `simbolos_astrologicos` + bucket `simbolos` criados a pedido do
  agente de front (spec registrada por eles na seção 9) — RLS: leitura
  pública, escrita restrita ao `auth.uid()` do admin (corrigido de
  `auth.role() = 'authenticated'`, que teria liberado qualquer usuário
  cadastrado do produto principal — falha real, corrigida antes de ir
  pra produção).
- **Correção de registro + renumeração de migration (30/07).** Uma
  sessão anterior registrou `_shared/lilith.ts` como arquivo separado
  já funcionando dentro de `compute-natal-chart` — **isso nunca foi
  confirmado no ar**. Deploy real desse padrão quebrou com "Module not
  found" em duas outras functions no mesmo dia. Corrigido: as quatro
  Edge Functions (`compute-natal-chart`, `compute-daily-window`,
  `compute-solar-return`, `compute-synastry`) foram revisadas com
  Quíron e Exílio **embutidos direto em cada `index.ts`**, sem nenhum
  arquivo `_shared/` — regra sem exceção daqui pra frente. Também
  corrigida colisão de numeração: a migration do Exílio tinha sido
  criada como `0007_exilio_planeta.sql`, mas `0007`/`0008` já estavam
  ocupados por `intent_anchors`/`diario` (criados no mesmo dia, sessão
  diferente) — renomeada pra `0009_exilio_planeta.sql`.
- **`compute-solar-return` corrigida contra o schema real (30/07).**
  Uma versão anterior do upsert tentava gravar `ascendente`/`meio_ceu`
  como colunas de `solar_returns` — essas colunas não existem
  (confirmado via `information_schema.columns`: só
  `id, user_id, ano, data_exata, planetas, aspectos, computado_em,
  latitude, longitude, cidade`). Corrigido pra não gravar esses dois
  campos como coluna — eles continuam calculados e voltam na resposta
  da function.
- **`ADENDO-CLAUDE.md` foi incorporado a este documento e removido do
  repo (29/07).** Todo o conteúdo dele já estava aplicado (renomes,
  vocabulário, `oraculo.html`, remoção de `caos-astral-landing.html`) —
  virou arquivo morto duplicando este `CLAUDE.md`. Não recriar; se surgir
  necessidade de novo adendo, editar direto este arquivo.
- **Identidade do autor (29/07): sem anonimato.** Decisão confirmada —
  nome e cara reais, herança do pai (astrologia) citada abertamente em
  `/intento` e `/raizes/berilo-faccio`. Não reabrir essa discussão sem
  motivo novo; essas duas páginas estão liberadas pra edição normal de
  conteúdo biográfico.
- **Terminologia (29/07): "Mapa Natal" venceu "Mapa Astral".** Aplicado
  nas 3 ocorrências existentes (`manifesto.html` x2, `raizes-berilo-
  faccio.html` x1) — não havia uso em título, UI ou no formulário de
  `ritual-de-entrada.html`, então não foi rename sistêmico. Usar "Mapa
  Natal" em qualquer copy nova daqui pra frente.
- **Astrologia como porta de entrada: mantida, sem mudança.** `index.html`
  já lidera título/H1 com marca + filosofia ("o mapa não é destino"), e
  nomeia "astrologia" logo no primeiro parágrafo como contraponto, não
  como rótulo genérico de categoria. Confirmado como padrão a manter.
- **Enciclopédia (29/07): criada, prioridade alta, já no menu.** Página
  índice `enciclopedia.html` + 8 verbetes-stub (`enciclopedia-simbolo.html`,
  `-mapa`, `-previsao`, `-arquetipo`, `-pratica`, `-crenca`, `-consciencia`,
  `-interpretacao`), organizados por pergunta fundamental, não por
  tradição — ver seção 15 do documento filosófico consolidado. Link
  inserido no menu principal e no rodapé de **todas** as páginas do site
  (entre "Raízes" e "Blog"). Verbetes marcados explicitamente como "em
  construção" — cada um tem framing de 2 parágrafos, não é conteúdo
  final. Não apagar esse aviso ao expandir o conteúdo real de cada
  verbete, e sim substituí-lo quando o verbete de fato estiver
  completo.
- **Dashboard como ecossistema (30/07), decisão do fundador.**
  `ritual-de-entrada.html` é join/register, feito uma vez só — depois
  disso o usuário cai num **Dashboard** novo (página ainda não existe no
  repo), que passa a ser o destino padrão pós-onboarding no lugar do
  link direto pra `kit`. O Dashboard reúne todos os produtos (Kit,
  Retorno, Ressonância, Âncora, Deriva, Oráculo) como cards, com a Janela
  do dia em destaque e o Diário como camada separada que atravessa todos
  eles, não é só mais um card. Ver glossário, termo **Dashboard**
  (novo) e **Diário** (redefinido).
- **Diário desatrelado da Âncora (30/07), decisão do fundador.** A
  definição antiga ("Diário de gnose", ligado só a "práticas de foco/
  estado alterado no uso da âncora") foi **substituída** — o Diário
  agora registra qualquer experiência dentro do ecossistema (não só
  entéogênica), no espírito Field Trip/iDoser. Implicação de schema:
  `diario_gnose` (seção 4/8) precisa de um campo tipo
  `produto_relacionado` (nullable: âncora, deriva, oráculo, nenhum) e um
  campo de tipo/tag de experiência livre, além do que já existe. Esse
  rename/ajuste de schema ainda não foi implementado pelo agente da
  máquina — registrar como pendência na seção 7 antes de fechar.
- **Exclusão de conta implementada (30/07)**, atendendo LGPD art. 18, VI.
  Nova Edge Function `supabase/functions/delete-account/index.ts` e
  seção "Encerrar minha conta" no `dashboard.html` (exige digitar
  "APAGAR MINHA CONTA" antes de habilitar o botão). **Exceção deliberada
  e estritamente controlada à regra "Edge Functions de usuário nunca
  usam service_role"** (regra geral continua valendo pra qualquer outra
  function): apagar `auth.users` só é possível via Admin API, que exige
  service_role. A function nunca aceita um `user_id` vindo do corpo da
  requisição — resolve o id sempre a partir do JWT de quem chama
  (`auth.getUser()` com a anon key primeiro), e só then usa o
  service_role pra apagar exatamente esse id. Não abrir essa exceção
  como precedente pra outras functions sem o mesmo cuidado de nunca
  aceitar id externo.
  **Pendência que ficou de propósito sem resolver**: `deleteUser` só
  limpa automaticamente tabelas com FK "on delete cascade" — confirmado
  em `iching_readings`, `intent_anchors`, `diario_gnose`. As tabelas mais
  antigas (`profiles`, `natal_charts`, `daily_readings`,
  `synastry_readings`, `solar_returns`) não têm migration versionada no
  repo pra conferir se também têm cascade — **precisa confirmar isso no
  schema real do Supabase antes de considerar essa function suficiente
  sozinha em produção**; se alguma não tiver cascade, ou sobra dado
  órfão ou o `deleteUser` falha por violação de FK.

---

## 9. Front-end — changelog (agente de front, com acesso de escrita ao repo)

Diferente do resto deste documento (que é território do agente da
máquina), esta seção é mantida pelo agente de front — registrando aqui
pra manter os três sincronizados, já que agora commitamos direto.

**Sessão de 28/07:**
- Removidos `caos-astral-landing.html` (landing single-file antiga) e
  `raizes-simbolos-sabianos.html` (duplicata de `raizes-cena-do-grau.html`).
- **Deriva** (`deriva.html` + `aura_flow.html`) trazida do site pessoal de
  tatuagem do usuário. Consertado bug real: 5 dos 12 portais visuais
  (rorschach, stars, wormhole, plasma, mandala) estavam quebrados —
  existiam como arquivos soltos (`hyperspace_flow.html`,
  `rorschach_flow.html`) nunca integrados ao sistema de camadas de
  `aura_flow.html`. Portados pra dentro do `RUNNERS` map; os dois
  arquivos soltos não entraram no repo. Nav trocada do site antigo de
  tatuagem pro menu padrão do Caos Astral (mesma lista, paleta própria
  da Deriva).
- **Âncora de Intenção** (`ancora.html`) deixou de ser placeholder — agora
  é o Gerador de Selos real, também trazido do site de tatuagem, com
  branding trocado pra Caos Astral. Motor de geração de símbolo é só
  frontend (JS puro, sem dependência de backend) — não precisa de Edge
  Function pra funcionar, mas ainda não persiste nada em `intent_anchors`
  (isso seria trabalho futuro de integração, não feito ainda).
- Menu: "Deriva" adicionado à lista canônica de navegação em todas as
  páginas do site (12 itens agora: Kit, Retorno, O Terceiro, Âncora,
  Deriva, Oráculo, Diário, Raízes, Blog, Manifesto, Intento, Planos).
- **Pendência em aberto:** admin hub pra upload de arte de símbolos
  astrológicos (efeito "flash decor" trazido do site de tatuagem) —
  **implementado** em `admin-simbolos.html` + `assets/flash-decor.js`,
  mas depende de schema que o agente da máquina ainda precisa criar (ver
  spec abaixo). Credenciais Supabase do projeto Caos Astral já recebidas
  do usuário e hardcoded nos dois arquivos (URL:
  `https://pvgeramqsatltnvkkpvf.supabase.co`, chave publicável — é
  seguro deixar no código-fonte, é a chave pública protegida por RLS,
  não a `service_role`).

  **Spec pro agente da máquina — tabela e bucket ainda não existem:**
  - Bucket de Storage: `simbolos` — público pra leitura, upload
    restrito a usuário autenticado (é admin único, sem multi-tenant
    por enquanto — `auth.role() = 'authenticated'` já basta como
    política de INSERT no bucket).
  - Tabela `simbolos_astrologicos`:
    - `id` uuid pk default `gen_random_uuid()`
    - `titulo` text
    - `image_url` text (URL pública do Storage)
    - `tags` text[] default `'{}'`
    - `decor` boolean default `true` (aparece na decoração aleatória do site)
    - `created_at` timestamptz default `now()`
    - RLS: **SELECT público** (sem restrição — é o que
      `flash-decor.js` consulta anonimamente em toda página do site);
      INSERT/UPDATE/DELETE só `auth.role() = 'authenticated'`.
  - Sem isso criado, `admin-simbolos.html` mostra erro ao tentar
    carregar a galeria, e `flash-decor.js` simplesmente não desenha
    nada (falha graciosamente, não quebra o site — mas fica sem
    decoração até a tabela existir).

  **[RESPOSTA DO AGENTE DA MÁQUINA — 28/07]:** tabela e bucket criados
  em `supabase/migrations/0005_simbolos_astrologicos.sql`, exatamente
  conforme a spec acima (RLS pública pra leitura, autenticado pra
  escrita, sem multi-tenant). Rodar essa migration no SQL Editor pra
  `admin-simbolos.html` e `flash-decor.js` passarem a funcionar de verdade.

- **Dashboard implementado (30/07)**, atendendo decisão do fundador
  (seção 8): `dashboard.html` criada, mesmo design system (`assets/
  style.css`, mesma nav/rodapé). Contém: painel de Janela do dia (com
  comentário `<!-- ENGINE -->` marcando onde plugar `daily_readings`/
  `compute-daily-window`), grid de 6 produtos (Kit, Retorno, O Terceiro,
  Âncora, Deriva, Oráculo) e painel de Diário separado (preview das
  últimas entradas + CTA "Registrar experiência"), com comentário
  `ENGINE` marcando onde puxar as últimas linhas de `diario_gnose`.
  `ritual-de-entrada.html` step 4 atualizado: CTA final agora aponta pra
  `dashboard` em vez de `kit` direto.
  **Pendência que ficou de fora de propósito**: o link "Dashboard" ainda
  não foi adicionado ao menu canônico das outras 31 páginas do site (só
  existe como destino, não como item de nav) — decidir se entra no menu
  ou fica só acessível via pós-onboarding antes de propagar em todas as
  páginas.
- **Schema do Diário e da Âncora criado (30/07)**: `intent_anchors`
  (`0007_intent_anchors.sql`) e `diario_gnose` (`0008_diario.sql`)
  existiam só descritas em prosa neste documento até agora — nenhuma das
  duas tinha migration versionada no repo. Ambas criadas do zero, já
  com o escopo ampliado do Diário (ver seção 8). **Atenção antes de
  aplicar em produção**: a FK de `diario_gnose.daily_reading_id` assume
  que `daily_readings` tem `id uuid` como chave primária — não
  verificado contra o schema real de produção (essa tabela também não
  está versionada ainda), conferir antes de rodar `0008` se não bater.
