import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import styles from '../../styles/Print.module.css';

interface OrderFormData {
    id_order: string;
    name_user: string;
    date_request: string;
    hour_request: string;
    id_tech: string;
    name_tech: string;
    date_delivery: string;
    code_equip: string;
    name_equip: string;
    brand_equip: string;
    model_equip: string;
    name_area: string;
    name_class: string;
    name_type: string;
    priority: string;
    work_requested: string;
    completion_date: string;
    observations: string;
    work_performed_details: string;
    failure_analysis: string;
    failure_cause: string;
}

interface TechnicianSupport {
    id_tech: string;
    name_tech: string;
}

interface SparePartUsed {
    id_spare_part: string;
    code_spare_part: string;
    name_spare_part: string;
    hour_current: number;
    hour_change: number;
}

const ExecutedOrderDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState<OrderFormData | null>(null);
    const [technicians, setTechnicians] = useState<TechnicianSupport[]>([]);
    const [spareParts, setSpareParts] = useState<SparePartUsed[]>([]);

    useEffect(() => {
        axios.get(`http://localhost:3002/workOrders/${id}`)
            .then((res) => {
                setForm(res.data.data);
            })
            .catch((err) => console.error('Error al cargar la orden:', err));

        axios.get(`http://localhost:3002/workOrderTechnicians/techniciansByOrder/${id}`)
            .then((res) => setTechnicians(res.data.data))
            .catch((err) => console.error('Error al cargar técnicos de apoyo:', err));

        axios.get(`http://localhost:3002/workOrderSpareParts/sparePartsByOrder/${id}`)
            .then((res) => setSpareParts(res.data.data))
            .catch((err) => console.error('Error al cargar repuestos:', err));
    }, [id]);


    if (!form) return <p className={styles.loading}>Cargando...</p>;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Enviar orden:', form);
    };

    const handleCancel = () => navigate('/order/executedList');

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>ORDEN EJECUTADA</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                {/* ==== Solicitud ==== */}
                <section className={styles.section}>
                    <h3>Solicitud</h3>
                    <div className={styles.tableRow}>
                        <div className={styles.cell}><strong>Nro Orden:</strong> {form.id_order}</div>
                        <div className={styles.cell}><strong>Emisor:</strong> {form.name_user}</div>
                        <div className={styles.cell}><strong>Técnico:</strong> {form.id_tech} - {form.name_tech}</div>
                    </div>
                    <div className={styles.tableRow}>
                        <div className={styles.cell}><strong>Fecha solicitud:</strong> {form.date_request}</div>
                        <div className={styles.cell}><strong>Hora solicitud:</strong> {form.hour_request}</div>
                        <div className={styles.cell}><strong>Fecha entrega:</strong> {form.date_delivery}</div>
                    </div>
                </section>

                <hr className={styles.divider} />

                {/* ==== Orden de Trabajo ==== */}
                <section className={styles.section}>
                    <h3>Orden de Trabajo</h3>
                    <div className={styles.tableRow}>
                        <div className={styles.cell}><strong>Equipo:</strong> {form.code_equip} - {form.name_equip}</div>
                        <div className={styles.cell}><strong>Marca:</strong> {form.brand_equip}</div>
                        <div className={styles.cell}><strong>Modelo:</strong> {form.model_equip}</div>
                    </div>
                    <div className={styles.tableRow}>
                        <div className={styles.cell}><strong>Ubicación:</strong> {form.name_area}</div>
                        <div className={styles.cell}><strong>Clase Mantenimiento:</strong> {form.name_class}</div>
                        <div className={styles.cell}><strong>Tipo Mantenimiento:</strong> {form.name_type}</div>
                        <div className={styles.cell}><strong>Prioridad:</strong> {form.priority}</div>
                    </div>
                    <div className={styles.tableRow}>
                        <div className={styles.cellFull}><strong>Trabajo solicitado:</strong> {form.work_requested}</div>
                    </div>
                </section>

                {/* ==== Trabajo Ejecutado ==== */}
                <section className={styles.section}>
                    <h3>Trabajo Ejecutado</h3>
                    <div className={styles.cellFull}><strong>Fecha entrega:</strong> {form.completion_date}</div>
                    <div className={styles.cellFull}><strong>Análisis de la falla:</strong> {form.failure_analysis}</div>
                    <div className={styles.cellFull}><strong>Causa de la falla:</strong> {form.failure_cause}</div>
                    <div className={styles.cellFull}><strong>Detalle del trabajo:</strong> {form.work_performed_details}</div>
                    <div className={styles.cellFull}>
                        <strong>Repuestos Utilizados:</strong>
                        {spareParts.length > 0 ? (
                            <table className={styles.sparePartsTable}>
                                <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Hora Actual</th>
                                    <th>Hora de Cambio</th>
                                </tr>
                                </thead>
                                <tbody>
                                {spareParts.map((s, i) => (
                                    <tr key={i}>
                                        <td>{s.code_spare_part}</td>
                                        <td>{s.name_spare_part}</td>
                                        <td>{s.hour_current}</td>
                                        <td>{s.hour_change}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No se registraron repuestos utilizados.</p>
                        )}
                    </div>

                    <div className={styles.cellFull}>
                        <strong>Técnicos de Apoyo:</strong>{' '}
                        {technicians.length > 0 ? (
                            <span>
                            {technicians
                                .map((t) => `(${t.id_tech}) ${t.name_tech}`)
                                .join(', ')}
                        </span>
                        ) : (
                            <span>No se registraron técnicos de apoyo.</span>
                        )}
                    </div>
                    <div className={styles.cellFull}><strong>Observaciones:</strong> {form.observations}</div>
                </section>

                <div className={styles.buttonGroup}>
                    <button type="button" className={styles.cancelButton} onClick={handleCancel}>ATRÁS</button>
                    <button type="submit" className={styles.saveButton}
                            onClick={() => navigate(`/order/print/${form.id_order}`)}
                    >IMPRIMIR</button>
                </div>
            </form>
        </div>
    );
};

export default ExecutedOrderDetails;
