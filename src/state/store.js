import { create } from 'zustand'
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react'
import { tStandalone as t } from '../i18n/I18nProvider.jsx'

/**
 * Diagrammwerk model.
 *
 * We keep ONE working document keyed by diagram type so users can switch
 * between (say) the class view and an ERM view without losing work. XML
 * export/import operates on the currently active diagram.
 *
 * DIAGRAM_TYPES carries i18n keys, not strings — UI components resolve
 * them via useT() at render time so language switches re-render labels.
 */

export const DIAGRAM_TYPES = [
  { id: 'class',    labelKey: 'diagram.class',    hintKey: 'diagram.class.hint' },
  { id: 'erm',      labelKey: 'diagram.erm',      hintKey: 'diagram.erm.hint' },
  { id: 'rdm',      labelKey: 'diagram.rdm',      hintKey: 'diagram.rdm.hint' },
  { id: 'usecase',  labelKey: 'diagram.usecase',  hintKey: 'diagram.usecase.hint' },
  { id: 'sequence', labelKey: 'diagram.sequence', hintKey: 'diagram.sequence.hint' },
  { id: 'swimlane', labelKey: 'diagram.swimlane', hintKey: 'diagram.swimlane.hint' },
  { id: 'epk',      labelKey: 'diagram.epk',      hintKey: 'diagram.epk.hint' },
]

const emptyDoc = () => ({ nodes: [], edges: [] })

let _id = 0
export const newId = (prefix = 'n') => `${prefix}_${Date.now().toString(36)}_${(_id++).toString(36)}`

export const useStore = create((set, get) => ({
  diagramType: 'class',
  diagrams: Object.fromEntries(DIAGRAM_TYPES.map((d) => [d.id, emptyDoc()])),
  selectedId: null,

  /** Currently active document (read-only convenience). */
  current: () => get().diagrams[get().diagramType],

  setDiagramType: (id) => set({ diagramType: id, selectedId: null }),

  onNodesChange: (changes) =>
    set((s) => {
      const cur = s.diagrams[s.diagramType]
      return {
        diagrams: { ...s.diagrams, [s.diagramType]: { ...cur, nodes: applyNodeChanges(changes, cur.nodes) } },
      }
    }),

  onEdgesChange: (changes) =>
    set((s) => {
      const cur = s.diagrams[s.diagramType]
      return {
        diagrams: { ...s.diagrams, [s.diagramType]: { ...cur, edges: applyEdgeChanges(changes, cur.edges) } },
      }
    }),

  onConnect: (params) =>
    set((s) => {
      const cur = s.diagrams[s.diagramType]
      const edge = {
        ...params,
        id: newId('e'),
        type: 'uml',
        data: defaultEdgeData(s.diagramType),
      }
      return {
        diagrams: { ...s.diagrams, [s.diagramType]: { ...cur, edges: addEdge(edge, cur.edges) } },
      }
    }),

  addNode: (kind, position, data = {}) =>
    set((s) => {
      const cur = s.diagrams[s.diagramType]
      const node = {
        id: newId('n'),
        type: kind,
        position,
        data: { ...defaultNodeData(kind), ...data },
      }
      return {
        diagrams: { ...s.diagrams, [s.diagramType]: { ...cur, nodes: [...cur.nodes, node] } },
        selectedId: node.id,
      }
    }),

  updateNodeData: (id, patch) =>
    set((s) => {
      const cur = s.diagrams[s.diagramType]
      return {
        diagrams: {
          ...s.diagrams,
          [s.diagramType]: {
            ...cur,
            nodes: cur.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)),
          },
        },
      }
    }),

  updateEdgeData: (id, patch) =>
    set((s) => {
      const cur = s.diagrams[s.diagramType]
      return {
        diagrams: {
          ...s.diagrams,
          [s.diagramType]: {
            ...cur,
            edges: cur.edges.map((e) => (e.id === id ? { ...e, data: { ...e.data, ...patch } } : e)),
          },
        },
      }
    }),

  setSelected: (id) => set({ selectedId: id }),

  deleteSelected: () =>
    set((s) => {
      const cur = s.diagrams[s.diagramType]
      const id = s.selectedId
      if (!id) return {}
      return {
        diagrams: {
          ...s.diagrams,
          [s.diagramType]: {
            nodes: cur.nodes.filter((n) => n.id !== id),
            edges: cur.edges.filter((e) => e.source !== id && e.target !== id && e.id !== id),
          },
        },
        selectedId: null,
      }
    }),

  /** Replace the active document wholesale — used by XML import. */
  loadDocument: (doc) =>
    set((s) => ({
      diagrams: { ...s.diagrams, [s.diagramType]: { nodes: doc.nodes || [], edges: doc.edges || [] } },
      selectedId: null,
    })),

  /** Replace all documents (full multi-diagram import). */
  loadAll: (docs, activeType) =>
    set(() => ({
      diagrams: { ...Object.fromEntries(DIAGRAM_TYPES.map((d) => [d.id, emptyDoc()])), ...docs },
      diagramType: activeType || 'class',
      selectedId: null,
    })),
}))

function defaultNodeData(kind) {
  switch (kind) {
    case 'class':
      return { name: t('default.class'), stereotype: '', attributes: ['- attr: Type'], methods: ['+ method(): void'] }
    case 'entity':
      // RDM table
      return { name: t('default.rdm'), attributes: [{ name: 'id', type: 'INT', pk: true }] }
    case 'erm-entity':
      return { name: t('default.entity') }
    case 'erm-relationship':
      return { name: t('default.relationship') }
    case 'erm-attribute':
      return { name: t('default.attribute'), key: false }
    case 'actor':
      return { name: t('default.actor') }
    case 'usecase':
      return { name: t('default.usecase') }
    case 'lifeline':
      return { name: t('default.lifeline') }
    case 'swimlane':
      return { name: t('default.lane'), orientation: 'horizontal' }
    case 'epk-event':
      return { name: t('default.event') }
    case 'epk-function':
      return { name: t('default.function') }
    case 'epk-connector':
      return { name: 'XOR', kind: 'xor' }
    case 'note':
      return { text: t('default.note') }
    default:
      return {}
  }
}

function defaultEdgeData(diagramType) {
  switch (diagramType) {
    case 'class':    return { kind: 'association', label: '' }
    // Chen ERM: plain undirected line, cardinality labels sit near each end.
    case 'erm':      return { kind: 'plain',       label: '', sourceCard: '', targetCard: '' }
    case 'rdm':      return { kind: 'relation',    label: '', sourceCard: '1', targetCard: 'N' }
    case 'usecase':  return { kind: 'association', label: '' }
    case 'sequence': return { kind: 'message',     label: 'msg()' }
    case 'swimlane': return { kind: 'flow',        label: '' }
    case 'epk':      return { kind: 'flow',        label: '' }
    default:         return { kind: 'plain', label: '' }
  }
}
