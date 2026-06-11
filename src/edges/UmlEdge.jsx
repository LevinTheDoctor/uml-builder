import { BaseEdge, EdgeLabelRenderer, getBezierPath, getSmoothStepPath } from '@xyflow/react'

/**
 * Diagrammwerk edge renderer.
 *
 * Edge appearance is driven by `data.kind` so the same component can render
 * UML class associations, ERM relations, sequence messages, EPK flow, etc.
 * Arrowheads and special markers (open triangle for inheritance, diamond for
 * composition, ...) are injected as inline SVG markers tied to a unique id —
 * inline markers avoid a global <defs> dependency that React Flow's built-in
 * markers would otherwise impose.
 */

const MARKERS = {
  none:          { width: 0, paint: () => null },
  arrow:         {
    width: 14,
    paint: (id) => (
      <marker id={id} viewBox="0 0 12 12" markerWidth="12" markerHeight="12" refX="11" refY="6" orient="auto">
        <path d="M0,0 L12,6 L0,12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </marker>
    ),
  },
  arrowFilled:   {
    width: 14,
    paint: (id) => (
      <marker id={id} viewBox="0 0 12 12" markerWidth="12" markerHeight="12" refX="11" refY="6" orient="auto">
        <path d="M0,0 L12,6 L0,12 Z" fill="currentColor" />
      </marker>
    ),
  },
  triangle:      {
    width: 18,
    paint: (id) => (
      <marker id={id} viewBox="0 0 14 14" markerWidth="14" markerHeight="14" refX="13" refY="7" orient="auto">
        <path d="M0,0 L14,7 L0,14 Z" fill="var(--c-node-bg)" stroke="currentColor" strokeWidth="1.5" />
      </marker>
    ),
  },
  diamondOpen:   {
    width: 18,
    paint: (id) => (
      <marker id={id} viewBox="0 0 18 12" markerWidth="18" markerHeight="12" refX="17" refY="6" orient="auto">
        <path d="M0,6 L9,0 L18,6 L9,12 Z" fill="var(--c-node-bg)" stroke="currentColor" strokeWidth="1.5" />
      </marker>
    ),
  },
  diamondFilled: {
    width: 18,
    paint: (id) => (
      <marker id={id} viewBox="0 0 18 12" markerWidth="18" markerHeight="12" refX="17" refY="6" orient="auto">
        <path d="M0,6 L9,0 L18,6 L9,12 Z" fill="currentColor" />
      </marker>
    ),
  },
  crowsfootMany: {
    width: 18,
    paint: (id) => (
      <marker id={id} viewBox="0 0 14 14" markerWidth="14" markerHeight="14" refX="13" refY="7" orient="auto">
        <path d="M14,7 L0,0 M14,7 L0,7 M14,7 L0,14" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </marker>
    ),
  },
  crowsfootOne:  {
    width: 14,
    paint: (id) => (
      <marker id={id} viewBox="0 0 14 14" markerWidth="14" markerHeight="14" refX="13" refY="7" orient="auto">
        <line x1="11" y1="0" x2="11" y2="14" stroke="currentColor" strokeWidth="1.4" />
      </marker>
    ),
  },
}

/** Map edge kind -> { startMarker, endMarker, dashed }. */
function styleFor(kind) {
  switch (kind) {
    case 'association':  return { end: 'none',          dashed: false }
    case 'directed':     return { end: 'arrow',         dashed: false }
    case 'inheritance':  return { end: 'triangle',      dashed: false }
    case 'realization':  return { end: 'triangle',      dashed: true  }
    case 'dependency':   return { end: 'arrow',         dashed: true  }
    case 'aggregation':  return { start: 'diamondOpen', end: 'none',  dashed: false }
    case 'composition':  return { start: 'diamondFilled', end: 'none',dashed: false }
    case 'message':      return { end: 'arrowFilled',   dashed: false }
    case 'asyncMessage': return { end: 'arrow',         dashed: true  }
    case 'relation':     return { end: 'none',          dashed: false } // ERM uses cardinality labels
    case 'flow':         return { end: 'arrow',         dashed: false }
    default:             return { end: 'none',          dashed: false }
  }
}

export function UmlEdge(props) {
  const {
    id, sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    data = {}, selected,
  } = props

  const kind = data.kind || 'association'
  const sty  = styleFor(kind)
  const useSmooth = kind === 'message' || kind === 'asyncMessage' || kind === 'flow'

  const [path, labelX, labelY] = useSmooth
    ? getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, borderRadius: 8 })
    : getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })

  const startId = `m-start-${id}`
  const endId   = `m-end-${id}`
  const startMarker = sty.start && sty.start !== 'none' ? MARKERS[sty.start] : null
  const endMarker   = sty.end   && sty.end   !== 'none' ? MARKERS[sty.end]   : null

  return (
    <g style={{ color: selected ? 'var(--c-accent)' : 'var(--c-edge)' }}>
      <defs>
        {startMarker?.paint(startId)}
        {endMarker?.paint(endId)}
      </defs>
      <BaseEdge
        path={path}
        markerStart={startMarker ? `url(#${startId})` : undefined}
        markerEnd={endMarker ? `url(#${endId})` : undefined}
        style={{
          stroke: 'currentColor',
          strokeDasharray: sty.dashed ? '6 4' : undefined,
        }}
      />
      {(data.label || data.sourceCard || data.targetCard) && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
          >
            <div
              className="font-mono text-[10px] px-1.5 py-0.5 rounded"
              style={{
                background: 'var(--c-bg-elev)',
                color: 'var(--c-fg)',
                border: '1px solid var(--c-border)',
              }}
            >
              {data.sourceCard && <span style={{ color: 'var(--c-fg-muted)' }}>{data.sourceCard}&nbsp;·&nbsp;</span>}
              {data.label}
              {data.targetCard && <span style={{ color: 'var(--c-fg-muted)' }}>&nbsp;·&nbsp;{data.targetCard}</span>}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </g>
  )
}

export const edgeTypes = { uml: UmlEdge }
