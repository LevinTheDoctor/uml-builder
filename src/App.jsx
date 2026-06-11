import { useTheme } from './themes/ThemeProvider.jsx'

export default function App() {
  const { base, setBase } = useTheme()
  return (
    <div className="h-full w-full flex items-center justify-center flex-col gap-6">
      <h1 className="font-display text-5xl italic tracking-tight" style={{ color: 'var(--c-fg)' }}>
        Diagrammwerk
      </h1>
      <p className="text-sm font-mono" style={{ color: 'var(--c-fg-muted)' }}>
        scaffold ready — current theme: <span style={{ color: 'var(--c-accent)' }}>{base}</span>
      </p>
      <div className="flex gap-2">
        {['light', 'dark', 'dracula'].map((t) => (
          <button key={t} onClick={() => setBase(t)} className="dw-btn font-mono uppercase tracking-wider">
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}
