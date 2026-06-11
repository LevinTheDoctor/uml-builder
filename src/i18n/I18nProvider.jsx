import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { dict, SUPPORTED, FALLBACK } from './dict.js'

const STORAGE_KEY = 'dw.lang.v1'
const I18nCtx = createContext(null)

function detectLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (SUPPORTED.includes(stored)) return stored
  } catch { /* ignore */ }
  if (typeof navigator !== 'undefined') {
    const nav = (navigator.language || '').slice(0, 2).toLowerCase()
    if (SUPPORTED.includes(nav)) return nav
  }
  return FALLBACK
}

/** Translate `key`, optionally substituting `{name}` placeholders from `vars`. */
function translate(lang, key, vars) {
  const v = dict[lang]?.[key] ?? dict[FALLBACK][key] ?? key
  if (!vars) return v
  return v.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`))
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detectLang)

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
    try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* quota */ }
  }, [lang])

  const value = useMemo(() => ({
    lang,
    setLang,
    t: (key, vars) => translate(lang, key, vars),
  }), [lang])

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nCtx)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}

/** Shorthand for the most common case. */
export function useT() {
  return useI18n().t
}

/**
 * Translator usable outside React (e.g. node defaults at creation time).
 * Reads the persisted language from localStorage so newly created elements
 * speak the user's language even before the React tree mounts.
 */
export function tStandalone(key, vars) {
  let lang = FALLBACK
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (SUPPORTED.includes(stored)) lang = stored
  } catch { /* ignore */ }
  return translate(lang, key, vars)
}
