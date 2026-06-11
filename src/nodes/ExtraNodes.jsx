import { NodeShell } from './nodeTypes.jsx'

/* -----------------------------------------------------------------------------
   Use-case family
   ---------------------------------------------------------------------------*/

/** Stick figure + name. The figure is inline SVG so it themes via currentColor. */
export function ActorNode({ data, selected }) {
  return (
    <NodeShell
      selected={selected}
      style={{ background: 'transparent', border: 'none', boxShadow: 'none', minWidth: 64 }}
    >
      <div className="flex flex-col items-center gap-1" style={{ color: 'var(--c-fg)' }}>
        <svg width="44" height="60" viewBox="0 0 44 60">
          <circle cx="22" cy="9" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <line x1="22" y1="16" x2="22" y2="38" stroke="currentColor" strokeWidth="1.8" />
          <line x1="6"  y1="24" x2="38" y2="24" stroke="currentColor" strokeWidth="1.8" />
          <line x1="22" y1="38" x2="10" y2="58" stroke="currentColor" strokeWidth="1.8" />
          <line x1="22" y1="38" x2="34" y2="58" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        <div className="font-display italic text-[14px] leading-none px-2 py-1 rounded"
             style={{ color: 'var(--c-fg)', background: selected ? 'var(--c-selection)' : 'transparent' }}>
          {data.name || 'Actor'}
        </div>
      </div>
    </NodeShell>
  )
}

/** Use-case ellipse. We draw an SVG ellipse so the border is a real curve. */
export function UseCaseNode({ data, selected }) {
  const label = data.name || 'Use Case'
  // Width scales with label length; height stays fixed.
  const w = Math.max(140, Math.min(320, label.length * 9 + 60))
  const h = 64
  return (
    <NodeShell
      selected={selected}
      style={{ background: 'transparent', border: 'none', boxShadow: 'none', minWidth: w, minHeight: h }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
        <ellipse
          cx={w / 2} cy={h / 2} rx={w / 2 - 4} ry={h / 2 - 4}
          fill="var(--c-node-bg)"
          stroke={selected ? 'var(--c-accent)' : 'var(--c-node-border)'}
          strokeWidth="1.5"
        />
        <text
          x={w / 2} y={h / 2}
          textAnchor="middle" dominantBaseline="central"
          fontFamily='"Instrument Serif", Georgia, serif'
          fontStyle="italic"
          fontSize="16"
          fill="var(--c-fg)"
        >
          {label}
        </text>
      </svg>
    </NodeShell>
  )
}

/* -----------------------------------------------------------------------------
   Sequence
   ---------------------------------------------------------------------------*/

/** Sequence lifeline: header rectangle with a dashed tail. */
export function LifelineNode({ data, selected }) {
  return (
    <NodeShell selected={selected} style={{ background: 'transparent', border: 'none', boxShadow: 'none', minWidth: 120 }}>
      <div
        className="px-3 py-2 font-display italic text-[15px] text-center"
        style={{
          background: 'var(--c-node-bg)',
          border: `1.5px solid ${selected ? 'var(--c-accent)' : 'var(--c-node-border)'}`,
          color: 'var(--c-fg)',
          borderRadius: 2,
        }}
      >
        {data.name || 'Lifeline'}
      </div>
      <div
        className="mx-auto mt-1"
        style={{ width: 0, height: 140, borderLeft: '1.5px dashed var(--c-node-border)' }}
      />
    </NodeShell>
  )
}

/* -----------------------------------------------------------------------------
   Swimlane
   ---------------------------------------------------------------------------*/

/** A wide lane that other nodes can be placed on top of. */
export function SwimlaneNode({ data, selected }) {
  return (
    <NodeShell
      selected={selected}
      style={{
        minWidth: 520,
        background: 'color-mix(in srgb, var(--c-bg-elev) 80%, transparent)',
        border: `1.5px dashed ${selected ? 'var(--c-accent)' : 'var(--c-border-strong)'}`,
        borderRadius: 0,
      }}
    >
      <div
        className="flex items-center"
        style={{ minHeight: 120, borderLeft: '4px solid var(--c-accent)' }}
      >
        <div
          className="font-display italic px-3 py-2 text-[18px]"
          style={{
            color: 'var(--c-fg)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            borderRight: '1px solid var(--c-border)',
            background: 'var(--c-bg)',
          }}
        >
          {data.name || 'Lane'}
        </div>
        <div className="flex-1" />
      </div>
    </NodeShell>
  )
}

/* -----------------------------------------------------------------------------
   EPK
   ---------------------------------------------------------------------------*/

/** EPK event: hexagon — a CSS clip-path keeps it crisp at any zoom. */
export function EpkEventNode({ data, selected }) {
  return (
    <NodeShell
      selected={selected}
      style={{
        minWidth: 180,
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
      }}
    >
      <div
        className="px-6 py-3 font-display italic text-[15px] text-center"
        style={{
          background: 'color-mix(in srgb, var(--c-accent) 12%, var(--c-node-bg))',
          color: 'var(--c-fg)',
          clipPath: 'polygon(0% 50%, 18% 0%, 82% 0%, 100% 50%, 82% 100%, 18% 100%)',
          // Two layered borders: outer + inner for the hex outline effect
          outline: `1.5px solid ${selected ? 'var(--c-accent)' : 'var(--c-node-border)'}`,
        }}
      >
        {data.name || 'Event'}
      </div>
    </NodeShell>
  )
}

/** EPK function: rounded rectangle. */
export function EpkFunctionNode({ data, selected }) {
  return (
    <NodeShell
      selected={selected}
      style={{
        minWidth: 180,
        background: 'var(--c-node-bg)',
        borderRadius: 24,
      }}
    >
      <div className="px-5 py-3 font-display italic text-[15px] text-center" style={{ color: 'var(--c-fg)' }}>
        {data.name || 'Function'}
      </div>
    </NodeShell>
  )
}

/** EPK connector: circle with XOR/AND/OR glyph. */
export function EpkConnectorNode({ data, selected }) {
  const k = (data.kind || 'xor').toLowerCase()
  return (
    <NodeShell
      selected={selected}
      style={{ background: 'transparent', border: 'none', boxShadow: 'none', minWidth: 56, minHeight: 56 }}
    >
      <svg width="56" height="56" viewBox="0 0 56 56" style={{ display: 'block' }}>
        <circle cx="28" cy="28" r="24"
                fill="var(--c-node-bg)"
                stroke={selected ? 'var(--c-accent)' : 'var(--c-node-border)'}
                strokeWidth="1.5" />
        {k === 'xor' && <text x="28" y="32" textAnchor="middle" fontSize="20" fontFamily="JetBrains Mono, monospace" fill="var(--c-fg)">X</text>}
        {k === 'and' && (
          <path d="M16 38 L28 16 L40 38 M22 30 L34 30" fill="none" stroke="var(--c-fg)" strokeWidth="2" />
        )}
        {k === 'or' && (
          <text x="28" y="32" textAnchor="middle" fontSize="16" fontFamily="JetBrains Mono, monospace" fill="var(--c-fg)">v</text>
        )}
      </svg>
    </NodeShell>
  )
}
