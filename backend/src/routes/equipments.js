const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
    const query = `SELECT * FROM equipments`;
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

module.exports = router;
