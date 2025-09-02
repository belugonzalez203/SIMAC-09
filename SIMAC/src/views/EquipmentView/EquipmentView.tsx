import styles from '../../styles/ListView.module.css';
import EditEquipmentModal from "./EditEquipmentModal";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Equipment {
    id_equip: number;
    code_equip: string;
    name_equip: string;
    brand_equip: string;
    model_equip: string;
    chassis_equip: string;
    number_plate: string;
    id_area: string | null;
    name_area: string | null;
    id_service: number;
    name_service: string;
}

type EquipmentFormData = {
    id_equip: number;
    codigo: string;
    nombre: string;
    marca: string;
    modelo: string;
    chasis: string;
    placa: string;
    name_service?: string;
    name_area?: string;
    id_service: number;
    id_area: string;
};


function EquipmentListView () {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
    const [searchCode, setSearchCode] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchArea, setSearchArea] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<EquipmentFormData | null>(null);

    const fetchEquipments = () => {
        axios.get('http://localhost:3002/equipment/')
            .then(response => {
                console.log('Datos recibidos del backend:', response.data.data);
                setEquipments(response.data.data);
                setFilteredEquipments(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching equipments:', error);
            });
    };


    const handleDelete = (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este equipo?')) return;
        axios.delete(`http://localhost:3002/equipment/${id}`)
            .then(() => {
                setEquipments(prev => prev.filter(equip => equip.id_equip !== id));
                console.log(`Equipo ${id} eliminado correctamente`);
            })
            .catch(error => {
                console.error(`Error eliminando el Equipo ${id}:`, error);
                alert('Hubo un error al eliminar el Equipo');
            });
        fetchEquipments();
    };

    useEffect(() => {
        fetchEquipments();
    }, []);

    useEffect(() => {
        const filtered = equipments.filter(eq =>
            (eq.code_equip ?? '').toLowerCase().includes(searchCode.toLowerCase()) &&
            (eq.name_equip ?? '').toLowerCase().includes(searchName.toLowerCase()) &&
            (eq.name_area ?? '').toLowerCase().includes(searchArea.toLowerCase())
        );
        setFilteredEquipments(filtered);
    }, [searchCode, searchName, searchArea, equipments]);


    return (
        <>
        <div className={styles.container}>
            <h2 className={styles.title}>EQUIPOS</h2>
            <div className={styles.actions}>
                <input
                    type="text"
                    placeholder="Buscar por código"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className={styles.searchInput}
                />
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className={styles.searchInput}
                />
                <input
                    type="text"
                    placeholder="Buscar por área"
                    value={searchArea}
                    onChange={(e) => setSearchArea(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Chasis</th>
                            <th>Servicio</th>
                            <th>Área</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEquipments.map((equip) => (
                            <tr key={equip.id_equip}>
                                <td>{equip.code_equip}</td>
                                <td>{equip.name_equip}</td>
                                <td>{equip.brand_equip}</td>
                                <td>{equip.model_equip}</td>
                                <td>{equip.chassis_equip}</td>
                                <td>{equip.name_service}</td>
                                <td>{equip.name_area}</td>
                                <td className={styles.iconCell}>
                                    <FaEdit
                                        className={styles.editIcon}
                                        onClick={() => {
                                            setSelectedEquipment({
                                                id_equip: equip.id_equip,
                                                codigo: equip.code_equip,
                                                nombre: equip.name_equip,
                                                marca: equip.brand_equip,
                                                modelo: equip.model_equip,
                                                chasis: equip.chassis_equip,
                                                placa: equip.number_plate,
                                                id_service: equip.id_service,
                                                id_area: equip.id_area ?? '',
                                                name_service: equip.name_service,
                                                name_area: equip.name_area ?? '',
                                            });

                                            setEditModalOpen(true);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </td>
                                <td className={styles.iconCell}>
                                    <FaTrashAlt
                                        className={styles.deleteIcon}
                                        onClick={() => handleDelete(equip.id_equip)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {selectedEquipment && (
            <EditEquipmentModal
                isOpen={editModalOpen}
                equipment={selectedEquipment}
                onClose={() => setEditModalOpen(false)}
                onConfirm={(updated) => {
                    setEquipments(prev =>
                        prev.map(eq =>
                            eq.id_equip === updated.id_equip
                                ? {
                                    ...eq,
                                    code_equip: updated.codigo,
                                    name_equip: updated.nombre,
                                    brand_equip: updated.marca,
                                    model_equip: updated.modelo,
                                    chassis_equip: updated.chasis,
                                    number_plate: updated.placa,
                                    id_service: updated.id_service ?? 0,
                                    id_area: updated.id_area ?? null,
                                    name_service: updated.name_service ?? '',
                                    name_area: updated.name_area ?? '',
                                }
                                : eq
                        )
                    );
                    setEditModalOpen(false);
                    fetchEquipments();
                }}

            />
        )}
        </>
    );
}

export default EquipmentListView;