import styles from '../../styles/ListView.module.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CreateTechnicianModal from './CreateTechnicianModal';
import EditTechnicianModal from './EditTechnicianModal';

interface Technician {
    id_tech: string;
    name_tech: string;
    contact_number_tech: string;
    name_area?: string | null;
    id_area?: string | null;
}

function TechnicianView() {
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>([]);
    const [searchCode, setSearchCode] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchArea, setSearchArea] = useState('');
    const [isCreateModalOpen, setisCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);

    useEffect(() => {
        fetchTechnicians();
    }, []);

    const fetchTechnicians = () => {
        axios.get('http://localhost:3002/technician/')
            .then(res => {
                setTechnicians(res.data.data);
                setFilteredTechnicians(res.data.data);
            })
            .catch(err => {
                console.error('Error al cargar técnicos:', err);
            });
    };

    useEffect(() => {
        const filtered = technicians.filter(t =>
            t.id_tech.toLowerCase().includes(searchCode.toLowerCase()) &&
            t.name_tech.toLowerCase().includes(searchName.toLowerCase()) &&
            (t.name_area ?? '').toLowerCase().includes(searchArea.toLowerCase())
        );
        setFilteredTechnicians(filtered);
    }, [searchCode, searchName, searchArea, technicians]);

    const handleDelete = (id: string) => {
        if (!window.confirm('¿Deseas eliminar este técnico?')) return;

            axios.delete(`http://localhost:3002/technician/${id}`)
                .then(() => {
                    setTechnicians(prev => prev.filter(t => t.id_tech !== id));
                    console.log(`Técnico ${id} eliminado correctamente`);
                })
                .catch(err => {
                    console.error(`Error al eliminar técnico ${id}:`, err);
                    alert('Hubo un error al eliminar el técnico');
                });
            fetchTechnicians();
        };

        const handleOpenEdit = (technician: Technician) => {
            setSelectedTechnician(technician);
            setIsEditModalOpen(true);
        };

        const handleConfirmCreate = () => {
            setisCreateModalOpen(false);
            fetchTechnicians();
        };

        const handleConfirmEdit = () => {
            setIsEditModalOpen(false);
            fetchTechnicians();
        };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>TÉCNICOS</h2>
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
                        <th>Contacto</th>
                        <th>Área</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTechnicians.map((tech) => (
                        <tr key={tech.id_tech}>
                            <td>{tech.id_tech}</td>
                            <td>{tech.name_tech}</td>
                            <td>{tech.contact_number_tech}</td>
                            <td>{tech.name_area}</td>
                            <td className={styles.iconCell}>
                                <FaEdit
                                    className={styles.editIcon}
                                    onClick={() => handleOpenEdit(tech)}
                                />
                            </td>
                            <td className={styles.iconCell}>
                                <FaTrashAlt
                                    className={styles.deleteIcon}
                                    onClick={() => handleDelete(tech.id_tech)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <CreateTechnicianModal
                isOpen={isCreateModalOpen}
                onClose={() => setisCreateModalOpen(false)}
                onConfirm={handleConfirmCreate}
            />

            {selectedTechnician && (
                <EditTechnicianModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onConfirm={handleConfirmEdit}
                    technician={selectedTechnician}
                />
            )}
        </div>
    );
}

export default TechnicianView;