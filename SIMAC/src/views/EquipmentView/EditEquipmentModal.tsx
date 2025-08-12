import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/Modal.module.css';
import { CustomSelect } from '../../components/CustomSelect';

type EquipmentFormData = {
    id_equip: number;
    codigo: string;
    nombre: string;
    marca: string;
    modelo: string;
    chasis: string;
    placa: string;
    id_area: string;
    id_service: number | null;
    name_area?: string;
    name_service?: string;
};

type Option = {
    value: string;
    label: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    equipment: EquipmentFormData;
    onConfirm: (updated: EquipmentFormData) => void;
};

const EditEquipmentModal: React.FC<Props> = ({ isOpen, onClose, equipment, onConfirm }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<EquipmentFormData>({
        ...equipment,
        id_area: equipment.id_area ?? '',
        id_service: equipment.id_service ?? null,
    });

    const [areas, setAreas] = useState<Option[]>([]);
    const [services, setServices] = useState<Option[]>([]);

    const [errors, setErrors] = useState({
        codigo: false,
        nombre: false,
        marca: false,
        chasis: false,
        placa: false,
    });

    useEffect(() => {
        if (isOpen) {
            const fetchOptions = async () => {
                try {
                    const [areaRes, serviceRes] = await Promise.all([
                        axios.get('http://localhost:3002/area/'),
                        axios.get('http://localhost:3002/serviceStatusEquipment/')
                    ]);

                    const areaOptions = areaRes.data.data.map((a: any) => ({
                        value: a.id_area.toString(),
                        label: a.name_area,
                    }));

                    const serviceOptions = serviceRes.data.data.map((s: any) => ({
                        value: s.id_service.toString(),
                        label: s.name_service,
                    }));

                    setAreas(areaOptions);
                    setServices(serviceOptions);

                    setFormData({
                        ...equipment,
                        id_area: equipment.id_area?.toString() ?? null,
                        id_service: equipment.id_service ?? null,
                    });

                } catch (error) {
                    console.error('Error al cargar opciones:', error);
                }
            };
            fetchOptions();
        }
    }, [isOpen, equipment]);


    useEffect(() => {
        if (areas.length && formData.id_area !== null) {
            const match = areas.find(opt => (opt.value) === String(formData.id_area));
            if (!match) {
                setFormData(prev => ({ ...prev, id_area: '' }));
            }
        }

        if (services.length && formData.id_service !== null) {
            const match = services.find(opt => parseInt(opt.value) === formData.id_service);
            if (!match) {
                setFormData(prev => ({ ...prev, id_service: null }));
            }
        }
    }, [areas, services]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAreaChange = (opt: Option | null) => {
        setFormData(prev => ({ ...prev, id_area: opt ? (opt.value) : '' }));
    };

    const handleServiceChange = (opt: Option | null) => {
        setFormData(prev => ({ ...prev, id_service: opt ? parseInt(opt.value) : null }));
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
            id_service: formData.id_service,
            id_area: formData.id_area || null,
        };

        try {
            console.log('Payload a enviar:', payload);
            const response = await axios.put(`http://localhost:3002/equipment/${formData.id_equip}`, payload);
            console.log('Equipo actualizado:', response.data);
            onConfirm(formData);
            onClose();
            navigate('/equipos');
        } catch (error) {
            console.error('Error al actualizar equipo:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Editar Equipo</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>Código<span>*</span></label>
                    <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} />
                    {errors.codigo && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Nombre<span>*</span></label>
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

                    <label>Placa<span>*</span></label>
                    <input type="text" name="placa" value={formData.placa} onChange={handleChange} />
                    {errors.placa && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Área</label>
                    <CustomSelect
                        options={areas}
                        value={
                            formData.id_area
                                ? areas.find(opt => opt.value === formData.id_area) ?? null
                                : null
                        }
                        onChange={handleAreaChange}
                        placeholder="Seleccione un área"
                    />

                    <label>Estado de Servicio</label>
                    <CustomSelect
                        options={services}
                        value={
                            services.find(opt => parseInt(opt.value) === formData.id_service!) || null
                        }
                        onChange={handleServiceChange}
                        placeholder= "Seleccione un estado"
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

export default EditEquipmentModal;

