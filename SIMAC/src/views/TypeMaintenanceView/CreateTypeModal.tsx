import React, { useState } from 'react';
import styles from '../../styles/Modal.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type TypeFormData = {
    nombre: string;
    horasCambio: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: TypeFormData) => void;
};

const CreateTypeChangeModal:React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<TypeFormData>({
        nombre: '',
        horasCambio: '',
    });

    const [errors, setErrors] = useState({
        nombre: false,
        horasCambio: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {
            nombre: formData.nombre.trim() === '',
            horasCambio: formData.horasCambio.trim() === '' || isNaN(Number(formData.horasCambio)),
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            name_change: formData.nombre,
            hour_change: formData.horasCambio ? parseInt(formData.horasCambio) : 0,
        };

        try {
            await axios.post('http://localhost:3002/typeChangeMaintenance', payload);
            onConfirm(formData);
            onClose();
            navigate('/type/maintenance');
        } catch (err) {
            console.error('Error al crear tipo de cambio:', err);
        }
    };

    const handleCancel = async () => {
        onClose();
        navigate('/type/maintenance');
    }

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Crear Tipo de Repuesto</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>Nombre<span>*</span></label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                    {errors.nombre && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Horas<span>*</span></label>
                    <input type="number" name="horasCambio" value={formData.horasCambio} onChange={handleChange} />
                    {errors.horasCambio && <p className={styles.error}>Debe ser un número válido</p>}

                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.saveButton}>GUARDAR</button>
                        <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                            CANCELAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTypeChangeModal;

