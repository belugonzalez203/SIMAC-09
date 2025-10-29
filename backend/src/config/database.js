// src/config/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Si no hay DB_PATH, usa la que ya tenés en src/config (modo desarrollo)
const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, "./siac.sqlite");

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("Error al conectar a SQLite:", err.message);
    } else {
        console.log("Conectado a la base de datos SQLite en:", DB_PATH);
    }
});

db.get("PRAGMA foreign_keys = ON");

module.exports = db;
