import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/CreateOrderForm.module.css';

const CreateOrderView: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nroOrden: '',
        fechaSolicitud: '',
        horaSolicitud: '',
        tecnico: '',
        ficha: '',
        emisor: '',
        equipo: '',
        modeloEquipo: '',
        ubicacion: '',
        area: '',
        supervisor: '',
        contactoSupervisor: '',
        fechaInicio: '',
        horaInicio: '',
        prioridad: '',
        claseMtto: '',
        tipoMtto: '',
        fechaFin: '',
        horaFin: '',
        descripcionOrden: '',
        trabajoSolicitado: '',
        causaFalla: '',
        analisisFalla: '',
        detalleTrabajo: '',
        repuestos: '',
        personalApoyo: '',
        observaciones: '',
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
            'nroOrden',
            'fechaSolicitud',
            'horaSolicitud',
            'tecnico',
            'nroOTA',
            'equipo',
            'area',
            'supervisor',
            'fechaInicio',
            'horaInicio',
            'descripcionOrden',
            'trabajoSolicitado',
            'causaFalla',
            'analisisFalla',
            'detalleTrabajo',
            'repuestos',
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
                            <label>Nro Orden<span>*</span></label>
                            <input name="nroOrden" value={form.nroOrden} onChange={handleChange} />
                            {errors.nroOrden && <p className={styles.error}>Este campo es obligatorio</p>}
                        </div>
                        <div className={styles.field}>
                            <label>Emisor<span>*</span></label>
                            <input name="nroOTA" value={form.emisor} onChange={handleChange} />
                            {errors.emisor && <p className={styles.error}>Este campo es obligatorio</p>}
                        </div>

                        <div className={styles.field}>
                            <label>Fecha solicitud<span>*</span></label>
                            <input type="date" name="fechaSolicitud" value={form.fechaSolicitud} onChange={handleChange} />
                            {errors.fechaSolicitud && <p className={styles.error}>Este campo es obligatorio</p>}
                        </div>

                        <div className={styles.field}>
                            <label>Hora solicitud<span>*</span></label>
                            <input type="time" name="horaSolicitud" value={form.horaSolicitud} onChange={handleChange} />
                            {errors.horaSolicitud && <p className={styles.error}>Este campo es obligatorio</p>}
                        </div>
                        <div className={styles.field}>
                            <label>Equipo<span>*</span></label>
                            <input name="equipo" value={form.equipo} onChange={handleChange} />
                            {errors.equipo && <p className={styles.error}>Este campo es obligatorio</p>}
                        </div>

                        <div className={styles.field}>
                            <label>Técnico<span>*</span></label>
                            <input name="tecnico" value={form.tecnico} onChange={handleChange} />
                            {errors.tecnico && <p className={styles.error}>Este campo es obligatorio</p>}
                        </div>
                        <div className={styles.field}>
                            <label>Modelo</label>
                            <input name="modeloEquipo" value={form.modeloEquipo} onChange={handleChange} />
                        </div>

                    </div>
                </section>

                <hr className={styles.divider} />

                {/* ==== Orden de Trabajo ==== */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Orden de Trabajo</h2>
                    <div className={styles.grid2}>
                        <div className={styles.field}>
                            <label>Área<span>*</span></label>
                            <input name="area" value={form.area} onChange={handleChange} />
                            {errors.area && <p className={styles.error}>Este campo es obligatorio</p>}
                        </div>
                        <div className={styles.field}>
                            <label>Prioridad</label>
                            <input name="prioridad" value={form.prioridad} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Supervisor<span>*</span></label>
                            <input name="supervisor" value={form.supervisor} onChange={handleChange} />
                            {errors.supervisor && <p className={styles.error}>Este campo es obligatorio</p>}
                        </div>
                        <div className={styles.field}>
                            <label>Clase Mantenimiento</label>
                            <input name="claseMtto" value={form.claseMtto} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Contacto Supervisor</label>
                            <input name="contactoSupervisor" value={form.contactoSupervisor} onChange={handleChange} />
                        </div>
                        <div className={styles.field}>
                            <label>Tipo Mantenimiento</label>
                            <input name="tipoMtto" value={form.tipoMtto} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Fecha inicio<span>*</span></label>
                            <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} />
                            {errors.fechaInicio && <p className={styles.error}>Este campo es obligatorio</p>}
                        </div>
                        <div className={styles.field}>
                            <label>Fecha fin</label>
                            <input type="date" name="fechaFin" value={form.fechaFin} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Hora inicio<span>*</span></label>
                            <input type="time" name="horaInicio" value={form.horaInicio} onChange={handleChange} />
                            {errors.horaInicio && <p className={styles.error}>Este campo es obligatorio</p>}
                        </div>
                        <div className={styles.field}>
                            <label>Hora fin</label>
                            <input type="time" name="horaFin" value={form.horaFin} onChange={handleChange} />
                        </div>

                        <div className={styles.fieldFull}>
                            <label>Descripción Orden Trabajo<span>*</span></label>
                            <textarea
                                name="descripcionOrden"
                                value={form.descripcionOrden}
                                onChange={handleChange}
                                rows={3}
                            />
                            {errors.descripcionOrden && <p className={styles.error}>Este campo es obligatorio</p>}
                        </div>
                    </div>
                </section>

                <hr className={styles.divider} />

                {/* ==== Trabajo Realizado ==== */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Trabajo Realizado</h2>
                    <div className={styles.gridFull}>
                        {['trabajoSolicitado','causaFalla','analisisFalla','detalleTrabajo','repuestos','personalApoyo','observaciones'].map((key) => (
                            <div key={key} className={styles.fieldFull}>
                                <label>
                                    {key === 'trabajoSolicitado' ? 'Trabajo solicitado*' :
                                        key === 'causaFalla'       ? 'Causa de la falla*' :
                                            key === 'analisisFalla'    ? 'Análisis de la falla*' :
                                                key === 'detalleTrabajo'   ? 'Detalle trabajo realizado*' :
                                                    key === 'repuestos'        ? 'Repuestos utilizados*' :
                                                        key === 'personalApoyo'    ? 'Personal de apoyo' :
                                                            'Observaciones'}
                                    {['trabajoSolicitado','causaFalla','analisisFalla','detalleTrabajo','repuestos'].includes(key) && <span>*</span>}
                                </label>
                                <textarea
                                    name={key}
                                    value={form[key as keyof typeof form]}
                                    onChange={handleChange}
                                    rows={2}
                                />
                                {errors[key] && <p className={styles.error}>Este campo es obligatorio</p>}
                            </div>
                        ))}
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
