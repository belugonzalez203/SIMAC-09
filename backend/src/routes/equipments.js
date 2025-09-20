const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
    const query = `
        SELECT e.id_equip, e.code_equip, e.name_equip, e.number_plate,
               e.brand_equip, e.model_equip, e.chassis_equip,
               e.id_area, 
               a.name_area AS name_area,
               e.id_service, 
               s.name_service as name_service
        FROM equipments e
        LEFT JOIN areas a ON e.id_area = a.id_area
        LEFT JOIN service_status_equipment s ON e.id_service = s.id_service
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los equipos:', err);
            return res.status(500).json({ error: 'Error al obtener los equiposs' });
        }
        res.json({ data: rows });
    });
});

router.post('/post', (req, res) => {
    const { code_equip, name_equip, number_plate, brand_equip, model_equip, chassis_equip, id_service, id_area } = req.body;

    if (!code_equip || !name_equip || !number_plate) {
        return res.status(400).json({ error: 'Datos requeridos inválidos. Se requiere  code_equip, name_equip, number_plate' });
    }

    const query = `INSERT INTO equipments (code_equip, name_equip, number_plate, brand_equip, model_equip, chassis_equip, id_service, id_area) VALUES (?, ?, ?, ?, ?, ?, ?, ? )`;
    db.run(query, [code_equip, name_equip, number_plate, brand_equip, model_equip, chassis_equip, id_service, id_area], function(err) {
        if (err) {
            console.error('Error al insertar el area:', err);
            return res.status(500).json({ error: 'Error al insertar' });
        }
        res.json({ message: 'Equipo creado', id: this.lastID });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { code_equip, name_equip, number_plate, brand_equip, model_equip, chassis_equip, id_service, id_area } = req.body;

    if (!name_equip || !id_service || !id_area) {
        return res.status(400).json({ error: 'Datos inválidos. Se requiere name_equip, id_service e id_area' });
    }

    const query = `UPDATE equipments SET code_equip = ?, name_equip = ?, number_plate = ?, brand_equip = ?, model_equip = ?, chassis_equip = ?, id_service = ?, id_area = ? WHERE id_equip = ?`;
    db.run(query, [code_equip, name_equip, number_plate, brand_equip, model_equip, chassis_equip, id_service, id_area, id], function(err) {
        if (err) {
            console.error('Error al actualizar el equipo:', err);
            return res.status(500).json({ error: 'Error al actualizar' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Equipo no encontrado' });
        }
        res.json({ message: 'Equipo actualizado' });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM equipments WHERE id_equip = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            console.error('Error al eliminar el Equipo:', err);
            return res.status(500).json({ error: 'Error al eliminar' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Equipo no encontrado' });
        }
        res.json({ message: 'Equipo eliminado' });
    });
});

router.get('/hourmeters/available', (req, res) => {
    const query = `
        SELECT
            e.id_equip   AS id_equip,
            e.name_equip AS name_equip,
            e.code_equip AS code_equip,
            a.name_area  AS name_area
        FROM equipments e
        LEFT JOIN hourmeters h ON e.id_equip = h.id_equip
        JOIN areas a ON a.id_area = e.id_area
        WHERE h.id_equip IS NULL
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los equipos:', err);
            return res.status(500).json({ error: 'Error al obtener los equipos' });
        }
        res.json({ data: rows });
    });
});

router.put("/updateService/:id_equip", (req, res) => {
    const { id_equip } = req.params;
    const { id_service } = req.body;

    if (!id_service) {
        return res.status(400).json({ error: "El campo id_service es obligatorio." });
    }

    const sql = `UPDATE equipments SET id_service = ? WHERE id_equip = ?`;

    db.run(sql, [id_service, id_equip], function (err) {
        if (err) {
            console.error("Error al actualizar el servicio del equipo:", err.message);
            return res.status(500).json({ error: "Error interno del servidor." });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Equipo no encontrado." });
        }

        return res.json({
            message: "Servicio actualizado correctamente.",
            id_equip,
            id_service,
        });
    });
});

module.exports = router;
