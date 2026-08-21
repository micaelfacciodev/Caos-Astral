/**
 * NatalTorus3D.jsx — Caos Astral 3D
 *
 * Ponto de entrada da cena. Recebe o MESMO objeto `chart` que
 * buildWheelSVG(chart) já recebe em kit.html:
 *   chart.planetas   = [{ chave, longitude, retrogrado }, ...]
 *   chart.aspectos   = [{ planeta_a, planeta_b, aspecto }, ...]
 *   chart.ascendente = longitude do ASC (define a rotação da roda)
 *   chart.meio_ceu   = longitude do MC (opcional)
 *
 * Ou seja: nenhuma mudança é necessária no backend/compute-natal-chart
 * pra alimentar essa cena, é só passar o mesmo `chart` que já
 * alimenta o SVG 2D.
 */
import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  TORUS_R,
  TORUS_R_TUBE,
  norm360,
  planetaParaToroide,
} from '../lib/toroidalCoords';
import { calcularFlowMap } from '../lib/l4l5Distortion';
import { AspectArc } from './AspectArc';
import { PlanetNode } from './PlanetNode';

function TorusMesh({ R, r }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[R, r, 32, 96]} />
      <meshStandardMaterial
        color="#0a0a12"
        emissive="#141428"
        emissiveIntensity={0.5}
        metalness={0.4}
        roughness={0.35}
        wireframe={false}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

export function NatalTorusScene({ chart, R = TORUS_R, r = TORUS_R_TUBE }) {
  const rotationOffset = useMemo(() => {
    if (chart?.ascendente == null) return 0;
    const ascSignIdx = Math.floor(norm360(chart.ascendente) / 30);
    return ascSignIdx * 30;
  }, [chart?.ascendente]);

  const flowMap = useMemo(
    () => calcularFlowMap(chart?.planetas ?? [], chart?.aspectos ?? []),
    [chart?.planetas, chart?.aspectos]
  );

  // pontos convertidos, indexados por chave — usado tanto pros
  // marcadores quanto pra ancorar os arcos de aspecto
  const pontosPorChave = useMemo(() => {
    const mapa = new Map();
    (chart?.planetas ?? []).forEach((p) => {
      const flow = flowMap.get(p.chave) ?? 0;
      mapa.set(p.chave, planetaParaToroide(p, { rotationOffset, R, r, flow }));
    });
    return mapa;
  }, [chart?.planetas, flowMap, rotationOffset, R, r]);

  return (
    <group>
      <TorusMesh R={R} r={r} />

      {[...pontosPorChave.values()].map((ponto) => (
        <PlanetNode key={ponto.chave} ponto={ponto} />
      ))}

      {(chart?.aspectos ?? []).map((asp, i) => {
        const a = pontosPorChave.get(asp.planeta_a);
        const b = pontosPorChave.get(asp.planeta_b);
        if (!a || !b) return null;
        return <AspectArc key={`${asp.planeta_a}-${asp.planeta_b}-${i}`} aspectKey={asp.aspecto} a={a} b={b} R={R} r={r} />;
      })}
    </group>
  );
}

export default function NatalTorus3D({ chart }) {
  return (
    <Canvas camera={{ position: [0, -9, 6], fov: 45 }} style={{ width: '100%', height: '100%', background: '#000' }}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 8]} intensity={0.6} />
      <NatalTorusScene chart={chart} />
      <OrbitControls enablePan={false} minDistance={4} maxDistance={20} />
    </Canvas>
  );
}
