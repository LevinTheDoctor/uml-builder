import { useEffect, useRef, useState } from 'react'
import { Palette, RotateCcw, Sun, Moon, Sparkles, X } from 'lucide-react'
import { useTheme } from './ThemeProvider.jsx'
import { BASE_THEMES, TOKEN_DEFS, resolveToken } from './themes.js'

const BASE_META = {
  light:   { icon: Sun,      label: 'Light',   note: 'paper & ink' },
  dark:    { icon: Moon,     label: 'Dark',    note: 'low-light studio' },
  dracula: { icon: Sparkles, label: 'Dracula', note: 'iconic neon' },
}

/**
 * Floating theme menu. Opens from the topbar; lets the user pick a base theme
 * and override any of the ~16 design tokens. Overrides persist per token so
 * switching base preserves customizations the user already cares about.
 */
export function ThemeMenu() {
  const [open, setOpen] = useState(false)
  const { base, overrides, setBase, setOverride, resetOverrides } = useTheme()
  const popRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e) { if (popRef.current && !popRef.current.contains(e.target)) setOpen(false) }
    function onKey(e) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="dw-btn flex items-center gap-2">
        <Palette size={14} />
        <span className="font-mono uppercase text-[11px] tracking-wider">{base}</span>
      </button>

      {open && (
        <div
          ref={popRef}
          className="absolute right-0 top-[calc(100%+8px)] w-[380px] z-50 dw-panel rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--c-border)' }}>
            <div>
              <div className="font-display text-xl italic leading-none" style={{ color: 'var(--c-fg)' }}>
                Theme
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] mt-1" style={{ color: 'var(--c-fg-subtle)' }}>
                base · custom tokens
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="dw-btn !p-1.5" aria-label="Close">
              <X size={14} />
            </button>
          </div>

          <div className="px-4 py-3 grid grid-cols-3 gap-2">
            {BASE_THEMES.map((t) => {
              const Meta = BASE_META[t]
              const Icon = Meta.icon
              const active = base === t
              return (
                <button
                  key={t}
                  onClick={() => setBase(t)}
                  className="relative text-left px-3 py-2.5 rounded-md transition"
                  style={{
                    border: `1px solid ${active ? 'var(--c-accent)' : 'var(--c-border)'}`,
                    background: active ? 'color-mix(in srgb, var(--c-accent) 8%, transparent)' : 'transparent',
                  }}
                >
                  <Icon size={14} style={{ color: active ? 'var(--c-accent)' : 'var(--c-fg-muted)' }} />
                  <div className="mt-2 font-display text-base italic leading-none">{Meta.label}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--c-fg-subtle)' }}>
                    {Meta.note}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="px-4 pb-1 flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--c-fg-subtle)' }}>
              Custom tokens
            </div>
            {Object.keys(overrides).length > 0 && (
              <button onClick={resetOverrides} className="dw-btn flex items-center gap-1 !text-[10px] !py-1">
                <RotateCcw size={11} />
                Reset
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto px-2 py-2">
            {TOKEN_DEFS.map((t) => (
              <TokenRow key={t.key} tokenKey={t.key} label={t.label} value={overrides[t.key]} onChange={(v) => setOverride(t.key, v)} />
            ))}
          </div>

          <div className="px-4 py-2 font-mono text-[10px]" style={{ borderTop: '1px solid var(--c-border)', color: 'var(--c-fg-subtle)' }}>
            Tip: customizations stack on top of the base theme.
          </div>
        </div>
      )}
    </div>
  )
}

function TokenRow({ tokenKey, label, value, onChange }) {
  // When no override is set, surface the resolved theme value so the picker
  // starts where the user actually sees the color today.
  const [live, setLive] = useState('#000000')
  useEffect(() => { setLive(value || resolveToken(tokenKey) || '#000000') }, [tokenKey, value])

  const swatch = value || live

  return (
    <label className="flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer hover:bg-[color-mix(in_srgb,var(--c-border)_30%,transparent)]">
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
        aria-label={`Pick ${label}`}
      />
      {value && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onChange(null) }}
          className="font-mono text-[10px] uppercase"
          style={{ color: 'var(--c-fg-subtle)' }}
          title="Clear override"
        >
          ×
        </button>
      )}
    </label>
  )
}

/** Native <input type="color"> requires "#rrggbb". Coerce best-effort. */
function normalizeHex(c) {
  if (!c) return '#000000'
  const trimmed = String(c).trim()
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) return trimmed
  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    return '#' + trimmed.slice(1).split('').map((d) => d + d).join('')
  }
  // For rgb(...)/color-mix() etc, render via a temp element to read computed color
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
