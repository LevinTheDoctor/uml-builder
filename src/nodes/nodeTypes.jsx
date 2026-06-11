import { Handle, Position } from '@xyflow/react'
import { ClassNode } from './ClassNode.jsx'

/**
 * Stub node renderers — proper visuals per diagram type live in their own
 * files (ClassNode, EntityNode, …). The stub establishes the handle pattern:
 * every node exposes four handles (T/R/B/L) so edges can be drawn from any
 * direction without thinking about source/target conventions.
 */

const HANDLE_POSITIONS = [
  { id: 't', position: Position.Top },
  { id: 'r', position: Position.Right },
  { id: 'b', position: Position.Bottom },
  { id: 'l', position: Position.Left },
]

export function NodeShell({ selected, children, style, className = '' }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: 'var(--c-node-bg)',
        border: `1.5px solid ${selected ? 'var(--c-accent)' : 'var(--c-node-border)'}`,
        borderRadius: 4,
        color: 'var(--c-fg)',
        fontSize: 12,
        minWidth: 140,
        boxShadow: selected ? '0 0 0 3px var(--c-selection)' : 'none',
        ...style,
      }}
    >
      {HANDLE_POSITIONS.map((h) => (
        <Handle key={h.id} id={h.id} type="source" position={h.position} isConnectableStart isConnectableEnd />
      ))}
      {children}
    </div>
  )
}

/** Placeholder used by diagram families whose real node isn't built yet. */
export function PlaceholderNode({ data, selected }) {
  return (
    <NodeShell selected={selected}>
      <div className="px-3 py-2 font-mono text-[11px] uppercase tracking-wider"
           style={{ color: 'var(--c-fg-muted)' }}>
        {data?.kind || 'node'}
      </div>
      <div className="px-3 pb-2 font-display italic text-base leading-none">{data?.name || data?.text || 'Untitled'}</div>
    </NodeShell>
  )
}

export function NoteNode({ data, selected }) {
  return (
    <NodeShell
      selected={selected}
      style={{
        background: 'color-mix(in srgb, var(--c-accent) 12%, var(--c-node-bg))',
        borderColor: 'var(--c-accent)',
      }}
    >
      <div className="px-3 py-2 text-[12px]" style={{ color: 'var(--c-fg)' }}>
        {data?.text || 'Note'}
      </div>
    </NodeShell>
  )
}

// Default registry — each diagram-family branch replaces its own entry.
export const nodeTypes = {
  class:           ClassNode,
  entity:          PlaceholderNode,
  actor:           PlaceholderNode,
  usecase:         PlaceholderNode,
  lifeline:        PlaceholderNode,
  swimlane:        PlaceholderNode,
  'epk-event':     PlaceholderNode,
  'epk-function':  PlaceholderNode,
  'epk-connector': PlaceholderNode,
  note:            NoteNode,
}
