import { useI18n } from './I18nProvider.jsx'
import { SUPPORTED } from './dict.js'

/** Minimal pill toggle DE | EN. */
export function LanguageToggle() {
  const { lang, setLang, t } = useI18n()
  return (
    <div
      className="flex items-center rounded-md p-0.5"
      role="group"
      aria-label={t('topbar.language')}
      style={{ border: '1px solid var(--c-border)', background: 'var(--c-bg)' }}
    >
      {SUPPORTED.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-[0.18em] transition"
          style={{
            background: lang === l ? 'var(--c-accent)' : 'transparent',
            color: lang === l ? 'var(--c-accent-fg)' : 'var(--c-fg-muted)',
          }}
          aria-pressed={lang === l}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
