import styles from '../../styles/ListView.module.css';
import EditSparePartsModal from "./EditSparePartsModal";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';

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

    const handleEditClick = (sp: SparePart) => {
        setSelectedSparePart(sp);
        setIsEditModalOpen(true);
    };

    const fetchSpareParts = () => {
        const fetchData = async () => {
            try {
                const [spRes, eqRes] = await Promise.all([
                    axios.get('http://localhost:3002/sparePart/'),
                    axios.get('http://localhost:3002/sparePart/equipments/')
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

    const handleDelete = (id: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este repuesto?')) return;

        axios.delete(`http://localhost:3002/sparePart/${id}`)
            .then(() => {
                setSpareParts(prev => prev.filter(sp => sp.id_spare_part !== id));
                console.log(`Repuesto ${id} eliminado correctamente`);
            })
            .catch(error => {
                console.error(`Error eliminando el repuesto ${id}:`, error);
                alert('Hubo un error al eliminar el repuesto');
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
                                    onClick={() => handleDelete(sp.id_spare_part)}
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

        </div>
    );
}

export default SparePartsView;