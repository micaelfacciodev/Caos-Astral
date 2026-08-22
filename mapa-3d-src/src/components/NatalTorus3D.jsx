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
import { Horizon } from './Horizon';

function TorusMesh({ R, r }) {
  // SEM rotação no group: THREE.TorusGeometry já usa a mesma
  // parametrização de toroidalToCartesian (x,y = anel maior em função
  // de theta/u, z = deslocamento no tubo em função de phi/v). Uma
  // rotação aqui desalinharia a malha visível (que ficaria com o
  // "furo" apontando pra outro eixo) dos pontos calculados em
  // PlanetNode/AspectArc/Horizon, que usam essas mesmas coordenadas
  // cruas sem nenhuma rotação — foi exatamente esse desalinhamento
  // que ficou visível quando o disco do horizonte (Horizon.jsx) foi
  // desenhado no plano "certo" (z=0) e pareceu perpendicular ao
  // toroide em vez de coincidir com o equador dele.
  return (
    <group>
      <mesh>
        <torusGeometry args={[R, r, 32, 96]} />
        <meshStandardMaterial
          color="#2a2a45"
          emissive="#3a3a70"
          emissiveIntensity={0.7}
          metalness={0.3}
          roughness={0.45}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* contorno da malha por cima, pra ficar claro que é um toroide
          mesmo quando o material sólido ficar escuro contra o fundo */}
      <mesh>
        <torusGeometry args={[R, r, 16, 48]} />
        <meshBasicMaterial color="#7a7ac0" wireframe transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

export function NatalTorusScene({ chart, R = TORUS_R, r = TORUS_R_TUBE }) {
  const rotationOffset = useMemo(() => {
    if (chart?.ascendente == null) return 0;
    const ascSignIdx = Math.floor(norm360(chart.ascendente) / 30);
    return ascSignIdx * 30;
  }, [chart?.ascendente]);

  // Meio do Céu real, usado pra calcular a altura acima/abaixo do
  // horizonte (ver l4l5Distortion.js). Fallback documentado: se o
  // mapa não trouxer meio_ceu (dado antigo ou ausente), aproxima por
  // ascendente+270° — só correto pra latitude ~0, mas evita quebrar
  // a cena; a camada de horizonte fica "aproximada" nesse caso, não
  // some, já que o resto do produto sempre calcula o MC de verdade.
  const meioCeu = useMemo(() => {
    if (chart?.meio_ceu != null) return chart.meio_ceu;
    if (chart?.ascendente != null) return norm360(chart.ascendente + 270);
    return null;
  }, [chart?.meio_ceu, chart?.ascendente]);

  const flowMap = useMemo(
    () => calcularFlowMap(chart?.planetas ?? [], chart?.aspectos ?? [], meioCeu),
    [chart?.planetas, chart?.aspectos, meioCeu]
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
      <Horizon R={R} r={r} />

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
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 5, 8]} intensity={0.8} />
      <directionalLight position={[-6, -4, -6]} intensity={0.3} color="#7a7ac0" />
      <NatalTorusScene chart={chart} />
      <OrbitControls enablePan={false} minDistance={4} maxDistance={20} />
    </Canvas>
  );
}
