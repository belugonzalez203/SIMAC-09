import React, { useState, useEffect } from 'react';
import styles from '../../styles/Modal.module.css';
import axios from 'axios';

interface TypeChange {
    id_type_change: number;
    name_change: string;
    hour_change: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    typeChange: TypeChange;
    onConfirm: () => void;
}

const EditTypeChangeModal: React.FC<Props> = ({ isOpen, onClose, typeChange, onConfirm }) => {
    const [formData, setFormData] = useState<TypeChange>({ ...typeChange });
    const [errors, setErrors] = useState({ name_change: false, hour_change: false });

    useEffect(() => {
        setFormData({ ...typeChange });
    }, [typeChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'hour_change' ? Number(value) : value }));
    };

    const validate = () => {
        const newErrors = {
            name_change: formData.name_change.trim() === '',
            hour_change: isNaN(formData.hour_change),
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await axios.put(`http://localhost:3002/typeChangeMaintenance/${formData.id_type_change}`, formData);
            onConfirm();
            onClose();
        } catch (err) {
            console.error('Error al actualizar tipo:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>EDITAR TIPO DE CAMBIO</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>Nombre</label>
                    <input type="text" name="name_change" value={formData.name_change} onChange={handleChange} />
                    {errors.name_change && <p className={styles.error}>Campo obligatorio</p>}

                    <label>Horas</label>
                    <input type="number" name="hour_change" value={formData.hour_change} onChange={handleChange} />
                    {errors.hour_change && <p className={styles.error}>Debe ser un número válido</p>}

                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.saveButton}>GUARDAR</button>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>CANCELAR</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTypeChangeModal;

