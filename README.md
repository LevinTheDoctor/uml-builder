# Diagrammwerk

UML & ERM builder. Web app first, packaged as a Tauri desktop app on the
`tauri-app` branch. Built with React + Vite, React Flow for the canvas,
`@levin-the-doctor/simple-tailwind-ui` for some chrome, and a Diagrammwerk
custom XML schema for persistence.

## Diagram families

| Family       | Nodes                              | Edges                                  |
|--------------|------------------------------------|----------------------------------------|
| UML Class    | Class, Note                        | association, inheritance, composition, aggregation, dependency, realization, directed |
| ERM          | Entity (PK-aware attributes), Note | relation with source/target cardinalities |
| UML Use Case | Actor, Use Case, Note              | association, directed, dependency |
| UML Sequence | Lifeline, Note                     | message, asyncMessage |
| Swimlanes    | Lane, Task, Note                   | flow |
| EPK          | Event, Function, Connector (XOR/AND/OR), Note | flow |

Switch families from the topbar tabs — each family keeps its own document, so
flipping between them never loses work.

## Theming

Three base themes — **Light**, **Dark**, **Dracula** — selectable from the
palette menu in the topbar. Every theme token (≈16 colors) is individually
overridable via the color pickers in the same menu; overrides persist in
`localStorage` and stack on top of the base.

## Export / Import

- **XML** (Diagrammwerk v1 schema): round-trippable, hand-edit friendly,
  carries all diagram families in a single file.
- **PNG**: full-diagram snapshot via `html-to-image`, framed by node bounds
  so nothing gets clipped and theme-aware so backgrounds match what's on
  screen.

In the browser, XML save triggers a download and open uses the file picker.
Inside the Tauri shell the same buttons hit a native Save/Open dialog and
write to disk.

## Run (web)

```bash
npm install
npm run dev          # http://localhost:5173
npm run build
```

## Run (Tauri desktop)

The `tauri-app` branch adds the desktop shell. You need the Rust toolchain
(`rustup`) and the Tauri CLI:

```bash
cargo install create-tauri-app --locked
cargo install tauri-cli --version "^2.0" --locked

# Add some PNG/ICO/ICNS icons to src-tauri/icons/ (see Tauri docs)
git checkout tauri-app
npm install
npm run tauri:dev
```

In Tauri mode XML files persist to the path the user chose; the storage layer
is in `src/platform/storage.js`.

## Branches

```
main                      ← released browser-only build
├─ feature/setup          ← Vite + Tailwind + theme provider scaffold
├─ feature/theming        ← theme menu, custom token overrides
├─ feature/app-shell      ← store + topbar + palette + canvas + inspector
├─ feature/class-diagram  ← ClassNode
├─ feature/erm            ← EntityNode
├─ feature/extra-diagrams ← Actor / UseCase / Lifeline / Swimlane / EPK
├─ feature/xml-export     ← XML roundtrip
└─ feature/png-export     ← PNG snapshot

tauri-app                 ← desktop shell, native file persistence
```
