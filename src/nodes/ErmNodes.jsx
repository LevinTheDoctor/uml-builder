import { NodeShell } from './nodeTypes.jsx'

/* -----------------------------------------------------------------------------
   Chen-notation ERM nodes
   ---------------------------------------------------------------------------*/

/** Entitätstyp — a filled rectangle with the type name. */
export function ErmEntityNode({ data, selected }) {
  return (
    <NodeShell
      selected={selected}
      style={{
        background: 'var(--c-node-head)',
        color: 'var(--c-node-head-fg)',
        border: `1.5px solid ${selected ? 'var(--c-accent)' : 'var(--c-node-border)'}`,
        borderRadius: 0,
        minWidth: 140,
      }}
    >
      <div className="px-4 py-3 text-center font-display italic text-[18px] leading-none">
        {data.name || 'Entität'}
      </div>
    </NodeShell>
  )
}

/** Beziehungstyp — a diamond with the relationship name inside. */
export function ErmRelationshipNode({ data, selected }) {
  // SVG diamond keeps the connection-handle math sane (the bounding box stays
  // a rectangle; only the visible fill is rhombus-shaped).
  const label = data.name || 'beziehung'
  const w = Math.max(140, Math.min(280, label.length * 9 + 70))
  const h = 80
  return (
    <NodeShell
      selected={selected}
      style={{ background: 'transparent', border: 'none', boxShadow: 'none', minWidth: w, minHeight: h }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
        <polygon
          points={`${w / 2},2 ${w - 2},${h / 2} ${w / 2},${h - 2} 2,${h / 2}`}
          fill="var(--c-node-head)"
          stroke={selected ? 'var(--c-accent)' : 'var(--c-node-border)'}
          strokeWidth="1.5"
        />
        <text
          x={w / 2} y={h / 2}
          textAnchor="middle" dominantBaseline="central"
          fontFamily='"Instrument Serif", Georgia, serif'
          fontStyle="italic"
          fontSize="16"
          fill="var(--c-node-head-fg)"
        >
          {label}
        </text>
      </svg>
    </NodeShell>
  )
}

/**
 * Attribut — an ellipse. If `data.key` is true, the attribute name is
 * underlined (Schlüsselattribut convention).
 */
export function ErmAttributeNode({ data, selected }) {
  const label = data.name || 'Attribut'
  const w = Math.max(96, Math.min(220, label.length * 9 + 36))
  const h = 50
  return (
    <NodeShell
      selected={selected}
      style={{ background: 'transparent', border: 'none', boxShadow: 'none', minWidth: w, minHeight: h }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
        <ellipse
          cx={w / 2} cy={h / 2} rx={w / 2 - 3} ry={h / 2 - 3}
          fill="var(--c-node-head)"
          stroke={selected ? 'var(--c-accent)' : 'var(--c-node-border)'}
          strokeWidth="1.5"
        />
        <text
          x={w / 2} y={h / 2}
          textAnchor="middle" dominantBaseline="central"
          fontFamily='"Instrument Serif", Georgia, serif'
          fontStyle="italic"
          fontSize="15"
          fill="var(--c-node-head-fg)"
          textDecoration={data.key ? 'underline' : undefined}
        >
          {label}
        </text>
      </svg>
    </NodeShell>
  )
}
