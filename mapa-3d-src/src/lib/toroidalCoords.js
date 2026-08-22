/**
 * toroidalCoords.js — Caos Astral 3D
 *
 * Conversão do motor de roda 2D (ver wheelXY em kit.html) para o
 * sistema toroidal (R, r, theta, phi) da simulação 3D.
 *
 * theta = longitude astrológica, mesma convenção do motor 2D:
 *   screenLon = norm360(lonDeg - rotationOffset)
 *   phi_wheel = (180 - screenLon) em graus
 * ou seja, ASC sempre no ponto "9h" da roda, sentido anti-horário.
 * Preservamos essa convenção para que a posição angular no toroide
 * bata com a posição angular na roda 2D — só adicionamos a dimensão
 * phi (o "tubo" do donut) que a roda 2D não tinha.
 *
 * phi = circuito vertical do tubo. flow ∈ [-1, 1] descreve pra onde
 * o filamento de um ponto está fluindo:
 *   flow = -1 → totalmente pra dentro (núcleo, vórtice de Saklas/L5)
 *   flow =  0 → equador do tubo (neutro, mesmo raio da roda 2D)
 *   flow = +1 → totalmente pra fora (carcaça externa, vórtice de Sofia/L4)
 */

export const TORUS_R = 4; // raio maior: centro do toroide até centro do tubo
export const TORUS_R_TUBE = 1.3; // raio menor: raio do próprio tubo

export function norm360(x) {
  x = x % 360;
  if (x < 0) x += 360;
  return x;
}

/** Longitude eclíptica (0–360°) → theta em radianos. Mesma convenção do wheelXY 2D. */
export function longitudeToTheta(lonDeg, rotationOffsetDeg = 0) {
  const screenLon = norm360(lonDeg - rotationOffsetDeg);
  return ((180 - screenLon) * Math.PI) / 180;
}

/** flow [-1,1] → phi em radianos, entre -90° (núcleo/Saklas) e +90° (carcaça/Sofia). */
export function flowToPhi(flow) {
  const clamped = Math.max(-1, Math.min(1, flow));
  return (clamped * Math.PI) / 2;
}

/**
 * Equações paramétricas padrão do toroide, exatamente como na
 * especificação:
 *   X = (R + r·cos φ)·cos θ
 *   Y = (R + r·cos φ)·sin θ
 *   Z = r·sin φ
 */
export function toroidalToCartesian(theta, phi, R = TORUS_R, r = TORUS_R_TUBE) {
  const x = (R + r * Math.cos(phi)) * Math.cos(theta);
  const y = (R + r * Math.cos(phi)) * Math.sin(theta);
  const z = r * Math.sin(phi);
  return { x, y, z };
}

/**
 * Função principal de injeção: recebe um ponto no MESMO shape que
 * chart.planetas já usa em kit.html — { chave, longitude, retrogrado }
 * — e devolve a posição 3D no toroide, junto com theta/phi (úteis
 * pra depois traçar os arcos de aspecto sobre a superfície).
 *
 * `flow` normalmente vem de calcularFlow() (ver l4l5Distortion.js):
 * planetas em aspecto com Sofia (L4) puxam pra fora, com Saklas (L5)
 * puxam pra dentro; sem aspecto com nenhum dos dois, fica no equador.
 */
export function planetaParaToroide(
  planeta,
  { rotationOffset = 0, R = TORUS_R, r = TORUS_R_TUBE, flow = 0 } = {}
) {
  const theta = longitudeToTheta(planeta.longitude, rotationOffset);
  const phi = flowToPhi(flow);
  const pos = toroidalToCartesian(theta, phi, R, r);
  return { ...pos, theta, phi, chave: planeta.chave, retrogrado: !!planeta.retrogrado };
}

/**
 * Anel do horizonte — o equador externo do tubo (phi = 0) dando a
 * volta completa em theta. Não é o anel-guia abstrato do toroide
 * (esse fica no raio R, sem nunca tocar a superfície) — é o círculo
 * de raio R+r, z=0, que É a linha onde a superfície do donut cruza o
 * plano do horizonte em qualquer ponto do zodíaco. Representa a
 * pessoa em pé no centro, com o horizonte se estendendo 360° ao redor
 * dela — dia acima (phi>0, rumo a Sofia/L4), noite abaixo (phi<0,
 * rumo a Saklas/L5).
 */
export function anelHorizonte({ R = TORUS_R, r = TORUS_R_TUBE, segments = 128 } = {}) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    pts.push(toroidalToCartesian(theta, 0, R, r));
  }
  return pts;
}

/**
 * Amostra pontos ao longo da SUPERFÍCIE do toroide entre dois theta
 * (caminho angular mais curto), interpolando phi entre os dois
 * extremos e adicionando uma leve "bolha" de phi no meio do trajeto
 * pra o filamento visivelmente abraçar a pele do toroide em vez de
 * cortar por dentro do tubo. Usado pelas correntes de Birkeland
 * (quadraturas/trígonos/sextis) — não usado pra oposição, que
 * atravessa o buraco central em linha reta.
 */
export function arcoNaSuperficie(thetaA, thetaB, phiA, phiB, { R = TORUS_R, r = TORUS_R_TUBE, segments = 48, bulge = 0.35 } = {}) {
  let delta = thetaB - thetaA;
  delta = Math.atan2(Math.sin(delta), Math.cos(delta)); // menor caminho angular, com wrap em ±π
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const theta = thetaA + delta * t;
    const phiBase = phiA + (phiB - phiA) * t;
    const phi = phiBase + Math.sin(t * Math.PI) * bulge;
    pts.push(toroidalToCartesian(theta, phi, R, r * 1.02));
  }
  return pts;
}
