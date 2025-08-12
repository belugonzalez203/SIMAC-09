import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/Modal.module.css';

type NewOrderData = {
    codigo: string;
    nombre: string;
    marca: string;
    modelo: string;
    chasis: string;
    placa: string;
    servicio: string;
    area: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: NewOrderData) => void;
};

const CreateEquipmentModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<NewOrderData>({
        codigo: '',
        nombre: '',
        marca: '',
        modelo: '',
        chasis: '',
        placa: '',
        servicio: '',
        area: '',
    });

    const [service, setService] = useState<{ id_service: string; name_service: string }[]>([]);
    const [areas, setAreas] = useState<{ id_area: string; name_area: string }[]>([]);

    const [errors, setErrors] = useState({
        codigo: false,
        nombre: false,
        marca: false,
        chasis: false,
        placa: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {
            codigo: formData.codigo.trim() === '',
            nombre: formData.nombre.trim() === '',
            marca: formData.marca.trim() === '',
            chasis: formData.chasis.trim() === '',
            placa: formData.placa.trim() === '',
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);

    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            code_equip: formData.codigo,
            name_equip: formData.nombre,
            number_plate: formData.placa,
            brand_equip: formData.marca || null,
            model_equip: formData.modelo || null,
            chassis_equip: formData.chasis,
            id_service: formData.servicio ? parseInt(formData.servicio) : null,
            id_area: formData.area || null,
        };

        try {
            const response = await axios.post('http://localhost:3002/equipment/post', payload);
            console.log('Respuesta del servidor:', response.data);
            onConfirm(formData);
            onClose();
            navigate('/equipos');
        } catch (error) {
            console.error('Error al guardar el orden de trabajo:', error);
            // mensaje de error en el modal
        }
    };

    useEffect(() => {
        if (isOpen) {
            axios.get('http://localhost:3002/area/')
                .then(res => setAreas(res.data.data))
                .catch(err => console.error('Error al cargar areas:', err));

            axios.get('http://localhost:3002/serviceStatusEquipment/')
                .then(res => setService(res.data.data))
                .catch(err => console.error('Error al cargar tipos de mantenimiento:', err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Crear Equipo</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>Código<span>*</span></label>
                    <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} />
                    {errors.codigo && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Nombre Equipo<span>*</span></label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                    {errors.nombre && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Marca<span>*</span></label>
                    <input type="text" name="marca" value={formData.marca} onChange={handleChange} />
                    {errors.marca && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Modelo</label>
                    <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} />

                    <label>Chasis<span>*</span></label>
                    <input type="text" name="chasis" value={formData.chasis} onChange={handleChange} />
                    {errors.chasis && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Número de placa<span>*</span></label>
                    <input type="text" name="placa" value={formData.placa} onChange={handleChange} />
                    {errors.placa && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Área</label>
                    <select name="area" value={formData.area} onChange={handleChange}>
                        <option value="">Seleccione el área</option>
                        {areas.map((t, i) => (
                            <option key={i} value={t.id_area}>{t.name_area}</option>
                        ))}
                    </select>

                    <label>Estado de Servicio</label>
                    <select name="servicio" value={formData.servicio} onChange={handleChange}>
                        <option value="">Seleccione el estado de servicio</option>
                        {service.map((t, i) => (
                            <option key={i} value={t.id_service}>{t.name_service}</option>
                        ))}
                    </select>

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

export default CreateEquipmentModal;
