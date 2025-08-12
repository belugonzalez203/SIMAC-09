const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
    const { area, equipment } = req.query;

    const baseQuery = `
        SELECT
            ar.id_area,
            ar.name_area,
            eq.id_equip,
            eq.code_equip,
            eq.name_equip,
            tc.id_type_change,
            tc.name_change AS maintenance_type,
            tc.hour_change AS maintenance_interval,
            hm.hour_current,
            hm.hour_change,
            hm.next_hour_change,
            (hm.hour_alert - ROUND((julianday('now') - julianday(hm.last_updated)) * 24, 0)) AS hour_alert
        FROM hourmeters hm
        JOIN equipments eq ON hm.id_equip = eq.id_equip
        LEFT JOIN areas ar ON eq.id_area = ar.id_area
        JOIN type_change_maintenance tc ON hm.id_type_change = tc.id_type_change
    `;

    const conditions = [];
    const params = [];

    if (area) {
        conditions.push("ar.name_area LIKE ?");
        params.push(`%${area}%`);
    }

    if (equipment) {
        conditions.push("eq.name_equip LIKE ?");
        params.push(`%${equipment}%`);
    }

    const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
    const finalQuery = `${baseQuery} ${whereClause} ORDER BY ar.name_area, eq.code_equip, tc.hour_change`;

    db.all(finalQuery, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const pivoted = {};

        rows.forEach(row => {
            const areaName = row.name_area || 'Sin área';
            const equipKey = `${areaName}::${row.code_equip}`;

            if (!pivoted[equipKey]) {
                pivoted[equipKey] = {
                    id_equip: row.id_equip,  // 👈 NECESARIO PARA PUT
                    area: areaName,
                    equipmentCode: row.code_equip,
                    equipmentName: row.name_equip,
                    maintenance: {}
                };
            }

            pivoted[equipKey].maintenance[row.maintenance_type] = {
                id_type_change: row.id_type_change, // 👈 NECESARIO PARA PUT
                intervalHours: row.maintenance_interval,
                hourCurrent: row.hour_current,
                hourChange: row.hour_change,
                nextHourChange: row.next_hour_change,
                hourAlert: row.hour_alert
            };
        });

        // Convertir a array
        const result = Object.values(pivoted);
        res.json({ data: result });
    });
});

router.post('/', (req, res) => {
    const { id_equip, hours } = req.body;

    if (!id_equip || typeof hours !== 'object') {
        return res.status(400).json({ error: 'Faltan datos o formato inválido. Se requiere id_equip y un objeto hours' });
    }

    // Verificar si el equipo ya tiene registros en hourmeters
    const checkQuery = `SELECT COUNT(*) AS count FROM hourmeters WHERE id_equip = ?`;
    db.get(checkQuery, [id_equip], (checkErr, result) => {
        if (checkErr) {
            console.error('Error al verificar registros existentes:', checkErr);
            return res.status(500).json({ error: 'Error al verificar duplicados' });
        }

        if (result.count > 0) {
            return res.status(400).json({ error: 'Este equipo ya tiene registros de horómetro.' });
        }

        // Obtener tipos de mantenimiento
        const query = `SELECT id_type_change, hour_change FROM type_change_maintenance`;

        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error al obtener tipos de mantenimiento:', err);
                return res.status(500).json({ error: 'Error al obtener tipos de mantenimiento' });
            }

            const stmt = db.prepare(`
                INSERT INTO hourmeters (
                    id_equip, id_type_change,
                    hour_current, hour_change, next_hour_change, hour_alert,
                    last_updated
                )
                VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
            `);


            rows.forEach(row => {
                const { id_type_change, hour_change: baseHourChange } = row;

                const hour_current = parseInt(hours[id_type_change]) || 0;
                const hour_change = hour_current;
                const next_hour_change = hour_change + baseHourChange;
                const hour_alert = next_hour_change - hour_current;

                stmt.run([
                    id_equip,
                    id_type_change,
                    hour_current,
                    hour_change,
                    next_hour_change,
                    hour_alert
                ]);
            });

            stmt.finalize(err => {
                if (err) {
                    console.error('Error al insertar horómetros:', err);
                    return res.status(500).json({ error: 'Error al insertar horómetros' });
                }

                res.json({ message: 'Horómetros agregados correctamente para el equipo' });
            });
        });
    });
});

router.put('/', (req, res) => {
    const { id_equip, id_type_change, hour_current } = req.body;

    if (!id_equip || !id_type_change || hour_current === undefined) {
        return res.status(400).json({ error: 'Faltan datos. Se requiere id_equip, id_type_change y hour_current' });
    }

    const parsedHour = parseInt(hour_current);
    if (isNaN(parsedHour) || parsedHour < 0) {
        return res.status(400).json({ error: 'hour_current debe ser un número válido mayor o igual a 0' });
    }

    const queryTypeChange = `
        SELECT hour_change FROM type_change_maintenance
        WHERE id_type_change = ?
    `;

    db.get(queryTypeChange, [id_type_change], (err, typeRow) => {
        if (err) {
            console.error('Error al obtener tipo de mantenimiento:', err);
            return res.status(500).json({ error: 'Error al obtener tipo de mantenimiento' });
        }

        if (!typeRow) {
            return res.status(404).json({ error: 'Tipo de mantenimiento no encontrado' });
        }

        const baseHourChange = typeRow.hour_change;
        const hour_change = parsedHour;
        const next_hour_change = hour_change + baseHourChange;
        const hour_alert = next_hour_change - parsedHour;

        const updateQuery = `
            UPDATE hourmeters
            SET 
                hour_current = ?, 
                hour_change = ?, 
                next_hour_change = ?, 
                hour_alert = ?, 
                last_updated = datetime('now')
            WHERE id_equip = ? AND id_type_change = ?
        `;

        db.run(updateQuery, [parsedHour, hour_change, next_hour_change, hour_alert, id_equip, id_type_change], function (updateErr) {
            if (updateErr) {
                console.error('Error al actualizar horómetro:', updateErr);
                return res.status(500).json({ error: 'Error al actualizar horómetro' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'No se encontró un registro para actualizar' });
            }

            res.json({ message: 'Horómetro actualizado correctamente' });
        });
    });
});

router.get('/alerts', (req, res) => {
    const query = `
        SELECT 
            eq.id_equip,
            eq.code_equip,
            eq.name_equip,
            ar.name_area,
            tc.name_change AS maintenance_type,
            hm.hour_current,
            hm.hour_change,
            hm.next_hour_change,
            (hm.hour_alert - ROUND((julianday('now') - julianday(hm.last_updated)) * 24, 0)) AS hour_alert
        FROM hourmeters hm
        JOIN equipments eq ON hm.id_equip = eq.id_equip
        LEFT JOIN areas ar ON eq.id_area = ar.id_area
        JOIN type_change_maintenance tc ON hm.id_type_change = tc.id_type_change
        WHERE (hm.hour_alert - ROUND((julianday('now') - julianday(hm.last_updated)) * 24, 0)) <= 36
    `;

    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

module.exports = router;
