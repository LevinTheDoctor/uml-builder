import { useStore } from '../state/store.js'

/**
 * Right sidebar. Renders an editor for whatever node is currently selected.
 * Stays intentionally generic — diagram-specific inspectors live alongside
 * their node components.
 */
export function Inspector() {
  const selectedId = useStore((s) => s.selectedId)
  const diagramType = useStore((s) => s.diagramType)
  const node = useStore((s) =>
    s.diagrams[s.diagramType].nodes.find((n) => n.id === selectedId)
  )
  const edge = useStore((s) =>
    selectedId ? s.diagrams[s.diagramType].edges.find((e) => e.id === selectedId) : null
  )
  const updateNodeData = useStore((s) => s.updateNodeData)
  const updateEdgeData = useStore((s) => s.updateEdgeData)

  return (
    <aside
      className="h-full w-[300px] shrink-0 flex flex-col"
      style={{ borderLeft: '1px solid var(--c-border)', background: 'var(--c-bg-elev)' }}
    >
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--c-border)' }}>
        <div className="font-display italic text-lg leading-none" style={{ color: 'var(--c-fg)' }}>
          Inspector
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] mt-1" style={{ color: 'var(--c-fg-subtle)' }}>
          {node ? node.type : edge ? edge.type : 'no selection'}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {!node && !edge && (
          <div className="text-sm" style={{ color: 'var(--c-fg-muted)' }}>
            Select a node or edge to edit its properties. Drag from the palette to add new elements.
            <div className="mt-4 font-mono text-[11px]" style={{ color: 'var(--c-fg-subtle)' }}>
              diagram: {diagramType}
            </div>
          </div>
        )}
        {node && <NodeEditor node={node} update={(p) => updateNodeData(node.id, p)} />}
        {edge && <EdgeEditor edge={edge} update={(p) => updateEdgeData(edge.id, p)} />}
      </div>
    </aside>
  )
}

function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] mb-1" style={{ color: 'var(--c-fg-subtle)' }}>
        {label}
      </div>
      {children}
    </label>
  )
}

function NodeEditor({ node, update }) {
  const { data, type } = node
  const isList = (k) => Array.isArray(data[k])

  // Generic editor — every node has `name` or `text`; arrays become textareas.
  return (
    <div>
      {data.name != null && (
        <Field label="Name">
          <input className="dw-input w-full" value={data.name} onChange={(e) => update({ name: e.target.value })} />
        </Field>
      )}
      {data.text != null && (
        <Field label="Text">
          <textarea className="dw-input w-full min-h-[80px]" value={data.text} onChange={(e) => update({ text: e.target.value })} />
        </Field>
      )}
      {data.stereotype != null && (
        <Field label="Stereotype">
          <input className="dw-input w-full" placeholder="«interface»" value={data.stereotype}
                 onChange={(e) => update({ stereotype: e.target.value })} />
        </Field>
      )}
      {isList('attributes') && type === 'class' && (
        <Field label="Attributes">
          <textarea
            className="dw-input w-full min-h-[90px] font-mono"
            value={data.attributes.join('\n')}
            onChange={(e) => update({ attributes: e.target.value.split('\n') })}
            placeholder="- name: Type"
          />
        </Field>
      )}
      {isList('methods') && (
        <Field label="Methods">
          <textarea
            className="dw-input w-full min-h-[90px] font-mono"
            value={data.methods.join('\n')}
            onChange={(e) => update({ methods: e.target.value.split('\n') })}
            placeholder="+ method(): T"
          />
        </Field>
      )}
      {type === 'entity' && isList('attributes') && (
        <Field label="Attributes (name : type, PK with *)">
          <textarea
            className="dw-input w-full min-h-[100px] font-mono"
            value={(data.attributes || []).map((a) => `${a.pk ? '*' : ''}${a.name} : ${a.type || ''}`).join('\n')}
            onChange={(e) => update({
              attributes: e.target.value.split('\n').filter(Boolean).map((line) => {
                const pk = line.startsWith('*')
                const rest = pk ? line.slice(1) : line
                const [name = '', type = ''] = rest.split(':').map((s) => s.trim())
                return { name, type, pk }
              })
            })}
          />
        </Field>
      )}
      {data.kind != null && type === 'epk-connector' && (
        <Field label="Connector kind">
          <select className="dw-input w-full" value={data.kind} onChange={(e) => update({ kind: e.target.value, name: e.target.value.toUpperCase() })}>
            <option value="xor">XOR</option>
            <option value="and">AND</option>
            <option value="or">OR</option>
          </select>
        </Field>
      )}
    </div>
  )
}

const EDGE_KINDS = [
  'association', 'directed', 'inheritance', 'realization', 'dependency',
  'aggregation', 'composition', 'message', 'asyncMessage', 'relation', 'flow',
]

function EdgeEditor({ edge, update }) {
  const { data } = edge
  return (
    <div>
      <Field label="Kind">
        <select className="dw-input w-full" value={data?.kind || 'association'} onChange={(e) => update({ kind: e.target.value })}>
          {EDGE_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </Field>
      <Field label="Label">
        <input className="dw-input w-full" value={data?.label || ''} onChange={(e) => update({ label: e.target.value })} />
      </Field>
      {('sourceCard' in (data || {}) || data?.kind === 'relation') && (
        <>
          <Field label="Source cardinality">
            <input className="dw-input w-full" value={data?.sourceCard || ''} onChange={(e) => update({ sourceCard: e.target.value })} placeholder="1 / 0..1 / N" />
          </Field>
          <Field label="Target cardinality">
            <input className="dw-input w-full" value={data?.targetCard || ''} onChange={(e) => update({ targetCard: e.target.value })} placeholder="N / 0..*" />
          </Field>
        </>
      )}
    </div>
  )
}
