import styles from '../../styles/ListView.module.css';
import EditAreaModal from "./EditAreaModal";
import ConfirmModal from "../../components/ConfirmModal";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import api from "../../services/api";


interface Area {
    id_area: number;
    code_area: string;
    name_area: string;
    in_charge: string;
    contact_number_area: string;
}

function AreaView() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
    const [searchCode, setSearchCode] = useState('');
    const [searchName, setSearchName] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [areaToDelete, setAreaToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setAreaToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!areaToDelete) return;

        api.delete(`/area/${areaToDelete}`)
            .then(() => {
                setAreas(prev => prev.filter(area => area.id_area !== areaToDelete));
                console.log(`Área ${areaToDelete} eliminada correctamente`);
            })
            .catch(error => {
                console.error(`Error eliminando el área ${areaToDelete}:`, error);
                alert('Hubo un error al eliminar el área');
            })
            .finally(() => {
                setIsConfirmOpen(false);
                setAreaToDelete(null);
                fetchAreas();
            });
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    const fetchAreas = () => {
        api.get('/area/')
            .then(response => {
                console.log('Datos recibidos del backend:', response.data.data);
                setAreas(response.data.data);
                setFilteredAreas(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching areas:', error);
            });
    };

    useEffect(() => {
        const filtered = areas.filter(area =>
            area.code_area.toLowerCase().includes(searchCode.toLowerCase()) &&
            area.name_area.toLowerCase().includes(searchName.toLowerCase())
            );
        setFilteredAreas(filtered);
    }, [searchCode, searchName, areas]);

    const openEditModal = (area: Area) => {
        setSelectedArea(area);
        setIsEditModalOpen(true);
    };

    const handleConfirmEdit = () => {
        setIsEditModalOpen(false);
        fetchAreas();
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>ÁREAS</h2>
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
                    placeholder="Buscar por área"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Responsable</th>
                                <th>Contacto</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                            <tbody>
                                {filteredAreas.map((area) => (
                                    <tr key={area.id_area}>
                                        <td>{area.code_area}</td>
                                        <td>{area.name_area}</td>
                                        <td>{area.in_charge}</td>
                                        <td>{area.contact_number_area}</td>
                                        <td className={styles.iconCell}>
                                            <FaEdit
                                                className={styles.editIcon}
                                                onClick={() => openEditModal(area)}
                                            />
                                        </td>
                                        <td className={styles.iconCell}>
                                            <FaTrashAlt
                                                className={styles.deleteIcon}
                                                onClick={() => handleDeleteClick(area.id_area)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                </table>
            </div>
            {/* Modal de edición */}
            {isEditModalOpen && selectedArea && (
                <EditAreaModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    area={selectedArea}
                    onConfirm={handleConfirmEdit}
                />
            )}

            {/* Modal de confirmación */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                message="¿Está seguro de que desea eliminar esta área?"
                onConfirm={confirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </div>

    );
};
export default AreaView;