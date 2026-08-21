/**
 * PlanetNode.jsx — Caos Astral 3D
 *
 * Marcador de um ponto (planeta, Quíron, Exílio, Sofia/L4, Saklas/L5)
 * já convertido pro toroide. Sofia e Saklas ganham tratamento visual
 * próprio, conforme a especificação:
 *
 *   SOFIA (L4): fonte de luz inversa/branca — halo maior, mais claro
 *   SAKLAS (L5): micro-buraco negro/vórtice de sucção — núcleo escuro
 *                com uma borda fina residual de luz (o "antes de sumir")
 */
import { Text } from '@react-three/drei';

const GLYPHS = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
  chiron: '⚷', exilio: '⚸', l4: '◐', l5: '◑',
};

export function PlanetNode({ ponto }) {
  if (!ponto) return null;
  const { x, y, z, chave, retrogrado } = ponto;

  if (chave === 'l4') {
    return (
      <group position={[x, y, z]}>
        <mesh>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        <pointLight color="#ffffff" intensity={4} distance={2.5} />
        <Text position={[0, 0.32, 0]} fontSize={0.18} color="#ffffff">
          {GLYPHS.l4}
        </Text>
      </group>
    );
  }

  if (chave === 'l5') {
    return (
      <group position={[x, y, z]}>
        <mesh>
          <sphereGeometry args={[0.14, 24, 24]} />
          <meshStandardMaterial color="#050505" emissive="#3a0d0d" emissiveIntensity={0.6} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.16, 0.19, 32]} />
          <meshBasicMaterial color="#7a1f1f" transparent opacity={0.8} side={2} />
        </mesh>
        <Text position={[0, 0.32, 0]} fontSize={0.18} color="#c14a3c">
          {GLYPHS.l5}
        </Text>
      </group>
    );
  }

  const destaque = chave === 'chiron' || chave === 'exilio';

  return (
    <group position={[x, y, z]}>
      <mesh>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial
          color={destaque ? '#f2c14e' : '#e8e8e8'}
          emissive={destaque ? '#f2c14e' : '#e8e8e8'}
          emissiveIntensity={destaque ? 1.4 : 0.8}
          toneMapped={false}
        />
      </mesh>
      <Text position={[0, 0.22, 0]} fontSize={0.15} color={destaque ? '#f2c14e' : '#ffffff'}>
        {GLYPHS[chave] ?? chave}
        {retrogrado ? ' R' : ''}
      </Text>
    </group>
  );
}
