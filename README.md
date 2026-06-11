# Diagrammwerk

UML, ERM and process-modelling builder. Same source builds both the web app
and a Tauri desktop shell. React + Vite, React Flow for the canvas,
`@levin-the-doctor/simple-tailwind-ui` for chrome, and a Diagrammwerk custom
XML schema for persistence.

## Diagram families

| Family       | Nodes                              | Edges                                  |
|--------------|------------------------------------|----------------------------------------|
| UML Class    | Class, Note                        | association, inheritance, composition, aggregation, dependency, realization, directed |
| ERM (Chen)   | Entitätstyp, Beziehungstyp, Attribut (Schlüssel-Option), Note | plain undirected with per-endpoint cardinality labels |
| RDM          | Table (PK-aware columns), Note     | relation with source/target cardinalities |
| UML Use Case | Actor, Use Case, Note              | association, directed, dependency |
| UML Sequence | Lifeline, Note                     | message, asyncMessage |
| Swimlanes    | Lane, Task, Note                   | flow |
| EPK          | Event, Function, Connector (XOR/AND/OR), Note | flow |

Switch families from the topbar tabs — each family keeps its own document, so
flipping between them never loses work.

## Settings

A single **Settings** modal in the topbar holds both preferences:

- **Language** — auto-detected from the browser on first load (DE / EN),
  overridable in the modal, persists in `localStorage`.
- **Appearance** — three base themes (Light, Dark, Dracula) and an inline
  customizer for each of the ~16 design tokens. Overrides stack on top of
  the base and persist in `localStorage`.

## Export / Import

- **XML** (Diagrammwerk v1 schema): round-trippable, hand-edit friendly,
  carries all diagram families in a single file.
- **PNG**: full-diagram snapshot via `html-to-image`, framed by node bounds
  so nothing gets clipped and theme-aware so the background matches what's
  on screen.

In the browser, XML save triggers a download and open uses the file picker.
Inside the Tauri shell the same buttons hit a native Save/Open dialog and
write to disk through `src/platform/storage.js`.

## Run (web)

```bash
npm install
npm run dev          # http://localhost:5173
npm run build
npm run preview      # preview the production build
```

## Run (Tauri desktop)

Same source tree — the `src-tauri/` folder is just ignored by Vite. You need
Rust (via `rustup` or Homebrew) installed locally; the Tauri CLI ships as a
devDep so `npx tauri …` works out of the box.

```bash
npm install
npm run tauri:icon   # one-off: regenerates src-tauri/icons/ from app-icon.svg
npm run tauri:dev    # first cargo build pulls deps and takes a few minutes
npm run tauri:build  # produces installers in src-tauri/target/release/bundle/
```

XML files saved from the desktop shell persist to whatever path the user
picked — no download dance.

## Deploy (Cloudflare Pages)

The build output (`dist/`) is fully static; no edge runtime needed.

**Option A — Wrangler CLI (one-off deploy from local machine):**

```bash
npm install -g wrangler        # or: npx wrangler …
wrangler login
npm run build
npm run deploy:cloudflare      # wrangler pages deploy dist --project-name=diagrammwerk
```

**Option B — Git integration (auto-deploy on push):**

In the Cloudflare Pages dashboard, connect this repo and configure:

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node version: 20 or newer (env var `NODE_VERSION=20`)

`public/_redirects` handles SPA-style routing (everything serves `index.html`
with a 200, so future client-side routes won't 404 on hard reload).
`public/_headers` long-caches the fingerprinted `assets/*` bundles and adds
basic security headers.

## Branches

```
main                       ← stable, web + Tauri build from one source
├─ feature/setup           ← Vite + Tailwind + theme provider scaffold
├─ feature/theming         ← theme tokens, custom overrides
├─ feature/app-shell       ← store + topbar + palette + canvas + inspector
├─ feature/class-diagram   ← ClassNode
├─ feature/erm             ← (old) RDM table-style entity
├─ feature/extra-diagrams  ← Actor / UseCase / Lifeline / Swimlane / EPK
├─ feature/xml-export      ← XML roundtrip
├─ feature/png-export      ← PNG snapshot
├─ feature/i18n            ← DE + EN with auto-detect
├─ feature/chen-erm        ← Chen-notation ERM + RDM split
├─ feature/settings-modal  ← Settings modal (Language + Theme)
├─ feature/tauri-runnable  ← @tauri-apps/cli devDep + generated icon set
└─ feature/cloudflare-pages← _redirects, _headers, wrangler.toml, deploy script

tauri-app                  ← anchor; superseded by main (kept for history)
```
