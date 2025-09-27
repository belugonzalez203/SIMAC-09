// preload.js
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('appConfig', {
    apiBaseUrl: 'http://localhost:3002'
});
