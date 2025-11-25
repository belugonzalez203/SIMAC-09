const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/executed', (req, res) => {
    const query = `
        SELECT
            wo.id_order                AS id_order,
            t.code_tech                AS code_tech,
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

router.get('/pending', (req, res) => {
    const query = `
        SELECT
            wo.id_order                AS id_order,
            t.id_tech                  AS id_tech,
            t.code_tech                AS code_tech,
            t.name_tech                AS name_tech,
            e.id_equip                 AS id_equip,
            e.code_equip               AS code_equip,
            e.name_equip               AS name_equip,
            e.brand_equip              AS brand_equip,
            tm.id_type                 AS id_type,
            tm.name_type               AS name_type,
            cm.id_class                AS id_class,
            cm.name_class              AS name_class,
            wo.priority                AS priority,
            a.name_area                AS name_area,
            wo.date_delivery           AS date_delivery,
            wo.work_requested          AS work_requested
        FROM work_orders wo
        LEFT JOIN technicians t        ON wo.id_tech  = t.id_tech
        LEFT JOIN equipments e         ON e.id_equip  = wo.id_equip
        LEFT JOIN areas a              ON e.id_area   = a.id_area
        LEFT JOIN type_maintenance tm  ON wo.id_type  = tm.id_type
        LEFT JOIN class_maintenance cm ON wo.id_class = cm.id_class
        WHERE wo.work_finished = 0
        ORDER BY
            CASE wo.priority
                WHEN 'Alta'  THEN 1
                WHEN 'Media' THEN 2
                WHEN 'Baja' THEN 3
                ELSE 4
                END,
            date(wo.date_delivery) ASC;
        `;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener la orden de trbajo ejecutados:', err);
            return res.status(500).json({ error: 'Error al obtener la orden de trabajo ejecutados' });
        }
        res.json({ data: rows });
    });
});

//AQUI FALTA QUE SU ESTADO DE ID_EQUIP.ID_SERVICE SEA ID 1 -- REVISAR
router.post('/post', (req, res) => {
    const {
        id_user,
        id_tech,
        id_equip,
        date_delivery,
        id_type,
        id_class,
        priority,
        work_requested
    } = req.body;

    if (!id_user || !id_tech || !id_equip || !id_type || !id_class || !work_requested) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const now = new Date();
    const date_request = now.toISOString().split('T')[0];
    const hour_request = now.toTimeString().slice(0, 5);

    const final_date_delivery = date_delivery || date_request;

    const query = `
        INSERT INTO work_orders 
        (id_user, id_tech, id_equip, date_request, hour_request, date_delivery, id_type, id_class, priority, work_requested) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        query,
        [
            id_user,
            id_tech,
            id_equip,
            date_request,
            hour_request,
            final_date_delivery,
            id_type,
            id_class,
            priority || null,
            work_requested
        ],
        function (err) {
            if (err) {
                console.error('Error al insertar orden de trabajo:', err);
                return res.status(500).json({ error: 'Error al crear la orden de trabajo' });
            }
            const id_order = this.lastID;

            const updateQuery = `
                UPDATE equipments
                SET id_service = 1
                WHERE id_equip = ?
            `;
            db.run(updateQuery, [id_equip], function (err2) {
                if (err2) {
                    console.error('Error al actualizar estado del equipo:', err2);
                    return res.status(500).json({
                        error: 'Orden creada pero error al actualizar estado del equipo',
                        id_order
                    });
                }

                res.status(201).json({
                    message: 'Orden de trabajo creada y estado de equipo actualizado',
                    id_order
                });
            }
            );
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
            t.code_tech                AS code_tech,
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

router.post('/:id/spareParts', (req, res) => {
    const { id } = req.params;
    const { spareParts } = req.body;

    if (!Array.isArray(spareParts) || spareParts.length === 0) {
        return res.status(400).json({
            error: 'Debes enviar un array spareParts con al menos un elemento'
        });
    }

    for (const s of spareParts) {
        if (!s.id_spare_part) {
            return res.status(400).json({ error: 'Cada repuesto necesita id_spare_part' });
        }
    }

    // Insertar uno por uno (si usas sqlite3)
    const query = `
        INSERT INTO work_order_spare_parts (
        id_order,
        id_spare_part,
        quantity_used,
        hour_current,
        hour_change
        ) VALUES (?, ?, ?, ?, ?)
    `;

    const stmt = db.prepare(query);

    try {
        for (const s of spareParts) {
            stmt.run([
                id,
                s.id_spare_part,
                s.quantity_used || 1,
                s.hour_current || 0,
                s.hour_change || 0
            ]);
        }

        stmt.finalize();

        res.status(201).json({
            message: 'Repuestos asignados correctamente',
            count: spareParts.length
        });
    } catch (err) {
        console.error('Error al insertar repuestos:', err);
        res.status(500).json({ error: 'Error al insertar repuestos' });
    }
});

router.post('/:id/technicians', (req, res) => {
    const { id } = req.params;
    const { technicians } = req.body;
    if (!Array.isArray(technicians) || technicians.length === 0) {
        return res.status(400).json({
            error: 'Debes enviar un array technicians con al menos un técnico'
        });
    }
    const query = `
        INSERT INTO work_order_technicians (id_order, id_tech)
        VALUES (?, ?)
    `;
    const stmt = db.prepare(query);
    try {
        for (const techId of technicians) {
            stmt.run([id, techId]);
        }
        stmt.finalize();
        res.status(201).json({
            message: 'Técnicos asignados correctamente',
            count: technicians.length
        });
    } catch (err) {
        console.error('Error al asignar técnicos:', err);
        res.status(500).json({ error: 'Error al asignar técnicos' });
    }
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const {
        observations,
        work_performed_details,
        failure_analysis,
        failure_cause,
    } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Datos requeridos inválidos. Se requiere id de la WorkOrder' });
    }

    const now = new Date();
    const completion_date = now.toISOString().split('T')[0];

    const updateWorkOrderQuery = `
        UPDATE work_orders
        SET 
            observations = ?,
            work_performed_details = ?,
            failure_analysis = ?,
            failure_cause = ?,
            work_finished = 1,
            completion_date = ?
        WHERE id_order = ?
    `;

    db.run(
        updateWorkOrderQuery,
        [
            observations || null,
            work_performed_details || null,
            failure_analysis || null,
            failure_cause || null,
            completion_date,
            id
        ],
        function (err) {
            if (err) {
                console.error('Error al actualizar la orden de trabajo:', err);
                return res.status(500).json({ error: 'Error al actualizar la orden de trabajo' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Orden no encontrada' });
            }

            const getEquipQuery = `SELECT id_equip FROM work_orders WHERE id_order = ?`;

            db.get(getEquipQuery, [id], (err2, row) => {
                if (err2) {
                    console.error('Error al obtener id_equip:', err2);
                    return res.status(500).json({ error: 'Orden actualizada pero error al obtener id_equip' });
                }

                if (!row) {
                    return res.status(404).json({ error: 'No se encontró equipo asociado a la orden' });
                }

                const id_equip = row.id_equip;

                const updateEquipQuery = `UPDATE equipments SET id_service = 1 WHERE id_equip = ?`;

                db.run(updateEquipQuery, [id_equip], function (err3) {
                    if (err3) {
                        console.error('Error al actualizar estado del equipo:', err3);
                        return res.status(500).json({
                            error: 'Orden actualizada pero error al actualizar estado del equipo'
                        });
                    }

                    res.json({
                        message: 'Orden de trabajo actualizada y estado del equipo cambiado a 2',
                        id_equip
                    });
                });
            });
        }
    );
});

router.put('/pending/:id', (req, res) => {
    const { id } = req.params;
    const {
        id_tech,
        id_equip,
        id_type,
        id_class,
        priority,
        work_requested,
        date_delivery
    } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Se requiere el ID de la orden de trabajo.' });
    }

    // Verifica si la orden existe y no ha sido respondida
    const checkQuery = `SELECT work_finished FROM work_orders WHERE id_order = ?`;

    db.get(checkQuery, [id], (err, row) => {
        if (err) {
            console.error('Error al verificar la orden:', err);
            return res.status(500).json({ error: 'Error al verificar el estado de la orden.' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Orden no encontrada.' });
        }

        if (row.work_finished === 1) {
            return res.status(400).json({
                error: 'No se puede editar la solicitud. La orden ya fue respondida.'
            });
        }

        // Actualizar los campos permitidos si la orden sigue pendiente
        const updateQuery = `
            UPDATE work_orders
            SET 
                id_tech = ?,
                id_equip = ?,
                id_type = ?,
                id_class = ?,
                priority = ?,
                work_requested = ?,
                date_delivery = ?
            WHERE id_order = ?
        `;

        db.run(
            updateQuery,
            [
                id_tech,
                id_equip,
                id_type,
                id_class,
                priority,
                work_requested,
                date_delivery,
                id
            ],
            function (updateErr) {
                if (updateErr) {
                    console.error('Error al actualizar la solicitud:', updateErr);
                    return res.status(500).json({ error: 'Error al actualizar la solicitud.' });
                }

                if (this.changes === 0) {
                    return res.status(404).json({ error: 'No se actualizó ninguna fila.' });
                }

                res.json({
                    message: 'Solicitud de orden de trabajo actualizada correctamente.',
                    id_order: id
                });
            }
        );
    });
});

router.delete('/:id', (req, res) => {
    console.log('Recibida solicitud DELETE para id:', req.params.id);
    const { id } = req.params;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Elimina posibles relaciones con técnicos
        db.run(
            'DELETE FROM work_order_technicians WHERE id_order = ?',
            [id],
            function (err) {
                if (err) {
                    console.error('Error al eliminar técnicos asociados:', err);
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Error al eliminar técnicos asociados' });
                }

                // Elimina posibles relaciones con repuestos
                db.run(
                    'DELETE FROM work_order_spare_parts WHERE id_order = ?',
                    [id],
                    function (err) {
                        if (err) {
                            console.error('Error al eliminar repuestos asociados:', err);
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: 'Error al eliminar repuestos asociados' });
                        }

                        // Elimina la orden de trabajo principal
                        db.run(
                            'DELETE FROM work_orders WHERE id_order = ?',
                            [id],
                            function (err) {
                                if (err) {
                                    console.error('Error al eliminar la orden de trabajo:', err);
                                    db.run('ROLLBACK');
                                    return res.status(500).json({ error: 'Error al eliminar la orden de trabajo' });
                                }

                                // Si no se encontró la orden
                                if (this.changes === 0) {
                                    db.run('ROLLBACK');
                                    return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
                                }

                                // Si todo fue bien, confirmamos los cambios
                                db.run('COMMIT', (err) => {
                                    if (err) {
                                        console.error('Error al confirmar transacción:', err);
                                        return res.status(500).json({ error: 'Error al confirmar transacción' });
                                    }
                                    res.json({
                                        message:
                                            'Orden de trabajo eliminada correctamente',
                                    });
                                });
                            }
                        );
                    }
                );
            }
        );
    });
});

module.exports = router;