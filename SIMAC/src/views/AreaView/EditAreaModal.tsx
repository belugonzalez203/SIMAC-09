import React, { useEffect, useState } from 'react';
import styles from '../../styles/Modal.module.css';
import axios from 'axios';

interface Area {
    id_area: string;
    name_area: string;
    in_charge: string;
    contact_number_area: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    area: Area;
    onConfirm: (updatedArea: Area) => void;
}

const EditAreaModal: React.FC<Props> = ({ isOpen, onClose, area, onConfirm }) => {
    const [formData, setFormData] = useState<Area>({ ...area });

    const [errors, setErrors] = useState({
        name_area: false,
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({ ...area });
        }
    }, [isOpen, area]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {
            name_area: formData.name_area.trim() === '',
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await axios.put(`http://localhost:3002/area/${formData.id_area}`, {
                name_area: formData.name_area,
                in_charge: formData.in_charge,
                contact_number_area: formData.contact_number_area,
            });
            onConfirm(formData);
            onClose();
        } catch (err) {
            console.error('Error al actualizar el área:', err);
            alert('Hubo un error al actualizar el área');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Editar Área</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>Código</label>
                    <input type="text" name="id_area" value={formData.id_area} disabled className={styles.disabledInput} />

                    <label>Nombre del Área</label>
                    <input
                        type="text"
                        name="name_area"
                        value={formData.name_area}
                        onChange={handleChange}
                    />
                    {errors.name_area && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Responsable</label>
                    <input
                        type="text"
                        name="in_charge"
                        value={formData.in_charge}
                        onChange={handleChange}
                    />

                    <label>Contacto</label>
                    <input
                        type="text"
                        name="contact_number_area"
                        value={formData.contact_number_area}
                        onChange={handleChange}
                    />

                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.saveButton}>GUARDAR</button>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>CANCELAR</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAreaModal;
