import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import { DIAGRAM_TYPES } from '../state/store.js'

/**
 * Diagrammwerk XML format (v1).
 *
 * Round-trippable representation of the full multi-diagram document:
 *
 *   <diagrammwerk version="1" active="class">
 *     <diagram type="class">
 *       <nodes>
 *         <node id="n_..." type="class" x="120" y="80">
 *           <data>
 *             <name>Account</name>
 *             <attributes>
 *               <item>- balance: Money</item>
 *             </attributes>
 *             <methods>
 *               <item>+ debit(): void</item>
 *             </methods>
 *           </data>
 *         </node>
 *       </nodes>
 *       <edges>
 *         <edge id="e_..." source="n_a" target="n_b" sourceHandle="r" targetHandle="l">
 *           <data>
 *             <kind>inheritance</kind>
 *             <label/>
 *           </data>
 *         </edge>
 *       </edges>
 *     </diagram>
 *   </diagrammwerk>
 *
 * `data` mirrors React Flow's `node.data` / `edge.data` shape. Arrays of
 * primitives become repeated <item> children; arrays of objects become
 * repeated <entry> children with key/value pairs. Keeping the layout flat
 * means hand-editing the XML is feasible.
 */

const VERSION = '1'

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  format: true,
  indentBy: '  ',
  suppressEmptyNode: true,
})

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: false, // keep everything as string; we re-coerce ourselves
  parseAttributeValue: true,
  trimValues: false,
  isArray: (name, jpath) => {
    // Force these to be arrays even when there's a single child.
    if (name === 'diagram') return true
    if (name === 'node' || name === 'edge') return true
    if (name === 'item' || name === 'entry') return true
    return false
  },
})

/** Encode a JS value for inclusion under <data>. */
function encodeValue(v) {
  if (v == null) return ''
  if (Array.isArray(v)) {
    if (v.length === 0) return ''
    if (v.every((x) => typeof x !== 'object' || x === null)) {
      return { item: v.map((x) => stringy(x)) }
    }
    return { entry: v.map((obj) => encodeObject(obj)) }
  }
  if (typeof v === 'object') return encodeObject(v)
  return stringy(v)
}
function encodeObject(o) {
  const out = {}
  for (const [k, v] of Object.entries(o)) out[k] = encodeValue(v)
  return out
}
function stringy(v) {
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  return String(v)
}

/** Inverse of `encodeValue` — best-effort, schema-aware coercion. */
function decodeData(raw, hints = {}) {
  const out = {}
  if (!raw || typeof raw !== 'object') return out

  for (const [k, v] of Object.entries(raw)) {
    if (k.startsWith('@_')) continue
    out[k] = decodeField(k, v, hints[k])
  }
  return out
}
function decodeField(key, v, hint) {
  if (v == null || v === '') {
    if (hint === 'array-of-string') return []
    if (hint === 'array-of-object') return []
    return ''
  }
  if (typeof v === 'object') {
    if ('item' in v) {
      const arr = Array.isArray(v.item) ? v.item : [v.item]
      return arr.map((x) => (typeof x === 'object' ? '' : String(x)))
    }
    if ('entry' in v) {
      const arr = Array.isArray(v.entry) ? v.entry : [v.entry]
      return arr.map((e) => decodeData(e))
    }
    // Nested object
    return decodeData(v)
  }
  // Booleans round-trip via 'true'/'false'
  if (v === 'true') return true
  if (v === 'false') return false
  return v
}

/** Build the XML document from the store snapshot. */
export function toXml({ diagrams, diagramType }) {
  const doc = {
    diagrammwerk: {
      '@_version': VERSION,
      '@_active':  diagramType,
      diagram: DIAGRAM_TYPES.map(({ id }) => {
        const d = diagrams[id] || { nodes: [], edges: [] }
        return {
          '@_type': id,
          nodes: d.nodes.length === 0 ? '' : {
            node: d.nodes.map((n) => ({
              '@_id':   n.id,
              '@_type': n.type,
              '@_x':    Math.round(n.position.x),
              '@_y':    Math.round(n.position.y),
              data: encodeObject(n.data || {}),
            })),
          },
          edges: d.edges.length === 0 ? '' : {
            edge: d.edges.map((e) => ({
              '@_id':     e.id,
              '@_source': e.source,
              '@_target': e.target,
              ...(e.sourceHandle && { '@_sourceHandle': e.sourceHandle }),
              ...(e.targetHandle && { '@_targetHandle': e.targetHandle }),
              data: encodeObject(e.data || {}),
            })),
          },
        }
      }),
    },
  }
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + builder.build(doc)
}

/** Per node-type schema hints so arrays come back as arrays (not strings). */
const NODE_HINTS = {
  class:  { attributes: 'array-of-string', methods: 'array-of-string' },
  entity: { attributes: 'array-of-object' },
}

export function fromXml(xmlString) {
  const parsed = parser.parse(xmlString)
  const root = parsed.diagrammwerk
  if (!root) throw new Error('Not a Diagrammwerk XML document')

  const diagrams = {}
  for (const d of root.diagram || []) {
    const id = d['@_type']
    const nodes = []
    const nodeList = d.nodes?.node || []
    for (const n of nodeList) {
      const type = n['@_type']
      nodes.push({
        id:   n['@_id'],
        type,
        position: { x: Number(n['@_x']) || 0, y: Number(n['@_y']) || 0 },
        data: decodeData(n.data || {}, NODE_HINTS[type] || {}),
      })
    }
    const edges = []
    const edgeList = d.edges?.edge || []
    for (const e of edgeList) {
      edges.push({
        id:           e['@_id'],
        source:       e['@_source'],
        target:       e['@_target'],
        sourceHandle: e['@_sourceHandle'] ?? null,
        targetHandle: e['@_targetHandle'] ?? null,
        type:         'uml',
        data:         decodeData(e.data || {}),
      })
    }
    diagrams[id] = { nodes, edges }
  }
  return { diagrams, activeType: root['@_active'] || 'class' }
}

/** Trigger a browser download of the XML for the current store state. */
export function downloadXml(stateSnapshot, filename = 'diagram.xml') {
  const xml = toXml(stateSnapshot)
  const blob = new Blob([xml], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Open a file picker, read selected file, return parsed payload. */
export function pickAndParseXml() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xml,application/xml,text/xml'
    input.onchange = () => {
      const f = input.files?.[0]
      if (!f) return reject(new Error('No file'))
      const reader = new FileReader()
      reader.onload = () => {
        try { resolve(fromXml(String(reader.result))) }
        catch (err) { reject(err) }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsText(f)
    }
    input.click()
  })
}
