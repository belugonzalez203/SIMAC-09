import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/CreateOrderForm.module.css';

const CreateOrderView: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    type OrderFormData = {
        nroOrden: string;
        emisor: string;
        fechaSolicitud: string;
        horaSolicitud: string;
        fechaEntrega: string;
        tecnico: string;
        tecnicoId: string;
        equipo: string;
        equipoId: string;
        modeloEquipo: string;
        areaEquipo: string;
        tipoMantenimiento: string;
        claseMantenimiento: string;
        prioridad: string;
        trabajoSolicitado: string;
    };

    const initialData = location.state as Partial<OrderFormData> || {};
    const [form, setForm] = useState<OrderFormData>({
        nroOrden: '',
        emisor: '',
        fechaSolicitud: new Date().toISOString().split('T')[0],
        horaSolicitud: new Date().toTimeString().slice(0, 5),
        fechaEntrega: initialData.fechaEntrega || '',
        tecnico: initialData.tecnico || '',
        tecnicoId: '',
        equipo: initialData.equipo || '',
        equipoId: '',
        modeloEquipo: '',
        areaEquipo: '',
        tipoMantenimiento: initialData.tipoMantenimiento || '',
        claseMantenimiento: initialData.claseMantenimiento || '',
        prioridad: initialData.prioridad || '',
        trabajoSolicitado: initialData.trabajoSolicitado || '',
    });
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        setErrors(err => ({ ...err, [name]: false }));
    };

    const validate = () => {
        const required = [
            'tecnico',
            'equipo',
            'trabajoSolicitado',
        ];
        const newErr: Record<string, boolean> = {};
        required.forEach(k => {
            if (!form[k as keyof typeof form].trim()) newErr[k] = true;
        });
        setErrors(newErr);
        return Object.keys(newErr).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        console.log('Enviar orden:', form);
        // navigate('/ordenes'); // por ejemplo
    };
    const handleCancel = () => navigate('/ordenes');

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>CREAR ORDEN</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                {/* ==== Solicitud ==== */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Solicitud</h2>
                    <div className={styles.grid2}>
                        <div className={styles.field}>
                            <label>Nro Orden</label>
                            <input name="nroOrden" value={form.nroOrden} onChange={handleChange} />
                        </div>
                        <div className={styles.field}>
                            <label>Emisor</label>
                            <input name="emisor" value={form.emisor} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Técnico<span>*</span></label>
                            <input name="tecnico" value={form.tecnico} onChange={handleChange} />
                            {errors.tecnico && <p className={styles.error}>Este campo es obligatorio</p>}
                        </div>
                        <div className={styles.field}>
                            <label>Ficha técnico</label>
                            <input name="tecnicoId" value={form.tecnicoId} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Fecha solicitud</label>
                            <input type="date" name="fechaSolicitud" value={form.fechaSolicitud} onChange={handleChange} />
                        </div>
                        <div className={styles.field}>
                            <label>Hora solicitud</label>
                            <input type="time" name="horaSolicitud" value={form.horaSolicitud} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Fecha entrega</label>
                            <input type="date" name="fechaEntrega" value={form.fechaEntrega} onChange={handleChange} />
                        </div>

                        
                    </div>
                </section>

                <hr className={styles.divider} />

                {/* ==== Orden de Trabajo ==== */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Orden de Trabajo</h2>
                    <div className={styles.grid2}>
                        <div className={styles.field}>
                            <label>Equipo<span>*</span></label>
                            <input name="equipo" value={form.equipo} onChange={handleChange} />
                            {errors.equipo && <p className={styles.error}>Este campo es obligatorio</p>}
                        </div>
                        <div className={styles.field}>
                            <label>Codigo<span>*</span></label>
                            <input name="equipoId" value={form.equipoId} onChange={handleChange} />
                        </div>
                        <div className={styles.field}>
                            <label>Modelo</label>
                            <input name="modeloEquipo" value={form.modeloEquipo} onChange={handleChange} />
                        </div>
                        <div className={styles.field}>
                            <label>Ubicacion<span>*</span></label>
                            <input name="areaEquipo" value={form.areaEquipo} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Clase Mantenimiento</label>
                            <input name="claseMantenimiento" value={form.claseMantenimiento} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Tipo Mantenimiento</label>
                            <input name="tipoMantenimiento" value={form.tipoMantenimiento} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Prioridad</label>
                            <input name="prioridad" value={form.prioridad} onChange={handleChange} />
                        </div>

                        <div className={styles.fieldFull}>
                            <label>Trabajo solicitado<span>*</span></label>
                            <textarea
                                name="trabajoSolicitado"
                                value={form.trabajoSolicitado}
                                onChange={handleChange}
                                rows={3}
                            />
                            {errors.trabajoSolicitado && <p className={styles.error}>Este campo es obligatorio</p>}
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

export default CreateOrderView;
