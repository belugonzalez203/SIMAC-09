const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
    db.all('SELECT * FROM work_order_spare_parts', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

router.get('/sparePartsByOrder/:id_order', (req, res) => {
    const query = `
        SELECT wsp.id_order, wsp.id_spare_part, sp.name_spare_part, sp.code_spare_part, wsp.hour_current, wsp.hour_change
        FROM work_order_spare_parts wsp
        JOIN spare_parts sp ON wsp.id_spare_part = sp.id_spare_part
        WHERE wsp.id_order = ?
    `;
    db.all(query, [req.params.id_order], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

module.exports = router;
