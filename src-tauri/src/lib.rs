// Diagrammwerk Tauri shell.
//
// The frontend lives in `../dist` (built by Vite). We register the `fs` and
// `dialog` plugins so the React side can call Save/Open dialogs and persist
// XML files to disk through the platform abstraction in
// `src/platform/storage.js`.

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
