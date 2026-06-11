import { NodeShell } from './nodeTypes.jsx'
import { useT } from '../i18n/I18nProvider.jsx'

/**
 * ERM entity. Header is the entity name; rows are attributes.
 * PK attributes get underlined per ERM convention; FK attributes (planned)
 * would render in italic — we just expose `pk` for now.
 */
export function EntityNode({ data, selected }) {
  const t = useT()
  const attrs = data.attributes || []
  return (
    <NodeShell selected={selected} style={{ minWidth: 200 }}>
      <div
        className="px-3 py-2 text-center"
        style={{
          background: 'var(--c-node-head)',
          color: 'var(--c-node-head-fg)',
          borderBottom: '1.5px solid var(--c-node-border)',
        }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-80 leading-none mb-1">
          {t('entity.label')}
        </div>
        <div className="font-display italic text-[18px] leading-none">
          {data.name || 'NewEntity'}
        </div>
      </div>
      <div className="font-mono text-[11px]">
        {attrs.length === 0 ? (
          <div className="px-3 py-1.5 italic" style={{ color: 'var(--c-fg-subtle)' }}>{t('entity.noAttrs')}</div>
        ) : attrs.map((a, i) => (
          <div
            key={i}
            className="px-3 py-1 flex items-baseline gap-2"
            style={{ borderTop: i ? '1px dashed var(--c-border)' : 'none' }}
          >
            <span
              style={{
                color: a.pk ? 'var(--c-accent)' : 'var(--c-fg)',
                textDecoration: a.pk ? 'underline' : 'none',
                textUnderlineOffset: '3px',
                fontWeight: a.pk ? 600 : 400,
              }}
            >
              {a.name}
            </span>
            <span className="ml-auto" style={{ color: 'var(--c-fg-muted)' }}>{a.type}</span>
          </div>
        ))}
      </div>
    </NodeShell>
  )
}
