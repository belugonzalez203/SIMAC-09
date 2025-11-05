import React, { useState, useEffect } from 'react';
import styles from '../../styles/Modal.module.css';
import { CustomSelect } from '../../components/CustomSelect';
import { Order } from "../../types/order";
import api from "../../services/api";

type Option = {
    value: string;
    label: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    onConfirm: () => void;
};

const EditOrderModal: React.FC<Props> = ({ isOpen, onClose, order, onConfirm }) => {
    const [formData, setFormData] = useState<Order>({
        id_order: 0,
        id_tech: 0,
        id_equip: 0,
        id_class: 0,
        id_type: 0,
        priority: 'Media',
        work_requested: '',
        date_delivery: null,
    });

    const [techOptions, setTechOptions] = useState<Option[]>([]);
    const [equipOptions, setEquipOptions] = useState<Option[]>([]);
    const [classOptions, setClassOptions] = useState<Option[]>([]);
    const [typeOptions, setTypeOptions] = useState<Option[]>([]);
    const [priorityOptions] = useState<Option[]>([
        { value: 'Baja', label: 'Baja' },
        { value: 'Media', label: 'Media' },
        { value: 'Alta', label: 'Alta' },
    ]);

    useEffect(() => {
        if (!isOpen || !order) return;

        const fetchAll = async () => {
            try {
                const [techRes, equipRes, classRes, typeRes] = await Promise.all([
                    api.get('/technician/'),
                    api.get('/equipment/'),
                    api.get('/maintenance/class'),
                    api.get('/maintenance/type'),
                ]);

                setTechOptions(
                    techRes.data.data.map((t: any) => ({
                        value: String(t.id_tech),
                        label: `${t.code_tech} - ${t.name_tech}`,
                    }))
                );

                setEquipOptions(
                    equipRes.data.data.map((e: any) => ({
                        value: String(e.id_equip),
                        label: `${e.code_equip} ${e.name_equip}`,
                    }))
                );

                setClassOptions(
                    classRes.data.data.map((c: any) => ({
                        value: String(c.id_class),
                        label: c.name_class,
                    }))
                );

                setTypeOptions(
                    typeRes.data.data.map((t: any) => ({
                        value: String(t.id_type),
                        label: t.name_type,
                    }))
                );

                setFormData(order);
            } catch (err) {
                console.error('Error cargando datos del modal:', err);
            }
        };

    fetchAll();
}, [isOpen, order]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                id_tech: formData.id_tech,
                id_equip: formData.id_equip,
                id_type: formData.id_type,
                id_class: formData.id_class,
                priority: formData.priority,
                work_requested: formData.work_requested.trim(),
                date_delivery: formData.date_delivery || null,
            };

            await api.put(`/workOrders/pending/${formData.id_order}`, payload);

            onConfirm();
            onClose();
        } catch (error: any) {
            console.error('Error al actualizar la orden de trabajo:', error);
            alert(error.response?.data?.error || 'Error al actualizar la orden.');
        }
    };

    if (!isOpen || !order) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>EDITAR ORDEN DE TRABAJO</h2>
                <form className={styles.form} onSubmit={handleSubmit}>

                    <label>Técnico</label>
                    <CustomSelect
                        options={techOptions}
                        value={techOptions.find(opt => opt.value === String(formData.id_tech)) || null}
                        onChange={opt => setFormData(prev => ({ ...prev, id_tech: opt ? Number(opt.value) : 0 }))}
                        placeholder="Seleccione un técnico"
                    />

                    <label>Fecha de Entrega</label>
                    <input
                        type="date"
                        value={formData.date_delivery || ''}
                        onChange={e => setFormData(prev => ({ ...prev, date_delivery: e.target.value }))}
                    />

                    <label>Equipo</label>
                    <CustomSelect
                        options={equipOptions}
                        value={equipOptions.find(opt => opt.value === String(formData.id_equip)) || null}
                        onChange={opt => setFormData(prev => ({ ...prev, id_equip: opt ? Number(opt.value) : 0 }))}
                        placeholder="Seleccione un equipo"
                    />

                    <label>Clase de Mantenimiento</label>
                    <CustomSelect
                        options={classOptions}
                        value={classOptions.find(opt => opt.value === String(formData.id_class)) || null}
                        onChange={opt => setFormData(prev => ({ ...prev, id_class: opt ? Number(opt.value) : 0 }))}
                        placeholder="Seleccione una clase"
                    />

                    <label>Tipo de Mantenimiento</label>
                    <CustomSelect
                        options={typeOptions}
                        value={typeOptions.find(opt => opt.value === String(formData.id_type)) || null}
                        onChange={opt => setFormData(prev => ({ ...prev, id_type: opt ? Number(opt.value) : 0 }))}
                        placeholder="Seleccione un tipo"
                    />

                    <label>Prioridad</label>
                    <CustomSelect
                        options={priorityOptions}
                        value={priorityOptions.find(opt => opt.value === formData.priority) || null}
                        onChange={opt => setFormData(prev => ({ ...prev, priority: opt?.value || 'Media' }))}
                        placeholder="Seleccione prioridad"
                    />

                    <label>Trabajo Solicitado</label>
                    <textarea
                        value={formData.work_requested}
                        onChange={e => setFormData(prev => ({ ...prev, work_requested: e.target.value }))}
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

export default EditOrderModal;
