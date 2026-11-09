//! Tauri v2 Native Desktop Application & Command Handlers for Lord Spey.
//!
//! Exposes the pure Rust core engine (`pub mod core`) as asynchronous Tauri IPC
//! commands for native `.spey` vault file I/O, manuscript metrics, wiki-link
//! graph extraction, outline indexing, and version checks.

pub mod core;

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use std::sync::Mutex;
#[cfg(not(target_arch = "wasm32"))]
use tauri::{Manager, State};

/// Payload representing a `.spey` or `.json` project bundle read from disk.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpeyFilePayload {
    pub file_name: String,
    pub file_path: String,
    pub content: String,
}

/// Runtime metadata describing the active Rust backend.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RustRuntimeInfo {
    pub backend: String,
    pub version: String,
    pub arch: String,
    pub os: String,
}

/// Managed Tauri state holding any `.spey` file path passed via OS file association on launch.
pub struct StartupSpeyState {
    pub pending_payload: Mutex<Option<SpeyFilePayload>>,
}

fn load_spey_payload_from_path(raw_path: &str) -> Result<SpeyFilePayload, String> {
    let cleaned = raw_path.trim().trim_matches(|c| c == '"' || c == '\'');
    if cleaned.is_empty() {
        return Err("File path is empty".to_string());
    }
    let path = Path::new(cleaned);
    if !path.exists() {
        return Err(format!("File does not exist: {}", cleaned));
    }
    let content = fs::read_to_string(path)
        .map_err(|e| format!("Failed to read file '{}': {}", cleaned, e))?;
    let file_name = path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("project.spey")
        .to_string();
    let full_path = path
        .canonicalize()
        .unwrap_or_else(|_| path.to_path_buf())
        .to_string_lossy()
        .to_string();

    Ok(SpeyFilePayload {
        file_name,
        file_path: full_path,
        content,
    })
}

#[cfg_attr(not(target_arch = "wasm32"), tauri::command)]
pub fn rust_runtime_info() -> RustRuntimeInfo {
    RustRuntimeInfo {
        backend: "tauri-rust-v2".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        arch: std::env::consts::ARCH.to_string(),
        os: std::env::consts::OS.to_string(),
    }
}

#[cfg_attr(not(target_arch = "wasm32"), tauri::command)]
pub fn rust_compute_metrics(text: String) -> core::ManuscriptMetrics {
    core::compute_manuscript_metrics(&text)
}

#[cfg_attr(not(target_arch = "wasm32"), tauri::command)]
pub fn rust_extract_wiki_links(markdown: String) -> Vec<core::WikiLink> {
    core::extract_wiki_links(&markdown)
}

#[cfg_attr(not(target_arch = "wasm32"), tauri::command)]
pub fn rust_extract_outline(markdown: String) -> Vec<core::HeadingEntry> {
    core::extract_outline(&markdown)
}

#[cfg_attr(not(target_arch = "wasm32"), tauri::command)]
pub fn rust_render_markdown(markdown: String) -> String {
    core::render_markdown(&markdown)
}

#[cfg_attr(not(target_arch = "wasm32"), tauri::command)]
pub fn rust_validate_spey_package(json_str: String) -> Result<core::SpeyValidationResult, String> {
    core::validate_spey_package(&json_str)
}

#[cfg_attr(not(target_arch = "wasm32"), tauri::command)]
pub fn rust_read_spey_file(path: String) -> Result<SpeyFilePayload, String> {
    load_spey_payload_from_path(&path)
}

#[cfg_attr(not(target_arch = "wasm32"), tauri::command)]
pub fn rust_write_spey_file(path: String, content: String) -> Result<bool, String> {
    let cleaned = path.trim().trim_matches(|c| c == '"' || c == '\'');
    if cleaned.is_empty() {
        return Err("Target file path cannot be empty".to_string());
    }
    // Validate JSON integrity before writing .spey bundle to disk
    let _ = core::validate_spey_package(&content)?;
    fs::write(cleaned, content.as_bytes())
        .map_err(|e| format!("Failed to write .spey file '{}': {}", cleaned, e))?;
    Ok(true)
}

#[cfg(not(target_arch = "wasm32"))]
#[tauri::command]
pub fn rust_get_startup_spey(state: State<'_, StartupSpeyState>) -> Option<SpeyFilePayload> {
    if let Ok(mut guard) = state.pending_payload.lock() {
        guard.take()
    } else {
        None
    }
}

#[cfg_attr(not(target_arch = "wasm32"), tauri::command)]
pub fn rust_compare_versions(v1: String, v2: String) -> i32 {
    core::compare_semver(&v1, &v2)
}

#[cfg(not(target_arch = "wasm32"))]
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let cli_args: Vec<String> = std::env::args().skip(1).collect();
    let initial_payload = core::find_spey_arg(&cli_args)
        .and_then(|path| load_spey_payload_from_path(&path).ok());

    tauri::Builder::default()
        .manage(StartupSpeyState {
            pending_payload: Mutex::new(initial_payload),
        })
        .setup(|app| {
            // If a .spey file was passed via OS file association, also inject it into the main window if ready
            if let Some(main_win) = app.get_webview_window("main") {
                let state = app.state::<StartupSpeyState>();
                if let Ok(guard) = state.pending_payload.lock() {
                    if let Some(ref payload) = *guard {
                        if let Ok(raw_json) = serde_json::to_string(payload) {
                            let safe_json = raw_json
                                .replace('\u{2028}', "\\u2028")
                                .replace('\u{2029}', "\\u2029");
                            let js_code = format!(
                                "if (window.__handleOpenedSpeyFile) {{ window.__handleOpenedSpeyFile({}); }} else {{ window.__PENDING_SPEY_PAYLOAD__ = {}; }}",
                                safe_json, safe_json
                            );
                            let _ = main_win.eval(&js_code);
                        }
                    }
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            rust_runtime_info,
            rust_compute_metrics,
            rust_extract_wiki_links,
            rust_extract_outline,
            rust_render_markdown,
            rust_validate_spey_package,
            rust_read_spey_file,
            rust_write_spey_file,
            rust_get_startup_spey,
            rust_compare_versions
        ])
        .run(tauri::generate_context!())
        .expect("error while running Lord Spey Tauri application");
}

