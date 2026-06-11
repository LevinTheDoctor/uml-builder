/**
 * Platform-aware persistence.
 *
 * In the browser we fall back to the classic download/upload dance.
 * Inside Tauri we use the dialog + fs plugins to actually write XML files
 * the user owns on disk and to re-open them on next launch.
 *
 * Detection: Tauri v2 injects `__TAURI_INTERNALS__` on window. We test for
 * that rather than user-agent sniffing.
 */

export function isTauri() {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
}

const LAST_PATH_KEY = 'dw.lastPath.v1'

export async function saveXmlToFile(xml, suggestedName = 'diagram.xml') {
  if (isTauri()) {
    const { save } = await import('@tauri-apps/plugin-dialog')
    const { writeTextFile } = await import('@tauri-apps/plugin-fs')
    const path = await save({
      defaultPath: suggestedName,
      filters: [{ name: 'Diagrammwerk XML', extensions: ['xml'] }],
    })
    if (!path) return null
    await writeTextFile(path, xml)
    try { localStorage.setItem(LAST_PATH_KEY, path) } catch { /* quota */ }
    return path
  }
  // Browser fallback: trigger a download.
  const blob = new Blob([xml], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = suggestedName
  document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
  return suggestedName
}

export async function openXmlFromFile() {
  if (isTauri()) {
    const { open } = await import('@tauri-apps/plugin-dialog')
    const { readTextFile } = await import('@tauri-apps/plugin-fs')
    const path = await open({
      multiple: false,
      directory: false,
      filters: [{ name: 'Diagrammwerk XML', extensions: ['xml'] }],
    })
    if (!path || Array.isArray(path)) return null
    const content = await readTextFile(path)
    try { localStorage.setItem(LAST_PATH_KEY, path) } catch { /* quota */ }
    return { path, content }
  }
  // Browser fallback: file picker
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xml,application/xml,text/xml'
    input.onchange = () => {
      const f = input.files?.[0]
      if (!f) return resolve(null)
      const r = new FileReader()
      r.onload = () => resolve({ path: f.name, content: String(r.result) })
      r.onerror = () => reject(r.error)
      r.readAsText(f)
    }
    input.click()
  })
}

export function getLastPath() {
  try { return localStorage.getItem(LAST_PATH_KEY) } catch { return null }
}

/**
 * Re-save to the last known path. In Tauri this writes without dialog,
 * giving a "Save" (vs "Save As") UX. Falls back to download in browser.
 */
export async function quickSaveXml(xml, fallbackName) {
  if (isTauri()) {
    const path = getLastPath()
    if (path) {
      const { writeTextFile } = await import('@tauri-apps/plugin-fs')
      await writeTextFile(path, xml)
      return path
    }
  }
  return saveXmlToFile(xml, fallbackName)
}
