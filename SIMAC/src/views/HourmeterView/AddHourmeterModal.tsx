import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/ListView.module.css';
import { CustomSelect } from '../../components/CustomSelect';

interface TypeChangeMaintenance {
    id_type_change: number;
    name_change: string;
    hour_change: number;
}

interface Equipment {
    id_equip: number;
    name_equip: string;
    code_equip: string;
    name_area: string;
}

interface AddHourmeterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddHourmeterModal: React.FC<AddHourmeterModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [types, setTypes] = useState<TypeChangeMaintenance[]>([]);
    const [selectedEquip, setSelectedEquip] = useState<{ label: string; value: string } | null>(null);
    const [hours, setHours] = useState<Record<number, string>>({});

    useEffect(() => {
        if (!isOpen) return;

        axios.get('http://localhost:3002/equipment/hourmeters/available')
            .then(res => setEquipments(res.data.data))
            .catch(err => console.error('Error cargando equipos:', err));

        axios.get('http://localhost:3002/typeChangeMaintenance')
            .then(res => setTypes(res.data.data))
            .catch(err => console.error('Error cargando tipos de cambio:', err));
    }, [isOpen]);

    const handleHourChange = (id: number, value: string) => {
        setHours(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        if (!selectedEquip) return alert('Debe seleccionar un equipo.');
        const selectedEquipId = parseInt(selectedEquip.value);

        const formattedHours: Record<number, number> = {};
        types.forEach(t => {
            const val = parseInt(hours[t.id_type_change]);
            formattedHours[t.id_type_change] = isNaN(val) ? 0 : val;
        });

        const hasAtLeastOneHour = Object.values(formattedHours).some(val => val > 0);
        if (!hasAtLeastOneHour) return alert('Debe ingresar al menos una hora actual.');

        try {
            await axios.post('http://localhost:3002/hourmeters', {
                id_equip: selectedEquipId,
                hours: formattedHours
            });
            alert('Horómetros agregados correctamente');
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Error al agregar horómetros');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Agregar Horómetros</h2>

                <div className={styles.fieldFull}>
                    <label>Equipo</label>
                    <CustomSelect
                        options={equipments.map(eq => ({
                            label: `${eq.code_equip} - ${eq.name_equip}`,
                            value: eq.id_equip.toString(),
                        }))}
                        value={selectedEquip}
                        onChange={(option) => setSelectedEquip(option)}
                        placeholder="Seleccione un equipo"
                    />
                </div>

                {types.length > 0 && (
                    <div className={styles.hourmeterTableWrapper}>
                        <table className={styles.hourmeterTable}>
                            <thead>
                            <tr>
                                {types.map(type => (
                                    <th key={type.id_type_change} style={{ textAlign: 'center', width: 50 }}>
                                        {type.name_change}<br />
                                        <span style={{ fontWeight: 'normal', fontSize: '0.8rem' }}>
                                            Cambio: {type.hour_change} h
                                        </span>
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                {types.map(type => (
                                    <td key={type.id_type_change}>
                                        <input
                                            type="number"
                                            placeholder="Hora actual"
                                            value={hours[type.id_type_change] ?? ''}
                                            onChange={e => handleHourChange(type.id_type_change, e.target.value)}
                                            style={{ width: '80%', padding: '0.4rem' }}
                                        />
                                    </td>
                                ))}
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                <div className={styles.buttonGroup}>
                    <button onClick={handleSubmit} className={styles.saveButton}>Guardar</button>
                    <button onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default AddHourmeterModal;
