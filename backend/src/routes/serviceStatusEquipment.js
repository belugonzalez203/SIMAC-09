const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
    const query = `SELECT * FROM service_status_equipment `;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los estados:', err);
            return res.status(500).json({ error: 'Error al obtener los estados' });
        }
        res.json({ data: rows });
    });
});

module.exports = router;
