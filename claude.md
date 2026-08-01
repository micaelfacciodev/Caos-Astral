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
- Projeto Supabase: `https://pvgeramqsatltnvkkpvf.supabase.co`. A chave publicável (anon key) está hardcoded em `admin-simbolos.html` e `assets/flash-decor.js` — **isso é seguro**, é a chave protegida por RLS, não a `service_role`; não reabrir essa discussão sem motivo novo.

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