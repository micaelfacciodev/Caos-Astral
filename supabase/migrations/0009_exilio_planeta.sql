-- ============================================================
-- CAOS ASTRAL — Migration 0009
-- Registra "Exílio" (Lilith Negra verdadeira / true Black Moon Lilith)
-- na tabela `planets`, pra que compute-daily-window e compute-synastry
-- consigam resolver rotulo_caos/temperamento por chave, do mesmo jeito
-- que já fazem pra sol/lua/planetas/quíron.
--
-- Sem essa linha, qualquer lookup em `planets` por chave = 'exilio'
-- volta undefined, e o texto final ("destaque do dia", rótulo de
-- aspecto etc.) mostra a chave crua ou "undefined" no lugar do rótulo.
--
-- RENOMEADA de 0007 pra 0009 (30/07): 0007/0008 já estavam ocupados
-- por intent_anchors.sql e diario.sql, criados em outra sessão no
-- mesmo dia — colisão de numeração evitada.
--
-- Deploy: com a integração GitHub↔Supabase ativa pra migrations, basta
-- commitar este arquivo em `supabase/migrations/` na branch `main` —
-- aplica sozinho. Se essa integração não estiver ativa por algum
-- motivo, rodar manualmente no SQL Editor, depois de 0008.
-- ============================================================

insert into public.planets (chave, nome_astro, rotulo_caos, glifo, nunca_retrograda, ordem, temperamento)
values ('exilio', 'Lilith Negra (verdadeira/oscilante)', 'Exílio', '⚸', false, 12, 'neutro')
on conflict (chave) do nothing;
