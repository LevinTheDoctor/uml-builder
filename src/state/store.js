import { create } from 'zustand'
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react'

/**
 * Diagrammwerk model.
 *
 * We keep ONE working document keyed by diagram type so users can switch
 * between (say) the class view and an ERM view without losing work. XML
 * export/import operates on the currently active diagram.
 */

export const DIAGRAM_TYPES = [
  { id: 'class',    label: 'UML Class',     hint: 'classes, inheritance, associations' },
  { id: 'erm',      label: 'ERM',           hint: 'entities, attributes, relations' },
  { id: 'usecase',  label: 'UML Use Case',  hint: 'actors, use cases, system boundary' },
  { id: 'sequence', label: 'UML Sequence',  hint: 'lifelines, messages' },
  { id: 'swimlane', label: 'Swimlanes',     hint: 'lanes, tasks' },
  { id: 'epk',      label: 'EPK',           hint: 'events, functions, connectors' },
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
      return { name: 'NewClass', stereotype: '', attributes: ['- attr: Type'], methods: ['+ method(): void'] }
    case 'entity':
      return { name: 'NewEntity', attributes: [{ name: 'id', type: 'INT', pk: true }] }
    case 'actor':
      return { name: 'Actor' }
    case 'usecase':
      return { name: 'Use Case' }
    case 'lifeline':
      return { name: 'Lifeline' }
    case 'swimlane':
      return { name: 'Lane', orientation: 'horizontal' }
    case 'epk-event':
      return { name: 'Event occurred' }
    case 'epk-function':
      return { name: 'Function' }
    case 'epk-connector':
      return { name: 'XOR', kind: 'xor' }
    case 'note':
      return { text: 'Note' }
    default:
      return {}
  }
}

function defaultEdgeData(diagramType) {
  switch (diagramType) {
    case 'class':    return { kind: 'association', label: '' }
    case 'erm':      return { kind: 'relation',    label: '', sourceCard: '1', targetCard: 'N' }
    case 'usecase':  return { kind: 'association', label: '' }
    case 'sequence': return { kind: 'message',     label: 'msg()' }
    case 'swimlane': return { kind: 'flow',        label: '' }
    case 'epk':      return { kind: 'flow',        label: '' }
    default:         return { kind: 'plain', label: '' }
  }
}
