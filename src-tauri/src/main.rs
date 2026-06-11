// Prevent the extra Windows console window in release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    diagrammwerk_lib::run()
}
