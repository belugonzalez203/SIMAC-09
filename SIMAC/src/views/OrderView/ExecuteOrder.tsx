import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactSelect from 'react-select';
import styles from '../../styles/CreateOrderForm.module.css';

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
    work_performed_details: string;
    failure_analysis: string;
    failure_cause: string;
    observations: string;
}

interface TechnicianOption {
    value: string;
    label: string;
}

interface SparePartOption {
    value: string;
    label: string;
}

const ExecuteOrderView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState<OrderFormData | null>(null);

    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const [techniciansOptions, setTechniciansOptions] = useState<TechnicianOption[]>([]);
    const [sparePartsOptions, setSparePartsOptions] = useState<SparePartOption[]>([]);
    const [selectedTechnicians, setSelectedTechnicians] = useState<TechnicianOption[]>([]);
    const [selectedSpareParts, setSelectedSpareParts] = useState<SparePartOption[]>([]);
    const [sparePartDetails, setSparePartDetails] = useState<{ [key: string]: { hour_current: string; hour_change: string } }>({});

    useEffect(() => {
        console.log("Spare parts seleccionados:", selectedSpareParts);
    }, [selectedSpareParts]);


    useEffect(() => {
        axios.get(`http://localhost:3002/workOrders/${id}`)
            .then(res => {
                const data = res.data.data;
                setForm({
                    ...data,
                    work_performed_details: data.work_performed_details || "",
                    failure_analysis: data.failure_analysis || "",
                    failure_cause: data.failure_cause || "",
                    observations: data.observations || "",
                });
            })
            .catch(err => console.error('Error al cargar la orden:', err));


        axios.get('http://localhost:3002/technician/')
            .then(res => setTechniciansOptions(
                res.data.data.map((t: any) => ({ value: t.id_tech, label: t.name_tech }))
            ))
            .catch(err => console.error('Error cargando técnicos:', err));

        axios.get('http://localhost:3002/sparePart/')
            .then(res => {
                console.log("Repuestos cargados desde backend:", res.data.data);
                const mapped = res.data.data.map((s: any) => {
                    console.log("🔍 Repuesto del backend:", s);
                    return {
                        value: s.id_spare_part,
                        label: s.name_spare_part
                    };
                });
                setSparePartsOptions(mapped);
            })

    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => prev ? { ...prev, [name]: value } : prev);
        setErrors(err => ({ ...err, [name]: false }));
    };

    const validate = () => {
        if (!form) return false;
        const required = [
            'work_performed_details', 'failure_analysis', 'failure_cause', 'observations'
        ];
        const newErrors: Record<string, boolean> = {};
        required.forEach(k => {
            const value = form[k as keyof OrderFormData];
            if (typeof value !== "string" || value.trim() === "") newErrors[k] = true;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !form) return;

        try {

            await axios.put(`http://localhost:3002/workOrders/${id}`, {
                observations: form.observations,
                work_performed_details: form.work_performed_details,
                failure_analysis: form.failure_analysis,
                failure_cause: form.failure_cause,
            });

            console.log("Technicians to assign:", selectedTechnicians.map(t => t.value));
            // técnicos de apoyo
            if (selectedTechnicians.length > 0) {
                await axios.post(`http://localhost:3002/workOrders/${id}/technicians`, {
                    technicians: selectedTechnicians.map(t => t.value)
                });
            }

            console.log("Spare parts to assign:", selectedSpareParts.map(s => ({
                id_spare_part: s.value,
                quantity_used: 1
            })))
            // repuestos utilizados
            if (selectedSpareParts.length > 0) {
                const sparePartsPayload = selectedSpareParts.map(s => ({
                    id_spare_part: s.value,
                    quantity_used: 1,
                    hour_current: Number(sparePartDetails[s.value]?.hour_current) || 0,
                    hour_change: Number(sparePartDetails[s.value]?.hour_change) || 0,
                }));

                console.log("Repuestos que se van a enviar al backend:", sparePartsPayload);

                if (sparePartsPayload.length > 0 && sparePartsPayload.every(p => p.id_spare_part)) {
                    await axios.post(`http://localhost:3002/workOrders/${id}/spareParts`, {
                        spareParts: sparePartsPayload
                    });
                } else {
                    console.warn("Payload inválido para repuestos:", sparePartsPayload);
                }

            }

            alert('Orden actualizada correctamente');
            navigate('/order/receivedList');
        } catch (err) {
            console.error('Error al actualizar la orden:', err);
            alert('Error al actualizar la orden');
        }
    };

    const handleCancel = () => navigate('/order/receivedList');

    if (!form) return <p className={styles.loading}>Cargando...</p>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>EJECUTAR ORDEN</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                {/* ==== Solicitud ==== */}
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Solicitud</h3>
                    <div className={styles.grid2}>
                        <Field label="Nro Orden" value={form.id_order} />
                        <Field label="Emisor" value={form.name_user} />
                        <Field label="Técnico" value={`${form.id_tech} - ${form.name_tech}`} />
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

                <hr className={styles.divider} />

                {/* ==== Trabajo Realizado ==== */}
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Trabajo Realizado</h3>
                    <div className={styles.gridFull}>
                        <div className={styles.fieldFull}>
                            <label>Análisis de la falla</label>
                            <textarea name="failure_analysis" value={form.failure_analysis} onChange={handleChange} />
                            {errors.failure_analysis && <span className={styles.error}>Este campo es requerido</span>}
                        </div>
                        <div className={styles.fieldFull}>
                            <label>Causa de la falla</label>
                            <textarea name="failure_cause" value={form.failure_cause} onChange={handleChange} />
                            {errors.failure_cause && <span className={styles.error}>Este campo es requerido</span>}
                        </div>
                        <div className={styles.fieldFull}>
                            <label>Trabajo realizado</label>
                            <textarea name="work_performed_details" value={form.work_performed_details} onChange={handleChange} />
                            {errors.work_performed_details && <span className={styles.error}>Este campo es requerido</span>}
                        </div>
                        <div className={styles.gridFull}>
                            <label>Personal de apoyo</label>
                            <ReactSelect
                                isMulti
                                options={techniciansOptions}
                                value={selectedTechnicians}
                                onChange={(selected) => setSelectedTechnicians(selected as TechnicianOption[])}
                                placeholder="Seleccione técnicos de apoyo..."
                            />

                            <label>Repuestos utilizados</label>
                            <ReactSelect
                                isMulti
                                options={sparePartsOptions}
                                value={selectedSpareParts}
                                onChange={(selected) => {
                                    const selectedArray = selected as SparePartOption[];
                                    setSelectedSpareParts(selectedArray);

                                    const updatedDetails = { ...sparePartDetails };
                                    selectedArray.forEach(sp => {
                                        if (!updatedDetails[sp.value]) {
                                            updatedDetails[sp.value] = { hour_current: '', hour_change: '' };
                                        }
                                    });

                                    // Elimina repuestos quitados
                                    Object.keys(updatedDetails).forEach(key => {
                                        if (!selectedArray.some(sp => sp.value === key)) {
                                            delete updatedDetails[key];
                                        }
                                    });

                                    setSparePartDetails(updatedDetails);
                                }}
                                placeholder="Seleccione repuestos utilizados..."
                            />
                            {selectedSpareParts.map(sp => (
                                <div key={sp.value} className={styles.sparePartRow}>
                                    <span>{sp.label}</span>
                                    <input
                                        type="number"
                                        placeholder="Hora actual"
                                        value={sparePartDetails[sp.value]?.hour_current || ''}
                                        onChange={(e) =>
                                            setSparePartDetails(prev => ({
                                                ...prev,
                                                [sp.value]: {
                                                    ...prev[sp.value],
                                                    hour_current: e.target.value
                                                }
                                            }))
                                        }
                                    />
                                    <input
                                        type="number"
                                        placeholder="Hora cambio"
                                        value={sparePartDetails[sp.value]?.hour_change || ''}
                                        onChange={(e) =>
                                            setSparePartDetails(prev => ({
                                                ...prev,
                                                [sp.value]: {
                                                    ...prev[sp.value],
                                                    hour_change: e.target.value
                                                }
                                            }))
                                        }
                                    />
                                </div>
                            ))}

                        </div>

                        <div className={styles.fieldFull}>
                            <label>Observaciones</label>
                            <textarea name="observations" value={form.observations} onChange={handleChange} />
                            {errors.observations && <span className={styles.error}>Este campo es requerido</span>}
                        </div>
                    </div>
                </section>

                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.saveButton}>GUARDAR</button>
                    <button type="button" className={styles.cancelButton} onClick={handleCancel}>CANCELAR</button>
                </div>
            </form>
        </div>
    );
};

const Field = ({ label, value, full = false, className = '' }: { label: string; value: string; full?: boolean; className?: string }) => (
    <div className={`${full ? styles.fieldFull : styles.field} ${className}`}>
        <label>{label}</label>
        <p className={styles.readOnlyValue}>{value}</p>
    </div>
);

export default ExecuteOrderView;

