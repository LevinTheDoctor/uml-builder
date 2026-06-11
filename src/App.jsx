import { TopBar } from './components/TopBar.jsx'
import { Palette } from './palette/Palette.jsx'
import { Canvas } from './components/Canvas.jsx'
import { Inspector } from './components/Inspector.jsx'
import { useStore } from './state/store.js'
import { downloadXml, pickAndParseXml } from './export/xml.js'

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

  function onExportPng() {
    alert('PNG export — wired up on its own branch')
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
