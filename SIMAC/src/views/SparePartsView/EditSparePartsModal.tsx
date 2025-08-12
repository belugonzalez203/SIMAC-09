import React, { useEffect, useState } from 'react';
import styles from '../../styles/Modal.module.css';
import axios from 'axios';
import ReactSelect from 'react-select';

type EquipOption = {
    value: number;
    label: string;
};

type SparePart = {
    id_spare_part: string;
    code_spare_part: string;
    name_spare_part: string;
    stock_spare_part: string;
    equipment_ids?: number[]; // para ReactSelect
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    repuesto: SparePart | null;
    onConfirm: () => void;
};

const EditSparePartsModal: React.FC<Props> = ({ isOpen, onClose, repuesto, onConfirm }) => {
    const [formData, setFormData] = useState<SparePart>({
        id_spare_part: '',
        code_spare_part: '',
        name_spare_part: '',
        stock_spare_part: '',
        equipment_ids: [],
    });

    const [equipOptions, setEquipOptions] = useState<EquipOption[]>([]);
    const [selectedEquips, setSelectedEquips] = useState<EquipOption[]>([]);

    useEffect(() => {
        if (!repuesto) return;

        setFormData({
            ...repuesto,
            equipment_ids: [],
        });

        axios.get('http://localhost:3002/equipment')
            .then(res => {
                const options = res.data.data.map((equip: any) => ({
                    value: equip.id_equip,
                    label: `${equip.code_equip} - ${equip.name_equip}`,
                }));
                setEquipOptions(options);

                // Obtiene asociaciones del repuesto
                return axios.get(`http://localhost:3002/sparePart/equipments/${repuesto.id_spare_part}`);
            })
            .then(res => {
                const ids = res.data.equipment_ids as number[];
                const selected = equipOptions.filter(opt => ids.includes(opt.value));
                setSelectedEquips(selected);
            })
            .catch(err => console.error('Error cargando datos:', err));
    }, [repuesto]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            code_spare_part: formData.code_spare_part,
            name_spare_part: formData.name_spare_part,
            stock_spare_part: parseInt(formData.stock_spare_part) || 0,
            equipments: selectedEquips.map(eq => eq.value),
        };

        try {
            await axios.put(`http://localhost:3002/sparePart/updateWithEquipments/${formData.id_spare_part}`, payload);
            onConfirm();
            onClose();
        } catch (error) {
            console.error('Error al actualizar repuesto:', error);
        }
    };

    if (!isOpen || !repuesto) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>EDITAR REPUESTO</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>Código</label>
                    <input
                        type="text"
                        name="code_spare_part"
                        value={formData.code_spare_part}
                        onChange={handleChange}
                    />

                    <label>Nombre</label>
                    <input
                        type="text"
                        name="name_spare_part"
                        value={formData.name_spare_part}
                        onChange={handleChange}
                    />

                    <label>Existencia</label>
                    <input
                        type="number"
                        name="stock_spare_part"
                        min={0}
                        value={formData.stock_spare_part}
                        onChange={handleChange}
                    />

                    <label>Equipos asociados</label>
                    <ReactSelect
                        isMulti
                        options={equipOptions}
                        value={selectedEquips}
                        onChange={(selected) => setSelectedEquips(selected as EquipOption[])}
                        placeholder="Seleccione uno o más equipos..."
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

export default EditSparePartsModal;
