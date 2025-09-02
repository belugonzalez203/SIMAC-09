import styles from '../../styles/ListView.module.css';
import EditAreaModal from "./EditAreaModal";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Area {
    id_area: string;
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

    const handleDelete = (id: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta área?')) return;

            axios.delete(`http://localhost:3002/area/${id}`)
                 .then(() => {
                        setAreas(prev => prev.filter(area => area.id_area !== id));
                        console.log(`Área ${id} eliminada correctamente`);
                    })
                 .catch(error => {
                        console.error(`Error eliminando el área ${id}:`, error);
                        alert('Hubo un error al eliminar el área');
                 });
            fetchAreas();
        };

    useEffect(() => {
        fetchAreas();
    }, []);

    const fetchAreas = () => {
        axios.get('http://localhost:3002/area/')
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
            area.id_area.toLowerCase().includes(searchCode.toLowerCase()) &&
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
                                        <td>{area.id_area}</td>
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
                                                onClick={() => handleDelete(area.id_area)}
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
        </div>

    );
};
export default AreaView;