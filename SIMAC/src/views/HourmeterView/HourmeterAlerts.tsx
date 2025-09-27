import React, { useEffect, useState } from 'react';
import styles from '../../styles/ListView.module.css';
import api from "../../services/api";

interface AlertHourmeter {
    id_equip: number;
    code_equip: string;
    name_equip: string;
    name_area: string;
    maintenance_type: string;
    hour_current: number;
    hour_change: number;
    next_hour_change: number;
    hour_alert: number;
}

const HourmeterAlerts: React.FC = () => {
    const [alerts, setAlerts] = useState<AlertHourmeter[]>([]);

    useEffect(() => {
        api.get('/hourmeters/alerts')
            .then(res => setAlerts(res.data.data))
            .catch(err => console.error('Error al cargar alertas:', err));
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>ALERTAS DE HORÓMETROS</h2>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Área</th>
                        <th>Equipo</th>
                        <th>Tipo Mantenimiento</th>
                        <th>Horas Actual</th>
                        <th>Cambio</th>
                        <th>Próx. Cambio</th>
                        <th>Alerta</th>
                    </tr>
                    </thead>
                    <tbody>
                    {alerts.map((a, i) => (
                        <tr key={i}>
                            <td>{a.name_area}</td>
                            <td>{a.code_equip} - {a.name_equip}</td>
                            <td>{a.maintenance_type}</td>
                            <td>{a.hour_current}</td>
                            <td>{a.hour_change}</td>
                            <td>{a.next_hour_change}</td>
                            <td style={{ color: a.hour_alert <= 36 ? 'red' : 'inherit', fontWeight: a.hour_alert <= 36 ? 'bold' : 'normal' }}>
                                {a.hour_alert}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HourmeterAlerts;
