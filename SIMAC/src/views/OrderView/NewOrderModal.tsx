import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Modal.module.css';

type NewOrderData = {
    tecnico: string;
    fechaEntrega: string;
    equipo: string;
    claseMantenimiento: string;
    tipoMantenimiento: string;
    prioridad: string;
    trabajoSolicitado: string;
};

type Option = {
    value: string;
    label: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: NewOrderData) => void;
};

const NewOrderModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
    const navigate = useNavigate();

    const [form, setForm] = useState<NewOrderData>({
        tecnico: '',
        fechaEntrega: '',
        equipo: '',
        claseMantenimiento: 'Correctivo',
        tipoMantenimiento: 'Mecánico',
        prioridad: 'Media',
        trabajoSolicitado: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleConfirm = () => {
        onConfirm(form);
        navigate('/order/create', { state: form });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Nueva Orden de Trabajo</h2>
                <div className={styles.form}>
                    <label>Técnico</label>
                    <input name="tecnico" value={form.tecnico} onChange={handleChange} />

                    <label>Fecha de Entrega</label>
                    <input type="date" name="fechaEntrega" value={form.fechaEntrega} onChange={handleChange} />

                    <label>Equipo</label>
                    <input name="equipo" value={form.equipo} onChange={handleChange} />

                    <label>Clase de Mantenimiento</label>
                    <select name="claseMantenimiento" value={form.claseMantenimiento} onChange={handleChange}>
                        <option value="Correctivo">Correctivo</option>
                        <option value="Predictivo">Predictivo</option>
                        <option value="Preventivo">Preventivo</option>
                        <option value="Mejoramiento">Mejoramiento</option>
                    </select>

                    <label>Tipo de Mantenimiento</label>
                    <select name="tipoMantenimiento" value={form.tipoMantenimiento} onChange={handleChange}>
                        <option value="Mecánico">Mecánico</option>
                        <option value="Eléctrico">Eléctrico</option>
                        <option value="Electrónico">Electrónico</option>
                    </select>

                    <label>Prioridad</label>
                    <select name="prioridad" value={form.prioridad} onChange={handleChange}>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                    </select>

                    <label>Trabajo solicitado</label>
                    <textarea name="trabajoSolicitado" value={form.trabajoSolicitado} onChange={handleChange} />

                    <div className={styles.buttonGroup}>
                        <button onClick={handleConfirm} className={styles.saveButton}>Guardar</button>
                        <button onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewOrderModal;
