const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/type', (req, res) => {
    const query = `SELECT * FROM type_maintenance`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los tipos de mantenimiento:', err);
            return res.status(500).json({ error: 'Error al obtener los tipos de mantenimiento' });
        }
        res.json({ data: rows });
    });
});

router.get('/class', (req, res) => {
    const query = `SELECT * FROM class_maintenance`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener las clases de mantenimiento:', err);
            return res.status(500).json({ error: 'Error al obtener las clases de mantenimiento' });
        }
        res.status(200).json({ data: rows });
    });
});

module.exports = router;