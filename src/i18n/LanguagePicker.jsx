import { useI18n } from './I18nProvider.jsx'

/**
 * Embedded language picker — two large radio cards. Designed for the
 * settings modal where there's room to breathe; the tiny pill toggle
 * stays out of the topbar entirely once settings replaces it.
 */

const META = [
  { id: 'de', label: 'Deutsch', flag: 'DE', note: 'Diagrammwerk auf Deutsch' },
  { id: 'en', label: 'English', flag: 'EN', note: 'Diagrammwerk in English' },
]

export function LanguagePicker() {
  const { lang, setLang } = useI18n()
  return (
    <div className="grid grid-cols-2 gap-3">
      {META.map((m) => {
        const active = lang === m.id
        return (
          <button
            key={m.id}
            onClick={() => setLang(m.id)}
            className="relative px-4 py-5 rounded-md text-left transition"
            style={{
              border: `1px solid ${active ? 'var(--c-accent)' : 'var(--c-border)'}`,
              background: active ? 'color-mix(in srgb, var(--c-accent) 8%, transparent)' : 'transparent',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-display italic text-2xl leading-none" style={{ color: 'var(--c-fg)' }}>
                {m.label}
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.2em] px-1.5 py-0.5 rounded"
                style={{
                  background: active ? 'var(--c-accent)' : 'var(--c-bg)',
                  color: active ? 'var(--c-accent-fg)' : 'var(--c-fg-muted)',
                  border: '1px solid var(--c-border)',
                }}
              >
                {m.flag}
              </span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider mt-2" style={{ color: 'var(--c-fg-subtle)' }}>
              {m.note}
            </div>
          </button>
        )
      })}
    </div>
  )
}
