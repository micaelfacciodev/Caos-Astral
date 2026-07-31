-- 0008_diario.sql
-- Diário (antigo "Diário de gnose", redefinido em 30/07 por decisão do
-- fundador — ver glossario-caos-astral.md e CLAUDE.md seção 8). Escopo
-- deixou de ser só "práticas de foco/estado alterado no uso da âncora" e
-- passou a cobrir qualquer experiência dentro do ecossistema (Dashboard).
--
-- Mantido o nome físico da tabela (diario_gnose) pra não quebrar
-- referências já documentadas em CLAUDE.md — só o escopo de uso mudou,
-- não a identidade técnica da tabela.
--
-- Ainda não existia como arquivo versionado no repo (só descrita em
-- CLAUDE.md), por isso "create table" do zero. As FKs abaixo assumem que
-- `daily_readings` e `intent_anchors` têm `id uuid` como chave primária —
-- `intent_anchors` foi criada agora mesmo em 0007; `daily_readings` é
-- anterior e não versionada ainda, então CONFERIR o nome real da coluna
-- de chave antes de aplicar esta migration em produção, se não bater
-- ajustar a FK ou rodar sem ela.
--
-- Rodar no SQL Editor do Supabase (sem terminal), depois de 0007.

create table if not exists public.diario_gnose (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- conteúdo livre da entrada
  titulo text,                          -- opcional, tipo "assunto" curto da entrada
  corpo text not null,                  -- o texto livre em si

  -- categorização aberta (não é mais restrita a uso da Âncora)
  tipo_experiencia text[] not null default '{}', -- tags livres: meditação, sonho, social, corporal, substância, outro etc.
  produto_relacionado text
    check (produto_relacionado in ('ancora', 'deriva', 'oraculo')), -- nullable: null = nenhum produto específico

  -- vínculos opcionais com o resto do sistema
  daily_reading_id uuid references public.daily_readings(id) on delete set null, -- Janela do dia em que a entrada foi escrita, se houver
  intent_anchor_id uuid references public.intent_anchors(id) on delete set null,  -- se a entrada nasceu do uso de uma âncora específica

  -- integração pós-experiência
  humor_pos smallint check (humor_pos between 1 and 10), -- nota livre de como a pessoa ficou depois, opcional

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.diario_gnose is
  'Diário: registro privado de qualquer experiência do usuário, não restrito a uso da Âncora (redefinido 30/07). RLS: cada usuário só acessa as próprias linhas.';

create index if not exists idx_diario_gnose_user_id on public.diario_gnose(user_id);
create index if not exists idx_diario_gnose_created_at on public.diario_gnose(user_id, created_at desc);

alter table public.diario_gnose enable row level security;

drop policy if exists "diario_gnose_owner_select" on public.diario_gnose;
create policy "diario_gnose_owner_select"
  on public.diario_gnose for select
  using (auth.uid() = user_id);

drop policy if exists "diario_gnose_owner_insert" on public.diario_gnose;
create policy "diario_gnose_owner_insert"
  on public.diario_gnose for insert
  with check (auth.uid() = user_id);

drop policy if exists "diario_gnose_owner_update" on public.diario_gnose;
create policy "diario_gnose_owner_update"
  on public.diario_gnose for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "diario_gnose_owner_delete" on public.diario_gnose;
create policy "diario_gnose_owner_delete"
  on public.diario_gnose for delete
  using (auth.uid() = user_id);

-- update permitido aqui (diferente de iching_readings/intent_anchors):
-- uma entrada de diário é o tipo de registro que a pessoa volta e edita/
-- complementa (ex: integração escrita 24-48h depois), não é log de evento
-- fechado.
