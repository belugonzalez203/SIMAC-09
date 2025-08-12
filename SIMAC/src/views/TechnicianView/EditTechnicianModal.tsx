import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/Modal.module.css';
import { CustomSelect } from '../../components/CustomSelect';

type AreaOption = {
    value: string;
    label: string;
};

type Technician = {
    id_tech: string;
    name_tech: string;
    contact_number_tech: string;
    name_area?: string | null;
    id_area?: string | null;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    technician: Technician | null;
    onConfirm: () => void;
};

const EditTechnicianModal: React.FC<Props> = ({ isOpen, onClose, technician, onConfirm }) => {
    const [formData, setFormData] = useState<Technician>({
        id_tech: '',
        name_tech: '',
        contact_number_tech: '',
        id_area: '',
    });

    const [areaOptions, setAreaOptions] = useState<AreaOption[]>([]);

    useEffect(() => {
        if (isOpen && technician) {
            setFormData(technician);

            axios.get('http://localhost:3002/area/')
                .then(res => {
                    const options = res.data.data.map((a: any) => ({
                        value: a.id_area,
                        label: `${a.name_area} (${a.id_area})`,
                    }));
                    setAreaOptions(options);
                })
                .catch(err => console.error('Error al cargar áreas:', err));
        }
    }, [isOpen, technician]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3002/technician/${formData.id_tech}`, {
                name_tech: formData.name_tech,
                contact_number_tech: formData.contact_number_tech,
                id_area: formData.id_area || null,
            });
            onConfirm();
            onClose();
        } catch (error) {
            console.error('Error al actualizar el técnico:', error);
        }
    };

    if (!isOpen || !technician) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>EDITAR TÉCNICO</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>Código</label>
                    <input type="text" value={formData.id_tech} disabled />

                    <label>Nombre</label>
                    <input type="text" name="name_tech" value={formData.name_tech} onChange={handleChange} />

                    <label>Contacto</label>
                    <input type="text" name="contact_number_tech" value={formData.contact_number_tech} onChange={handleChange} />

                    <label>Área</label>
                    <CustomSelect
                        options={areaOptions}
                        value={areaOptions.find(opt => opt.value === formData.id_area) || null}
                        onChange={opt => setFormData(prev => ({ ...prev, id_area: opt?.value || '' }))}
                        placeholder={formData.name_area || "Selecciona un área"}
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

export default EditTechnicianModal;
