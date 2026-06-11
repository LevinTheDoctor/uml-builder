import { useCallback, useRef } from 'react'
import { ReactFlow, Background, Controls, MiniMap, useReactFlow, ReactFlowProvider, BackgroundVariant } from '@xyflow/react'
import { useStore } from '../state/store.js'
import { nodeTypes } from '../nodes/nodeTypes.jsx'
import { edgeTypes } from '../edges/UmlEdge.jsx'

function CanvasInner() {
  const { current, onNodesChange, onEdgesChange, onConnect, addNode, setSelected, deleteSelected } = useStore()
  const diagramType = useStore((s) => s.diagramType)
  const { nodes, edges } = useStore((s) => s.diagrams[s.diagramType])
  const wrapperRef = useRef(null)
  const rf = useReactFlow()

  const onDrop = useCallback((event) => {
    event.preventDefault()
    const kind = event.dataTransfer.getData('application/x-dw-node')
    if (!kind) return
    const position = rf.screenToFlowPosition({ x: event.clientX, y: event.clientY })
    addNode(kind, position)
  }, [rf, addNode])

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }, [])

  const onSelectionChange = useCallback(({ nodes: sel }) => {
    setSelected(sel[0]?.id ?? null)
  }, [setSelected])

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      deleteSelected()
    }
  }, [deleteSelected])

  return (
    <div
      ref={wrapperRef}
      className="flex-1 relative outline-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onDrop={onDrop}
      onDragOver={onDragOver}
      data-diagram-type={diagramType}
      id="dw-canvas"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        fitView
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: 'uml' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="var(--c-grid)" />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap
          pannable zoomable
          maskColor="var(--xy-minimap-mask-background-color)"
          nodeStrokeColor="var(--c-node-border)"
          nodeColor="var(--c-node-bg)"
          style={{ border: '1px solid var(--c-border)' }}
        />
      </ReactFlow>
    </div>
  )
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  )
}
