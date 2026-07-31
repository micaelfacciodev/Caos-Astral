-- 0007_intent_anchors.sql
-- Âncora de Intenção (antiga sigil_journal, separada em duas — ver CLAUDE.md
-- seção 8). O gerador de selo já existe no front (ancora.html), mas ainda
-- não persiste nada — esta migration cria a tabela que falta pra isso.
--
-- Ainda não existia como arquivo versionado no repo (só descrita em
-- CLAUDE.md), por isso "create table" do zero em vez de "alter". Se a
-- tabela já existir em produção com outro shape (feita direto no painel
-- antes da integração GitHub), revisar contra este arquivo antes de aplicar.
--
-- Rodar no SQL Editor do Supabase (sem terminal), depois de 0006.

create table if not exists public.intent_anchors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  intencao text not null,              -- a decisão já tomada que o selo fixa
  selo_svg text,                       -- markup do selo gerado (ou referência de imagem/asset)
  kit_snapshot jsonb,                  -- pontos do kit usados na geração, se relevante (opcional)
  created_at timestamptz not null default now()
);

comment on table public.intent_anchors is
  'Âncora de intenção: selo que fixa uma decisão já tomada, plugado nos dados do kit. RLS: cada usuário só acessa as próprias linhas. Sem invocar nada externo.';

create index if not exists idx_intent_anchors_user_id on public.intent_anchors(user_id);

alter table public.intent_anchors enable row level security;

drop policy if exists "intent_anchors_owner_select" on public.intent_anchors;
create policy "intent_anchors_owner_select"
  on public.intent_anchors for select
  using (auth.uid() = user_id);

drop policy if exists "intent_anchors_owner_insert" on public.intent_anchors;
create policy "intent_anchors_owner_insert"
  on public.intent_anchors for insert
  with check (auth.uid() = user_id);

drop policy if exists "intent_anchors_owner_delete" on public.intent_anchors;
create policy "intent_anchors_owner_delete"
  on public.intent_anchors for delete
  using (auth.uid() = user_id);

-- sem policy de update: uma âncora já fixada não deve ser editada, só
-- criada ou apagada (mesma lógica aplicada a iching_readings, 0006).
