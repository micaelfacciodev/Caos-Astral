-- ============================================================
-- CAOS ASTRAL — Migration 0016 (04/08)
--
-- CAUSA: erro real em produção — "Could not find the 'leitura' column
-- of 'daily_readings' in the schema cache". Ao reconstruir o schema
-- (0001, sem ter visto o código real de compute-daily-window na época,
-- confiança marcada como BAIXA de propósito), a coluna de conteúdo da
-- leitura do dia foi nomeada `janela`. O código real (conferido agora,
-- usuário colou o .ts inteiro) usa `leitura`:
--   .insert({ user_id, data: hoje, leitura: leituraPayload })
--
-- Esta migration renomeia a coluna existente (não recria a tabela —
-- preserva user_id/data/iching_convite_aceito/created_at como estavam).
-- Segura rodar mesmo que `leitura` já exista por algum motivo (nesse
-- caso não faz nada) e mesmo que `janela` não exista mais.
-- ============================================================

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'daily_readings' and column_name = 'janela'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'daily_readings' and column_name = 'leitura'
  ) then
    alter table public.daily_readings rename column janela to leitura;
  end if;
end $$;

-- garante que a coluna existe (caso a tabela tenha sido criada de um
-- jeito diferente do esperado, ou já sem 'janela' por algum motivo)
alter table public.daily_readings add column if not exists leitura jsonb;
