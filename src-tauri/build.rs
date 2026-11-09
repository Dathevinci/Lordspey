fn main() {
    if std::env::var("CARGO_CFG_TARGET_ARCH").unwrap_or_default() != "wasm32" {
        tauri_build::build();
    }
}
