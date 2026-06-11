import { TopBar } from './components/TopBar.jsx'
import { Palette } from './palette/Palette.jsx'
import { Canvas } from './components/Canvas.jsx'
import { Inspector } from './components/Inspector.jsx'
import { useStore } from './state/store.js'
import { downloadXml, pickAndParseXml } from './export/xml.js'
import { exportPng } from './export/png.js'

export default function App() {
  const loadAll = useStore((s) => s.loadAll)

  function onExportXml() {
    const { diagrams, diagramType } = useStore.getState()
    downloadXml({ diagrams, diagramType }, `diagrammwerk-${diagramType}.xml`)
  }

  async function onImportXml() {
    try {
      const { diagrams, activeType } = await pickAndParseXml()
      loadAll(diagrams, activeType)
    } catch (err) {
      console.error(err)
      alert('Could not import XML: ' + err.message)
    }
  }

  async function onExportPng() {
    const { diagrams, diagramType } = useStore.getState()
    const { nodes } = diagrams[diagramType]
    try {
      await exportPng({ nodes, filename: `diagrammwerk-${diagramType}.png` })
    } catch (err) {
      console.error(err)
      alert('Could not export PNG: ' + err.message)
    }
  }

  return (
    <div className="h-full w-full flex flex-col">
      <TopBar onExportXml={onExportXml} onImportXml={onImportXml} onExportPng={onExportPng} />
      <div className="flex-1 flex min-h-0">
        <Palette />
        <Canvas />
        <Inspector />
      </div>
    </div>
  )
}
