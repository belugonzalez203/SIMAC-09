// electron-main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const waitOn = require('wait-on');


const isDev = process.env.NODE_ENV === 'development' || !!process.env.VITE_DEV_SERVER_URL;
const FRONTEND_DEV_URL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:1420';
const EXPRESS_PORT = process.env.PORT || 3002;

function ensureUserDb() {
    const userData = app.getPath('userData');
    const destDb = path.join(userData, 'siac.sqlite');

    // Si ya existe en userData, devolver ruta
    if (fs.existsSync(destDb)) return destDb;

    // Ruta al sqlite dentro del paquete (dev: backend/src/config/siac.sqlite)
    // En producción ese archivo puede estar en resources/app.asar — por eso mejor copiar
    const bundledDb = path.join(__dirname, 'backend', 'src', 'config', 'siac.sqlite');

    try {
        if (fs.existsSync(bundledDb)) {
            fs.copyFileSync(bundledDb, destDb);
            console.log('DB copiada a userData:', destDb);
        } else {
            console.log('No se encontró DB en paquete, se creará una vacía en userData:', destDb);
            fs.closeSync(fs.openSync(destDb, 'w'));
        }
    } catch (e) {
        console.error('Error al copiar/crear DB:', e);
    }
    return destDb;
}

async function startExpress() {
    // setear DB_PATH antes de importar la app
    process.env.PORT = EXPRESS_PORT;
    process.env.DB_PATH = ensureUserDb();

    // Importa tu servidor sin ejecutar server.js->listen (usando el patrón que ya aplicaste)
    const expressApp = require(path.join(__dirname, 'backend', 'server.js'));
    const server = expressApp.listen(EXPRESS_PORT, () => {
        console.log(`API escuchando en http://localhost:${EXPRESS_PORT}`);
    });

    return server;
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    if (isDev) {
        win.loadURL(FRONTEND_DEV_URL);
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, 'dist', 'index.html'));
    }

    win.webContents.on('did-finish-load', () => {
        win.webContents.setZoomFactor(0.8);
    });
}

app.whenReady().then(async () => {
    const server = await startExpress();

    if (isDev) {
        try {
            await waitOn({ resources: [FRONTEND_DEV_URL], timeout: 300000 });
        } catch (err) {
            console.warn('Frontend dev server no respondió a tiempo, seguimos de todas formas.');
        }
    }

    createWindow();

    app.on('before-quit', () => {
        if (server && server.close) server.close();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
