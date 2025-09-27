import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Modal.module.css';
import { CustomSelect } from '../../components/CustomSelect';
import api from "../../services/api";

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

    const [formData, setFormData] = useState<NewOrderData>({
        tecnico: '',
        fechaEntrega: '',
        equipo: '',
        claseMantenimiento: '',
        tipoMantenimiento: '',
        prioridad: 'Media',
        trabajoSolicitado: '',
    });

    const [tecnicoOptions, setTecnicoOptions] = useState<Option[]>([]);
    const [equipoOptions, setEquipoOptions] = useState<Option[]>([]);
    const [claseOptions, setClaseOptions] = useState<Option[]>([]);
    const [tipoOptions, setTipoOptions] = useState<Option[]>([]);
    const [prioridadOptions] = useState<Option[]>([
            { value: 'Baja', label: 'Baja' },
            { value: 'Media', label: 'Media' },
            { value: 'Alta', label: 'Alta' },
    ]);

    const [errors, setErrors] = useState({
        tecnico: false,
        equipo: false,
        trabajoSolicitado: false,
        fechaEntrega: false,
        claseMantenimiento: false,
        tipoMantenimiento: false,
    });

    const validate = () => {
        const today = new Date().toISOString().slice(0, 10);

        const fechaEntregaValida = formData.fechaEntrega === '' || formData.fechaEntrega >= today;

            const newErrors = {
            tecnico: formData.tecnico.trim() === '',
            equipo: formData.equipo.trim() === '',
            claseMantenimiento: formData.claseMantenimiento.trim() === '',
            tipoMantenimiento: formData.tipoMantenimiento.trim() === '',
            trabajoSolicitado: formData.trabajoSolicitado.trim() === '',
            fechaEntrega: !fechaEntregaValida,
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

            const payload = {
                id_user: "1",
                id_tech: formData.tecnico,
                date_delivery: formData.fechaEntrega || null,
                id_equip: parseInt(formData.equipo),
                id_class: parseInt(formData.claseMantenimiento),
                id_type: parseInt(formData.tipoMantenimiento),
                priority: formData.prioridad,
                work_requested: formData.trabajoSolicitado,
            };

            try {
                const response = await api.post('/workOrders/post', payload);
                console.log('Respuesta del servidor:', response.data);

                await api.put(`/equipment/updateService/${formData.equipo}`, { id_service: 2 });

                onConfirm(formData);
                onClose();
                navigate('/order/received');
            } catch (error) {
                console.error('Error al guardar el orden de trabajo:', error);
            }
    };

    useEffect(() => {
        if (isOpen) {
            api.get('/technician/')
                .then(res => setTecnicoOptions(
                    res.data.data.map((t: any) => ({
                        value: t.id_tech,
                        label: `${t.name_tech} (${t.id_tech})`
                    }))
                ))
                .catch(err => console.error('Error al cargar técnicos:', err));

            api.get('/equipment/')
                .then(res => setEquipoOptions(
                    res.data.data.map((e: any) => ({
                        value: String(e.id_equip),
                        label: `${e.code_equip} ${e.name_equip}`
                    }))
                ))
                .catch(err => console.error('Error al cargar equipos:', err));

            api.get('/maintenance/class')
                .then(res => setClaseOptions(
                    res.data.data.map((c: any) => ({
                        value: String(c.id_class),
                        label: c.name_class
                    }))
                ))
                .catch(err => console.error('Error al cargar clases de mantenimiento:', err));

            api.get('/maintenance/type')
                .then(res => setTipoOptions(
                    res.data.data.map((t: any) => ({
                        value: String(t.id_type),
                        label: t.name_type
                    }))
                ))
                .catch(err => console.error('Error al cargar tipos de mantenimiento:', err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Nueva Orden de Trabajo</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>Técnico<span>*</span></label>
                    <CustomSelect
                        options={tecnicoOptions}
                        value={tecnicoOptions.find(opt => opt.value === formData.tecnico) || null}
                        onChange={opt => setFormData(prev => ({ ...prev, tecnico: opt?.value || '' }))}
                        placeholder="Seleccione un técnico"
                    />
                    {errors.tecnico && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Fecha de Entrega</label>
                    <input
                        type="date"
                        name="fechaEntrega"
                        value={formData.fechaEntrega}
                        onChange={e => setFormData(prev => ({ ...prev, fechaEntrega: e.target.value }))}
                    />
                    {errors.fechaEntrega && <p className={styles.error}>No puede ser una fecha pasada</p>}

                    <label>Equipo<span>*</span></label>
                    <CustomSelect
                        options={equipoOptions}
                        value={equipoOptions.find(opt => opt.value === formData.equipo) || null}
                        onChange={opt => setFormData(prev => ({ ...prev, equipo: opt?.value || '' }))}
                        placeholder="Seleccione un equipo"
                    />
                    {errors.equipo && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Clase de Mantenimiento<span>*</span></label>
                    <CustomSelect
                        options={claseOptions}
                        value={claseOptions.find(opt => opt.value === formData.claseMantenimiento) || null}
                        onChange={opt => setFormData(prev => ({ ...prev, claseMantenimiento: opt?.value || '' }))}
                        placeholder="Seleccione una clase"
                    />
                    {errors.claseMantenimiento && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Tipo de Mantenimiento<span>*</span></label>
                    <CustomSelect
                        options={tipoOptions}
                        value={tipoOptions.find(opt => opt.value === formData.tipoMantenimiento) || null}
                        onChange={opt => setFormData(prev => ({ ...prev, tipoMantenimiento: opt?.value || '' }))}
                        placeholder="Seleccione un tipo"
                    />
                    {errors.tipoMantenimiento && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Prioridad</label>
                    <CustomSelect
                       options={prioridadOptions}
                       value={prioridadOptions.find(opt => opt.value === formData.prioridad) || null}
                       onChange={opt => setFormData(prev => ({ ...prev, prioridad: opt?.value || '' }))}
                       placeholder="Seleccione prioridad"
                    />

                    <label>Trabajo solicitado<span>*</span></label>
                    <textarea
                        name="trabajoSolicitado"
                        value={formData.trabajoSolicitado}
                        onChange={e => setFormData(prev => ({ ...prev, trabajoSolicitado: e.target.value }))}
                    />
                    {errors.trabajoSolicitado && <p className={styles.error}>Este campo es obligatorio</p>}

                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.saveButton}>GUARDAR</button>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>CANCELAR</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewOrderModal;
