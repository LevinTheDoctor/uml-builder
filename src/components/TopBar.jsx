import { useState } from 'react'
import { Image as ImageIcon, Upload, FileCode2, Settings2 } from 'lucide-react'
import { useStore, DIAGRAM_TYPES } from '../state/store.js'
import { useT } from '../i18n/I18nProvider.jsx'
import { SettingsModal } from './SettingsModal.jsx'

export function TopBar({ onExportXml, onImportXml, onExportPng }) {
  const t = useT()
  const diagramType = useStore((s) => s.diagramType)
  const setDiagramType = useStore((s) => s.setDiagramType)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <header
      className="flex items-center justify-between px-5 py-2.5 gap-4"
      style={{ borderBottom: '1px solid var(--c-border)', background: 'var(--c-bg-elev)' }}
    >
      <div className="flex items-center gap-6 min-w-0">
        <div className="flex items-baseline gap-2 shrink-0">
          <span className="font-display italic text-[26px] leading-none" style={{ color: 'var(--c-fg)' }}>
            Diagrammwerk
          </span>
          <span className="font-mono uppercase text-[9px] tracking-[0.24em]" style={{ color: 'var(--c-fg-subtle)' }}>
            {t('app.tag')}
          </span>
        </div>
        <div
          className="flex items-center gap-0.5 rounded-md p-0.5 overflow-x-auto"
          style={{ border: '1px solid var(--c-border)', background: 'var(--c-bg)' }}
        >
          {DIAGRAM_TYPES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDiagramType(d.id)}
              className="px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition whitespace-nowrap"
              style={{
                background: diagramType === d.id ? 'var(--c-accent)' : 'transparent',
                color: diagramType === d.id ? 'var(--c-accent-fg)' : 'var(--c-fg-muted)',
              }}
              title={t(d.hintKey)}
            >
              {t(d.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button className="dw-btn flex items-center gap-1.5" onClick={onImportXml}>
          <Upload size={13} />
          <span className="font-mono text-[11px] uppercase tracking-wider">{t('topbar.import')}</span>
        </button>
        <button className="dw-btn flex items-center gap-1.5" onClick={onExportXml}>
          <FileCode2 size={13} />
          <span className="font-mono text-[11px] uppercase tracking-wider">{t('topbar.export')}</span>
        </button>
        <button className="dw-btn flex items-center gap-1.5" onClick={onExportPng}>
          <ImageIcon size={13} />
          <span className="font-mono text-[11px] uppercase tracking-wider">{t('topbar.png')}</span>
        </button>
        <div className="w-px h-6 mx-1" style={{ background: 'var(--c-border)' }} />
        <button
          className="dw-btn flex items-center gap-1.5"
          onClick={() => setSettingsOpen(true)}
          aria-label={t('topbar.settings')}
          title={t('topbar.settings')}
        >
          <Settings2 size={14} />
          <span className="font-mono text-[11px] uppercase tracking-wider">{t('topbar.settings')}</span>
        </button>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  )
}
