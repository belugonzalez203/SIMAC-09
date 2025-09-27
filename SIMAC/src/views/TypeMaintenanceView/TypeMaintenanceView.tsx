import styles from '../../styles/ListView.module.css';
import EditTypeChangeModal from "./EditTypeModal";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import ConfirmModal from "../../components/ConfirmModal";
import api from "../../services/api";

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

    const [showConfirm, setShowConfirm] = useState(false);
    const [typeToDelete, setTypeToDelete] = useState<number | null>(null);

    const fetchTypes = () => {
        api.get('/typeChangeMaintenance')
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

    const handleDeleteClick = (id: number) => {
        setTypeToDelete(id);
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        if (typeToDelete !== null) {
            api.delete(`/typeChangeMaintenance/${typeToDelete}`)
                .then(() => fetchTypes())
                .catch(err => console.error("Error al eliminar:", err));
        }
        setShowConfirm(false);
        setTypeToDelete(null);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setTypeToDelete(null);
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
                                <FaTrashAlt
                                    className={styles.deleteIcon}
                                    onClick={() => handleDeleteClick(t.id_type_change)}
                                />
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

            {/* Modal de confirmación */}
            <ConfirmModal
                isOpen={showConfirm}
                title="Eliminar tipo de cambio"
                message="¿Estás seguro que deseas eliminar este tipo de cambio?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
}

export default TypeChangeMaintenanceView;

