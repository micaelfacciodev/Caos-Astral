const ITENS = [
  { glyph: '☉', nome: 'Núcleo (Sol)' },
  { glyph: '☽', nome: 'Fome (Lua)' },
  { glyph: '☿', nome: 'Mercúrio' },
  { glyph: '♀', nome: 'Vênus' },
  { glyph: '♂', nome: 'Marte' },
  { glyph: '♃', nome: 'Júpiter' },
  { glyph: '♄', nome: 'Saturno' },
  { glyph: '♅', nome: 'Urano' },
  { glyph: '♆', nome: 'Netuno' },
  { glyph: '♇', nome: 'Plutão' },
  { glyph: '⚷', nome: 'Cicatriz (Quíron)' },
  { glyph: '⚸', nome: 'Exílio (Lilith)' },
  { glyph: '◐', nome: 'Sofia (L4)' },
  { glyph: '◑', nome: 'Saklas (L5)' },
];

export default function Legend() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        background: 'rgba(0,0,0,0.65)',
        border: '1px solid rgba(255,255,255,0.12)',
        padding: '10px 14px',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        color: '#e8e8e8',
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        columnGap: 10,
        rowGap: 4,
        zIndex: 5,
        pointerEvents: 'none',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}
    >
      {ITENS.map((it) => (
        <div key={it.nome} style={{ display: 'contents' }}>
          <span style={{ opacity: 0.85, textAlign: 'center' }}>{it.glyph}</span>
          <span style={{ opacity: 0.7 }}>{it.nome}</span>
        </div>
      ))}
    </div>
  );
}
