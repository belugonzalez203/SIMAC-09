const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/techniciansByOrder/:id_order', (req, res) => {
    const query = `
        SELECT wt.id_order, wt.id_tech, t.name_tech
        FROM work_order_technicians wt
        JOIN technicians t ON wt.id_tech = t.id_tech
        WHERE wt.id_order = ?
    `;
    db.all(query, [req.params.id_order], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

module.exports = router;