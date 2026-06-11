import { useEffect, useState } from 'react'
import { Sun, Moon, Sparkles, RotateCcw } from 'lucide-react'
import { useTheme } from './ThemeProvider.jsx'
import { BASE_THEMES, TOKEN_DEFS, resolveToken } from './themes.js'
import { useT } from '../i18n/I18nProvider.jsx'

/**
 * Theme picker UI — pulled out of the old floating menu so it can be embedded
 * inside the settings modal (or anywhere else that needs the full editor).
 *
 * Renders: base theme cards on top, scrollable token customizer below.
 */

const BASE_META = {
  light:   { icon: Sun,      labelKey: 'theme.base.light',   noteKey: 'theme.base.light.note' },
  dark:    { icon: Moon,     labelKey: 'theme.base.dark',    noteKey: 'theme.base.dark.note' },
  dracula: { icon: Sparkles, labelKey: 'theme.base.dracula', noteKey: 'theme.base.dracula.note' },
}

export function ThemeSettings() {
  const t = useT()
  const { base, overrides, setBase, setOverride, resetOverrides } = useTheme()

  return (
    <div className="flex flex-col gap-4">
      <section>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--c-fg-subtle)' }}>
          {t('theme.subtitle')}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {BASE_THEMES.map((bid) => {
            const Meta = BASE_META[bid]
            const Icon = Meta.icon
            const active = base === bid
            return (
              <button
                key={bid}
                onClick={() => setBase(bid)}
                className="relative text-left px-3 py-3 rounded-md transition"
                style={{
                  border: `1px solid ${active ? 'var(--c-accent)' : 'var(--c-border)'}`,
                  background: active ? 'color-mix(in srgb, var(--c-accent) 8%, transparent)' : 'transparent',
                }}
              >
                <Icon size={14} style={{ color: active ? 'var(--c-accent)' : 'var(--c-fg-muted)' }} />
                <div className="mt-2 font-display text-base italic leading-none" style={{ color: 'var(--c-fg)' }}>
                  {t(Meta.labelKey)}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--c-fg-subtle)' }}>
                  {t(Meta.noteKey)}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--c-fg-subtle)' }}>
            {t('theme.customTokens')}
          </div>
          {Object.keys(overrides).length > 0 && (
            <button onClick={resetOverrides} className="dw-btn flex items-center gap-1 !text-[10px] !py-1">
              <RotateCcw size={11} />
              {t('theme.reset')}
            </button>
          )}
        </div>
        <div
          className="rounded-md overflow-y-auto max-h-[320px]"
          style={{ border: '1px solid var(--c-border)' }}
        >
          {TOKEN_DEFS.map((tok, i) => (
            <TokenRow
              key={tok.key}
              tokenKey={tok.key}
              label={t(`token.${tok.key}`)}
              value={overrides[tok.key]}
              onChange={(v) => setOverride(tok.key, v)}
              first={i === 0}
              t={t}
            />
          ))}
        </div>
        <div className="font-mono text-[10px] mt-2" style={{ color: 'var(--c-fg-subtle)' }}>
          {t('theme.tip')}
        </div>
      </section>
    </div>
  )
}

function TokenRow({ tokenKey, label, value, onChange, first, t }) {
  const [live, setLive] = useState('#000000')
  useEffect(() => { setLive(value || resolveToken(tokenKey) || '#000000') }, [tokenKey, value])
  const swatch = value || live
  return (
    <label
      className="flex items-center gap-3 px-3 py-2 cursor-pointer transition"
      style={{ borderTop: first ? 'none' : '1px solid var(--c-border)' }}
    >
      <span
        className="w-6 h-6 rounded-md shrink-0"
        style={{ background: swatch, border: '1px solid var(--c-border-strong)' }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-[12px] truncate" style={{ color: 'var(--c-fg)' }}>{label}</div>
        <div className="font-mono text-[10px] truncate" style={{ color: 'var(--c-fg-subtle)' }}>--{tokenKey}</div>
      </div>
      <input
        type="color"
        value={normalizeHex(swatch)}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 cursor-pointer rounded-md overflow-hidden border-none bg-transparent"
        style={{ padding: 0 }}
        aria-label={t('theme.token.pick', { label })}
      />
      {value && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onChange(null) }}
          className="font-mono text-[12px]"
          style={{ color: 'var(--c-fg-subtle)' }}
          title={t('theme.token.clear')}
        >
          ×
        </button>
      )}
    </label>
  )
}

function normalizeHex(c) {
  if (!c) return '#000000'
  const trimmed = String(c).trim()
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) return trimmed
  if (/^#[0-9a-f]{3}$/i.test(trimmed)) return '#' + trimmed.slice(1).split('').map((d) => d + d).join('')
  try {
    const probe = document.createElement('span')
    probe.style.color = trimmed
    document.body.appendChild(probe)
    const cs = getComputedStyle(probe).color
    probe.remove()
    const m = cs.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (m) {
      const hex = (n) => Number(n).toString(16).padStart(2, '0')
      return '#' + hex(m[1]) + hex(m[2]) + hex(m[3])
    }
  } catch { /* ignore */ }
  return '#000000'
}
