use tauri::Manager;
use std::process::Command;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let app_handle = app.handle();
      tauri::async_runtime::spawn(async move {
        // Ejecuta el backend Node.js al lanzar la app
        let result = Command::new("node")
          .arg("backend/app.js") // ruta relativa desde raíz del proyecto
          .spawn();

        match result {
          Ok(_child) => {
            println!("Servidor backend iniciado correctamente.");
          }
          Err(err) => {
            eprintln!("Error al iniciar el backend: {:?}", err);
          }
        }
      });

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![start_backend])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

// Expone el comando 'start_backend' al frontend
#[tauri::command]
async fn start_backend() {
  println!("start_backend invocado desde el frontend");
}
