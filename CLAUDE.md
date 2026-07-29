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
| **Agente de Front-end** | Site estático (HTML/CSS puro, sem build step), fluxo de onboarding (`ritual-de-entrada.html`), conectar telas às Edge Functions nos pontos `<!-- ENGINE: ... -->` | Schema do banco, cálculo astrológico |
| **Agente de I Ching** | `iching_readings` (tabela própria), tradução de Legge (1882, domínio público), identidade visual própria (papel/tinta/cinábrio) | Alterar tabelas do Caos Astral diretamente, usar vocabulário do kit (núcleo/fricção/território etc.) |

### Mapa do site (referência: `arquitetura-conteudo-caos-astral.md`)
```
/ (landing) · /manifesto · /intento · /raizes (+ 4 subpáginas de proveniência)
/ritual-de-entrada (onboarding) · /kit · /retorno · /ressonancia · /ancora
/oraculo (ou /i-ching — ver pendência de nome, seção 7) · /diario · /blog · /planos
```

### Pendência de UI aberta pro front (nova)
`/retorno` precisa de um campo de **localização do ano** ("onde você vai
passar esse ano") — não é a mesma coisa que a cidade de nascimento.
Reaproveitar a mesma busca de cidade (Nominatim) já usada no onboarding.
Sem isso preenchido, `compute-solar-return` recusa calcular (ver seção 5).

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
  seed/
    seed_0001_planets_houses_aspects.sql       -- 11 planetas, 12 casas, 5 aspectos
    seed_0002_graus_simbolicos.sql             -- 360 cenas de grau (nome do arquivo desatualizado,
                                                --   tabela final é cenas_grau após o rename da 0003)
  functions/
    compute-natal-chart/index.ts
    compute-daily-window/index.ts
    compute-solar-return/index.ts
```

**Ordem de execução (SQL Editor do Supabase, sem terminal)** — já aplicada
com sucesso uma vez neste projeto:
`0001_schema.sql` → `seed_0001_planets_houses_aspects.sql` →
`seed_0002_graus_simbolicos.sql` → `0002_natal_charts_unique.sql` →
`0003_adendo_vocabulario_e_tabelas.sql` → `0004_solar_return_localizacao.sql`

Se precisar zerar tudo de novo por qualquer motivo: rodar `0000_reset.sql`
primeiro, depois a sequência acima do início.

### Tabelas — dicionário (RLS: leitura pública, escrita só service_role)
- `planets` — chave, nome_astro, rotulo_caos, glifo, nunca_retrograda, ordem, `temperamento` (benefico/malefico/neutro — só usado pra decidir tom de conjunção, seção 5)
- `houses` — numero (1-12), tema, rotulo_caos
- `aspects` — chave, angulo, orbe, rotulo_caos (**nullable** — null pra conjunção), classe_cor
- `cenas_grau` *(antiga `graus_simbolicos`, renomeada)* — signo, grau (1-30), decanato, tempero, imagem, leitura, versao

### Tabelas — dado de usuário (RLS: privado, `auth.uid()`)
- `profiles` — 1:1 com `auth.users`, criado automaticamente via trigger no primeiro login Google.
- `natal_charts` — uma linha por usuário (upsert). ascendente, meio_ceu, planetas (jsonb), aspectos (jsonb).
- `daily_readings` — uma linha por usuário por dia. `iching_convite_aceito` pro handoff com I Ching (seção 6).
- `synastry_readings` — sinastria (câmara de ressonância). `composite_chart` jsonb é onde O Terceiro vive. **Sem Edge Function ainda.**
- `solar_returns` — retorno (revolução solar). `user_id`, `ano` (unique juntos), `data_exata`, **`latitude`/`longitude`/`cidade` do ano em questão** (não é a de nascimento — ver seção 5), `planetas`, `aspectos`. **Tem Edge Function: `compute-solar-return`.**
- `intent_anchors` *(antiga `sigil_journal`, separada)* — a âncora de intenção em si (gerada por ferramenta externa ao Supabase).
- `diario_gnose` *(antiga `sigil_journal`, separada)* — registro livre de prática, com FK opcional pra `daily_readings` e pra `intent_anchors`.

### Autenticação
Login via Google OAuth nativo do Supabase Auth. Config manual no
Dashboard (Authentication → Providers → Google). Não é SQL.

### Deploy sem terminal
SQL Editor pra migrations/seeds; Edge Functions → Deploy a new function
→ **Via Editor** (colar o `index.ts` inteiro) → Deploy. Usuário responsável
não usa terminal (iMac 2011) — todo caminho de deploy deve assumir
navegador, nunca CLI como único caminho.

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
  decisão do glossário. Implementado em `compute-daily-window` e
  `compute-solar-return` como: os dois planetas benéficos clássicos
  (Vênus, Júpiter) → tom de corrente; os dois maléficos clássicos
  (Marte, Saturno) → tom de fricção; qualquer combinação envolvendo
  planeta neutro, ou um benéfico + um maléfico → sem categoria forçada.
  **Interpretação minha, não decisão fechada do time** — revisar antes
  de considerar definitivo.
- **Retorno (revolução solar)**: busca binária do instante exato em que
  o núcleo em trânsito volta ao grau natal exato (o Sol nunca retrograda,
  então a busca é segura — ~40 iterações a partir de uma janela de dias
  ao redor do aniversário calendário). **A localização usada pro
  ascendente/casas do mapa de retorno é a de ONDE A PESSOA VAI PASSAR
  aquele ano — não a de nascimento.** `compute-solar-return` exige
  `latitude`/`longitude` no corpo da requisição e recusa calcular sem
  isso (erro 400 explícito, sem aproximação silenciosa). Se `ano` não
  for informado, calcula o retorno mais recente já ocorrido (o que rege
  o período atual).
- **Rótulos vêm do banco** (`planets.rotulo_caos`, `aspects.rotulo_caos`),
  não hardcoded — editável sem redeploy. `compute-daily-window` e
  `compute-solar-return` já seguem isso; `compute-natal-chart` só grava
  a chave do aspecto (`square`, `trine` etc.), o rótulo é decidido por
  quem lê depois via `aspects`.

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
  etc.) — tradição deliberadamente separada, identidade visual própria.
- Nenhum agente altera schema do outro diretamente.

---

## 7. Pendências conhecidas

- [ ] Edge Function de sinastria (`synastry_readings` + `composite_chart` existem, function não).
- [ ] Edge Function de O Terceiro (mapa composto por pontos médios).
- [ ] Migrar rótulos hardcoded de `compute-natal-chart` pra buscar do banco, se algo vier a depender de rótulo de planeta/aspecto ali (hoje só grava a chave do aspecto, então não é urgente).
- [ ] Fuso horário de `daily_readings`: usa data UTC do servidor — pode
      gerar leitura "de ontem" ainda visível de manhã cedo em fusos negativos.
- [ ] Confirmar/ajustar o algoritmo provisório de conjunção (seção 5) com o time.
- [ ] Território de ofício, Marcos, Intento: specs técnicas pendentes, não codar ainda.
- [ ] UI do front: campo de "localização do ano" em `/retorno`, obrigatório
      pra `compute-solar-return` funcionar (ver seção 2).
- [ ] **Itens de arquivo do front (fora do meu escopo, não tenho acesso de
      escrita ao repo)**: apagar `origens-do-iching.html` (substituído por
      `raizes-i-ching.html`), decidir destino de `oraculo.html` (redirecionar
      pra `i-ching.html` ou remover), apagar `caos-astral-landing.html`.
- [ ] Front-end está desorganizado no momento — testes de ponta a ponta
      (natal, janela do dia) ainda não rodados de verdade por causa disso.
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
- **[ATUALIZADO]** Identidade visual: decisão do usuário foi **padronizar
  o layout completamente** — não é mais fase posterior, é decisão ativa.
  Oráculo (I Ching) já foi convertido pra tema escuro padrão (commit
  "tema escuro padrão"). Ferramentas com identidade própria ainda
  pendentes de unificação: Âncora de Intenção (paleta dourado/osso,
  Cinzel/EB Garamond) e Deriva (paleta vermelho/areia, EB Garamond) —
  ver seção 9.
- Usuário responsável não usa terminal (iMac 2011) — deploy sempre via
  Dashboard/navegador.

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
  astrológicos (efeito "flash decor" trazido do site de tatuagem) — em
  planejamento, não implementado ainda. Vai precisar de credenciais
  Supabase **próprias do projeto Caos Astral** (o admin original usa
  projeto Supabase do site de tatuagem, hardcoded — não reaproveitar).
  Se o agente da máquina já tiver `SUPABASE_URL`/`anon key` do projeto
  Caos Astral documentados em algum lugar, adicionar aqui pra front
  não precisar pedir de novo.
