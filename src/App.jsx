import { ThemeMenu } from './themes/ThemeMenu.jsx'

export default function App() {
  return (
    <div className="h-full w-full flex flex-col">
      <header
        className="flex items-center justify-between px-6 py-3"
        style={{ borderBottom: '1px solid var(--c-border)', background: 'var(--c-bg-elev)' }}
      >
        <div className="flex items-baseline gap-3">
          <span className="font-display italic text-2xl leading-none" style={{ color: 'var(--c-fg)' }}>
            Diagrammwerk
          </span>
          <span className="font-mono uppercase text-[10px] tracking-[0.22em]" style={{ color: 'var(--c-fg-subtle)' }}>
            theming preview
          </span>
        </div>
        <ThemeMenu />
      </header>
      <main className="flex-1 flex items-center justify-center" style={{ background: 'var(--c-bg-canvas)' }}>
        <div className="dw-panel rounded-lg px-8 py-10 max-w-md text-center">
          <div className="font-display italic text-3xl leading-none" style={{ color: 'var(--c-fg)' }}>
            Color forge
          </div>
          <p className="mt-3 text-sm" style={{ color: 'var(--c-fg-muted)' }}>
            Pick a base — Light, Dark or Dracula — then tune any token in the menu above.
            Your overrides persist across reloads.
          </p>
          <div className="mt-6 grid grid-cols-4 gap-1.5">
            {['c-accent', 'c-bg', 'c-bg-elev', 'c-fg', 'c-node-bg', 'c-node-border', 'c-edge', 'c-border'].map((t) => (
              <div key={t} className="h-10 rounded-md" style={{ background: `var(--${t})`, border: '1px solid var(--c-border)' }} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
