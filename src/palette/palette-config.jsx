/**
 * What appears in the left palette per diagram type.
 *
 * Each entry: { kind, label, blurb, glyph }
 *   - `kind` matches a React Flow nodeTypes key
 *   - `glyph` is a small inline SVG that hints at the visual on the canvas
 */

const SwG = (children) => (props) => (
  <svg viewBox="0 0 32 32" width={28} height={28} {...props}>{children}</svg>
)

const GlyphClass = SwG(<>
  <rect x="4" y="6" width="24" height="20" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
  <line x1="4" y1="12" x2="28" y2="12" stroke="currentColor" strokeWidth="1.2"/>
  <line x1="4" y1="19" x2="28" y2="19" stroke="currentColor" strokeWidth="1.2"/>
</>)
const GlyphEntity = SwG(<>
  <rect x="4" y="8" width="24" height="16" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
  <line x1="4" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1.2"/>
  <circle cx="8.5" cy="19" r="1.2" fill="currentColor"/>
</>)
const GlyphActor = SwG(<>
  <circle cx="16" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.2"/>
  <line x1="16" y1="11" x2="16" y2="22" stroke="currentColor" strokeWidth="1.2"/>
  <line x1="10" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="1.2"/>
  <line x1="16" y1="22" x2="12" y2="28" stroke="currentColor" strokeWidth="1.2"/>
  <line x1="16" y1="22" x2="20" y2="28" stroke="currentColor" strokeWidth="1.2"/>
</>)
const GlyphUseCase = SwG(<ellipse cx="16" cy="16" rx="12" ry="7" fill="none" stroke="currentColor" strokeWidth="1.2"/>)
const GlyphLifeline = SwG(<>
  <rect x="9" y="5" width="14" height="6" fill="none" stroke="currentColor" strokeWidth="1.2"/>
  <line x1="16" y1="11" x2="16" y2="28" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1.2"/>
</>)
const GlyphSwimlane = SwG(<>
  <rect x="3" y="6" width="26" height="20" fill="none" stroke="currentColor" strokeWidth="1.2"/>
  <line x1="3" y1="16" x2="29" y2="16" stroke="currentColor" strokeWidth="1.2"/>
  <line x1="11" y1="6" x2="11" y2="26" stroke="currentColor" strokeWidth="1.2"/>
</>)
const GlyphEpkEvent = SwG(<polygon points="4,16 16,6 28,16 16,26" fill="none" stroke="currentColor" strokeWidth="1.2"/>)
const GlyphEpkFunction = SwG(<rect x="4" y="9" width="24" height="14" rx="6" fill="none" stroke="currentColor" strokeWidth="1.2"/>)
const GlyphEpkConnector = SwG(<>
  <circle cx="16" cy="16" r="7" fill="none" stroke="currentColor" strokeWidth="1.2"/>
  <line x1="11.5" y1="11.5" x2="20.5" y2="20.5" stroke="currentColor" strokeWidth="1.2"/>
  <line x1="20.5" y1="11.5" x2="11.5" y2="20.5" stroke="currentColor" strokeWidth="1.2"/>
</>)
const GlyphNote = SwG(<>
  <polygon points="6,6 22,6 26,10 26,26 6,26" fill="none" stroke="currentColor" strokeWidth="1.2"/>
  <polyline points="22,6 22,10 26,10" fill="none" stroke="currentColor" strokeWidth="1.2"/>
</>)

export const PALETTE = {
  class: [
    { kind: 'class', label: 'Class',     blurb: 'Attributes + methods',     glyph: GlyphClass },
    { kind: 'note',  label: 'Note',      blurb: 'Free-text annotation',     glyph: GlyphNote },
  ],
  erm: [
    { kind: 'entity', label: 'Entity',   blurb: 'Table with attributes',    glyph: GlyphEntity },
    { kind: 'note',   label: 'Note',     blurb: 'Free-text annotation',     glyph: GlyphNote },
  ],
  usecase: [
    { kind: 'actor',   label: 'Actor',   blurb: 'External role',            glyph: GlyphActor },
    { kind: 'usecase', label: 'Use Case',blurb: 'Capability ellipse',       glyph: GlyphUseCase },
    { kind: 'note',    label: 'Note',    blurb: 'Free-text annotation',     glyph: GlyphNote },
  ],
  sequence: [
    { kind: 'lifeline', label: 'Lifeline', blurb: 'Object on the timeline', glyph: GlyphLifeline },
    { kind: 'note',     label: 'Note',     blurb: 'Free-text annotation',   glyph: GlyphNote },
  ],
  swimlane: [
    { kind: 'swimlane', label: 'Lane',  blurb: 'Horizontal lane',           glyph: GlyphSwimlane },
    { kind: 'epk-function', label: 'Task', blurb: 'A task inside a lane',   glyph: GlyphEpkFunction },
    { kind: 'note',     label: 'Note',  blurb: 'Free-text annotation',      glyph: GlyphNote },
  ],
  epk: [
    { kind: 'epk-event',     label: 'Event',     blurb: 'Hexagon',          glyph: GlyphEpkEvent },
    { kind: 'epk-function',  label: 'Function',  blurb: 'Rounded rectangle',glyph: GlyphEpkFunction },
    { kind: 'epk-connector', label: 'Connector', blurb: 'XOR / AND / OR',   glyph: GlyphEpkConnector },
    { kind: 'note',          label: 'Note',      blurb: 'Free-text',        glyph: GlyphNote },
  ],
}
