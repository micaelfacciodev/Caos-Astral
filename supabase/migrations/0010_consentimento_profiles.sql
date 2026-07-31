-- ============================================================
-- CAOS ASTRAL — Migration 0010
-- Duas coisas nesta migration:
--
-- 1. Colunas de consentimento em `profiles`, pro ritual-de-entrada.html
--    conseguir gravar de verdade o que os dois checkboxes de
--    consentimento (termos/privacidade geral, e o consentimento
--    específico de dado sensível — art. 11 LGPD) já coletam na UI, mas
--    que hoje não são persistidos em lugar nenhum. Timestamp + versão
--    em vez de só um booleano: se os termos ou a redação do
--    consentimento mudarem no futuro, dá pra saber quem aceitou qual
--    versão e quando.
--
-- 2. `nome` e `cidade_nascimento`, defensivamente. Só
--    `data_nascimento, hora_nascimento, utc_offset, latitude, longitude`
--    são confirmados no código real de `compute-natal-chart` (ele só lê
--    essas 5). `nome`/`cidade_nascimento` são suposição do onboarding —
--    `add column if not exists` é seguro mesmo se elas já existirem,
--    então roda sem risco dos dois lados (já existir ou não).
--
-- ATENÇÃO — CHAVE: `profiles` usa `id` (referencia auth.users.id
-- direto), NÃO `user_id` como as outras tabelas do produto — confirmado
-- via compute-natal-chart (`.eq("id", user.id)`). Já causou um bug real
-- no primeiro rascunho do onboarding (30/07); não reintroduzir.
--
-- Deploy: commitar em supabase/migrations/ na branch main (aplica
-- sozinho via integração GitHub↔Supabase), ou rodar manualmente no
-- SQL Editor se essa integração estiver fora do ar.
-- ============================================================

alter table public.profiles
  add column if not exists nome text,
  add column if not exists cidade_nascimento text,
  add column if not exists termos_aceitos_em timestamptz,
  add column if not exists termos_versao text,
  add column if not exists consentimento_sensivel_aceito_em timestamptz,
  add column if not exists consentimento_sensivel_versao text;
