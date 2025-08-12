import './styles.css';
import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';

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
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);