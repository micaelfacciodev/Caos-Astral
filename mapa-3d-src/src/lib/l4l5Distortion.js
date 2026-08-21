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
 */

const PUXAO_SOFIA = 0.6; // por aspecto com l4 (fora)
const PUXAO_SAKLAS = -0.6; // por aspecto com l5 (dentro)

/**
 * flow ∈ [-1, 1] para um planeta específico, somando o puxão de
 * todos os aspectos dele com l4/l5 (mais de um aspecto acumula,
 * depois é limitado ao intervalo).
 */
export function calcularFlow(planetaChave, aspectos = []) {
  if (planetaChave === 'l4') return 1; // Sofia sempre na borda externa
  if (planetaChave === 'l5') return -1; // Saklas sempre no núcleo

  let flow = 0;
  aspectos.forEach((asp) => {
    const outro =
      asp.planeta_a === planetaChave ? asp.planeta_b : asp.planeta_b === planetaChave ? asp.planeta_a : null;
    if (outro === 'l4') flow += PUXAO_SOFIA;
    if (outro === 'l5') flow += PUXAO_SAKLAS;
  });
  return Math.max(-1, Math.min(1, flow));
}

/** Mapa chave → flow para todos os planetas de uma vez (conveniência pra useMemo). */
export function calcularFlowMap(planetas = [], aspectos = []) {
  const mapa = new Map();
  planetas.forEach((p) => mapa.set(p.chave, calcularFlow(p.chave, aspectos)));
  return mapa;
}
