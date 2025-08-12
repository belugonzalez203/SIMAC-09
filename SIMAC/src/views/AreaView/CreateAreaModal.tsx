import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Modal.module.css';
import axios from 'axios';

type NewAreaData = {
    codigo: string;
    area: string;
    responsable: string;
    contacto: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: NewAreaData) => void;
};

const CreateAreaModal : React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {

    const [formData, setFormData] = useState<NewAreaData>({
        codigo: '',
        area: '',
        responsable: '',
        contacto: '',
    });

    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        codigo: false,
        area: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {
            codigo: formData.codigo.trim() === '',
            area: formData.area.trim() === '',
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);

    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            id_area: formData.codigo,
            name_area: formData.area,
            in_charge: formData.responsable || null,
            contact_number_area: formData.contacto || null,
        };

        try {
            const response = await axios.post('http://localhost:3002/area/post', payload);
            console.log('Respuesta del servidor:', response.data);
            onConfirm(formData);
            onClose();
            navigate('/areas');
        } catch (error) {
            console.error('Error al guardar el área:', error);
            // mensaje de error en el modal
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h1 className={styles.title}>CREAR ÁREA</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label>Código<span>*</span></label>
                        <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} />
                        {errors.codigo && <p className={styles.error}>Este campo es obligatorio</p>}
                    </div>

                    <div className={styles.field}>
                        <label>Área<span>*</span></label>
                        <input type="text" name="area" value={formData.area} onChange={handleChange} />
                        {errors.area && <p className={styles.error}>Este campo es obligatorio</p>}
                    </div>

                    <div className={styles.field}>
                        <label>Responsable</label>
                        <input type="text" name="responsable" value={formData.responsable} onChange={handleChange} />
                    </div>

                    <div className={styles.field}>
                        <label>Contacto</label>
                        <input type="text" name="contacto" value={formData.contacto} onChange={handleChange} />
                    </div>

                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.saveButton}>GUARDAR</button>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                        >CANCELAR</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAreaModal;