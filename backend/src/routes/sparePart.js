const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
    const query = `SELECT * FROM spare_parts WHERE deleted = 0`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los repuestos:', err);
            return res.status(500).json({ error: 'Error al obtener los repuestos' });
        }
        res.json({ data: rows });
    });
});

router.post('/postWithEquipments', (req, res) => {
    const {
        code_spare_part,
        name_spare_part,
        stock_spare_part,
        equipments
    } = req.body;

    if (!code_spare_part || !name_spare_part) {
        return res.status(400).json({
            error: 'Se requieren code_spare_part y name_spare_part'
        });
    }
    const insertSparePartQuery = `
        INSERT INTO spare_parts (code_spare_part, name_spare_part, stock_spare_part)
        VALUES (?, ?, ?)
    `;
    db.run(
        insertSparePartQuery,
        [code_spare_part.trim(), name_spare_part.trim(), stock_spare_part || 0],
        function (err) {
            if (err) {
                console.error('Error al insertar repuesto:', err);
                return res.status(500).json({ error: 'Error al insertar repuesto' });
            }
            const newSparePartId = this.lastID;
            if (Array.isArray(equipments) && equipments.length > 0) {
                const insertRelationQuery = `
                INSERT INTO equipment_spare_parts (id_equip, id_spare_part)
                VALUES (?, ?)
            `;
                const stmt = db.prepare(insertRelationQuery);

                try {
                    for (const equipId of equipments) {
                        stmt.run([equipId, newSparePartId]);
                    }
                    stmt.finalize();

                    return res.status(201).json({
                        message: 'Repuesto creado y asociado a equipos',
                        id_spare_part: newSparePartId,
                        count_equipments: equipments.length
                    });
                } catch (relErr) {
                    console.error('Error al asociar equipos al repuesto:', relErr);
                    return res
                        .status(500)
                        .json({ error: 'Error al asociar equipos al repuesto' });
                }
            } else {
                return res.status(201).json({
                    message: 'Repuesto creado sin equipos asociados',
                    id_spare_part: newSparePartId
                });
            }
        }
    );
});

router.put('/updateWithEquipments/:id', (req, res) => {
    const { id } = req.params;
    const {
        code_spare_part,
        name_spare_part,
        stock_spare_part,
        equipments
    } = req.body;

    const updateSparePartQuery = `
        UPDATE spare_parts
        SET code_spare_part = ?, name_spare_part = ?, stock_spare_part = ?
        WHERE id_spare_part = ?
    `;

    db.run(
        updateSparePartQuery,
        [code_spare_part.trim(), name_spare_part.trim(), stock_spare_part || 0, id],
        function (err) {
            if (err) {
                console.error('Error al actualizar repuesto:', err);
                return res.status(500).json({ error: 'Error al actualizar repuesto' });
            }

            if (Array.isArray(equipments)) {
                const deleteRelationsQuery = `
                    DELETE FROM equipment_spare_parts WHERE id_spare_part = ?
                    `;
                db.run(deleteRelationsQuery, [id], function (delErr) {
                    if (delErr) {
                        console.error('Error al limpiar relaciones:', delErr);
                        return res.status(500).json({ error: 'Error al limpiar relaciones' });
                    }

                    if (equipments.length > 0) {
                        const insertRelationQuery = `
                            INSERT INTO equipment_spare_parts (id_equip, id_spare_part)
                            VALUES (?, ?)
                            `;
                        const stmt = db.prepare(insertRelationQuery);

                        try {
                            for (const equipId of equipments) {
                                stmt.run([equipId, id]);
                            }
                            stmt.finalize();

                            return res.status(200).json({
                                message: 'Repuesto y relaciones actualizadas correctamente',
                                id_spare_part: id,
                                count_equipments: equipments.length
                            });
                        } catch (relErr) {
                            console.error('Error al asociar equipos:', relErr);
                            return res.status(500).json({ error: 'Error al asociar equipos' });
                        }
                    } else {
                        return res.status(200).json({
                            message: 'Repuesto actualizado sin equipos asociados',
                            id_spare_part: id
                        });
                    }
                });
            } else {
                return res.status(200).json({
                    message: 'Repuesto actualizado',
                    id_spare_part: id
                });
            }
        }
    );
});

router.get('/equipments/:id', (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT id_equip 
        FROM equipment_spare_parts
        WHERE id_spare_part = ?
    `;

    db.all(query, [id], (err, rows) => {
        if (err) {
            console.error('Error al obtener los equipos asociados:', err);
            return res.status(500).json({ error: 'Error al obtener los equipos asociados' });
        }

        const equipment_ids = rows.map(r => r.id_equip);

        res.json({ equipment_ids });
    });
});

router.get('/equipments', (req, res) => {
    const query = `
    SELECT 
        es.id_spare_part,
        GROUP_CONCAT(e.code_equip, ', ') AS equipment_codes
        FROM equipment_spare_parts es
        JOIN equipments e ON e.id_equip = es.id_equip
        GROUP BY es.id_spare_part
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener asociaciones de repuestos y equipos:', err);
            return res.status(500).json({ error: 'Error al obtener asociaciones' });
        }

        res.json({ data: rows });
    });
});

//ELIMINADO LOGICO, RESTRINGIR
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = `UPDATE spare_parts SET deleted = 1 WHERE id_spare_part = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            console.error('Error al eliminar el repuesto:', err);
            return res.status(500).json({ error: 'Error al eliminar' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Repuesto no encontrado' });
        }
        res.json({ message: 'Repuesto eliminado' });
    });
});

module.exports = router;
