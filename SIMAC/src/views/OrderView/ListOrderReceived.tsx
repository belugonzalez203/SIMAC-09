import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from '../../styles/ListView.module.css';
import api from "../../services/api";


interface Order {
    id_order: number;
    code_equip: string;
    name_equip: string;
    brand_equip: string;
    name_area: string;
    date_delivery: string;
    id_tech: string;
    name_tech: string;
}

const ExecutedOrderList: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

    const [searchOrder, setSearchOrder] = useState('');
    const [searchArea, setSearchArea] = useState('');
    const [searchEquipment, setSearchEquipment] = useState('');
    const [searchTechnician, setSearchTechnician] = useState('');

    useEffect(() => {
        api.get('/workOrders/pending')
            .then(res => {
                setOrders(res.data.data);
                setFilteredOrders(res.data.data);
                console.log('Órdenes ejecutadas:', res.data.data);
            })
            .catch(err => console.error('Error cargando órdenes:', err));
    }, []);

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
                        <th>Marca</th>
                        <th>Área</th>
                        <th>Fecha Entrega</th>
                        <th>Técnico</th>
                        <th>Ver más</th>
                        <th>Ejecutar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredOrders.map((order, index) => (
                        <tr key={index}>
                            <td>{order.id_order}</td>
                            <td>{order.code_equip}-{order.name_equip}</td>
                            <td>{order.brand_equip}</td>
                            <td>{order.name_area}</td>
                            <td>{order.date_delivery}</td>
                            <td>{order.id_tech}-{order.name_tech}</td>
                            <td className={styles.iconCell}>
                                <button
                                    className={`${styles.subLink} ${styles.buttonLink}`}
                                    onClick={() => navigate(`/order/received/${order.id_order}`)}
                                >
                                    <img src="./seeMore.png" alt="seeMore" className={styles.img} />
                                </button>
                            </td>
                            <td className={styles.iconCell}>
                                <button
                                    className={styles.buttonLink}
                                    onClick={() => navigate(`/order/execute/${order.id_order}`)}
                                >
                                    <img src="./execute.png" alt="executeOrder" className={styles.img} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExecutedOrderList;
