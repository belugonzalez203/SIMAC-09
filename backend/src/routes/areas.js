const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
    const query = `SELECT * FROM areas`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener las areas:', err);
            return res.status(500).json({ error: 'Error al obtener las areas' });
        }
        res.json({ data: rows });
    });
});

router.post('/post', (req, res) => {
    const { id_area, code_area, name_area, in_charge, contact_number_area } = req.body;

    if (!code_area || !name_area) {
        return res.status(400).json({ error: 'Datos requeridos inválidos. Se requiere id_area y name_area' });
    }

    const query = `INSERT INTO areas (code_area, name_area, in_charge, contact_number_area) VALUES (?, ?, ?, ?)`;
    db.run(query, [code_area, name_area, in_charge, contact_number_area], function(err) {
        if (err) {
            console.error('Error al insertar el area:', err);
            return res.status(500).json({ error: 'Error al insertar' });
        }
        res.json({ message: 'Area creada', id: this.lastID });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { code_area, name_area, in_charge, contact_number_area } = req.body;

    if (!name_area || !code_area) {
        return res.status(400).json({ error: 'Datos requeridos inválidos. Se requiere name_area' });
    }

    const query = `UPDATE areas SET code_area = ?, name_area = ?, in_charge = ?, contact_number_area = ? WHERE id_area = ?`;
    db.run(query, [code_area, name_area, in_charge, contact_number_area, id], function(err) {
        if (err) {
            console.error('Error al actualizar el area:', err);
            return res.status(500).json({ error: 'Error al actualizar' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Area no encontrado' });
        }
        res.json({ message: 'Area actualizado' });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM areas WHERE id_area = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            console.error('Error al eliminar el Area:', err);
            return res.status(500).json({ error: 'Error al eliminar' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Area no encontrado' });
        }
        res.json({ message: 'Area eliminado' });
    });
});

module.exports = router;
