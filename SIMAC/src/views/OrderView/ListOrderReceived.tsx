import React, { useEffect, useState } from 'react';
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import styles from '../../styles/ListView.module.css';
import ConfirmModal from "../../components/ConfirmModal";
import EditOrderModal from './EditOrderReceived';
import { Order } from "../../types/order";
import api from "../../services/api";
import { useLocation, useNavigate } from 'react-router-dom';


const ExecutedOrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

    const [searchOrder, setSearchOrder] = useState('');
    const [searchArea, setSearchArea] = useState('');
    const [searchEquipment, setSearchEquipment] = useState('');
    const [searchTechnician, setSearchTechnician] = useState('');

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const location = useLocation();
    const navigate = useNavigate();

    const handleDeleteClick = (id: number) => {
        setOrderToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (orderToDelete === null) return;

        api.delete(`/workOrders/${orderToDelete}`)
            .then(() => {
                setOrders(prev => prev.filter(order => order.id_order !== orderToDelete));
                console.log(`Órden de trabajo ${orderToDelete} eliminada correctamente`);
            })
            .catch(error => {
                console.error(`Error eliminando órden de trabajo ${orderToDelete}:`, error);
                alert('Hubo un error al eliminar la órden de trabajo');
            })
            .finally(() => {
                setIsConfirmOpen(false);
                setOrderToDelete(null);
                fetchOrders();
            });
    };

    const handleOpenEdit = (order: Order) => {
        setSelectedOrder(order);
        setIsEditModalOpen(true);
    };

    const handleConfirmEdit = () => {
        setIsEditModalOpen(false);
        fetchOrders();
    };


    useEffect(() => {
        fetchOrders ();
    }, []);

    const fetchOrders = () => {
        api.get('/workOrders/pending')
            .then(res => {
                setOrders(res.data.data);
                setFilteredOrders(res.data.data);
                console.log('Órdenes ejecutadas:', res.data.data);
            })
            .catch(err => console.error('Error cargando órdenes:', err));
    };

    useEffect(() => {
        if (location.state?.refresh) {
            fetchOrders();
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state]);

    useEffect(() => {
        const filtered = orders.filter(order =>
            (order.id_order?.toString() ?? '').includes(searchOrder.toLowerCase()) &&
            (order.name_area ?? '').toLowerCase().includes(searchArea.toLowerCase()) &&
            (
                (order.code_equip ?? '').toLowerCase().includes(searchEquipment.toLowerCase()) ||
                (order.name_equip ?? '').toLowerCase().includes(searchEquipment.toLowerCase())
            ) &&
            (order.name_tech ?? '').toLowerCase().includes(searchTechnician.toLowerCase())
        );

        setFilteredOrders(filtered);
    }, [searchOrder, searchArea, searchEquipment, searchTechnician, orders]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>ÓRDENES RECIBIDAS</h2>

            <div className={styles.actions}>
                <input
                    type="text"
                    placeholder="Buscar por orden"
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.target.value)}
                    className={styles.searchInput}
                />
                <input
                    type="text"
                    placeholder="Buscar por equipo"
                    value={searchEquipment}
                    onChange={(e) => setSearchEquipment(e.target.value)}
                    className={styles.searchInput}
                />
                <input
                    type="text"
                    placeholder="Buscar por área"
                    value={searchArea}
                    onChange={(e) => setSearchArea(e.target.value)}
                    className={styles.searchInput}
                />
                <input
                    type="text"
                    placeholder="Buscar por técnico"
                    value={searchTechnician}
                    onChange={(e) => setSearchTechnician(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Orden</th>
                        <th>Equipo</th>
                        <th>Área</th>
                        <th>Fecha Entrega</th>
                        <th>Técnico</th>
                        <th>Ver más</th>
                        <th>Ejecutar</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredOrders.map((order, index) => (
                        <tr key={index}>
                            <td>{order.id_order}</td>
                            <td>{order.code_equip}-{order.name_equip}</td>
                            <td>{order.name_area}</td>
                            <td>{order.date_delivery}</td>
                            <td>{order.code_tech}-{order.name_tech}</td>
                            <td className={styles.iconCell}>
                                <button
                                    className={`${styles.subLink} ${styles.buttonLink}`}
                                    onClick={() => navigate(`/order/received/${order.id_order}`)}
                                >
                                    <img src="./seeMore.png" alt="seeMore" className={styles.img} />
                                </button>
                            </td>
                            <td className={styles.iconCell}>
                                <FaArrowUpRightFromSquare
                                    className={styles.executeIcon}
                                    onClick={() => navigate(`/order/execute/${order.id_order}`)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </td>
                            <td className={styles.iconCell}>
                                <FaEdit
                                    className={styles.editIcon}
                                    onClick={() => handleOpenEdit(order)}
                                />
                            </td>
                            <td className={styles.iconCell}>
                                <FaTrashAlt
                                    className={styles.deleteIcon}
                                    onClick={() => handleDeleteClick(order.id_order)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <EditOrderModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onConfirm={handleConfirmEdit}
                    order={selectedOrder}
                />
            )}

            <ConfirmModal
                isOpen={isConfirmOpen}
                message="¿Está seguro de que desea eliminar esta órden?"
                onConfirm={confirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </div>
    );
};

export default ExecutedOrderList;
