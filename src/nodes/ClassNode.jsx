import { NodeShell } from './nodeTypes.jsx'

/**
 * UML class. Three stacked compartments: header (stereotype + name),
 * attributes, methods. Empty compartments collapse so the node stays compact
 * for simple cases. Editing happens in the Inspector.
 */
export function ClassNode({ data, selected }) {
  const attrs   = (data.attributes || []).filter(Boolean)
  const methods = (data.methods    || []).filter(Boolean)
  return (
    <NodeShell selected={selected} style={{ minWidth: 180 }}>
      <div
        className="px-3 py-2 text-center"
        style={{
          background: 'var(--c-node-head)',
          color: 'var(--c-node-head-fg)',
          borderBottom: '1.5px solid var(--c-node-border)',
        }}
      >
        {data.stereotype && (
          <div className="font-mono text-[10px] tracking-wider opacity-80 leading-none mb-1">
            «{data.stereotype.replace(/[«»]/g, '')}»
          </div>
        )}
        <div className="font-display italic text-[18px] leading-none">
          {data.name || 'NewClass'}
        </div>
      </div>

      {attrs.length > 0 && (
        <div className="px-3 py-1.5 font-mono text-[11px] leading-snug"
             style={{ borderBottom: methods.length > 0 ? '1.5px solid var(--c-node-border)' : 'none' }}>
          {attrs.map((a, i) => <div key={i}>{a}</div>)}
        </div>
      )}

      {methods.length > 0 && (
        <div className="px-3 py-1.5 font-mono text-[11px] leading-snug">
          {methods.map((m, i) => <div key={i}>{m}</div>)}
        </div>
      )}

      {attrs.length === 0 && methods.length === 0 && (
        <div className="px-3 py-1.5 font-mono text-[10px] italic" style={{ color: 'var(--c-fg-subtle)' }}>
          empty class
        </div>
      )}
    </NodeShell>
  )
}
