-- ============================================================
-- CAOS ASTRAL — Migration 0015 (01/08)
--
-- CAUSA RAIZ: erro real visto no console — code 42501, "new row
-- violates row-level security policy for table profiles" — ao
-- finalizar o ritual de entrada numa conta cuja linha em `profiles`
-- JÁ EXISTIA (criada pela trigger no login).
--
-- Por que isso acontece mesmo a linha já existindo: o front faz
-- `sb.from('profiles').upsert({...}, { onConflict: 'id' })`, que o
-- PostgREST traduz em SQL puro pra `INSERT ... ON CONFLICT (id) DO
-- UPDATE`. Mesmo quando o resultado final é um UPDATE (conflito
-- encontrado), o COMANDO em si começa como INSERT — e com RLS
-- habilitado, o Postgres exige uma policy de INSERT válida pra sequer
-- tentar o comando, antes de chegar na parte de resolver o conflito.
-- Sem policy de INSERT, é bloqueado ali, não importa que ia acabar
-- virando update.
--
-- 0001_schema.sql só criou SELECT + UPDATE em profiles (copiando o
-- que tínhamos confirmado via pg_policies no projeto ANTIGO) — mas
-- nunca chegamos a confirmar de ponta a ponta que só essas duas
-- bastavam lá; a troca de projeto interrompeu esse teste antes da
-- confirmação final. Ficou faltando a de INSERT o tempo todo.
--
-- Rodar no SQL Editor do projeto novo, a qualquer momento depois de
-- 0001 e 0014 (esta migration só adiciona policy, não depende de mais
-- nada além da tabela profiles já existir).
-- ============================================================

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);
