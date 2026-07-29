-- 0006_iching_readings.sql
-- Histórico privado de consultas do Oráculo (I Ching). Cada lançamento de
-- moedas em oraculo.html, quando o usuário está logado, salva uma linha
-- aqui. RLS: cada pessoa só lê/escreve as próprias consultas.
--
-- Rodar no SQL Editor do Supabase (sem terminal), depois de 0005.

create table if not exists public.iching_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text,                          -- pergunta que a pessoa digitou (opcional)
  primary_hexagram int not null check (primary_hexagram between 1 and 64),
  moving_lines int[] not null default '{}', -- posições (1-6) das linhas em movimento
  resulting_hexagram int check (resulting_hexagram between 1 and 64), -- se houver linhas móveis
  created_at timestamptz not null default now()
);

comment on table public.iching_readings is
  'Histórico privado de consultas do Oráculo (I Ching). RLS: cada usuário só acessa as próprias linhas.';

create index if not exists idx_iching_readings_user_id on public.iching_readings(user_id);

alter table public.iching_readings enable row level security;

drop policy if exists "iching_readings_owner_select" on public.iching_readings;
create policy "iching_readings_owner_select"
  on public.iching_readings for select
  using (auth.uid() = user_id);

drop policy if exists "iching_readings_owner_insert" on public.iching_readings;
create policy "iching_readings_owner_insert"
  on public.iching_readings for insert
  with check (auth.uid() = user_id);

drop policy if exists "iching_readings_owner_delete" on public.iching_readings;
create policy "iching_readings_owner_delete"
  on public.iching_readings for delete
  using (auth.uid() = user_id);

-- sem policy de update: uma consulta já lançada não deve ser editada, só
-- criada ou apagada (a pessoa pode lançar de novo se quiser reconsultar).
