# CLAUDE.md — Caos Astral

Documento vivo. Atualizar sempre que uma decisão de arquitetura, schema
ou convenção for tomada por qualquer um dos três agentes. Nenhum agente
deve alterar schema compartilhado sem registrar aqui primeiro.

---

## 1. O que é o produto

**Caos Astral** é o oposto da astrologia comercial preditiva. Não faz
horóscopo genérico nem tenta adivinhar eventos ("você vai brigar com
um amigo hoje"). A base filosófica é a Magia do Caos: crença como
ferramenta, não como verdade. Trânsitos e posições planetárias não
determinam destino — representam correntes de energia e ingredientes
disponíveis. O produto ensina a pessoa a operar essas energias (gnose,
força de vontade, sigilos, decisão ativa), nunca a esperar passivamente
que elas aconteçam.

### Vocabulário oficial (não inventar sinônimos soltos)
| Termo tradicional | Termo Caos Astral |
|---|---|
| Signo solar | **núcleo** |
| Signo lunar | **fome** |
| Ascendente | **máscara** |
| Aspecto tenso (quadratura/oposição) | **fricção** / **tensão de eixo** |
| Aspecto harmônico (trígono/sextil) | **corrente** / **corrente leve** |
| Conjunção | **fusão** |
| Trânsito do dia | **janela** (a leitura do dia) |
| Casa astrológica | **território** |
| Retrogradação | **eco** |
| Quíron | **cicatriz** |
| Compatibilidade / sinastria | **câmara de ressonância** |

Tom de voz: nunca "você vai" ou "isso significa que você é". Sempre
**ferramenta + escolha em aberto**. Nenhuma conclusão moral fechada.

---

## 2. Os três agentes

| Agente | Responsabilidade | Não deve fazer |
|---|---|---|
| **Este agente (Claude — "a máquina")** | Schema Supabase, RLS, SQL, Edge Functions, motor de cálculo astrológico, dados de referência (graus simbólicos) | Front-end, telas, I Ching |
| **Agente de Front-end** | Telas, fluxo de onboarding, sessões/histórico visual, chamar as Edge Functions | Schema do banco, cálculo astrológico |
| **Agente de I Ching** | Tabela própria de leituras de I Ching, tradução de Legge (1882, domínio público) | Alterar tabelas do Caos Astral diretamente |

Os três recebem o mesmo prompt-base e devem manter este arquivo
sincronizado — é a fonte única de verdade entre eles.

---

## 3. Propriedade intelectual — regras já resolvidas, não reabrir

- **Símbolos de grau**: sistema 100% autoral do Caos Astral. **Não é
  Jones (1953) nem Rudhyar (1936)** — ambos ainda protegidos por
  direito autoral. Fonte de verdade: `/graus-caos-astral/` no repo
  (12 arquivos JSON por signo + `graus-caos-astral-completo.json`).
  Estrutura: 3 decanatos de 10° por signo, com tempero de regência
  tradicional (triplicidade — isso sim é domínio público, é técnica
  antiga). **Nunca usar a palavra "sabian" em código, schema ou
  documentação** — nem como referência de inspiração.
- **I Ching**: tradução de James Legge (1882/1899), domínio público
  confirmado (autor morto em 1897). Fonte deve ser texto limpo
  (ex: sacred-texts.com), não PDF escaneado com OCR não verificado.
- Antes de usar qualquer material histórico de terceiros como fonte de
  dado (não só reescrita — nem como "inspiração" de estrutura
  grau-a-grau), verificar status de domínio público por data de
  publicação real, não data de criação/canalização.

---

## 4. Schema Supabase — estado atual

Arquivos no repo (pasta sugerida: `supabase/`):

```
supabase/
  migrations/
    0001_schema.sql                        -- todas as tabelas + RLS + trigger
    0002_natal_charts_unique.sql           -- unique(user_id) em natal_charts
  seed/
    seed_0001_planets_houses_aspects.sql   -- 11 planetas, 12 casas, 5 aspectos
    seed_0002_graus_simbolicos.sql         -- 360 graus (gerado do JSON)
  functions/
    compute-natal-chart/index.ts
    compute-daily-window/index.ts
```

### Tabelas — dicionário (RLS: leitura pública, escrita só service_role)
- `planets` — chave, nome_astro, rotulo_caos, glifo, nunca_retrograda, ordem (11 linhas, inclui Quíron)
- `houses` — numero (1-12), tema, rotulo_caos
- `aspects` — chave, angulo, orbe, rotulo_caos, classe_cor (5 linhas)
- `graus_simbolicos` — signo, grau (1-30), decanato, tempero, imagem, leitura, versao (360 linhas, versao='v1')

### Tabelas — dado de usuário (RLS: privado, `auth.uid()`)
- `profiles` — 1:1 com `auth.users`, criado automaticamente via trigger no primeiro login Google. Campos: nome, data_nascimento, hora_nascimento, utc_offset, latitude, longitude, cidade_nascimento.
- `natal_charts` — **uma linha por usuário** (upsert via `onConflict: user_id`). ascendente, meio_ceu, planetas (jsonb), aspectos (jsonb).
- `daily_readings` — uma linha por usuário por dia (`unique(user_id, data)`). Campo `iching_convite_aceito` já existe pro handoff com o I Ching (ver seção 6).
- `synastry_readings` — sinastria entre dois usuários (ou usuário + dados manuais de parceiro sem conta). **Ainda não tem Edge Function própria** — pendente.
- `sigil_journal` — diário de sigilos/gnose. Ferramenta de sigilo em si é externa (o usuário já tem uma pronta); esta tabela é só o armazenamento.

### Autenticação
Login via Google OAuth, gerenciado pelo Supabase Auth nativamente.
Configuração manual necessária no **Dashboard → Authentication →
Providers → Google** (Client ID/Secret do Google Cloud Console + redirect
URI que o próprio Supabase mostra). Isso não é SQL, é config de painel.

### Como aplicar tudo (sem terminal — usuário não usa CLI)
1. SQL Editor do Supabase (colar e rodar, nesta ordem):
   `0001_schema.sql` → `seed_0001_planets_houses_aspects.sql` →
   `seed_0002_graus_simbolicos.sql` → `0002_natal_charts_unique.sql`
2. Edge Functions → Deploy a new function → **Via Editor** (não CLI) →
   colar o conteúdo de cada `index.ts` → Deploy.

---

## 5. Motor de cálculo astrológico

- **Efemérides reais** via `astronomy-engine` (npm, MIT license, sem
  arquivos de dados pesados). **Atenção**: usar `GeoVector` + `Ecliptic`
  pra posição geocêntrica — **não usar `EclipticLongitude`**, que é
  heliocêntrica e quebra pro Sol (bug já corrigido, não reintroduzir).
- **Quíron**: não está na astronomy-engine. Calculado localmente por
  órbita kepleriana de dois corpos (elementos JPL SBDB, época
  2021-Jul-01: a=13.70 UA, e=0.3772, i=6.9299°, Ω=209.27°, ω=339.48°,
  M₀=180.70°, período=18523 dias). Sem correção de perturbação de
  Saturno/Urano — aceitável pra uso pessoal, precisão degrada quanto
  mais longe da época de referência.
- **Ascendente/Meio-do-Céu**: fórmula própria via GMST + obliquidade da
  eclíptica + latitude (não é estimativa — é cálculo real, exige hora
  de nascimento exata).
- **Casas**: sistema **signo inteiro** (escolha deliberada — o mais
  simples de implementar sem ambiguidade; Placidus ficou de fora por
  ora).
- **Grau "em andamento"**: `floor(grau_na_casa) + 1`, não arredondamento
  pro mais próximo nem `ceil` puro (um planeta a 14°20' já completou 14°
  e está cursando o 15º). Já corrigido um bug de `ceil` que quebrava em
  graus exatos — não reintroduzir.
- **Aspectos**: conjunção (0°, orbe 8°), sextil (60°, orbe 5°), quadratura
  (90°, orbe 7°), trígono (120°, orbe 7°), oposição (180°, orbe 8°).
- **Rótulos vêm do banco** (`planets.rotulo_caos`, `aspects.rotulo_caos`),
  não hardcoded no código — editável sem redeploy. `compute-daily-window`
  já segue essa prática; `compute-natal-chart` ainda tem nomes de signo
  fixos no código (aceitável, signo não muda) mas os rótulos de
  planeta/aspecto lá deveriam ser migrados pra buscar do banco também
  — pendente.

---

## 6. Contrato Caos Astral ↔ I Ching

- O agente de I Ching cria sua própria tabela (ex: `iching_readings`),
  RLS privada (`auth.uid() = user_id`), mesmo padrão das tabelas
  privadas do Caos Astral.
- Essa tabela deve ter uma coluna opcional:
  `daily_reading_id uuid references public.daily_readings(id)` (nullable
  — permite tiragem avulsa, sem vir da janela do dia).
- Fluxo esperado:
  1. Front-end chama `compute-daily-window`, recebe o `id` da leitura.
  2. Se o usuário aceitar o convite ("que tal ver o que o acaso traz"),
     o front-end passa esse `daily_reading_id` pro fluxo do I Ching.
  3. Ao salvar a tiragem, o agente de I Ching grava esse id junto.
  4. Front-end (ou agente de I Ching) faz
     `update daily_readings set iching_convite_aceito = true where id = <daily_reading_id>`
     — já coberto pela RLS existente.
- Nenhum dos dois agentes altera o schema do outro diretamente.

---

## 7. Pendências conhecidas (não esquecer)

- [ ] Edge Function de sinastria (`synastry_readings` existe, function não).
- [ ] Migrar rótulos hardcoded de `compute-natal-chart` pra buscar do banco.
- [ ] Definir se `daily_readings` recalcula à meia-noite local do usuário
      ou UTC (hoje usa data UTC do servidor — pode gerar leitura "de
      ontem" ainda visível de manhã cedo em fusos negativos. Não
      resolvido ainda).
- [ ] Landing page e app ainda usam identidades visuais diferentes —
      decidido unificar numa paleta só (ver histórico de chat), mas
      arquivos ainda não foram atualizados.
- [ ] `sigil_journal` depende da ferramenta de sigilo externa do usuário
      — ponto de integração ainda não especificado tecnicamente.
- [ ] Plano de monetização (paywall, assinatura) pressupõe cobrança real
      — nada disso existe ainda; esta base é só schema + lógica.

---

## 8. Histórico de decisões relevantes (não reabrir sem motivo novo)

- Google OAuth via Supabase Auth nativo — decidido, não trocar por auth
  customizado.
- RLS obrigatório em toda tabela, sem exceção.
- Nenhum uso de `service_role` nas Edge Functions de usuário — elas
  atuam com o JWT do próprio usuário, deixando a RLS decidir. Só
  operações de admin/seed usam service_role, e isso é feito via SQL
  Editor do painel, não em runtime.
- Usuário responsável pelo projeto não usa terminal (iMac 2011) — toda
  instrução de deploy deve assumir caminho via Dashboard/navegador, nunca
  CLI como único caminho.
