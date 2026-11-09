// Prevents an additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    #[cfg(not(target_arch = "wasm32"))]
    lord_spey_lib::run();
}
