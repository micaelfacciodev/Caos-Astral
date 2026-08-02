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
| Signo lunar | **fome** | fechado |
| Ascendente | **máscara** | fechado |
| Casa astrológica | **território** | fechado |
| Recorte vocacional (casa 6/10) | **território de ofício** | pendente |
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
| Lilith Negra (verdadeira/oscilante) | **exílio** | fechado — ver seção 5 (motor) e seção 4 (schema/planets) |
| Deriva | espaço de contemplação visual/sonora — 12 camadas generativas + frequências binaurais por estado de onda cerebral. Não é jogo nem meditação guiada; é ferramenta de estado alterado sem narrador — o que se faz com o estado é decisão de quem usa, igual a tudo mais aqui | fechado |

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
    0007_exilio_planeta.sql                      -- insere 'exilio' (Lilith verdadeira) em `planets`, pros lookups de rótulo/temperamento funcionarem
  seed/
    seed_0001_planets_houses_aspects.sql       -- 11 planetas, 12 casas, 5 aspectos
    seed_0002_graus_simbolicos.sql             -- 360 cenas de grau (nome do arquivo desatualizado,
                                                --   tabela final é cenas_grau após o rename da 0003)
  functions/
    compute-natal-chart/index.ts
    compute-daily-window/index.ts
    compute-solar-return/index.ts
    compute-synastry/index.ts
```

**Ordem de execução (SQL Editor do Supabase, sem terminal)**:
`0001_schema.sql` → `seed_0001_planets_houses_aspects.sql` →
`seed_0002_graus_simbolicos.sql` → `0002_natal_charts_unique.sql` →
`0003_adendo_vocabulario_e_tabelas.sql` → `0004_solar_return_localizacao.sql`
→ `0005_simbolos_astrologicos.sql` → `0006_simbolos_admin_restrito.sql` →
`0007_exilio_planeta.sql`

Se precisar zerar tudo de novo por qualquer motivo: rodar `0000_reset.sql`
primeiro (não apaga `simbolos_astrologicos`/bucket — só as tabelas do
motor astrológico; se precisar zerar isso também, apagar manualmente).

### Tabelas — dicionário (RLS: leitura pública, escrita só service_role)
- `planets` — chave, nome_astro, rotulo_caos, glifo, nunca_retrograda, ordem, `temperamento` (benefico/malefico/neutro — só usado pra decidir tom de conjunção, seção 5). Inclui `exilio` desde a 0007 (temperamento `neutro` — Exílio nunca entra na regra de conjunção benéfico/malefico, sempre cai em "sem categoria forçada" quando conjunto a outro ponto).
- `houses` — numero (1-12), tema, rotulo_caos
- `aspects` — chave, angulo, orbe, rotulo_caos (**nullable** — null pra conjunção), classe_cor
- `cenas_grau` *(antiga `graus_simbolicos`, renomeada)* — signo, grau (1-30), decanato, tempero, imagem, leitura, versao

### Tabelas — dado de usuário (RLS: privado, `auth.uid()`)
- `profiles` — 1:1 com `auth.users`, criado automaticamente via trigger no primeiro login Google.
- `natal_charts` — uma linha por usuário (upsert). ascendente, meio_ceu, planetas (jsonb), aspectos (jsonb).
- `daily_readings` — uma linha por usuário por dia. `iching_convite_aceito` pro handoff com I Ching (seção 6).
- `synastry_readings` — sinastria (câmara de ressonância). `composite_chart` jsonb é onde O Terceiro vive. **Tem Edge Function: `compute-synastry`** — só funciona com dados manuais do parceiro por enquanto (ver seção 5 e pendência de consentimento, seção 7).
- `solar_returns` — retorno (revolução solar). `user_id`, `ano` (unique juntos), `data_exata`, `latitude`/`longitude`/`cidade` do ano em questão (não é a de nascimento). **Tem Edge Function: `compute-solar-return`.**
- `intent_anchors` *(antiga `sigil_journal`, separada)* — a âncora de intenção em si. **Ainda não recebe gravação real do front** (gerador já existe, ver seção 9, mas não persiste ainda).
- `diario_gnose` *(antiga `sigil_journal`, separada)* — registro livre de prática, com FK opcional pra `daily_readings` e pra `intent_anchors`.

### Tabelas/recursos do admin hub de símbolos (novo, seção 9)
- `simbolos_astrologicos` — galeria de arte pra decoração do site. `titulo`, `image_url`, `tags` (text[]), `decor` (boolean), `created_at`. RLS: **SELECT público** (consultado anonimamente por `flash-decor.js` em qualquer página); INSERT/UPDATE/DELETE só `auth.role() = 'authenticated'` — admin único, sem multi-tenant por enquanto.
- Bucket de Storage `simbolos` — público pra leitura, upload restrito ao admin (ver correção de segurança abaixo). Mesma lógica de RLS aplicada em `storage.objects` filtrando por `bucket_id = 'simbolos'`.
- **Correção de segurança (0006)**: a policy original (`auth.role() = 'authenticated'`) liberava escrita pra QUALQUER usuário cadastrado no site — não só o admin. Como o Caos Astral tem cadastro aberto (Google OAuth) pro produto principal, isso deixaria qualquer cliente comum apagar/subir símbolo na galeria. Corrigido pra `auth.uid() = '<uuid do admin>'::uuid`, tanto na tabela quanto no bucket. **Regra geral daqui pra frente: nunca usar `auth.role() = 'authenticated'` como controle de admin em nenhuma tabela nova — isso significa "qualquer usuário logado", não "o dono do site". Pra admin único, sempre `auth.uid() = <uuid fixo>`.**
- Projeto Supabase: `https://pibwwyqjrsdwnzsiremx.supabase.co`. A chave publicável (anon key) está hardcoded em `admin-simbolos.html` e `assets/flash-decor.js` — **isso é seguro**, é a chave protegida por RLS, não a `service_role`; não reabrir essa discussão sem motivo novo.

### Autenticação
Login via Google OAuth nativo do Supabase Auth. Config manual no
Dashboard (Authentication → Providers → Google). Não é SQL.

### Deploy sem terminal
SQL Editor pra migrations/seeds; Edge Functions → Deploy a new function
→ **Via Editor** (colar o `index.ts` inteiro) → Deploy. Usuário responsável
não usa terminal (iMac 2011) — todo caminho de deploy deve assumir
navegador, nunca CLI como único caminho.

**Regra nova, confirmada por erro real em produção**: o editor do
Dashboard usado aqui **não resolve import de arquivo extra dentro da
mesma function** (ex: `./_shared/algo.ts`) — tentativa com
`_shared/lilith.ts` quebrou o deploy 2x com "Module not found" em
`compute-daily-window` e `compute-synastry` (28-30/07). **Daqui pra
frente, todo código auxiliar deve ser embutido direto no `index.ts`
único de cada function, nunca em arquivo separado** — mesmo que isso
signifique duplicar a mesma lógica (ex: `computeTrueLilith`,
`chironGeocentricEclipticLongitude`) em várias functions.

**Revisão completa em 30/07**: as quatro Edge Functions foram
revisadas/reescritas pra seguir essa regra de forma consistente —
nenhuma delas tem import de arquivo próprio, todas com Quíron e Exílio
embutidos:
- `compute-natal-chart`: corrigida (tinha o import frágil de
  `_shared/lilith.ts`, mesmo já estando com Quíron embutido — agora os
  dois pontos custom estão embutidos igual).
- `compute-daily-window` e `compute-synastry`: já corrigidas
  anteriormente na mesma sessão.
- `compute-solar-return`: **reescrita do zero** — antes tinha só um
  snippet de invocação client-side de 2 linhas colado no lugar do
  código real (bug real de deploy, provavelmente copy-paste errado no
  editor). Agora implementa a spec completa da seção 5: busca binária
  do instante exato do retorno (~40 iterações, Sol nunca retrograda),
  ascendente/MC na localização do ano (nunca a de nascimento, recusa
  sem lat/lon), Quíron e Exílio inclusos desde o início, aspectos
  internos, graus simbólicos, upsert em `solar_returns`.
  **Atenção**: o upsert assume nomes de coluna (`ascendente`,
  `meio_ceu`, `planetas`, `aspectos`, `computado_em`) espelhando
  `natal_charts` — não tínhamos o SQL exato de 0003/0004 em mãos nesta
  revisão; conferir contra o schema real antes de considerar
  100% fechado, e ajustar se os nomes divergirem.

---

## 5. Motor de cálculo astrológico

- **Efemérides reais** via `astronomy-engine`. Usar `GeoVector` + `Ecliptic`
  (geocêntrico) — **nunca `EclipticLongitude`** (heliocêntrica, quebra pro Sol).
- **Quíron**: fora da astronomy-engine. Kepleriana de dois corpos
  (elementos JPL SBDB, época 2021-Jul-01). Sem correção de perturbação —
  aceitável pra uso pessoal.
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
- **Retorno (revolução solar)**: busca binária do instante exato em que
  o núcleo em trânsito volta ao grau natal exato (o Sol nunca retrograda,
  então a busca é segura — ~40 iterações a partir de uma janela de dias
  ao redor do aniversário calendário). **A localização usada pro
  ascendente/casas do mapa de retorno é a de ONDE A PESSOA VAI PASSAR
  aquele ano — não a de nascimento.** `compute-solar-return` exige
  `latitude`/`longitude` no corpo da requisição e recusa calcular sem
  isso. Se `ano` não for informado, calcula o retorno mais recente já
  ocorrido (o que rege o período atual).
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
- **Exílio (Lilith Negra verdadeira / true Black Moon Lilith)**: apogeu
  osculador da órbita real e perturbada da Lua num instante — não é a
  Lilith média (que assume órbita lunar limpa, avanço monotônico de
  ~40'/dia). A verdadeira usa estado real (posição + velocidade via
  `GeoMoonState`), ajusta uma elipse kepleriana de dois corpos que
  "osculam" esse estado, e toma o apogeu dessa elipse instantânea. Por
  isso oscila, empaca e retrograda por dias dentro de cada mês —
  comportamento esperado, não bug, documentado no próprio código
  (`_shared/lilith.ts`, função `computeTrueLilith`). Usa GM do sistema
  Terra+Lua (`Astronomy.MassProduct(Body.EMB)`), não só da Terra —
  razão de massa Lua/Terra (~1/81) não é desprezível aqui.
  **Validação feita**: método bate com a definição padrão (Swiss
  Ephemeris, corpo h21 "True Lilith"); sanidade física da excentricidade
  calculada (oscila ~0.026–0.077, dentro da faixa real conhecida,
  média histórica 0.0549); padrão de retrogradação mensal bate com o
  comportamento documentado. **Validação NÃO feita**: comparação
  grau-a-grau contra efeméride de referência publicada (ex: astro.com,
  h21) pra datas de nascimento reais — antes de considerar isso pronto
  pra produção, rodar 2-3 datas reais e comparar (erro esperado de
  poucos minutos de arco; erro de vários graus indicaria bug).
  **Integração por function** (código de `computeTrueLilith` **embutido
  diretamente em cada `index.ts`**, não em arquivo `_shared/lilith.ts`
  separado — o editor de Edge Function do Dashboard do Supabase, usado
  aqui por colar direto sem terminal, não resolve import de arquivo
  extra dentro da mesma function; tentativa de usar `_shared/lilith.ts`
  quebrou o deploy duas vezes com "Module not found" em
  `compute-daily-window` e `compute-synastry`. **Atenção**: qualquer
  ajuste futuro no método de cálculo precisa ser replicado manualmente
  nos três arquivos, já que não há mais uma fonte única compartilhada):
  - `compute-natal-chart`: integrado.
  - `compute-daily-window`: integrado — trânsito de Exílio já entra no
    cálculo de aspectos contra o natal e no "destaque do dia" como
    qualquer outro ponto.
  - `compute-synastry`: integrado — entra tanto nos aspectos cruzados
    quanto no cálculo de O Terceiro (ponto médio).
  - Requer a migration `0007_exilio_planeta.sql` (linha `exilio` em
    `planets`, temperamento `neutro`) — sem ela, os rótulos ficam
    `undefined` em qualquer function que busque `planets` pra montar
    texto.
  - Pendência: dados de validação grau-a-grau, mencionada acima.

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

- [ ] **🔴 URGENTE — compute-natal-chart retornando 400 em produção**
      (achado 31/07-01/08, pelo agente de front, fora do escopo normal
      dele — sinalizando bem alto porque bloqueia o produto inteiro).
      Sintoma: usuário completa o ritual de entrada inteiro (nome, data,
      cidade, hora), vê "Login funcionou, mas não consegui calcular seu
      mapa agora", e `kit.html` também falha depois ("Não consegui
      calcular seu mapa agora"). Invocations do Supabase confirmam
      `POST compute-natal-chart` → **400**, ~1.4s de execução (rápido
      demais pra ter rodado o cálculo — bate com uma validação batendo
      logo no início, tipo o check de `data_nascimento`/`hora_nascimento`/
      `utc_offset`/`latitude`/`longitude` faltando).
      **Causa raiz confirmada em parte**: conferido em duas contas reais
      via Table Editor — `profiles` fica travado no que a trigger de
      auto-criação deixa (`nome = 'EMPTY'`, `data_nascimento`/
      `hora_nascimento` NULL). O upsert real de
      `ritual-de-entrada.html:finalizarRitual()` está **correto no
      código** (usa `id`, não `user_id`, `onConflict: 'id'` — já
      conferido linha a linha) mas parece nunca "pegar".
      **Hipótese principal, não 100% confirmada**: falta policy de
      UPDATE em `profiles` pro próprio usuário — a trigger faz o INSERT
      inicial (não sofre RLS), o upsert do front vira um UPDATE via
      onConflict e aí precisa de policy própria; se só existir
      SELECT/INSERT (a tela mostrava "2 RLS policies"), o UPDATE é
      recusado, o upsert lança erro, cai no catch genérico do front.
      **Ação tomada**: `supabase/migrations/0011_profiles_update_policy.sql`
      — cria a policy de UPDATE só se realmente não existir nenhuma
      ainda (idempotente, seguro mesmo se a hipótese estiver errada).
      **Falta fazer** (agente da máquina): (1) confirmar via
      `select * from pg_policies where tablename = 'profiles'` se era
      isso mesmo antes/depois de rodar a 0011; (2) se não era isso,
      olhar o `response.body` real do 400 direto no código de
      `compute-natal-chart` (não consegui pegar o corpo da resposta
      pelos logs do dashboard, só os metadados — teria que ser via
      DevTools do navegador ou `curl` com JWT válido); (3) as duas
      contas já travadas (`nome='EMPTY'`, ids conferidos em conversa,
      não repetidos aqui por serem PII) continuam quebradas até
      refazerem o ritual ou alguém rodar um UPDATE manual — a 0011 só
      destrava upserts *futuros*.
- [ ] **Seção 4 (schema) está desatualizada** — lista só até
      `0007_exilio_planeta.sql`, mas o repo já tem `0008_diario.sql`,
      `0009_exilio_planeta.sql` (nome real da migration do Exílio, não
      `0007`), `0010_consentimento_profiles.sql`, e agora `0011`. Não
      reconciliei a lista inteira agora (não tenho certeza de todo o
      histórico/ordem sem acesso a `supabase/functions/`) — fica pro
      agente da máquina revisar e corrigir a seção 4 pra bater com a
      pasta de verdade.
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
  (I Ching) já convertido pro tema escuro padrão. Âncora de Intenção
  (paleta dourado/osso, Cinzel/EB Garamond) e Deriva (paleta
  vermelho/areia, EB Garamond) ainda pendentes de unificação visual —
  funcionais, mas com identidade própria por ora.
- `simbolos_astrologicos` + bucket `simbolos` criados a pedido do
  agente de front (spec registrada por eles na seção 9) — RLS: leitura
  pública, escrita restrita ao `auth.uid()` do admin (corrigido de
  `auth.role() = 'authenticated'`, que teria liberado qualquer usuário
  cadastrado do produto principal — falha real, corrigida antes de ir
  pra produção).
- Usuário responsável não usa terminal (iMac 2011) — deploy sempre via
  Dashboard/navegador.
- **Exílio (Lilith Negra verdadeira) confirmado no glossário oficial e
  no motor de cálculo** — implementado nas três Edge Functions
  (`compute-natal-chart`, `compute-daily-window`, `compute-synastry`)
  via `_shared/lilith.ts` duplicado em cada uma, mais a migration
  `0007_exilio_planeta.sql`. Validação de sanidade feita; validação
  grau-a-grau contra efeméride de referência publicada ainda pendente
  antes de considerar 100% fechado pra produção (ver seção 5).

---

## 9. Front-end — changelog (agente de front, com acesso de escrita ao repo)

Diferente do resto deste documento (que é território do agente da
máquina), esta seção é mantida pelo agente de front — registrando aqui
pra manter os três sincronizados, já que agora commitamos direto.

**Sessão de 31/07 — widget "O céu agora" (canto fixo, 100% cliente, sem depender do backend):**
- **Motivo**: usuário relatou `compute-natal-chart` falhando em produção (login funciona, mapa não calcula, tanto no fim do ritual de entrada quanto abrindo `kit.html` direto — "Não consegui calcular seu mapa agora"). **Não consegui diagnosticar a causa raiz** — a Edge Function não está neste repo (só `supabase/migrations/`, sem `supabase/functions/`), e não tenho rede nem credencial pro projeto Supabase daqui. Suspeita, não confirmada: migration `0009_exilio_planeta.sql` sugere que "Exílio" (Lilith Negra verdadeira) foi adicionado recentemente ao motor — mudança nova é sempre a primeira suspeita. **Isso é pendência pro agente da máquina** — precisa dos logs da function (Supabase Dashboard → Edge Functions → compute-natal-chart → Logs) ou do erro exato do Network tab do navegador (`calcErr`/`profileErr` em `ritual-de-entrada.html` e `kit.html` hoje caem no mesmo catch genérico e mostram sempre a mesma mensagem pro usuário, então o console é a única pista real).
- Enquanto isso não é resolvido, criado `assets/ceu-agora.js`: widget fixo no canto inferior direito (botão redondo colapsado → painel com posição de todos os planetas + Quíron + aspectos ativos entre eles, "agora"). Calcula tudo no navegador via `astronomy-engine` (mesma lib do backend, carregada sob demanda via CDN) — **não usa Supabase, não usa nenhuma Edge Function, não depende de login**. Refresh a cada 60s, só enquanto o painel está aberto.
- **Validado contra referência externa** (astro.com, captura do dia 30/07/2026 21h59): Sol, Lua, Mercúrio, Vênus, Marte, Júpiter, Saturno, Urano, Netuno e Plutão bateram com diferença ≤1' de arco (ruído de arredondamento/segundo exato, esperado). Quíron divergiu ~37' — **não é bug**, é a mesma limitação já documentada do motor real (kepleriana de 2 corpos sem correção de perturbação, "aceitável pra uso pessoal", seção 5) — o widget usa exatamente os mesmos elementos orbitais/época do `compute-natal-chart`, então herda a mesma imprecisão de propósito, por consistência.
- Rótulos de aspecto reaproveitam a convenção do glossário (fricção = quadratura/oposição, corrente = trígono/sextil) — cores diferentes no widget pra cada categoria.
- CSS em `assets/style.css` (seção "CÉU AGORA"), script incluído nas mesmas 33 páginas que já têm o header/footer padrão (mesmo `<script defer>`, sem precisar rodar antes de mais nada — não depende do markup do header/footer, só faz `document.body.appendChild`).

**Sessão de 01/08 — 🔴 BUG CRÍTICO achado (não corrigido por mim, código não está neste repo): ascendente sai com 180° de erro em TODA conta:**
- Usuário testou o mapa dinâmico novo, reparou que o ascendente mostrado
  não batia com o que ele sabe ser o real (Touro em vez de Escorpião).
  Investigado a fundo, não é bug do mapa nem dado velho em cache — é bug
  real na fórmula do ascendente dentro de `compute-natal-chart`.
- **Confirmado contra Swiss Ephemeris** (`pyswisseph`, padrão-ouro de
  cálculo astrológico, instalado só pra essa validação) em 3 casos
  independentes (São Paulo 1977, Rio 1990, Londres 2000): a fórmula
  atual do `computeAscMc` devolve o **Descendente**, não o Ascendente —
  erro de exatamente 180° em todo caso testado, sem exceção. O Meio do
  Céu está calculado certinho (bate exato com Swiss Ephemeris) — o erro
  está isolado só na linha do `asc`, não no resto da cadeia (GMST,
  obliquidade, LST — todos corretos, confirmados pelo MC batendo).
- **Correção (uma linha)**, dentro de `computeAscMc`:
  ```
  // ANTES (errado — devolve o Descendente):
  const asc = norm360(Math.atan2(ascY, ascX) * 180 / Math.PI);
  // DEPOIS (corrigido, validado contra Swiss Ephemeris em 3 casos):
  const asc = norm360(Math.atan2(ascY, ascX) * 180 / Math.PI + 180);
  ```
- **NÃO CONSEGUI APLICAR ISSO** — `compute-natal-chart/index.ts` não
  está versionado neste repo (só o front tem acesso de escrita aqui).
  Precisa ser aplicado manualmente no Supabase Dashboard → Edge
  Functions → `compute-natal-chart` → Code → deploy. Passado pro
  usuário aplicar diretamente.
- **Impacto, pra dimensionar a gravidade**: como `casa` de cada planeta
  é calculado só por diferença de signo em relação ao ascendente
  (`(signIdx - ascSignIdx + 12) % 12 + 1`), esse bug não afeta só o
  rótulo "Máscara" — desloca a casa de TODO planeta de TODO mapa já
  calculado em exatamente 6 posições (o que devia ser casa 1 aparece
  como casa 7, etc.). Qualquer `natal_charts` já salvo antes dessa
  correção está com ascendente E todas as 12 casas erradas — precisa
  ser apagado e recalculado depois do fix (mesmo passo já usado nas
  contas de teste: apagar a linha em `natal_charts`, `kit.html`
  recalcula sozinho na próxima visita).
- **Contexto de como cheguei nisso**: no caminho, também troquei o
  cálculo de `utc_offset` em `ritual-de-entrada.html` (antes usava
  `new Date().getTimezoneOffset()` — o fuso ATUAL do navegador de quem
  preenche o formulário, não o fuso histórico da cidade/data de
  nascimento — comentário no código já admitia isso como aproximação
  grosseira). Essa troca **era uma correção real e válida** (agora usa
  `tz-lookup` pra achar o fuso IANA da cidade + `Intl.DateTimeFormat`
  pra pegar o offset histórico exato daquela data, testado contra DST
  histórico do Brasil e de outros países) — só que **não era a causa
  deste bug específico** (nesse caso de teste o offset já batia por
  coincidência). Mantive a correção do fuso mesmo assim porque é
  melhoria real e necessária pra outros casos (alguém nascido num fuso
  diferente de onde está agora, ou em data com DST diferente de hoje).

**Sessão de 01/08 — kit.html: mapa astral deixa de ser placeholder estático, vira SVG dinâmico com posições reais + aspectos:**
- Usuário testou de novo depois da `0015` — **calculou!** Ritual completo
  funcionando de ponta a ponta pela primeira vez desde a troca de
  projeto (RLS de UPDATE + GRANT sistêmico + RLS de INSERT, as três
  causas juntas, resolvidas).
- Usuário reparou que o `<svg id="kit-wheel-svg">` de `kit.html` era
  puramente decorativo — glifos em coordenadas de pixel fixas no
  código, sem nenhuma relação com o mapa real da pessoa (já vinha
  assim desde o protótipo original, com comentário `ENGINE:` avisando
  "substituir por render dinâmico da posição real", nunca feito).
  Implementado agora:
  - **Rotação do mapa**: ascendente sempre no ponto esquerdo (9h),
    casas (signo inteiro) preenchendo os 12 setores de 30° em sentido
    anti-horário a partir do INÍCIO do signo do ascendente (não do grau
    exato do ascendente) — bate exatamente com como
    `compute-natal-chart` já calcula `casa` (`(signIdx - ascSignIdx +
    12) % 12 + 1`, só por diferença de signo).
  - **Testado ANTES de integrar**: matemática de rotação isolada num
    script Node à parte, conferindo que ASC cai exatamente no ponto
    esquerdo, a casa 2 fica abaixo-à-esquerda (sentido anti-horário
    correto), 90° adiante cai embaixo (região do Fundo do Céu) — só
    depois de bater certo é que entrou no `kit.html`.
  - **Testado de novo depois de integrado**: extraí as funções puras de
    geometria do arquivo real (não uma cópia) e rodei com um mapa de
    teste completo (12 pontos, incluindo 3 próximos entre si em Leão
    pra testar anti-sobreposição, 6 aspectos variados) — SVG gerado,
    198 coordenadas conferidas uma a uma (nenhuma fora do viewBox,
    nenhuma NaN), convertido pra PNG e inspecionado, e conferido
    programaticamente que os 12 signos aparecem na ordem certa girando
    anti-horário a partir do signo do ascendente.
  - **Anti-sobreposição simples**: planetas a menos de 7° de longitude
    um do outro alternam entre dois raios (mais próximo/mais afastado
    do centro), evita glifos empilhados exatamente um em cima do outro.
  - **Linhas de aspecto**: desenhadas num raio interno fixo (separado
    da posição visual dos glifos, que pode ter sido deslocada pelo
    anti-sobreposição), cor por categoria — fricção (quadratura/
    oposição) em tom de acento, corrente (trígono/sextil) em verde,
    conjunção em cinza tracejado — mesma paleta já usada no widget "céu
    agora", por consistência.
  - **Marcadores de ASC/DESC/MC/IC** na borda externa, nas posições
    reais (MC/IC não caem necessariamente em cima/embaixo sob signo
    inteiro, já que a rotação segue o início do signo do ascendente,
    não o grau exato — isso é esperado, não bug).
  - Retrogradação: pequeno "r" ao lado do glifo, mesma convenção do
    resto do site.
  - SVG estático inicial (fallback antes do JS rodar, ou se
    `chart.ascendente` vier nulo por algum motivo) simplificado pra só
    os círculos de referência — sem mais glifo nenhum em posição falsa,
    pra nunca mostrar dado errado por engano.

**Sessão de 01/08 — 🔴 depois do GRANT, apareceu a causa raiz seguinte: faltava policy de INSERT em profiles:**
- GRANT resolvido (0014) não foi suficiente sozinho — usuário testou de
  novo, mesma mensagem genérica pro usuário, mas dessa vez o console
  mostrou um erro DIFERENTE do 42501 anterior: `code: "42501"` de novo,
  mas `message: "new row violates row-level security policy for table
  profiles"` — RLS de verdade dessa vez, não GRANT.
- **Causa**: `sb.from('profiles').upsert({...}, {onConflict:'id'})` vira
  `INSERT ... ON CONFLICT (id) DO UPDATE` por baixo. Mesmo quando o
  resultado final é um UPDATE (linha já existe, criada pela trigger),
  o COMANDO começa como INSERT — Postgres exige policy de INSERT válida
  pra sequer tentar, antes de resolver o conflito. `0001_schema.sql`
  só tinha criado SELECT + UPDATE em `profiles`, copiando o que
  confirmamos via `pg_policies` no projeto ANTIGO — só que nunca
  chegamos a validar isso de ponta a ponta lá (a troca de projeto
  interrompeu o teste antes da confirmação final). Ficou faltando a de
  INSERT o tempo todo, nos dois projetos.
- **Validado com reprodução exata, não só teoria**: simulei o cenário
  completo — usuário com linha já existente em `profiles` (via
  trigger), como role `authenticated`, rodando o mesmo `INSERT ... ON
  CONFLICT DO UPDATE` que o front roda. **Sem a correção: mesma
  mensagem de erro exata da produção.** Com `0015_profiles_insert_policy.sql`
  aplicada: funciona, linha atualiza.
- `0001_schema.sql` também corrigido direto (não só a migration
  incremental `0015`) — quem instalar o schema do zero a partir de
  agora já não precisa da 0015 como remendo, ela existe pra aplicar
  retroativamente no banco que já estava rodando.
- **Padrão pra lembrar dessa vez**: qualquer tabela onde o front usa
  `.upsert(...)` (não `.update(...)` puro) precisa de policy de INSERT
  E de UPDATE, mesmo que a intenção seja "só atualizar uma linha que já
  existe" — o Postgres não sabe disso de antemão, o comando upsert
  sempre passa pelo caminho de INSERT primeiro.

**Sessão de 01/08 — 🔴 causa raiz real do ritual travando no projeto novo: faltava GRANT, não RLS:**
- Usuário testou de novo, console mostrou o erro de verdade dessa vez:
  `POST .../rest/v1/profiles 403 (Forbidden)`, código Postgres `42501`,
  mensagem `permission denied for table profiles`, hint sugerindo
  `GRANT ... ON public.profiles TO authenticated`. **Isso não é RLS** —
  a policy de UPDATE estava certa desde a `0001`. É a camada de baixo:
  Postgres exige GRANT explícito de SQL (SELECT/INSERT/UPDATE/DELETE)
  pra uma role ANTES de RLS decidir quais linhas — sem o grant, a RLS
  nem chega a ser avaliada.
- **Achado sistêmico, não isolado em profiles**: nenhuma migration
  deste repo tinha `grant` explícito nenhum (conferido via grep) — nem
  as que eu escrevi (0001/0012/0013) nem as que já existiam antes de
  mim (0005-0011). Ou seja, TODA tabela criada por SQL direto nesse
  projeto novo provavelmente estava com o mesmo problema, só que só
  profiles tinha sido testada até agora. Não confirmei a causa exata de
  por que o projeto novo não veio com os grants padrão de fábrica que
  Supabase geralmente configura sozinho (suspeita: relacionado ao
  formato de chave `sb_publishable_...`, mais novo — não tenho certeza).
- `supabase/migrations/0014_grants.sql` criada: `grant select, insert,
  update, delete ... to authenticated` + `grant select ... to anon` em
  TODAS as tabelas do schema public de uma vez, mais `alter default
  privileges` pra qualquer tabela criada depois já nascer com o grant
  certo (não deveria precisar disso de novo pra tabela nova, mas não
  custa ficar).
- **Validado de verdade, não só "rodou sem erro de sintaxe"**: testei
  reproduzindo o cenário exato que quebrou — criei um usuário de teste
  (dispara a trigger), simulei a role `authenticated` (não `postgres`)
  fazendo `UPDATE` em `profiles` como o front faz de verdade via
  `SET ROLE authenticated` + `auth.uid()` apontando pro usuário certo —
  sem a `0014`, dava exatamente o mesmo 42501 que apareceu em produção;
  com a `0014`, `UPDATE 1` — confirma que resolve o problema real, não
  só "parece certo no papel".
- **Lição registrada pra não repetir**: daqui pra frente, toda migration
  nova que cria tabela precisa incluir seu próprio `grant` — não confiar
  que o projeto Supabase configura isso sozinho. Ver 0014 como rede de
  segurança, não como substituto de fazer certo desde a próxima tabela.

**Sessão de 01/08 — varredura completa fechada: mais um gap (`enciclopedia_simbolos`), agora sim tudo client-side coberto:**
- Completei a varredura que deixei como pendência no achado anterior:
  grep de `.from(`/`.storage.from(`/`.rpc(` em TODO o código (literal E
  variável — `admin-simbolos.html` usa `const TABLE = 'simbolos_astrologicos'`,
  grep só de string literal não pegava isso). Achei mais um gap real:
  **`enciclopedia_simbolos`** (tabela) + **`enciclopedia_indice_publico`**
  (view pública) + **`profiles.is_admin`** (coluna) — mesma história das
  outras duas rodadas: só existiam citadas em comentário dentro de
  `admin-enciclopedia.html` como "0003_enciclopedia_simbolos.sql"/
  "0004_...sql", nunca foram arquivo de verdade neste repo.
- `supabase/migrations/0013_enciclopedia_simbolos.sql` criada e testada
  (Postgres local) — schema reconstruído do payload real do formulário
  admin (14 colunas), RLS: SELECT completo só `tier='gratis'` ou admin
  (monetização de `tier='pago'` continua sem implementação nenhuma, é o
  estado real do produto, não um bug), view pública expõe metadados de
  TODOS os verbetes (inclusive pagos) sem vazar conteúdo, seguindo
  exatamente o comentário que já existia no código do front.
- **Achado outro conteúdo real recuperável**: `lote_001_enciclopedia.json`,
  já versionado neste repo, com 5 verbetes reais (Caosphere, Sigilo
  pessoal, Ouroboros, Sol, Lua) — não é a enciclopédia inteira (nome
  já indica lotes), mas é conteúdo de verdade, não inventado. Virou
  `supabase/seed/seed_0003_enciclopedia.sql`, testado, 5 linhas batendo
  na tabela E na view depois de rodar.
- **Resultado da varredura, pra fechar de vez**: as únicas tabelas
  referenciadas direto por código client-side (HTML/JS, não Edge
  Function) são: `profiles`, `natal_charts`, `houses`,
  `iching_hexagrams`, `iching_readings`, `simbolos_astrologicos`,
  `enciclopedia_simbolos`, `enciclopedia_indice_publico` — todas
  cobertas agora. `planets`, `aspects`, `cenas_grau`, `daily_readings`,
  `synastry_readings`, `solar_returns`, `intent_anchors`,
  `diario_gnose` só são tocadas por Edge Functions (server-side, fora
  deste repo) — não aparecem em grep de front, por isso continuam só
  com a confiança que eu já tinha (alta pras que vi o código real,
  baixa pras 3 que nunca vi).
- **Ação manual que falta**: `update public.profiles set is_admin =
  true where id = '<seu-uuid-no-projeto-novo>';` pra conseguir usar
  `admin-enciclopedia.html` de novo (mesma lógica do UUID hardcoded em
  `0012`, mas aqui é coluna, roda uma vez só).

**Sessão de 01/08 — mais um gap achado durante o teste do usuário: `simbolos_astrologicos` também nunca foi versionado (404 em produção):**
- Usuário testou o ritual de entrada no projeto novo, abriu o console
  do navegador a pedido meu, achou `GET .../rest/v1/simbolos_astrologicos
  404 (Not Found)` vindo de `flash-decor.js` — **não era a causa do bug
  de cálculo** (esse erro falha graciosamente, só afeta a decoração
  visual, claude.md já documentava isso), mas revelou um gap real que
  eu tinha deixado passar na reconstrução de 01/08: `simbolos_astrologicos`
  (tabela) + bucket `simbolos` (Storage) **nunca existiram como arquivo
  neste repo** — só descritos em prosa no claude.md, igual 0001-0004
  estavam. Migration `0012_simbolos_astrologicos.sql` criada e testada
  (Postgres local, com `storage.objects` simulado) pra cobrir isso.
- **Ação manual obrigatória antes de rodar 0012**: o arquivo tem um
  UUID placeholder (`00000000-...`) nas duas policies de escrita —
  precisa trocar pelo `auth.uid()` real do admin no projeto NOVO
  (Authentication → Users → copiar o ID), porque o UUID antigo morreu
  junto com o projeto deletado. Sem essa troca a policy nunca deixa
  ninguém escrever (mais seguro que deixar aberto por engano, mas
  também não funciona até trocar).
- **Norma que eu deveria ter seguido desde a reconstrução de 01/08 e só
  segui agora**: qualquer coisa que claude.md só descreve em prosa,
  sem arquivo `.sql` correspondente neste repo, precisa ser tratada como
  não-migrada de verdade — o texto da doc não é garantia de que o
  arquivo existiu ou rodou. Vale a pena, antes de considerar a
  reconstrução do schema "completa", grepar o código de TODAS as
  páginas/admin hubs por `.from(` e `supabase.storage.from(` e conferir
  cada tabela/bucket citado contra o que existe de fato em
  `supabase/migrations/` — não fiz essa varredura sistemática ainda,
  fiz reativo (o usuário achou por acaso testando). Pendência: rodar
  essa varredura completa antes de dar o schema como 100% reconstruído.

**Sessão de 01/08 — schema 0001-0004 reconstruído e VALIDADO (não é só arquivo escrito, rodei de verdade):**
- Resposta ao pedido "me dá os SQL todos, sem os erros que tavam
  tendo". Como não existe backup do schema original em lugar nenhum,
  reconstruí do zero — mas não entreguei sem testar: instalei Postgres
  localmente (sandbox), simulei `auth.users`/`auth.uid()`/`auth.jwt()`
  (o mínimo que o Supabase fornece nativamente) e rodei os arquivos
  novos **de verdade**, na ordem, mais TODAS as migrations que já
  existiam neste repo (0005-0011) por cima, pra confirmar que tudo se
  encaixa sem erro de verdade (só notices esperados de `drop policy if
  exists` em tabela nova, e um erro que era só limitação do meu teste —
  faltava simular `auth.jwt()`, corrigido e re-testado). Contagens
  finais batendo: 12 planets, 12 houses, 5 aspects, **360 cenas_grau**,
  64 iching_hexagrams, `profiles` nascendo com as 2 policies certas
  (SELECT+UPDATE) — sem precisar da 0011 depois, ela já roda como no-op
  idempotente se aplicada de novo.
- **Arquivos criados**: `supabase/migrations/0001_schema.sql` (profiles,
  natal_charts, planets, houses, aspects, cenas_grau, daily_readings,
  synastry_readings, solar_returns — todas com RLS),
  `supabase/seed/seed_0001_planets_houses_aspects.sql`,
  `supabase/seed/seed_0002_graus_simbolicos.sql`.
- **Achado ótimo no meio do caminho**: as 360 cenas de grau (conteúdo
  autoral, a peça que eu realmente não tinha como reconstruir sozinho)
  **não estavam perdidas** — tinha uma pasta `graus-caos-astral/` já
  versionada neste mesmo repo com o JSON completo
  (`graus-caos-astral-completo.json`), 360 entradas, validei 1:1 contra
  o schema esperado (12 signos × 30 graus, todos os campos, zero
  duplicata/falta) antes de gerar o INSERT — gerado por script a partir
  do JSON real, não digitado/reconstruído de memória.
- **Nível de confiança documentado dentro do próprio 0001_schema.sql**,
  por tabela: ALTO (profiles, natal_charts, planets, aspects — direto
  do código real de compute-natal-chart + das migrations 0005-0011 que
  já existiam), MÉDIO (cenas_grau — estrutura confirmada por código,
  conteúdo recuperado de verdade), BAIXO (houses, daily_readings,
  synastry_readings, solar_returns — nunca vi compute-daily-window/
  compute-solar-return/compute-synastry, essas 3 Edge Functions nunca
  foram versionadas neste repo; inferi o shape só pela descrição em
  claude.md, PROVÁVEL que precise ajuste depois de testar de verdade).
- **Gap real que não dá pra fingir que resolvi**: `houses.rotulo_caos`
  (o texto de marca por casa, ex. nomes próprios de território) fica
  **NULL de propósito** — não tenho esse conteúdo em lugar nenhum, só
  os placeholders óbvios de preview (`FAKE_TERRITORIOS` no rascunho
  antigo do onboarding) que nunca foram o texto real. `tema` preenchido
  com conhecimento astrológico tradicional/genérico (domínio público,
  não é conteúdo de marca) só pra tabela não ficar vazia.
- **Efeito colateral direto dessa troca de projeto**: toda conta de
  teste anterior (as duas que a gente debugou na sessão passada)
  deixou de existir — banco novo, ninguém cadastrado ainda.

**Sessão de 01/08 — 🔴 projeto Supabase INTEIRO trocado (era nos EUA, agora Brasil) — bloqueia tudo até checklist abaixo:**
- Usuário deletou o projeto Supabase antigo (`pvgeramqsatltnvkkpvf`, hospedado
  nos EUA) e criou um novo, hospedado no Brasil: `pibwwyqjrsdwnzsiremx`.
  Edge Functions já redeployadas lá pelo usuário. **Todo o resto (banco,
  auth, storage) é novo e vazio** — isso não é só trocar URL/key.
- **O que eu já corrigi neste repo** (mecânico, sem risco): troquei
  `SUPABASE_URL`/`SUPABASE_KEY`/`SUPABASE_ANON_KEY` e a chave de
  localStorage (`sb-<ref>-auth-token`, o ref muda) em TODOS os arquivos
  que tinham credencial antiga hardcoded: `ritual-de-entrada.html`,
  `kit.html`, `dashboard.html`, `oraculo.html`, `admin-simbolos.html`,
  `admin-iching.html`, `admin-enciclopedia.html`,
  `enciclopedia-index.html`, `enciclopedia-verbete.html`,
  `assets/flash-decor.js`, `assets/site-chrome.js`. Também atualizei as
  três menções de URL nesta própria documentação (ver nota grande sobre
  os três arquivos de doc, logo abaixo).
- **🔴 O que EU NÃO CONSIGO fazer daqui (sem acesso ao Supabase) — pendência
  do agente da máquina/usuário, nessa ordem, senão nada funciona**:
  1. **Rodar TODAS as migrations no projeto novo, do zero** — inclusive
     `0001`–`0004` (que criam `profiles`, `natal_charts`, `cenas_grau`,
     `planets`, `houses`, `aspects`, e o RLS base) — **esse repo nunca
     teve esses arquivos versionados aqui** (só existem `0005` em
     diante). Precisa da fonte original de `0001_schema.sql` até
     `0004_solar_return_localizacao.sql` de algum outro lugar (histórico
     do SQL Editor do projeto antigo? backup? outro repo do agente da
     máquina?) — **se essa fonte não existir em lugar nenhum, o schema
     base precisa ser reconstruído do zero olhando o código das Edge
     Functions**, que é a única fonte de verdade restante de como as
     colunas se chamam.
  2. **Rodar os seeds** (`seed_0001_planets_houses_aspects.sql`,
     `seed_0002_graus_simbolicos.sql`, 360 cenas de grau) — mesmo
     problema, não estão neste repo.
  3. **Reconfigurar Google OAuth** no projeto novo (Dashboard →
     Authentication → Providers → Google) — client ID/secret e a
     redirect URL (`https://pibwwyqjrsdwnzsiremx.supabase.co/auth/v1/callback`)
     mudaram, mesmo que o client ID do Google Cloud seja reaproveitado,
     o provider precisa ser configurado de novo no projeto novo.
  4. **Recriar o bucket de Storage `simbolos`** (RLS: leitura pública,
     escrita só `auth.uid()` do admin — ver seção 4/9 antiga) — bucket
     não migra sozinho entre projetos.
  5. Depois de 1–4: minha migration `0011_profiles_update_policy.sql`
     (policy de UPDATE em `profiles`) precisa rodar de novo também —
     ela só existia no projeto antigo, que foi apagado.
  6. Todas as contas de usuário do projeto antigo (inclusive as duas
     contas de teste com `profiles` travado que a gente debugou nesta
     mesma sessão) **deixaram de existir** — auth é por projeto, não
     migra. Todo mundo precisa se cadastrar de novo no projeto novo.
- **Achado no meio do caminho, sem relação direta com a troca de
  projeto, mas sério**: existem **três arquivos de documentação quase
  duplicados** na raiz do repo — `claude.md` (o que uso a sessão
  inteira), `CLAUDE.md` (maiúsculo — mesmo conteúdo só que uma versão
  mais antiga, existia desde antes de eu clonar o repo pela primeira
  vez e eu nunca tinha reparado, porque git é case-sensitive e os dois
  coexistem sem conflito) e `ADENDO-CLAUDE.md` (505 linhas, um adendo
  separado). **Nada do que documentei nesta sessão inteira (RLS fix,
  site-chrome.js, widget céu-agora, dropdown de login, etc.) foi
  refletido em `CLAUDE.md` nem em `ADENDO-CLAUDE.md`** — só em
  `claude.md`. Não tentei reconciliar os três agora (fora de escopo
  urgente, e não sei qual os outros dois agentes efetivamente leem) —
  só troquei a URL do Supabase nos três pra não deixar credencial morta
  espalhada, e estou sinalizando bem alto aqui pra alguém decidir qual
  arquivo é a fonte de verdade e apagar os outros dois (ou reconciliar).

**Sessão de 01/08 — widget céu-agora usa "Lilith", não "Exílio" (exceção deliberada):**
- Decisão explícita do usuário: nesse widget especificamente, o rótulo
  é **"Lilith"**, não "Exílio". Chave interna continua `exilio` (mesmo
  ponto, mesmo cálculo), só o texto mostrado mudou.
- **Registrando pra não ser revertido por engano depois**: isso É uma
  exceção ao glossário (`Exílio` é o termo de marca em todo o resto do
  produto — kit.html, `planets.rotulo_caos`, etc.). Não generalizei pro
  resto do site. Se um agente futuro notar essa "inconsistência" e
  achar que devia unificar, essa nota é o motivo de não mexer sem
  perguntar de novo — foi pedido assim de propósito, provavelmente
  porque esse widget é uma leitura mais crua/técnica (no estilo do
  print de referência do astro.com que motivou a ferramenta), não
  conteúdo de marca do kit.

**Sessão de 01/08 — widget "O céu agora": Exílio (Lilith verdadeira) + botão com texto:**
- **Botão deixou de ser só um ícone** — agora mostra "Céu agora" escrito (pílula com texto, não mais bolinha só com glifo). Feedback direto: "só chico xavier sabe que tá ali" — justo, ícone sozinho não se explica.
- **Adicionado Exílio** (Lilith Negra verdadeira) à lista de pontos do widget — era o único do glossário faltando (já tinha Quíron). Implementação **não trivial**, documentando aqui porque é fácil de fazer errado: True Lilith é o apogeu *osculante* da órbita lunar (a direção instantânea, calculada a partir do vetor de excentricidade osculante Terra-Lua no exato momento — não é a Lilith média, que é um polinômio suavizado que a maioria dos sites usa por padrão sem avisar qual é qual). Usei `Astronomy.GeoMoonState()` (posição+velocidade da Lua) rotacionado pra eclíptica, calculei o vetor de excentricidade com μ geocêntrico Terra+Lua (não só GM da Terra sozinha — usar só GM_Terra dá direção sistematicamente errada), e Lilith = direção desse vetor + 180° (perigeu e apogeu ficam na mesma reta vista da Terra).
- **Validado por comparação com a Lilith média** (fórmula polinomial padrão, bem estabelecida) em 4 datas diferentes espalhadas ao longo de 26 anos: diferença sempre entre 2.6° e 14.6°, e excentricidade osculante resultante sempre entre 0.043–0.065 — ambos batem com o comportamento documentado da Lilith verdadeira (oscila até ~30° da média, é isso que a diferencia da média — "true Lilith" pode até retrogradar, o que a média nunca faz). Não tenho uma fonte externa com valor exato pra esse ponto específico (diferente do Sol/Lua/planetas, que bati contra captura de tela do astro.com) — a validação aqui foi por consistência física/comportamento esperado, não por número exato batendo com terceiro.
- Rodei o arquivo real (não uma cópia à parte) contra o `astronomy-engine` de verdade pra confirmar que o Exílio calcula e entra nos aspectos junto com o resto.

**Sessão de 01/08 — CTA do header agora sabe se você está logado:**
- Fechei a pendência registrada na sessão anterior ("usuário logado em
  página comum ainda vê Entrar"). Agora o header tem 3 estados: override
  manual (dashboard/admin, como já era) → sessão salva → mostra o
  e-mail com um menuzinho (Meu ecossistema / Meu kit / Sair) → sem
  sessão → dropdown de Entrar de sempre.
- **Decisão de implementação**: não carreguei o `supabase-js` nem chamei
  `getSession()` em toda página só pra decidir isso — leio direto a
  chave que o próprio `supabase-js` já guarda em `localStorage`
  (`sb-pibwwyqjrsdwnzsiremx-auth-token`). Síncrono, sem esperar rede,
  sem peso extra de biblioteca carregada à toa. **É otimista de
  propósito**: não valido o token com o servidor, é só decoração do
  header — se o token realmente expirou, a primeira ação que precisar
  dele de verdade (abrir o kit, etc.) falha do jeito normal e pede login
  de novo, igual qualquer outro app.
- **Limitação que ainda fica**: sem `onAuthStateChange` entre páginas —
  se alguém loga em `ritual-de-entrada.html` (fluxo próprio dela, não o
  dropdown) e não recarrega, o header de outra aba/página não atualiza
  sozinho até o próximo load. Aceitável, não vale a complexidade de um
  listener cross-tab pra isso agora.
- Botão "Sair" chama `sb.auth.signOut()` (mesmo client sob demanda já
  usado pro login) e manda pro `index`.

**Sessão de 31/07 — CTA do header virou dropdown de Entrar/Cadastrar:**
- **Pedido original desde o começo desta sessão**: tirar o "Abrir meu
  kit" do menu e trocar por um Entrar/Cadastre-se simples, com Google.
  Ficou pendente enquanto a unificação de header/footer era resolvida
  primeiro — implementado agora, direto em `assets/site-chrome.js`, então
  já vale pra toda página de uma vez (essa é a vantagem de ter
  centralizado antes).
- CTA padrão do header deixou de ser um link estático pro
  `ritual-de-entrada` e virou um dropdown "Entrar": botão Google (OAuth)
  + e-mail/senha, com "Ainda não tem kit? Criar agora →" apontando pro
  `ritual-de-entrada` de qualquer forma — cadastro continua sendo lá, o
  dropdown é só pra quem já tem conta.
- **Login real, não placeholder**: reaproveitei exatamente as mesmas
  chamadas/credenciais que `ritual-de-entrada.html` já usa
  (`sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo:
  origin + pathname } })` e `sb.auth.signInWithPassword({ email,
  password })`). O `supabase-js` é carregado sob demanda (só quando
  alguém clica em "Entrar"), pra não pesar toda página só por causa do
  dropdown do header.
- **Overrides continuam funcionando do jeito que já estavam**:
  `dashboard.html`, `admin-simbolos.html`, `admin-iching.html` — que já
  setam `window.SITE_CHROME.headerCta` — continuam com o CTA simples de
  sempre (Registrar experiência / Sair / Admin Símbolos), sem o
  dropdown. Testado (simulação Node) que o dropdown NÃO aparece nessas
  três.
- CSS novo (`.nav-auth`, `.auth-dropdown`, `.auth-oauth-btn`,
  `.auth-divider`, `.auth-dropdown-foot`) foi pro `assets/style.css`
  compartilhado, não em `<style>` de página — segue a mesma lógica de
  fonte única.
- **Pendência registrada, não resolvida agora**: o dropdown não checa se
  já existe sessão ativa. Um usuário já logado navegando por qualquer
  página comum (não-dashboard) ainda vê "Entrar" no lugar de algo tipo
  "Minha conta"/"Sair". Só `dashboard.html`/`admin-*.html` têm
  consciência de sessão hoje, cada um checando por conta própria. Trocar
  isso exigiria `site-chrome.js` checar `getSession()` em toda página
  (custo de uma chamada assíncrona a mais em toda navegação) — decisão
  de custo/benefício que prefiro deixar pro time bater o martelo, não
  implementei sozinho.

**Sessão de 31/07 — header/footer viraram componente único, norma daqui pra frente:**
- **Motivo:** cada página tinha o `<header class="site-header">` e o
  `<footer class="site-footer">` copiados e colados inline. Auditoria
  encontrou 7 variantes reais de header e 6 de footer entre as páginas
  (link faltando, CTA divergente, `Enciclopédia`/`Termos`/`Privacidade`
  presentes num footer e ausentes em outro) — resultado natural de
  vários agentes passando pelo mesmo arquivo em sessões diferentes.
- **Decisão de arquitetura, vale como norma pra qualquer página nova:**
  nenhuma página deve mais hardcodar o markup de header/footer. Criado
  `assets/site-chrome.js` como fonte única — um script injeta o
  `<nav>` (grupos Ferramentas/Saber/Sobre + CTA) e o `<footer>`
  (h2 fixo + CTA + links) a partir de UMA lista, marcando o link ativo
  pela URL atual. Cada página só tem o mount vazio:
  ```html
  <header class="site-header" id="site-header"></header>
  ...
  <footer class="site-footer" id="site-footer"></footer>
  ```
  e `<script src="assets/site-chrome.js" defer></script>` como o
  **primeiro** script `defer` da página (antes de `nav-menu.js` e
  `theme-toggle.js`, que dependem do markup injetado por ele).
- Aplicado nas 33 páginas que já tinham o header padrão. Ficaram de
  fora, deliberadamente: `deriva.html` (header com classe extra
  `grid-only`, identidade visual própria ainda pendente de unificação —
  ver seção 8) e `aura_flow.html` (documentado como sem menu, overlay
  embutido). `enciclopedia-index.html` e `enciclopedia-verbete.html` já
  não tinham o header padrão antes disso — não mexido, fica como
  pendência separada se algum dia precisarem entrar no site principal.
- **Rodapé — normalizado, não só centralizado:** a lista de links do
  footer agora é sempre `Manifesto, Intento, Raízes, Enciclopédia,
  Diário, Termos, Privacidade, Planos` em toda página — antes,
  `Enciclopédia` só aparecia em alguns footers e `Termos`/`Privacidade`
  só em 3 páginas (`dashboard`, `termos`, `privacidade`). Decisão minha,
  favorecendo o superset (nunca removi link que já existia em algum
  lugar) — reversível se o time achar que Termos/Privacidade não
  deveriam estar em todo footer.
- **`ancora.html` ganhou footer** — tinha o header padrão mas nunca teve
  footer, parece esquecimento (não há nenhuma decisão registrada dizendo
  que Âncora não deveria ter footer, ao contrário de `ritual-de-entrada`
  e das páginas de admin, que continuam sem footer de propósito).
- **CTA contextual preservado via override, não perdido na
  centralização:** `dashboard.html` (usuário logado → "Registrar
  experiência"/"Registrar minha primeira experiência", ambos apontando
  pra `diario`), `admin-simbolos.html` ("Sair", chama `logout()`) e
  `admin-iching.html` ("Admin Símbolos" → `admin-simbolos`) setam
  `window.SITE_CHROME = {...}` antes de carregar `site-chrome.js`. Ver
  comentário no topo do próprio arquivo pra sintaxe do override.
- Removidos `nav-menu.js` e `style.css` da raiz do repo — cópias órfãs
  desatualizadas (nada referenciava, as páginas já usavam
  `assets/nav-menu.js` e `assets/style.css`; a existência das duas
  cópias é o mesmo tipo de risco de divergência que motivou essa sessão
  inteira, só que em arquivo em vez de em página).
- **Norma daqui pra frente:** qualquer novo item de menu, mudança de
  rótulo, ou novo link de footer se edita **só** em
  `assets/site-chrome.js`. Nunca copiar o HTML do header/footer de uma
  página pra outra de novo.

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
  `https://pibwwyqjrsdwnzsiremx.supabase.co`, chave publicável — é
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