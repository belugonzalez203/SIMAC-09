import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Modal.module.css';
import axios from 'axios';
import ReactSelect from 'react-select';

type SparePartFormData = {
    codigo: string;
    nombre: string;
    existencia: string;
};

type EquipOption = {
    value: number;
    label: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: SparePartFormData) => void;
};

const CreateSparePartsModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SparePartFormData>({
        codigo: '',
        nombre: '',
        existencia: '',
    });

    const [errors, setErrors] = useState({
        codigo: false,
        nombre: false,
    });

    const [equipOptions, setEquipOptions] = useState<EquipOption[]>([]);
    const [selectedEquips, setSelectedEquips] = useState<EquipOption[]>([]);

    useEffect(() => {
        axios.get('http://localhost:3002/equipment')
            .then(res => {
                const options = res.data.data.map((equip: any) => ({
                    value: equip.id_equip,
                    label: `${equip.code_equip} - ${equip.name_equip}`,
                }));
                setEquipOptions(options);
            })
            .catch(err => console.error('Error cargando equipos:', err));
    }, []);

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
            code_spare_part: formData.codigo,
            name_spare_part: formData.nombre,
            stock_spare_part: formData.existencia ? parseInt(formData.existencia) : 0,
            equipments: selectedEquips.map(eq => eq.value),
        };

        try {
            const response = await axios.post('http://localhost:3002/sparePart/postWithEquipments', payload);
            console.log('Respuesta del servidor:', response.data);
            onConfirm(formData);
            onClose();
            navigate('/repuestos');
        } catch (error) {
            console.error('Error al guardar el repuesto:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Crear Repuesto</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>Código<span>*</span></label>
                    <input
                        type="text"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleChange}
                    />
                    {errors.codigo && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Nombre<span>*</span></label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                    />
                    {errors.nombre && <p className={styles.error}>Este campo es obligatorio</p>}

                    <label>Existencia</label>
                    <input
                        type="number"
                        name="existencia"
                        min={0}
                        value={formData.existencia}
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

export default CreateSparePartsModal;
