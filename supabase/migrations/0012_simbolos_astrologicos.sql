-- ============================================================
-- CAOS ASTRAL — Migration 0012 (RECONSTRUÍDA em 01/08)
--
-- CONTEXTO: `simbolos_astrologicos` (tabela) + bucket `simbolos`
-- (Storage) nunca foram versionados neste repo como arquivo .sql — só
-- existiam descritos em claude.md (seção 4/9, referenciando
-- "0005_simbolos_astrologicos.sql"/"0006_simbolos_admin_restrito.sql",
-- que NUNCA foram os arquivos reais em supabase/migrations/ — esses
-- números foram reocupados por outra sessão com iching_hexagrams.sql/
-- iching_readings.sql, colisão de numeração já documentada em
-- 0009_exilio_planeta.sql). Resultado: quando o projeto Supabase foi
-- trocado (banco novo), essa tabela nunca existiu no projeto novo —
-- causa do 404 em `GET .../rest/v1/simbolos_astrologicos` visto no
-- console do navegador (flash-decor.js tentando ler a decoração).
--
-- Reconstruído a partir do código real (não é inferência solta):
-- - assets/flash-decor.js: `select image_url&decor=eq.true`
-- - admin-simbolos.html: TABLE='simbolos_astrologicos', BUCKET='simbolos',
--   colunas usadas: titulo, image_url, tags (array), decor (bool),
--   created_at (order by).
--
-- Rodar no SQL Editor do projeto novo, em qualquer momento (não
-- depende de 0001-0011, é independente do resto do produto — só
-- afeta a decoração visual do site e o admin hub de símbolos).
-- ============================================================

create table if not exists public.simbolos_astrologicos (
  id uuid primary key default gen_random_uuid(),
  titulo text,
  image_url text not null,
  tags text[] not null default '{}',
  decor boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.simbolos_astrologicos is
  'Galeria de arte pra decoração do site (flash-decor.js) + admin hub (admin-simbolos.html). RLS: SELECT público, escrita só admin (auth.uid() fixo, ver policy abaixo — trocar o UUID pelo do admin de verdade antes de rodar).';

alter table public.simbolos_astrologicos enable row level security;

drop policy if exists "simbolos_astrologicos_select_public" on public.simbolos_astrologicos;
create policy "simbolos_astrologicos_select_public"
  on public.simbolos_astrologicos for select
  using (true);

-- ⚠️ AÇÃO MANUAL NECESSÁRIA antes de rodar esta linha: trocar o UUID
-- abaixo pelo auth.uid() real do admin no projeto NOVO (o UUID antigo
-- morreu junto com o projeto deletado — usuários não migram entre
-- projetos Supabase). Pegar em Authentication → Users → copiar o ID
-- da conta admin. Regra geral (claude.md seção 4): nunca usar
-- auth.role() = 'authenticated' aqui — isso libera qualquer usuário
-- cadastrado no produto principal, não só o admin (já foi bug real
-- antes, corrigido, não reintroduzir).
drop policy if exists "simbolos_astrologicos_write_admin" on public.simbolos_astrologicos;
create policy "simbolos_astrologicos_write_admin"
  on public.simbolos_astrologicos for all
  using (auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid)
  with check (auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid);


-- ------------------------------------------------------------
-- Bucket de Storage 'simbolos' — criar pelo Dashboard (Storage → New
-- bucket → nome exato "simbolos" → marcar Public), criar bucket via
-- SQL puro não é suportado de forma confiável em todo projeto. A
-- policy de RLS sobre storage.objects abaixo pode rodar por SQL depois
-- do bucket já existir.
-- ------------------------------------------------------------
drop policy if exists "simbolos_bucket_select_public" on storage.objects;
create policy "simbolos_bucket_select_public"
  on storage.objects for select
  using (bucket_id = 'simbolos');

-- ⚠️ mesmo UUID do admin usado acima, trocar aqui também.
drop policy if exists "simbolos_bucket_write_admin" on storage.objects;
create policy "simbolos_bucket_write_admin"
  on storage.objects for all
  using (bucket_id = 'simbolos' and auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid)
  with check (bucket_id = 'simbolos' and auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid);
