import './styles.css';
import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { invoke } from '@tauri-apps/api/core';
import { HashRouter } from "react-router-dom";


async function startBackend() {
    try {
        await invoke("start_backend");
        console.log("Servidor backend iniciado");
    } catch (error) {
        console.error("Error al iniciar el backend:", error);
    }
}


startBackend();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </React.StrictMode>
);