/**
 * Horizon.jsx — Caos Astral 3D
 *
 * A pessoa está em pé no centro do toroide, no instante do
 * nascimento. Dois elementos compõem essa metáfora:
 *
 *   1) o anel do horizonte propriamente dito — a linha exata (phi=0)
 *      onde a casca do donut cruza o plano z=0, dando a volta inteira
 *      pelo zodíaco. É onde ASC e DESC "moram" (altura = 0).
 *   2) um chão sutil (disco), maior que o próprio toroide, deixando
 *      claro que o plano z=0 não é só uma linha decorativa — é o
 *      horizonte real se estendendo ao redor de quem está no centro,
 *      dividindo visualmente dia (z>0, rumo a Sofia/L4) de noite
 *      (z<0, rumo a Saklas/L5). x/y é o plano do zodíaco (mesmo plano
 *      do anel guia do toroide), z é o eixo vertical Sofia↔Saklas.
 */
import { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { anelHorizonte, TORUS_R, TORUS_R_TUBE } from '../lib/toroidalCoords';

export function Horizon({ R = TORUS_R, r = TORUS_R_TUBE }) {
  const pontosAnel = useMemo(
    () => anelHorizonte({ R, r }).map((p) => new THREE.Vector3(p.x, p.y, p.z)),
    [R, r]
  );

  const raioChao = R + r + 2.5;

  return (
    <group>
      {/* anel do horizonte — a costura exata entre dia e noite na casca do toroide */}
      <Line points={pontosAnel} color="#f2e9da" lineWidth={1.6} transparent opacity={0.55} />

      {/* chão do horizonte — disco no plano z=0 (mesmo plano do anel guia do
          toroide), pessoa em pé no centro (0,0,0) */}
      <mesh>
        <circleGeometry args={[raioChao, 96]} />
        <meshBasicMaterial color="#f2e9da" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* algumas linhas radiais sutis, só pra dar noção de escala/direção no chão */}
      {[0, 45, 90, 135].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const p1 = new THREE.Vector3(Math.cos(rad) * raioChao, Math.sin(rad) * raioChao, 0);
        const p2 = new THREE.Vector3(-p1.x, -p1.y, 0);
        return <Line key={deg} points={[p1, p2]} color="#f2e9da" lineWidth={0.6} transparent opacity={0.12} />;
      })}

      {/* marcador da pessoa, no centro exato */}
      <mesh>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#f2e9da" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}
