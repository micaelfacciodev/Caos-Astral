-- ============================================================
-- CAOS ASTRAL — Migration 0014
-- Registra "L4" e "L5" (pontos Trojanos Terra-Lua / Nuvens de
-- Kordylewski) na tabela `planets`, mesmo padrão da 0009 (Exílio):
-- sem essa linha, qualquer lookup em `planets` por chave = 'l4'/'l5'
-- volta undefined, e o texto final mostra a chave crua no lugar do
-- rótulo.
--
-- rotulo_caos = 'L4' / 'L5' (nome técnico cru, não um termo poético
-- Caos Astral tipo "Núcleo"/"Fome") DE PROPÓSITO — cunhar um rótulo
-- de marca pra esses pontos é decisão de produto ainda não tomada,
-- ver glossario-caos-astral.md ("se um termo não está na tabela, ele
-- não existe oficialmente ainda, debater antes de codar"). Trocar
-- rotulo_caos aqui quando/se essa decisão for fechada, sem precisar
-- de nova migration (é UPDATE simples).
--
-- glifo: ◐ (L4) / ◑ (L5) — meias-luas espelhadas, escolhidas porque
-- (a) reforçam visualmente que os dois pontos são um PAR, sempre a
-- 120° um do outro, ladeando a Lua (diferente da maioria dos pontos
-- do sistema, que são solo); (b) mantêm a mesma linguagem gráfica dos
-- glifos astrológicos existentes (círculos/crescentes), sem introduzir
-- um sistema de ícone novo que mais nada no site usa — todo glifo
-- hoje (☉☽☿♀♂♃♄♅♆♇⚷⚸) é caractere Unicode simples impresso como texto,
-- tanto no widget quanto no SVG do mapa (kit.html), não um asset
-- separado. Se um dia quiserem um símbolo mais autoral, é uma
-- discussão de identidade visual separada, não bloqueia esta migration.
--
-- nunca_retrograda = true: L4/L5 não têm movimento próprio pra
-- "atrasar" em relação a si mesmos, eles só seguem a Lua a 60° fixos
-- — o conceito de retrogradação não se aplica (ver l4l5.ts).
--
-- ordem 13/14, na sequência direta depois de Quíron(11)/Exílio(12).
--
-- Deploy: com a integração GitHub↔Supabase ativa pra migrations,
-- commitar este arquivo em supabase/migrations/ na branch main aplica
-- sozinho. Se essa integração não estiver ativa, rodar manualmente no
-- SQL Editor, depois de 0013.
-- ============================================================

insert into public.planets (chave, nome_astro, rotulo_caos, glifo, nunca_retrograda, ordem, temperamento)
values
  ('l4', 'L4 (Trojano Terra-Lua, adiantado)', 'L4', '◐', true, 13, 'neutro'),
  ('l5', 'L5 (Trojano Terra-Lua, atrasado)', 'L5', '◑', true, 14, 'neutro')
on conflict (chave) do nothing;
