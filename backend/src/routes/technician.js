const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
    const query = `SELECT * FROM technicians`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los tecnicos:', err);
            return res.status(500).json({ error: 'Error al obtener los tecnicos' });
        }
        res.json({ data: rows });
    });
});

router.post('/post', (req, res) => {
    const { id_tech, name_tech, contact_number_tech, id_area, id_user } = req.body;

    if (!id_tech || !name_tech) {
        return res.status(400).json({ error: 'Datos requeridos inválidos. Se requiere id_tech y name_tech' });
    }

    const query = `INSERT INTO technicians (id_tech, name_tech, contact_number_tech, id_area, id_user) VALUES (?, ?, ?, ?, ? )`;
    db.run(query, [id_tech, name_tech, contact_number_tech, id_area, id_user], function(err) {
        if (err) {
            console.error('Error al insertar el tecnico:', err);
            return res.status(500).json({ error: 'Error al insertar' });
        }
        res.json({ message: 'Tecnico creado', id: this.lastID });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name_tech, contact_number_tech, id_area } = req.body;

    const query = `UPDATE technicians SET name_tech = ?, contact_number_tech = ?, id_area = ? WHERE id_tech = ?`;
    db.run(query, [name_tech, contact_number_tech, id_area, id], function(err) {
        if (err) {
            console.error('Error al actualizar el tecnico:', err);
            return res.status(500).json({ error: 'Error al actualizar' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tecnico no encontrado' });
        }
        res.json({ message: 'Tecnico actualizado' });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM technicians WHERE id_tech = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            console.error('Error al eliminar el Tecnico:', err);
            return res.status(500).json({ error: 'Error al eliminar' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tecnico no encontrado' });
        }
        res.json({ message: 'Tecnico eliminado' });
    });
});

module.exports = router;
