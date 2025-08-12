const express = require('express');
const router = express.Router();
const db = require('../database');


router.get('/', (req, res) => {
    const query = `SELECT * FROM type_change_maintenance`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los tipos:', err);
            return res.status(500).json({ error: 'Error al obtener los tipos de cambio' });
        }
        res.json({ data: rows });
    });
});

router.post('/', (req, res) => {
    const { name_change, hour_change } = req.body;

    if (!name_change || typeof hour_change !== 'number') {
        return res.status(400).json({ error: 'Datos inválidos. Se requiere name_change y hour_change (número)' });
    }

    const query = `INSERT INTO type_change_maintenance (name_change, hour_change) VALUES (?, ?)`;
    db.run(query, [name_change, hour_change], function(err) {
        if (err) {
            console.error('Error al insertar tipo de cambio:', err);
            return res.status(500).json({ error: 'Error al insertar' });
        }
        res.json({ message: 'Tipo de cambio creado', id: this.lastID });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name_change, hour_change } = req.body;

    if (!name_change || typeof hour_change !== 'number') {
        return res.status(400).json({ error: 'Datos inválidos. Se requiere name_change y hour_change (número)' });
    }

    const query = `UPDATE type_change_maintenance SET name_change = ?, hour_change = ? WHERE id_type_change = ?`;
    db.run(query, [name_change, hour_change, id], function(err) {
        if (err) {
            console.error('Error al actualizar tipo de cambio:', err);
            return res.status(500).json({ error: 'Error al actualizar' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tipo de cambio no encontrado' });
        }
        res.json({ message: 'Tipo de cambio actualizado' });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM type_change_maintenance WHERE id_type_change = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            console.error('Error al eliminar tipo de cambio:', err);
            return res.status(500).json({ error: 'Error al eliminar' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tipo de cambio no encontrado' });
        }
        res.json({ message: 'Tipo de cambio eliminado' });
    });
});

module.exports = router;
