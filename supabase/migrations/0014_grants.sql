-- ============================================================
-- CAOS ASTRAL — Migration 0014 (01/08)
--
-- CAUSA RAIZ do erro visto em produção: "permission denied for table
-- profiles" (código Postgres 42501) ao tentar finalizar o ritual de
-- entrada. Isso NÃO é RLS (RLS já estava certo — policy de UPDATE
-- existe desde a 0001) — é a camada de baixo: no Postgres, uma role
-- (`authenticated`, `anon`) precisa ter GRANT explícito de
-- SELECT/INSERT/UPDATE/DELETE na tabela ANTES de a RLS entrar em ação.
-- RLS decide QUAIS LINHAS; GRANT decide SE a operação é permitida de
-- jeito nenhum. Sem o GRANT, nem importa o que a policy de RLS diz.
--
-- Nenhuma migration deste repo (nem as que eu escrevi 0001/0012/0013,
-- nem as que já existiam antes — 0005 a 0011) tinha GRANT explícito
-- pra nenhuma tabela nova, só a view de 0013 (conferido via grep,
-- claude.md documenta). Um projeto Supabase normalmente já vem com
-- `alter default privileges ... grant all on tables to anon,
-- authenticated` configurado de fábrica para novas tabelas — por
-- algum motivo (projeto novo, região Brasil, formato de chave
-- `sb_publishable_...` mais novo — não confirmei qual exatamente) isso
-- não aconteceu sozinho aqui. Resultado: toda tabela criada por SQL
-- direto neste projeto ficou sem grant nenhum pras roles do Supabase,
-- e a RLS nunca chegou a ser avaliada.
--
-- Efeito: qualquer teste noutra tabela (I Ching, âncoras, diário,
-- retorno, sinastria) provavelmente ia dar o mesmo erro assim que
-- fosse tentado — não é só profiles, é sistêmico. Esta migration
-- cobre TODAS as tabelas do schema público, incluindo as que não
-- foram escritas por mim.
--
-- Rodar no SQL Editor do projeto novo, a qualquer momento depois de
-- 0001. Idempotente — seguro rodar de novo se alguma tabela nova for
-- criada depois e alguém esquecer de grant nela (mas o ideal é toda
-- migration nova já vir com seu próprio grant, não depender desta).
-- ============================================================

-- schema public: uso básico, sem isso nem chega a tentar nada
grant usage on schema public to anon, authenticated;

-- todas as tabelas/views que já existem hoje — RLS continua sendo
-- quem decide o que cada usuário realmente enxerga/edita, isso aqui só
-- destrava a permissão de SQL de base.
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;

-- qualquer tabela criada DEPOIS desta migration (por qualquer um dos
-- três agentes, via SQL direto) já nasce com esses grants — não
-- deveria mais precisar rodar isto de novo pra tabela nova nenhuma,
-- mas nada impede de rodar mesmo assim por segurança.
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant select on tables to anon;
