/**
 * l4l5Distortion.js — Caos Astral 3D
 *
 * SOFIA (L4): fonte de luz inversa/branca. Filamentos conectados a
 * ela ficam mais finos, aceleram, espiralam pra cima e pra fora
 * (escape do código-fonte). Puxa o phi de quem está em aspecto com
 * ela em direção à carcaça externa do toroide (flow positivo).
 *
 * SAKLAS (L5): vórtice de sucção. Filamentos conectados a ele sofrem
 * torção helicoidal pra baixo, desaceleram, ficam mais densos/opacos
 * antes de sumir no buraco do donut. Puxa o phi de quem está em
 * aspecto com ele em direção ao núcleo (flow negativo).
 *
 * Espera os mesmos shapes já usados no motor 2D (kit.html):
 *   aspectos: [{ planeta_a, planeta_b, aspecto }]
 *   chaves de planeta em BODIES/PLANET_GLYPHS: sun, moon, mercury,
 *   venus, mars, jupiter, saturn, uranus, neptune, pluto, chiron,
 *   exilio, l4, l5.
 *
 * --- Camada de horizonte (nova) ---
 * `flow` deixou de vir só do puxão de aspecto — agora é a COMBINAÇÃO
 * de dois efeitos:
 *
 *   1) altura real acima/abaixo do horizonte de nascimento. Não é
 *      aproximação forçada: ASC e DESC são, por definição, os pontos
 *      onde a eclíptica cruza o horizonte local no instante exato do
 *      nascimento (mesmo cálculo real de GMST+obliquidade+latitude
 *      que já gera `chart.ascendente`/`chart.meio_ceu`, seção 5 do
 *      claude.md). Meio do Céu = zênite (mais "de dia" possível),
 *      Fundo do Céu = nadir (mais "de noite" possível), ASC/DESC =
 *      a própria linha do horizonte. Isso vira um cosseno contínuo
 *      em função da longitude do planeta relativo ao Meio do Céu.
 *   2) o puxão simbólico de aspecto exato com L4/L5, como já existia.
 *
 * A pessoa em pé no centro do toroide (ver Horizon.jsx) vê seu próprio
 * céu de nascimento: metade acima da linha do horizonte (dia, puxando
 * pra Sofia), metade abaixo (noite, puxando pra Saklas) — e o
 * mecanismo do acaso (aspecto exato com os pontos L4/L5) modula essa
 * posição base, não a substitui.
 */

const PUXAO_SOFIA = 0.6; // por aspecto com l4 (fora)
const PUXAO_SAKLAS = -0.6; // por aspecto com l5 (dentro)

const PESO_HORIZONTE = 0.7; // peso da posição real acima/abaixo do horizonte
const PESO_ASPECTO = 0.45; // peso do puxão simbólico de aspecto exato com L4/L5

/**
 * Altura acima/abaixo do horizonte para uma longitude eclíptica,
 * relativa ao Meio do Céu (zênite). +1 = exatamente no MC (zênite),
 * 0 = exatamente em ASC ou DESC (linha do horizonte), -1 = exatamente
 * no Fundo do Céu (nadir). Contínuo entre os quatro pontos.
 */
export function alturaHorizonte(lonDeg, meioCeuDeg) {
  const diffRad = ((lonDeg - meioCeuDeg) * Math.PI) / 180;
  return Math.cos(diffRad);
}

/**
 * flow ∈ [-1, 1] para um planeta específico: combina a altura real
 * acima/abaixo do horizonte de nascimento com o puxão de todos os
 * aspectos dele com l4/l5 (mais de um aspecto acumula, depois o
 * resultado combinado é limitado ao intervalo).
 *
 * `longitude`/`meioCeu` em graus. Se `meioCeu` não vier (mapas
 * antigos sem o dado), a camada de horizonte simplesmente não
 * contribui (horizonte = 0) e o flow fica só no puxão de aspecto,
 * como no comportamento original.
 */
export function calcularFlow(planetaChave, aspectos = [], { longitude, meioCeu } = {}) {
  if (planetaChave === 'l4') return 1; // Sofia sempre no polo/zênite simbólico
  if (planetaChave === 'l5') return -1; // Saklas sempre no polo/nadir simbólico

  const horizonte = longitude != null && meioCeu != null ? alturaHorizonte(longitude, meioCeu) : 0;

  let aspectPull = 0;
  aspectos.forEach((asp) => {
    const outro =
      asp.planeta_a === planetaChave ? asp.planeta_b : asp.planeta_b === planetaChave ? asp.planeta_a : null;
    if (outro === 'l4') aspectPull += PUXAO_SOFIA;
    if (outro === 'l5') aspectPull += PUXAO_SAKLAS;
  });

  const combinado = horizonte * PESO_HORIZONTE + aspectPull * PESO_ASPECTO;
  return Math.max(-1, Math.min(1, combinado));
}

/** Mapa chave → flow para todos os planetas de uma vez (conveniência pra useMemo). */
export function calcularFlowMap(planetas = [], aspectos = [], meioCeu) {
  const mapa = new Map();
  planetas.forEach((p) =>
    mapa.set(p.chave, calcularFlow(p.chave, aspectos, { longitude: p.longitude, meioCeu }))
  );
  return mapa;
}
