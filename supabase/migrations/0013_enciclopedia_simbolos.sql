-- ============================================================
-- CAOS ASTRAL — Migration 0013 (RECONSTRUÍDA em 01/08)
--
-- Mesmo padrão do 0012: `enciclopedia_simbolos` + a view
-- `enciclopedia_indice_publico` nunca existiram como arquivo neste
-- repo (só citadas em comentário dentro de admin-enciclopedia.html
-- como "0003_enciclopedia_simbolos.sql"/"0004_...sql" — números que
-- nunca corresponderam a arquivos reais aqui, mesma colisão de
-- numeração das outras reconstruções). Achado numa varredura de
-- `.from(...)` em todo o código depois do gap de simbolos_astrologicos
-- (ver claude.md, "norma que eu deveria ter seguido desde o início").
--
-- Reconstruído a partir do código real:
-- - admin-enciclopedia.html: payload completo do formulário (linha
--   ~411), checagem de admin via profiles.is_admin (linha ~249).
-- - enciclopedia-index.html: consulta a view enciclopedia_indice_publico,
--   só slug/nome/categoria/tier/significado (nunca o conteúdo protegido).
-- - enciclopedia-verbete.html: consulta a tabela base direto, trata
--   "não veio nada" como bloqueio de RLS (tier pago) OU slug inexistente
--   — mesma linha, sem distinguir (comentário deles mesmo).
--
-- MONETIZAÇÃO AINDA NÃO EXISTE (claude.md seção 1: "pendente de
-- desenho") — não há tabela de assinatura/pagamento em lugar nenhum.
-- Por isso a policy de SELECT abaixo só libera tier='gratis' pra
-- todo mundo; tier='pago' fica RLS-bloqueado pra QUALQUER usuário não
-- admin até o dia que a monetização for implementada de verdade (não
-- é bug, é o estado atual do produto — verbete pago existe no schema,
-- mas ninguém consegue ler o conteúdo completo ainda, só a "vitrine"
-- na view pública).
--
-- Rodar no SQL Editor do projeto novo. Independente do resto (não
-- depende de 0001-0012).
-- ============================================================

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

comment on column public.profiles.is_admin is
  'Admin único do site (sem multi-tenant) — controla acesso a admin-enciclopedia.html, mesmo padrão de "auth.uid() = admin fixo" usado em simbolos_astrologicos, só que via coluna em vez de UUID hardcoded no SQL.';


create table if not exists public.enciclopedia_simbolos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  categoria text,
  tier text not null default 'gratis' check (tier in ('gratis', 'pago')),
  nomes_alternativos text[] not null default '{}',
  tradicoes text[] not null default '{}',
  origem text,
  primeiros_registros text,
  significado text,
  uso_historico text,
  uso_moderno text,
  correspondencias jsonb,
  bibliografia text[] not null default '{}',
  svg_path text,
  created_at timestamptz not null default now()
);

comment on table public.enciclopedia_simbolos is
  'Enciclopédia de símbolos (raízes/proveniência). RLS: SELECT completo só pra tier=gratis ou admin (monetização de tier=pago ainda não implementada — ver nota no topo do arquivo). Escrita só admin.';

alter table public.enciclopedia_simbolos enable row level security;

drop policy if exists "enciclopedia_simbolos_select_gratis_or_admin" on public.enciclopedia_simbolos;
create policy "enciclopedia_simbolos_select_gratis_or_admin"
  on public.enciclopedia_simbolos for select
  using (
    tier = 'gratis'
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

drop policy if exists "enciclopedia_simbolos_admin_write" on public.enciclopedia_simbolos;
create policy "enciclopedia_simbolos_admin_write"
  on public.enciclopedia_simbolos for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));


-- View pública: expõe metadados de TODOS os verbetes (inclusive
-- tier=pago) pra virar "card com cadeado" em enciclopedia-index.html,
-- sem vazar o conteúdo protegido (só 5 colunas, nunca uso_historico/
-- bibliografia/etc). Funciona porque a view roda com o dono da tabela
-- (postgres, com bypassrls no Supabase) — comportamento padrão do
-- Postgres pra views sem security_invoker, não precisa de nada
-- especial além do grant de select abaixo.
create or replace view public.enciclopedia_indice_publico as
select slug, nome, categoria, tier, significado
from public.enciclopedia_simbolos;

grant select on public.enciclopedia_indice_publico to anon, authenticated;
