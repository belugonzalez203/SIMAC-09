import styles from '../../styles/ListView.module.css';
import EditTypeChangeModal from "./EditTypeModal";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface TypeChange {
    id_type_change: number;
    name_change: string;
    hour_change: number;
}

function TypeChangeMaintenanceView() {
    const [types, setTypes] = useState<TypeChange[]>([]);
    const [filteredTypes, setFilteredTypes] = useState<TypeChange[]>([]);
    const [searchName, setSearchName] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<TypeChange | null>(null);

    const fetchTypes = () => {
        axios.get('http://localhost:3002/typeChangeMaintenance')
            .then(res => {
                const received = res.data?.data;
                if (Array.isArray(received)) {
                    setTypes(received);
                    setFilteredTypes(received);
                } else {
                    console.error('La respuesta del servidor no contiene un arreglo:', res.data);
                }
            })
            .catch(err => console.error('Error al cargar tipos:', err));
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    useEffect(() => {
        const filtered = types.filter(t =>
            (t.name_change ?? '').toLowerCase().includes(searchName.toLowerCase())
        );
        setFilteredTypes(filtered);
    }, [searchName, types]);

    const handleDelete = (id: number) => {
        if (!window.confirm('¿Eliminar tipo de cambio?')) return;

        axios.delete(`http://localhost:3002/typeChangeMaintenance/${id}`)
            .then(() => fetchTypes())
            //.catch(err => alert('Error al eliminar'));
    };

    const openEditModal = (type: TypeChange) => {
        setSelectedType(type);
        setIsEditModalOpen(true);
    };

    const handleConfirmEdit = () => {
        setIsEditModalOpen(false);
        fetchTypes();
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>TIPOS DE CAMBIO</h2>
            <div className={styles.actions}>
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Horas</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTypes.map(t => (
                        <tr key={t.id_type_change}>
                            <td>{t.id_type_change}</td>
                            <td>{t.name_change}</td>
                            <td>{t.hour_change}</td>
                            <td className={styles.iconCell}>
                                <FaEdit className={styles.editIcon} onClick={() => openEditModal(t)} />
                            </td>
                            <td className={styles.iconCell}>
                                <FaTrashAlt className={styles.deleteIcon} onClick={() => handleDelete(t.id_type_change)} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {isEditModalOpen && selectedType && (
                <EditTypeChangeModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    typeChange={selectedType}
                    onConfirm={handleConfirmEdit}
                />
            )}
        </div>
    );
}

export default TypeChangeMaintenanceView;

