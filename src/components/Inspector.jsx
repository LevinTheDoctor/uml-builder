import { useStore } from '../state/store.js'
import { useT } from '../i18n/I18nProvider.jsx'

/**
 * Right sidebar. Renders an editor for whatever node/edge is currently
 * selected. Stays intentionally generic — diagram-specific inspectors
 * live alongside their node components.
 */
export function Inspector() {
  const t = useT()
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
          {t('inspector.title')}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] mt-1" style={{ color: 'var(--c-fg-subtle)' }}>
          {node ? node.type : edge ? edge.type : t('inspector.noSelectionAria')}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {!node && !edge && (
          <div className="text-sm" style={{ color: 'var(--c-fg-muted)' }}>
            {t('inspector.noSelection')}
            <div className="mt-4 font-mono text-[11px]" style={{ color: 'var(--c-fg-subtle)' }}>
              {t('inspector.diagram')}: {diagramType}
            </div>
          </div>
        )}
        {node && <NodeEditor node={node} update={(p) => updateNodeData(node.id, p)} t={t} />}
        {edge && <EdgeEditor edge={edge} update={(p) => updateEdgeData(edge.id, p)} t={t} />}
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

function NodeEditor({ node, update, t }) {
  const { data, type } = node
  const isList = (k) => Array.isArray(data[k])

  return (
    <div>
      {data.name != null && (
        <Field label={t('inspector.name')}>
          <input className="dw-input w-full" value={data.name} onChange={(e) => update({ name: e.target.value })} />
        </Field>
      )}
      {data.text != null && (
        <Field label={t('inspector.text')}>
          <textarea className="dw-input w-full min-h-[80px]" value={data.text} onChange={(e) => update({ text: e.target.value })} />
        </Field>
      )}
      {data.stereotype != null && (
        <Field label={t('inspector.stereotype')}>
          <input className="dw-input w-full" placeholder="«interface»" value={data.stereotype}
                 onChange={(e) => update({ stereotype: e.target.value })} />
        </Field>
      )}
      {isList('attributes') && type === 'class' && (
        <Field label={t('inspector.attributes')}>
          <textarea
            className="dw-input w-full min-h-[90px] font-mono"
            value={data.attributes.join('\n')}
            onChange={(e) => update({ attributes: e.target.value.split('\n') })}
            placeholder="- name: Type"
          />
        </Field>
      )}
      {isList('methods') && (
        <Field label={t('inspector.methods')}>
          <textarea
            className="dw-input w-full min-h-[90px] font-mono"
            value={data.methods.join('\n')}
            onChange={(e) => update({ methods: e.target.value.split('\n') })}
            placeholder="+ method(): T"
          />
        </Field>
      )}
      {type === 'entity' && isList('attributes') && (
        <Field label={t('inspector.attributesRdm')}>
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
        <Field label={t('inspector.connectorKind')}>
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
  'aggregation', 'composition', 'message', 'asyncMessage', 'relation', 'flow', 'plain',
]

function EdgeEditor({ edge, update, t }) {
  const { data } = edge
  return (
    <div>
      <Field label={t('inspector.edgeKind')}>
        <select className="dw-input w-full" value={data?.kind || 'association'} onChange={(e) => update({ kind: e.target.value })}>
          {EDGE_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </Field>
      <Field label={t('inspector.edgeLabel')}>
        <input className="dw-input w-full" value={data?.label || ''} onChange={(e) => update({ label: e.target.value })} />
      </Field>
      {('sourceCard' in (data || {}) || data?.kind === 'relation') && (
        <>
          <Field label={t('inspector.sourceCard')}>
            <input className="dw-input w-full" value={data?.sourceCard || ''} onChange={(e) => update({ sourceCard: e.target.value })} placeholder="1 / 0..1 / N" />
          </Field>
          <Field label={t('inspector.targetCard')}>
            <input className="dw-input w-full" value={data?.targetCard || ''} onChange={(e) => update({ targetCard: e.target.value })} placeholder="N / 0..*" />
          </Field>
        </>
      )}
    </div>
  )
}
