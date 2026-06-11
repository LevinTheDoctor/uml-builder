import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { applyTheme, BASE_THEMES } from './themes.js'

const ThemeCtx = createContext(null)

const STORAGE_KEY = 'dw.theme.v1'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (BASE_THEMES.includes(parsed.base)) return parsed
    }
  } catch { /* ignore corrupt storage */ }
  return { base: 'light', overrides: {} }
}

export function ThemeProvider({ children }) {
  const [state, setState] = useState(loadInitial)

  useEffect(() => {
    applyTheme(state.base, state.overrides)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* quota */ }
  }, [state])

  const value = useMemo(() => ({
    base: state.base,
    overrides: state.overrides,
    setBase: (base) => setState((s) => ({ ...s, base })),
    setOverride: (key, value) => setState((s) => ({
      ...s,
      overrides: value
        ? { ...s.overrides, [key]: value }
        : Object.fromEntries(Object.entries(s.overrides).filter(([k]) => k !== key)),
    })),
    resetOverrides: () => setState((s) => ({ ...s, overrides: {} })),
  }), [state])

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeCtx)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
