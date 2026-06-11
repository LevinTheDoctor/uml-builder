import { toPng } from 'html-to-image'
import { getNodesBounds, getViewportForBounds } from '@xyflow/react'

/**
 * Snapshot the active diagram to a PNG.
 *
 * Strategy: ask React Flow for the bounds of all current nodes, compute a
 * viewport transform that frames those bounds inside a target raster size,
 * and rasterize the `.react-flow__viewport` element. This guarantees the
 * full diagram is captured, not just whatever happens to be on-screen.
 *
 * The background color is read from the live CSS theme so screenshots match
 * what the user sees (incl. custom token overrides).
 */
export async function exportPng({ nodes, filename = 'diagram.png', scale = 2 }) {
  if (!nodes || nodes.length === 0) {
    throw new Error('Nothing to export — the canvas is empty.')
  }

  const viewportEl = document.querySelector('.react-flow__viewport')
  if (!viewportEl) throw new Error('React Flow viewport not mounted')

  const W = 1920
  const H = 1080
  const bounds = getNodesBounds(nodes)
  const tf = getViewportForBounds(bounds, W, H, 0.4, 2, 40 /* padding */)

  // Pull theme tokens live so dark/dracula/custom themes all render correctly.
  const cs = getComputedStyle(document.documentElement)
  const bg   = cs.getPropertyValue('--c-bg-canvas').trim() || '#ffffff'

  const dataUrl = await toPng(viewportEl, {
    backgroundColor: bg,
    width: W,
    height: H,
    pixelRatio: scale,
    style: {
      width: `${W}px`,
      height: `${H}px`,
      transform: `translate(${tf.x}px, ${tf.y}px) scale(${tf.zoom})`,
    },
    // Skip controls/minimap during snapshot — they live in a sibling element.
    filter: (node) => {
      if (!node?.classList) return true
      const blocked = ['react-flow__minimap', 'react-flow__controls', 'react-flow__attribution']
      return !blocked.some((c) => node.classList.contains(c))
    },
  })

  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}
