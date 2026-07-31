-- ============================================================
-- CAOS ASTRAL — Migration 0010
-- Adiciona colunas de consentimento em `profiles`, pro
-- ritual-de-entrada.html conseguir gravar de verdade o que os dois
-- checkboxes de consentimento (termos/privacidade geral, e o
-- consentimento específico de dado sensível — art. 11 LGPD) já
-- coletam na UI, mas que hoje não são persistidos em lugar nenhum.
--
-- Timestamp + versão em vez de só um booleano: se os termos ou a
-- redação do consentimento mudarem no futuro, dá pra saber quem
-- aceitou qual versão e quando — booleano sozinho perde essa
-- informação.
--
-- Deploy: commitar em supabase/migrations/ na branch main (aplica
-- sozinho via integração GitHub↔Supabase), ou rodar manualmente no
-- SQL Editor se essa integração estiver fora do ar.
-- ============================================================

alter table public.profiles
  add column if not exists termos_aceitos_em timestamptz,
  add column if not exists termos_versao text,
  add column if not exists consentimento_sensivel_aceito_em timestamptz,
  add column if not exists consentimento_sensivel_versao text;
