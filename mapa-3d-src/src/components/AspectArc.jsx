/**
 * AspectArc.jsx — Caos Astral 3D
 *
 * Renderiza um aspecto entre dois pontos já convertidos pro toroide
 * (ver toroidalCoords.js). Cada tipo de aspecto vira uma linguagem
 * visual diferente, conforme a especificação:
 *
 *   conjuncao (0°)   → nó de sobrecarga: ponto de partículas hiper-brilhante
 *   oposicao (180°)  → corrente de polarização dupla: raio reto atravessando
 *                       o buraco central vazio do toroide
 *   quadratura (90°) → corrente de Birkeland friccional: arco vermelho/laranja
 *                       estalando sobre a pele do toroide
 *   trigono (120°)   → corrente de Birkeland harmônica: fluxo azul/ciano contínuo
 *   sextil (60°)     → variante mais fina do trígono
 *
 * IMPORTANTE sobre nomenclatura: o motor 2D real (kit.html,
 * ASPECT_STYLE) usa chaves em inglês — square, opposition, trine,
 * sextile, conjunction — não os nomes em PT acentuados. Este
 * componente usa as chaves reais do backend pra não quebrar a
 * integração com chart.aspectos.
 */
import { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { arcoNaSuperficie, TORUS_R, TORUS_R_TUBE } from '../lib/toroidalCoords';

export const ASPECT_VISUAL = {
  conjunction: { kind: 'burst', color: '#eaeaea' },
  opposition: { kind: 'axis', color: '#c14a3c', width: 2.4 },
  square: { kind: 'birkeland', color: '#ff6a2c', width: 2.2, opacity: 0.9, jitter: true },
  trine: { kind: 'birkeland', color: '#33d6c9', width: 1.8, opacity: 0.7, jitter: false },
  sextile: { kind: 'birkeland', color: '#33d6c9', width: 1, opacity: 0.55, jitter: false },
};

/**
 * a, b: pontos já vindos de planetaParaToroide() — precisam de
 * {x,y,z,theta,phi}.
 */
export function AspectArc({ aspectKey, a, b, R = TORUS_R, r = TORUS_R_TUBE }) {
  const visual = ASPECT_VISUAL[aspectKey];

  const geometria = useMemo(() => {
    if (!visual || !a || !b) return null;

    if (visual.kind === 'axis') {
      // Oposição: corda reta pelo espaço vazio (o "eixo da espinha
      // dorsal do avatar"), não pela superfície do tubo.
      const curva = new THREE.CatmullRomCurve3([
        new THREE.Vector3(a.x, a.y, a.z),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(b.x, b.y, b.z),
      ]);
      return { pontos: curva.getPoints(32) };
    }

    if (visual.kind === 'birkeland') {
      const brutos = arcoNaSuperficie(a.theta, b.theta, a.phi, b.phi, { R, r });
      const vetores = brutos.map((p) => new THREE.Vector3(p.x, p.y, p.z));
      const curva = new THREE.CatmullRomCurve3(vetores, false, 'catmullrom', 0.5);
      return { pontos: curva.getPoints(80) };
    }

    return null;
  }, [aspectKey, a, b, R, r, visual]);

  if (!visual || !a || !b) return null;

  if (visual.kind === 'burst') {
    // Conjunção: fusão de dados, não é uma linha, é um nó de
    // sobrecarga de partículas no ponto médio entre os dois corpos.
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;
    const midZ = (a.z + b.z) / 2;
    return (
      <mesh position={[midX, midY, midZ]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={visual.color}
          emissive={visual.color}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
    );
  }

  if (!geometria) return null;

  return (
    <Line
      points={geometria.pontos}
      color={visual.color}
      lineWidth={visual.width}
      transparent
      opacity={visual.opacity ?? 0.7}
    />
  );
}
