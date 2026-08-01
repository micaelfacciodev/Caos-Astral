-- ============================================================
-- CAOS ASTRAL — Seed: planets, aspects, houses
-- RECONSTRUÍDO em 01/08 pelo agente de front (troca de projeto Supabase).
--
-- Rodar depois de 0001_schema.sql.
-- ============================================================

-- ------------------------------------------------------------
-- PLANETS — confiança ALTA.
-- chave/nunca_retrograda/ordem: direto do array BODIES em
-- compute-natal-chart/index.ts (código real, não inferência).
-- rotulo_caos: só Sol→Núcleo e Lua→Fome têm renome de marca
-- confirmado no glossário oficial (claude.md seção 1). Quíron→Cicatriz
-- e exilio→Exílio também confirmados (glossário + migration 0009, que
-- já insere a linha de exilio separadamente — não repetida aqui).
-- Mercúrio a Plutão NÃO aparecem no glossário como renomeados, então
-- rotulo_caos = nome comum mesmo (nenhuma tradução de marca pra eles).
-- temperamento: direto da regra descrita em claude.md seção 5
-- (algoritmo provisório de conjunção) — Vênus/Júpiter = benéfico,
-- Marte/Saturno = maléfico, resto = neutro (mesmo padrão do exilio,
-- que já está marcado 'neutro' na 0009).
-- ------------------------------------------------------------
insert into public.planets (chave, nome_astro, rotulo_caos, glifo, nunca_retrograda, ordem, temperamento) values
  ('sun',     'Sol',      'Núcleo',   '☉', true,  1,  'neutro'),
  ('moon',    'Lua',      'Fome',     '☽', true,  2,  'neutro'),
  ('mercury', 'Mercúrio', 'Mercúrio', '☿', false, 3,  'neutro'),
  ('venus',   'Vênus',    'Vênus',    '♀', false, 4,  'benefico'),
  ('mars',    'Marte',    'Marte',    '♂', false, 5,  'malefico'),
  ('jupiter', 'Júpiter',  'Júpiter',  '♃', false, 6,  'benefico'),
  ('saturn',  'Saturno',  'Saturno',  '♄', false, 7,  'malefico'),
  ('uranus',  'Urano',    'Urano',    '♅', false, 8,  'neutro'),
  ('neptune', 'Netuno',   'Netuno',   '♆', false, 9,  'neutro'),
  ('pluto',   'Plutão',   'Plutão',   '♇', false, 10, 'neutro'),
  ('chiron',  'Quíron',   'Cicatriz', '⚷', false, 11, 'neutro')
on conflict (chave) do update set
  nome_astro = excluded.nome_astro,
  rotulo_caos = excluded.rotulo_caos,
  glifo = excluded.glifo,
  nunca_retrograda = excluded.nunca_retrograda,
  ordem = excluded.ordem,
  temperamento = excluded.temperamento;

-- 'exilio' entra pela migration 0009_exilio_planeta.sql, que já existe
-- neste repo e roda depois desta — não duplicar aqui.


-- ------------------------------------------------------------
-- ASPECTS — confiança ALTA. Ângulo/orbe direto do array ASPECTS em
-- compute-natal-chart/index.ts. rotulo_caos: fricção = quadratura/
-- oposição, corrente = trígono/sextil, null = conjunção (glossário,
-- "sem termo fixo" — algoritmo provisório decide o tom caso a caso,
-- não um rótulo fixo aqui).
-- ------------------------------------------------------------
insert into public.aspects (chave, angulo, orbe, rotulo_caos, classe_cor) values
  ('conjunction', 0,   8, null,       'neutro'),
  ('sextile',     60,  5, 'corrente', 'corrente'),
  ('square',      90,  7, 'fricção',  'friccao'),
  ('trine',       120, 7, 'corrente', 'corrente'),
  ('opposition',  180, 8, 'fricção',  'friccao')
on conflict (chave) do update set
  angulo = excluded.angulo,
  orbe = excluded.orbe,
  rotulo_caos = excluded.rotulo_caos,
  classe_cor = excluded.classe_cor;


-- ------------------------------------------------------------
-- HOUSES — confiança BAIXA no rotulo_caos (fica NULL de propósito).
-- `tema` abaixo é conhecimento astrológico tradicional/genérico (não é
-- conteúdo de marca, não precisa ser "recuperado" — é de domínio
-- público, qualquer livro de astrologia tem algo equivalente), só pra
-- não deixar a tabela vazia. `rotulo_caos` — o texto de marca real
-- (ex: territórios com nome próprio Caos Astral) eu NÃO tenho; o
-- glossário só confirma "casa → território" no conceito geral e cita
-- "território de ofício" (casas 6/10) como PENDENTE, sem definir as
-- outras 11. Preencher rotulo_caos é trabalho de conteúdo, não de
-- schema — fica como está até alguém (usuário/agente da máquina)
-- fornecer o texto real.
-- ------------------------------------------------------------
insert into public.houses (numero, tema, rotulo_caos) values
  (1,  'identidade, corpo, aparência, iniciativa', null),
  (2,  'recursos, valores, posses, autoestima material', null),
  (3,  'comunicação, aprendizado próximo, irmãos, deslocamentos curtos', null),
  (4,  'raízes, família, lar, fundação emocional', null),
  (5,  'criação, prazer, romance, autoexpressão, filhos', null),
  (6,  'trabalho cotidiano, rotina, saúde, serviço', null),
  (7,  'parcerias, casamento, contratos, o outro', null),
  (8,  'transformação, recursos compartilhados, crise, sexualidade', null),
  (9,  'expansão, crenças, filosofia, viagens longas, ensino superior', null),
  (10, 'vocação, status público, autoridade, carreira', null),
  (11, 'comunidade, amizades, projetos coletivos, futuro', null),
  (12, 'dissolução, inconsciente, isolamento, o que fica oculto', null)
on conflict (numero) do update set
  tema = excluded.tema;
