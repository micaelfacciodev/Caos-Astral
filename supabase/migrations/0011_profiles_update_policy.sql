-- ============================================================
-- CAOS ASTRAL — Migration 0011
--
-- DIAGNÓSTICO (31/07-01/08): compute-natal-chart retornando 400 em
-- produção pra contas que já passaram pelo ritual de entrada completo
-- (nome, data, cidade, hora preenchidos). Nas duas contas conferidas
-- na Table Editor, `profiles` ficou travado no estado que a trigger de
-- auto-criação deixa no primeiro login (nome = 'EMPTY', data/hora
-- nascimento NULL) — ou seja, o upsert real de
-- ritual-de-entrada.html:finalizarRitual() nunca "pegou".
--
-- O código do front já está correto (usa `id`, não `user_id`, com
-- onConflict: 'id' — ver comentário na 0010, já resolvido antes).
-- Suspeita principal restante: falta policy de UPDATE em `profiles`
-- pro próprio usuário. A trigger faz o INSERT inicial (roda como
-- owner/security definer, não sofre RLS); o upsert do front, rodando
-- como o usuário autenticado via RLS, vira um UPDATE por trás do
-- onConflict — se só existir policy de SELECT/INSERT (sem UPDATE), o
-- Postgres recusa silenciosamente pra quem não é dono/sem policy, o
-- upsert lança erro, o front cai no catch genérico ("Login funcionou,
-- mas não consegui calcular seu mapa agora"), e o perfil nunca é
-- corrigido.
--
-- Esta migration só CRIA a policy de UPDATE se realmente não existir
-- nenhuma ainda — seguro rodar mesmo se o diagnóstico acima estiver
-- errado (não faz nada nesse caso, não quebra política existente).
--
-- Depois de rodar: contas já travadas (nome='EMPTY'/campos NULL)
-- continuam travadas até o usuário repetir o ritual de entrada (ou
-- alguém rodar um UPDATE manual) — esta migration destrava o UPDATE,
-- não conserta retroativamente linhas já erradas.
-- ============================================================

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and cmd = 'UPDATE'
  ) then
    create policy "profiles_update_own" on public.profiles
      for update
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;
end $$;
