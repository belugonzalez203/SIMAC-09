import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import styles from '../../styles/CreateOrderForm.module.css';
import api from "../../services/api";


interface OrderFormData {
    id_order: string;
    name_user: string;
    date_request: string;
    hour_request: string;
    code_tech: string;
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
}

const OrderReceivedView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState<OrderFormData | null>(null);

    useEffect(() => {
        api.get(`/workOrders/${id}`)
            .then((res) => {
                setForm(res.data.data);
            })
            .catch((err) => console.error('Error al cargar la orden:', err));

    }, [id]);

    const handleCancel = () => navigate('/order/receivedList');

    if (!form) return <p className={styles.loading}>Cargando...</p>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>DETALLES ORDEN RECIBIDA</h2>
            <div className={styles.form}>
                {/* ==== Solicitud ==== */}
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Solicitud</h3>
                    <div className={styles.grid2}>
                        <Field label="Nro Orden" value={form.id_order} />
                        <Field label="Emisor" value={form.name_user} />
                        <Field label="Técnico" value={`${form.code_tech} - ${form.name_tech}`} />
                        <Field label="Fecha solicitud" value={form.date_request} />
                        <Field label="Hora solicitud" value={form.hour_request} />
                        <Field label="Fecha entrega" value={form.date_delivery} />
                    </div>
                </section>

                <hr className={styles.divider} />

                {/* ==== Orden de Trabajo ==== */}
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Orden de Trabajo</h3>
                    <div className={styles.grid2}>
                        <Field label="Equipo" value={form.name_equip} />
                        <Field label="Código" value={form.code_equip} />
                        <Field label="Marca" value={form.brand_equip} />
                        <Field label="Modelo" value={form.model_equip} />
                        <Field label="Ubicación" value={form.name_area} />
                        <Field label="Clase Mantenimiento" value={form.name_class} />
                        <Field label="Tipo Mantenimiento" value={form.name_type} />
                        <Field label="Prioridad" value={form.priority} />
                        <div className={styles.fieldSpan3}>
                            <label>Trabajo Solicitado</label>
                            <p className={styles.readOnlyValue}>{form.work_requested}</p>
                        </div>
                    </div>
                </section>

                <div className={styles.buttonGroup}>

                    <button type="button"
                            className={styles.cancelButton}
                            onClick={handleCancel}
                    >
                        ATRÁS
                    </button>

                    <button type="submit"
                            className={styles.saveButton}
                            onClick={() => navigate(`/order/execute/${form.id_order}`)}
                    >
                        EJECUTAR
                    </button>

                </div>
            </div>
        </div>
    );
};

const Field = ({ label, value, full = false, className = '' }: { label: string; value: string; full?: boolean; className?: string }) => (
    <div className={`${full ? styles.fieldFull : styles.field} ${className}`}>
        <label>{label}</label>
        <p className={styles.readOnlyValue}>{value}</p>
    </div>
);

export default OrderReceivedView;
