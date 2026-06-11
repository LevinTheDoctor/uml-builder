/**
 * Diagrammwerk theme registry.
 *
 * A theme is the flat set of CSS tokens consumed by `src/index.css`. The base
 * themes (light / dark / dracula) are hand-tuned; custom themes are stored in
 * localStorage and override individual tokens of a chosen base.
 *
 * Tokens are kept in sync with `src/index.css` — adding a token here means
 * also surfacing it in the customizer.
 */

export const TOKEN_DEFS = [
  { key: 'c-bg',            label: 'Background' },
  { key: 'c-bg-elev',       label: 'Panel' },
  { key: 'c-bg-canvas',     label: 'Canvas' },
  { key: 'c-fg',            label: 'Foreground' },
  { key: 'c-fg-muted',      label: 'Foreground (muted)' },
  { key: 'c-fg-subtle',     label: 'Foreground (subtle)' },
  { key: 'c-border',        label: 'Border' },
  { key: 'c-border-strong', label: 'Border (strong)' },
  { key: 'c-accent',        label: 'Accent' },
  { key: 'c-accent-fg',     label: 'Accent fg' },
  { key: 'c-node-bg',       label: 'Node bg' },
  { key: 'c-node-border',   label: 'Node border' },
  { key: 'c-node-head',     label: 'Node header' },
  { key: 'c-node-head-fg',  label: 'Node header fg' },
  { key: 'c-edge',          label: 'Edge' },
  { key: 'c-grid',          label: 'Canvas grid' },
]

export const BASE_THEMES = ['light', 'dark', 'dracula']

/** Apply a base theme + optional token overrides to <html>. */
export function applyTheme(base, overrides = {}) {
  const root = document.documentElement
  root.setAttribute('data-theme', BASE_THEMES.includes(base) ? base : 'light')
  // Wipe previous overrides so they don't bleed across switches.
  for (const t of TOKEN_DEFS) root.style.removeProperty(`--${t.key}`)
  for (const [k, v] of Object.entries(overrides)) {
    if (v) root.style.setProperty(`--${k}`, v)
  }
  // simple-tailwind-ui uses `.dark` on <html> for its dark mode.
  root.classList.toggle('dark', base !== 'light')
}

/** Read the currently resolved value of a token (after base + overrides). */
export function resolveToken(key) {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${key}`).trim()
}
