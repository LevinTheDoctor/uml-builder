import { useStore } from '../state/store.js'
import { PALETTE } from './palette-config.jsx'

/**
 * Left sidebar. Items are drag sources; the Canvas wires up the drop side.
 * The active list is filtered by the currently selected diagram type.
 */
export function Palette() {
  const diagramType = useStore((s) => s.diagramType)
  const items = PALETTE[diagramType] || []

  function onDragStart(e, kind) {
    e.dataTransfer.setData('application/x-dw-node', kind)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <aside
      className="h-full w-[240px] shrink-0 flex flex-col"
      style={{ borderRight: '1px solid var(--c-border)', background: 'var(--c-bg-elev)' }}
    >
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--c-border)' }}>
        <div className="font-display italic text-lg leading-none" style={{ color: 'var(--c-fg)' }}>
          Palette
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] mt-1" style={{ color: 'var(--c-fg-subtle)' }}>
          drag onto canvas
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
        {items.map((it) => {
          const Glyph = it.glyph
          return (
            <div
              key={it.kind}
              draggable
              onDragStart={(e) => onDragStart(e, it.kind)}
              className="group relative flex items-start gap-3 p-3 rounded-md cursor-grab active:cursor-grabbing select-none transition"
              style={{ border: '1px solid var(--c-border)', background: 'var(--c-bg)' }}
            >
              <div style={{ color: 'var(--c-fg-muted)' }} className="shrink-0 mt-0.5 group-hover:text-[color:var(--c-accent)] transition">
                <Glyph />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] leading-tight" style={{ color: 'var(--c-fg)' }}>{it.label}</div>
                <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--c-fg-subtle)' }}>{it.blurb}</div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="px-4 py-2 font-mono text-[10px]" style={{ borderTop: '1px solid var(--c-border)', color: 'var(--c-fg-subtle)' }}>
        ⌥ drag to duplicate · Del to remove
      </div>
    </aside>
  )
}
