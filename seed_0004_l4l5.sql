-- ============================================================
-- CAOS ASTRAL — Seed: enciclopedia_simbolos (lote L4/L5)
--
-- FONTE: lote_l4l5_enciclopedia.json, já versionado neste repo
-- (conteúdo real, não inventado) — versão "v1", tier "pago"
-- (conteúdo especulativo/denso, ajustar se decidirem tornar gratis).
--
-- Rodar depois de 0013_enciclopedia_simbolos.sql, pode rodar em
-- qualquer ordem em relação a seed_0003 (slug diferente, sem conflito).
-- ============================================================

insert into public.enciclopedia_simbolos
  (nome, slug, categoria, tier, nomes_alternativos, tradicoes, origem, primeiros_registros, significado, uso_historico, uso_moderno, correspondencias, bibliografia, svg_path)
values
  (
    'Pontos L4 e L5 (Nuvens de Kordylewski)',
    'pontos-l4-l5',
    'astrologia',
    'pago',
    '{"Pontos Trojanos Terra-Lua","Nuvens de Kordylewski","Guardiões da Lua"}',
    '{"astrologia"}',
    'Não são um símbolo herdado de tradição antiga. São um resultado da mecânica celeste newtoniana: Joseph-Louis Lagrange descreveu matematicamente a existência de L4 e L5 em 1772, dois pontos de equilíbrio gravitacional estável que formam um triângulo equilátero com os dois corpos principais de qualquer sistema orbital. Nenhuma civilização pré-moderna tinha ferramenta matemática para chegar a esse resultado; não há registro de atenção ritual ou astrológica a esses pontos antes do século XX.',
    'O astrônomo polonês Kazimierz Kordylewski observou a olho nu, em 1956/1961, concentrações difusas de poeira cósmica presas nos pontos L4 e L5 do sistema Terra-Lua, hoje chamadas Nuvens de Kordylewski. A existência delas permaneceu contestada por décadas e só foi confirmada com mais robustez em estudos de 2018 (luz polarizada). Em 2022, o autor Robert Temple, em ''A New Science of Heaven'', junto ao astrofísico Chandra Wickramasinghe, propôs que essas nuvens de plasma poderiam abrigar uma forma de inteligência não-biológica, e especulou que ela poderia se manifestar historicamente como anjos, deuses e outras entidades divinas.',
    'Fisicamente, L4 e L5 ficam a 60° de distância angular da Lua na própria órbita lunar, um adiantado (L4) e outro atrasado (L5), sustentados em equilíbrio pela gravidade combinada de Terra e Lua. Não são corpos, são posições, o que os aproxima, por categoria, de outros pontos vazios já usados em astrologia (Nodos Lunares, Parte da Fortuna, Exílio) mais do que de um planeta. No Caos Astral, essa é justamente a leitura adotada: não afirmamos a hipótese de consciência plasmática do Temple como fato, tratamos como mitologia contemporânea, mas usamos a mecânica desses pontos, um par sempre a 120° de distância um do outro, ladeando a Lua, como eixo simbólico de indexação, o que sobe da experiência vivida e o que pode ser acessado de volta por concentração.',
    'Inexistente antes de Kordylewski (1961). Não há uso histórico anterior a citar; qualquer verbete ou site que apresente L4/L5 como sabedoria ancestral recuperada está incorreto factualmente. O paralelo estrutural mais próximo, sem ser ancestral, são os Navagrahas védicos Rahu e Ketu, os nodos lunares: também pontos matemáticos vazios (interseção de órbita, não equilíbrio gravitacional), também tratados como par carregado de peso mítico apesar de não serem corpos físicos.',
    'Adotado pelo Caos Astral como ponto autoral, não como recuperação de sistema perdido. Proposta de uso: calcular a posição de L4 e L5 no mapa natal a partir da Lua natal, herdando o signo e o território (casa) lunar da pessoa. Como prática, a orientação, saber exatamente onde no céu aquele ponto está agora, funciona pela mesma mecânica ritualística de qualquer orientação sagrada (rezar virado para um ponto fixo, altares alinhados a eventos celestes): ancora a atenção, não é alegado como canal literal de transmissão de informação. O widget ''Céu agora'' é o lugar natural para essa camada contemplativa.',
    '{"corpo_de_referencia": "calculado a partir da longitude eclíptica geocêntrica da Lua (±60°), não possui elementos orbitais próprios", "par": "sempre dois pontos, nunca um só, a diferença estrutural em relação à maioria dos pontos hipotéticos usados em astrologia", "conceito_chave": "memória como reconstrução, não arquivo fixo, alinhado ao manifesto do Caos Astral"}'::jsonb,
    '{"Joseph-Louis Lagrange, Essai sur le problème des trois corps (1772)","Robert Temple e Chandra Wickramasinghe, A New Science of Heaven (2022)","J. Slíz-Balogh, A. Barta, G. Horváth, Celestial Mechanics and Polarization Optics of the Kordylewski Dust Cloud (2019)"}',
    null
  )
on conflict (slug) do update set
  nome = excluded.nome,
  categoria = excluded.categoria,
  tier = excluded.tier,
  nomes_alternativos = excluded.nomes_alternativos,
  tradicoes = excluded.tradicoes,
  origem = excluded.origem,
  primeiros_registros = excluded.primeiros_registros,
  significado = excluded.significado,
  uso_historico = excluded.uso_historico,
  uso_moderno = excluded.uso_moderno,
  correspondencias = excluded.correspondencias,
  bibliografia = excluded.bibliografia,
  svg_path = excluded.svg_path;
