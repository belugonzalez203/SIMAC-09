import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/Modal.module.css';
import { CustomSelect } from '../../components/CustomSelect';

type TechnicianData = {
    codigo: string;
    nombre: string;
    contacto: string;
    area: string;
};

type AreaOption = {
    value: string;
    label: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: TechnicianData) => void;
};

const CreateTechnicianModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<TechnicianData>({
        codigo: '',
        nombre: '',
        contacto: '',
        area: '',
    });

    const [errors, setErrors] = useState({
        codigo: false,
        nombre: false,
    });

    const [areaOptions, setAreaOptions] = useState<AreaOption[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {
            codigo: formData.codigo.trim() === '',
            nombre: formData.nombre.trim() === '',
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            id_tech: formData.codigo,
            name_tech: formData.nombre,
            contact_number_tech: formData.contacto || null,
            id_area: formData.area || null,
        };

        try {
            const response = await axios.post('http://localhost:3002/technician/post', payload);
            console.log('Técnico creado:', response.data);
            onConfirm(formData);
            onClose();
            navigate('/tecnicos');
        } catch (error) {
            console.error('Error al guardar el técnico:', error);
        }
    };

    const handleCancel = () => {
        onClose();
        navigate('/tecnicos');
    };

    useEffect(() => {
        if (isOpen) {
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
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>CREAR TÉCNICO</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>Código<span>*</span></label>
                    <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} />
                    {errors.codigo && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Nombre<span>*</span></label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                    {errors.nombre && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Contacto</label>
                    <input type="text" name="contacto" value={formData.contacto} onChange={handleChange} />

                    <label>Área</label>
                    <CustomSelect
                        options={areaOptions}
                        value={areaOptions.find(opt => opt.value === formData.area) || null}
                        onChange={opt => setFormData(prev => ({ ...prev, area: opt?.value || '' }))}
                        placeholder="Seleccione un área"
                    />

                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.saveButton}>GUARDAR</button>
                        <button type="button" className={styles.cancelButton} onClick={handleCancel}>CANCELAR</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTechnicianModal;
