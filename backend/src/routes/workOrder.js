const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/executed', (req, res) => {
    const query = `
        SELECT
            wo.id_order                AS id_order,
            t.id_tech                  AS id_tech,
            t.name_tech                AS name_tech,
            e.code_equip               AS code_equip,
            e.name_equip               AS name_equip,
            e.brand_equip              AS brand_equip,
            a.name_area                AS name_area,
            wo.completion_date         AS completion_date
        FROM work_orders wo
        LEFT JOIN technicians t        ON wo.id_tech  = t.id_tech
        LEFT JOIN equipments e         ON e.id_equip  = wo.id_equip
        LEFT JOIN areas a              ON e.id_area   = a.id_area
        WHERE wo.work_finished = 1;
        `;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener la orden de trbajo ejecutados:', err);
            return res.status(500).json({ error: 'Error al obtener la orden de trabajo ejecutados' });
        }
        res.json({ data: rows });
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT
            wo.id_order           AS id_order,
            u.name_user                AS name_user,
            wo.date_request            AS date_request,
            wo.hour_request            AS hour_request,
            t.id_tech                  AS id_tech,
            t.name_tech                AS name_tech,
            wo.date_delivery           AS date_delivery,
            e.code_equip               AS code_equip,
            e.name_equip               AS name_equip,
            e.brand_equip              AS brand_equip,
            e.model_equip              AS model_equip,
            a.name_area                AS name_area,
            cm.name_class              AS name_class,
            tm.name_type               AS name_type,
            wo.priority                AS priority,
            wo.work_requested          AS work_requested,
            wo.completion_date         AS completion_date,
            wo.observations            AS observations,
            wo.work_performed_details  AS work_performed_details,
            wo.failure_analysis        AS failure_analysis,
            wo.failure_cause           AS failure_cause
        FROM work_orders wo
        LEFT JOIN class_maintenance cm ON wo.id_class = cm.id_class
        LEFT JOIN technicians t        ON wo.id_tech  = t.id_tech
        LEFT JOIN equipments e         ON e.id_equip  = wo.id_equip
        LEFT JOIN areas a              ON e.id_area   = a.id_area
        LEFT JOIN type_maintenance tm  ON tm.id_type  = wo.id_type
        LEFT JOIN users u              ON u.id_user   = wo.id_user
        WHERE wo.id_order = ?;
        `;
    db.get(query, [id], (err, rows) => {
        if (err) {
            console.error('Error al obtener la orden de trbajo:', err);
            return res.status(500).json({ error: 'Error al obtener la orden de trabajo' });
        }
        res.json({ data: rows });
    });
});

module.exports = router;