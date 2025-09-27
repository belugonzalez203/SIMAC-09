import styles from '../../styles/ListView.module.css';
import EditSparePartsModal from "./EditSparePartsModal";
import ConfirmModal from "../../components/ConfirmModal";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import api from "../../services/api";


interface SparePart {
    id_spare_part: string;
    code_spare_part: string;
    name_spare_part: string;
    stock_spare_part: string;
    equipment_codes?: string;
}

function SparePartsView() {
    const [spareParts, setSpareParts] = useState<SparePart[]>([]);
    const [filteredSpareParts, setFilteredSpareParts] = useState<SparePart[]>([]);

    const [searchCode, setSearchCode] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchType, setSearchType] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSparePart, setSelectedSparePart] = useState<SparePart | null>(null);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [sparePartToDelete, setSparePartToDelete] = useState<string | null>(null);

    const handleEditClick = (sp: SparePart) => {
        setSelectedSparePart(sp);
        setIsEditModalOpen(true);
    };

    const fetchSpareParts = () => {
        const fetchData = async () => {
            try {
                const [spRes, eqRes] = await Promise.all([
                    await api.get('/sparePart/'),
                    await api.get('/sparePart/equipments/')
                ]);

                const equipmentMap: Record<string, string> = {};
                eqRes.data.data.forEach((item: any) => {
                    equipmentMap[item.id_spare_part] = item.equipment_codes;
                });

                const enrichedData = spRes.data.data.map((sp: SparePart) => ({
                    ...sp,
                    equipment_codes: equipmentMap[sp.id_spare_part] || ''
                }));

                setSpareParts(enrichedData);
                setFilteredSpareParts(enrichedData);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        };

        fetchData();
    };

    const handleDeleteClick = (id: string) => {
        setSparePartToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!sparePartToDelete) return;

        api.delete(`/sparePart/${sparePartToDelete}`)
            .then(() => {
                setSpareParts(prev => prev.filter(sp => sp.id_spare_part !== sparePartToDelete));
                console.log(`Repuesto ${sparePartToDelete} eliminado correctamente`);
            })
            .catch(error => {
                console.error(`Error eliminando el repuesto ${sparePartToDelete}:`, error);
                alert('Hubo un error al eliminar el repuesto');
            })
            .finally(() => {
                setIsConfirmOpen(false);
                setSparePartToDelete(null);
            });
    };

    useEffect(() => {
        fetchSpareParts();
    }, []);

    useEffect(() => {
        const filtered = spareParts.filter(sp =>
            String(sp.code_spare_part ?? '').toLowerCase().includes(searchCode.toLowerCase()) &&
            String(sp.name_spare_part ?? '').toLowerCase().includes(searchName.toLowerCase()) &&
            String(sp.equipment_codes ?? '').toLowerCase().includes(searchType.toLowerCase())
        );
        setFilteredSpareParts(filtered);
    }, [searchCode, searchName, searchType, spareParts]);


    return (
        <div className={styles.container}>
            <h2 className={styles.title}>REPUESTOS</h2>
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
                    placeholder="Buscar por equipo"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Existencia</th>
                            <th>Equipos</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredSpareParts.map((sp) => (
                        <tr key={sp.id_spare_part}>
                            <td>{sp.code_spare_part}</td>
                            <td>{sp.name_spare_part}</td>
                            <td>{sp.stock_spare_part}</td>
                            <td>{sp.equipment_codes}</td>
                            <td className={styles.iconCell}>
                                <FaEdit
                                    className={styles.editIcon}
                                    onClick={() => handleEditClick(sp)}
                                />
                            </td>
                            <td className={styles.iconCell}>
                                <FaTrashAlt
                                    className={styles.deleteIcon}
                                    onClick={() => handleDeleteClick(sp.id_spare_part)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <EditSparePartsModal
                isOpen={isEditModalOpen}
                repuesto={selectedSparePart}
                onClose={() => setIsEditModalOpen(false)}
                onConfirm={() => {
                    fetchSpareParts();
                    setIsEditModalOpen(false);
                }}
            />

            <ConfirmModal
                isOpen={isConfirmOpen}
                message="¿Estás seguro de que deseas eliminar este repuesto?"
                onConfirm={confirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
            />

        </div>
    );
}

export default SparePartsView;