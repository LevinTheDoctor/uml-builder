import { Download, Upload, Image as ImageIcon, FileCode2 } from 'lucide-react'
import { useStore, DIAGRAM_TYPES } from '../state/store.js'
import { ThemeMenu } from '../themes/ThemeMenu.jsx'

export function TopBar({ onExportXml, onImportXml, onExportPng }) {
  const diagramType = useStore((s) => s.diagramType)
  const setDiagramType = useStore((s) => s.setDiagramType)

  return (
    <header
      className="flex items-center justify-between px-5 py-2.5"
      style={{ borderBottom: '1px solid var(--c-border)', background: 'var(--c-bg-elev)' }}
    >
      <div className="flex items-center gap-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display italic text-[26px] leading-none" style={{ color: 'var(--c-fg)' }}>
            Diagrammwerk
          </span>
          <span className="font-mono uppercase text-[9px] tracking-[0.24em]" style={{ color: 'var(--c-fg-subtle)' }}>
            v0.1
          </span>
        </div>
        <div className="flex items-center gap-0.5 rounded-md p-0.5"
             style={{ border: '1px solid var(--c-border)', background: 'var(--c-bg)' }}>
          {DIAGRAM_TYPES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDiagramType(d.id)}
              className="px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition"
              style={{
                background: diagramType === d.id ? 'var(--c-accent)' : 'transparent',
                color: diagramType === d.id ? 'var(--c-accent-fg)' : 'var(--c-fg-muted)',
              }}
              title={d.hint}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="dw-btn flex items-center gap-1.5" onClick={onImportXml}>
          <Upload size={13} />
          <span className="font-mono text-[11px] uppercase tracking-wider">Import XML</span>
        </button>
        <button className="dw-btn flex items-center gap-1.5" onClick={onExportXml}>
          <FileCode2 size={13} />
          <span className="font-mono text-[11px] uppercase tracking-wider">Export XML</span>
        </button>
        <button className="dw-btn flex items-center gap-1.5" onClick={onExportPng}>
          <ImageIcon size={13} />
          <span className="font-mono text-[11px] uppercase tracking-wider">PNG</span>
        </button>
        <div className="w-px h-6 mx-1" style={{ background: 'var(--c-border)' }} />
        <ThemeMenu />
      </div>
    </header>
  )
}
