import { TopBar } from './components/TopBar.jsx'
import { Palette } from './palette/Palette.jsx'
import { Canvas } from './components/Canvas.jsx'
import { Inspector } from './components/Inspector.jsx'
import { useStore } from './state/store.js'
import { toXml, fromXml } from './export/xml.js'
import { exportPng } from './export/png.js'
import { saveXmlToFile, openXmlFromFile } from './platform/storage.js'
import { useT } from './i18n/I18nProvider.jsx'

export default function App() {
  const t = useT()
  const loadAll = useStore((s) => s.loadAll)

  async function onExportXml() {
    const { diagrams, diagramType } = useStore.getState()
    const xml = toXml({ diagrams, diagramType })
    try {
      await saveXmlToFile(xml, `diagrammwerk-${diagramType}.xml`)
    } catch (err) {
      console.error(err)
      alert(`${t('error.save')} ${err.message}`)
    }
  }

  async function onImportXml() {
    try {
      const result = await openXmlFromFile()
      if (!result) return
      const { diagrams, activeType } = fromXml(result.content)
      loadAll(diagrams, activeType)
    } catch (err) {
      console.error(err)
      alert(`${t('error.import')} ${err.message}`)
    }
  }

  async function onExportPng() {
    const { diagrams, diagramType } = useStore.getState()
    const { nodes } = diagrams[diagramType]
    try {
      await exportPng({ nodes, filename: `diagrammwerk-${diagramType}.png` })
    } catch (err) {
      console.error(err)
      alert(`${t('error.png')} ${err.message}`)
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
