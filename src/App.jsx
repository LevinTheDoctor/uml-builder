import { TopBar } from './components/TopBar.jsx'
import { Palette } from './palette/Palette.jsx'
import { Canvas } from './components/Canvas.jsx'
import { Inspector } from './components/Inspector.jsx'

export default function App() {
  // Export/import wiring lives on its own branch — pass no-ops for now so the
  // UI is fully laid out and clickable from day one.
  const todo = (label) => () => alert(`${label} — wired up on its own branch`)

  return (
    <div className="h-full w-full flex flex-col">
      <TopBar
        onExportXml={todo('Export XML')}
        onImportXml={todo('Import XML')}
        onExportPng={todo('Export PNG')}
      />
      <div className="flex-1 flex min-h-0">
        <Palette />
        <Canvas />
        <Inspector />
      </div>
    </div>
  )
}
