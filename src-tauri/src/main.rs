use serde_json::Value;
use std::{fs, path::PathBuf};
use tauri::Manager;

fn progress_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.join("progress.json"))
}

#[tauri::command]
fn load_progress(app: tauri::AppHandle) -> Result<Option<Value>, String> {
    let path = progress_path(&app)?;
    if !path.exists() { return Ok(None); }
    let data = fs::read_to_string(path).map_err(|e| e.to_string())?;
    serde_json::from_str(&data).map(Some).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_progress(app: tauri::AppHandle, progress: Value) -> Result<(), String> {
    let path = progress_path(&app)?;
    let temp = path.with_extension("json.tmp");
    let bytes = serde_json::to_vec_pretty(&progress).map_err(|e| e.to_string())?;
    fs::write(&temp, bytes).map_err(|e| e.to_string())?;
    if path.exists() {
        fs::remove_file(&path).map_err(|e| e.to_string())?;
    }
    fs::rename(&temp, &path).map_err(|e| e.to_string())
}

#[tauri::command]
fn check_answer(answer: String, expected: String) -> bool {
    answer.trim().eq_ignore_ascii_case(expected.trim())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_progress, save_progress, check_answer])
        .run(tauri::generate_context!())
        .expect("failed to run Kotori Japanese Studio");
}

fn main() { run(); }
