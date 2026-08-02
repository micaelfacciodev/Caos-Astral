-- ============================================================
-- CAOS ASTRAL — Migration 0001 (RECONSTRUÍDA em 01/08)
--
-- CONTEXTO: o projeto Supabase original (pvgeramqsatltnvkkpvf, EUA) foi
-- deletado pelo usuário; projeto novo criado no Brasil
-- (pibwwyqjrsdwnzsiremx). Este repo NUNCA teve 0001-0004 versionados
-- (só existiam 0005 em diante) — este arquivo reconstrói o schema base
-- do zero, já que não há backup do SQL original.
--
-- NÍVEL DE CONFIANÇA POR TABELA (importante ler antes de rodar):
--   ALTO  — profiles, natal_charts, planets, aspects: reconstruído a
--           partir do código REAL de compute-natal-chart/index.ts
--           (que eu tinha na íntegra) + das migrations 0005-0011 que
--           já existiam neste repo e referenciam essas tabelas.
--   MÉDIO — cenas_grau (estrutura): campos batem 1:1 com o que
--           compute-natal-chart consulta. O CONTEÚDO das 360 linhas
--           está eu recuperei de verdade, não é reconstrução — ver
--           supabase/seed/seed_0002_graus_simbolicos.sql.
--   BAIXO — houses, daily_readings, synastry_readings, solar_returns:
--           nunca vi o código de compute-daily-window/
--           compute-solar-return/compute-synastry (não estão neste
--           repo, "agente da máquina" nunca versionou aqui). Colunas
--           abaixo são inferência a partir só da descrição em
--           claude.md — PROVÁVEL que precisem de ajuste depois de
--           testar essas 3 Edge Functions de verdade contra o schema
--           novo. Rótulos de casa (rotulo_caos) ficam NULL de
--           propósito — não tenho o texto real, ver aviso no final.
--
-- Rodar no SQL Editor do Supabase (sem terminal), projeto novo,
-- ANTES de qualquer outra migration deste repo (0002 em diante já
-- existiam e continuam valendo depois desta).
-- ============================================================

-- ------------------------------------------------------------
-- PROFILES — 1:1 com auth.users. Confirmado via compute-natal-chart:
-- chave é `id` (references auth.users.id), NÃO `user_id` — não
-- reintroduzir esse bug (já documentado em 0010).
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  data_nascimento date,
  hora_nascimento time,
  cidade_nascimento text,
  latitude numeric,
  longitude numeric,
  utc_offset numeric,
  termos_aceitos_em timestamptz,
  termos_versao text,
  consentimento_sensivel_aceito_em timestamptz,
  consentimento_sensivel_versao text,
  created_at timestamptz not null default now()
);

comment on table public.profiles is
  'Dados de nascimento + consentimento do usuário. RLS: cada usuário só acessa a própria linha (id = auth.uid()).';

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- policy de UPDATE incluída desde já — a causa raiz do bug de
-- compute-natal-chart retornando 400 em produção (01/08) era essa
-- policy faltando (só existia SELECT). Ver claude.md, pendência
-- resolvida. Não omitir de novo.
-- policy de INSERT — necessária mesmo a trigger já criando a linha:
-- o upsert do front (INSERT ... ON CONFLICT DO UPDATE) exige policy de
-- INSERT válida pra sequer tentar o comando, mesmo quando o resultado
-- final é um UPDATE por conflito. Descoberto em produção 01/08 —
-- SELECT+UPDATE sozinhas não bastam (ver migration 0015, que aplicou
-- esse mesmo fix retroativamente no banco já rodando; aqui é só pra
-- quem instalar do zero não precisar da 0015 como remendo).
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- trigger: cria a linha em profiles automaticamente no primeiro
-- login (Google ou e-mail). security definer pra rodar sem RLS
-- (o usuário ainda não teria permissão de insert nele mesmo se
-- tentasse, e não precisa — só a trigger insere).
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ------------------------------------------------------------
-- NATAL_CHARTS — uma linha por usuário (upsert via onConflict: 'user_id').
-- Confirmado via compute-natal-chart: user_id, ascendente, meio_ceu,
-- planetas (jsonb), aspectos (jsonb), computado_em.
-- ------------------------------------------------------------
create table if not exists public.natal_charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  ascendente numeric,
  meio_ceu numeric,
  planetas jsonb not null default '[]'::jsonb,
  aspectos jsonb not null default '[]'::jsonb,
  computado_em timestamptz not null default now()
);

comment on table public.natal_charts is
  'Mapa natal calculado (compute-natal-chart). Uma linha por usuário, upsert por user_id. RLS: cada usuário só acessa a própria linha.';

alter table public.natal_charts enable row level security;

drop policy if exists "natal_charts_select_own" on public.natal_charts;
create policy "natal_charts_select_own"
  on public.natal_charts for select
  using (auth.uid() = user_id);

drop policy if exists "natal_charts_insert_own" on public.natal_charts;
create policy "natal_charts_insert_own"
  on public.natal_charts for insert
  with check (auth.uid() = user_id);

drop policy if exists "natal_charts_update_own" on public.natal_charts;
create policy "natal_charts_update_own"
  on public.natal_charts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- natal_charts é gravado pela Edge Function usando o JWT do próprio
-- usuário (não service_role — ver claude.md seção 8), por isso INSERT
-- e UPDATE aqui também, diferente de profiles (que só tem UPDATE
-- porque o INSERT é feito pela trigger, security definer).


-- ------------------------------------------------------------
-- PLANETS, HOUSES, ASPECTS — tabelas de referência/conteúdo editorial.
-- RLS: leitura pública (qualquer um, logado ou não, precisa consultar
-- pra montar o kit), escrita só service_role (sem policy de INSERT/
-- UPDATE/DELETE pra authenticated — mesma lógica de simbolos_astrologicos).
-- ------------------------------------------------------------
create table if not exists public.planets (
  chave text primary key,
  nome_astro text not null,
  rotulo_caos text not null,
  glifo text,
  nunca_retrograda boolean not null default false,
  ordem int not null,
  temperamento text check (temperamento in ('benefico', 'malefico', 'neutro'))
);

comment on table public.planets is
  'Dicionário de planetas/pontos: nome técnico, rótulo de marca (rotulo_caos), glifo, temperamento (usado no algoritmo provisório de tom de conjunção — ver claude.md seção 5). RLS: leitura pública, escrita só service_role.';

alter table public.planets enable row level security;

drop policy if exists "planets_select_public" on public.planets;
create policy "planets_select_public"
  on public.planets for select
  using (true);


create table if not exists public.houses (
  numero int primary key check (numero between 1 and 12),
  tema text,
  rotulo_caos text
);

comment on table public.houses is
  'Dicionário de casas astrológicas (território, no vocabulário Caos Astral). RLS: leitura pública, escrita só service_role. rotulo_caos ainda NULL — ver seed, conteúdo de marca não recuperado.';

alter table public.houses enable row level security;

drop policy if exists "houses_select_public" on public.houses;
create policy "houses_select_public"
  on public.houses for select
  using (true);


create table if not exists public.aspects (
  chave text primary key,
  angulo numeric not null,
  orbe numeric not null,
  rotulo_caos text,  -- nullable de propósito: null pra conjunção (sem termo fixo, ver claude.md seção 5)
  classe_cor text
);

comment on table public.aspects is
  'Dicionário de aspectos: ângulo, orbe, rótulo (fricção/corrente/null). RLS: leitura pública, escrita só service_role.';

alter table public.aspects enable row level security;

drop policy if exists "aspects_select_public" on public.aspects;
create policy "aspects_select_public"
  on public.aspects for select
  using (true);


-- ------------------------------------------------------------
-- CENAS_GRAU — 360 graus, conteúdo autoral. Estrutura confirmada via
-- compute-natal-chart (select signo, grau, decanato, tempero, imagem,
-- leitura .eq("versao","v1")). RLS: leitura pública, escrita só
-- service_role.
-- ------------------------------------------------------------
create table if not exists public.cenas_grau (
  id uuid primary key default gen_random_uuid(),
  signo text not null,
  grau int not null check (grau between 1 and 30),
  decanato int,
  tempero text,
  imagem text,
  leitura text,
  versao text not null default 'v1',
  unique (signo, grau, versao)
);

comment on table public.cenas_grau is
  '360 cenas de grau (conteúdo 100% autoral, ver claude.md seção 3 — IP). RLS: leitura pública, escrita só service_role.';

alter table public.cenas_grau enable row level security;

drop policy if exists "cenas_grau_select_public" on public.cenas_grau;
create policy "cenas_grau_select_public"
  on public.cenas_grau for select
  using (true);


-- ------------------------------------------------------------
-- DAILY_READINGS, SYNASTRY_READINGS, SOLAR_RETURNS — confiança BAIXA
-- (ver aviso no topo do arquivo). Shape mínimo pra não travar o resto
-- do produto; ajustar depois de testar as Edge Functions reais contra
-- o projeto novo.
-- ------------------------------------------------------------
create table if not exists public.daily_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data date not null default current_date,
  janela jsonb,
  iching_convite_aceito boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, data)
);

comment on table public.daily_readings is
  'Janela do dia. RECONSTRUÍDA COM CONFIANÇA BAIXA (nunca vi compute-daily-window/index.ts) — conferir shape real antes de confiar. RLS: cada usuário só acessa a própria linha.';

alter table public.daily_readings enable row level security;

drop policy if exists "daily_readings_select_own" on public.daily_readings;
create policy "daily_readings_select_own"
  on public.daily_readings for select
  using (auth.uid() = user_id);

drop policy if exists "daily_readings_insert_own" on public.daily_readings;
create policy "daily_readings_insert_own"
  on public.daily_readings for insert
  with check (auth.uid() = user_id);

drop policy if exists "daily_readings_update_own" on public.daily_readings;
create policy "daily_readings_update_own"
  on public.daily_readings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


create table if not exists public.synastry_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  partner_nome text,
  partner_data_nascimento date,
  partner_hora_nascimento time,
  partner_cidade_nascimento text,
  partner_latitude numeric,
  partner_longitude numeric,
  partner_utc_offset numeric,
  synastry_aspects jsonb,
  composite_chart jsonb,
  created_at timestamptz not null default now()
);

comment on table public.synastry_readings is
  'Câmara de ressonância / O Terceiro. RECONSTRUÍDA COM CONFIANÇA BAIXA (nunca vi compute-synastry/index.ts) — conferir shape real antes de confiar. RLS: cada usuário só acessa as próprias linhas.';

alter table public.synastry_readings enable row level security;

drop policy if exists "synastry_readings_select_own" on public.synastry_readings;
create policy "synastry_readings_select_own"
  on public.synastry_readings for select
  using (auth.uid() = user_id);

drop policy if exists "synastry_readings_insert_own" on public.synastry_readings;
create policy "synastry_readings_insert_own"
  on public.synastry_readings for insert
  with check (auth.uid() = user_id);


create table if not exists public.solar_returns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ano int not null,
  data_exata timestamptz,
  latitude numeric,
  longitude numeric,
  cidade text,
  resultado jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, ano)
);

comment on table public.solar_returns is
  'Retorno (revolução solar). RECONSTRUÍDA COM CONFIANÇA BAIXA (nunca vi compute-solar-return/index.ts) — conferir shape real antes de confiar. Localização é a de ONDE A PESSOA VAI PASSAR o ano, não a de nascimento (decisão confirmada em claude.md, não reabrir). RLS: cada usuário só acessa as próprias linhas.';

alter table public.solar_returns enable row level security;

drop policy if exists "solar_returns_select_own" on public.solar_returns;
create policy "solar_returns_select_own"
  on public.solar_returns for select
  using (auth.uid() = user_id);

drop policy if exists "solar_returns_insert_own" on public.solar_returns;
create policy "solar_returns_insert_own"
  on public.solar_returns for insert
  with check (auth.uid() = user_id);

drop policy if exists "solar_returns_update_own" on public.solar_returns;
create policy "solar_returns_update_own"
  on public.solar_returns for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
