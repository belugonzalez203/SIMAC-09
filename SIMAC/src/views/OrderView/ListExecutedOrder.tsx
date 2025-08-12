import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from '../../styles/ListView.module.css';

interface Order {
    id_order: number;
    code_equip: string;
    name_equip: string;
    brand_equip: string;
    name_area: string;
    completion_date: string;
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
        axios.get('http://localhost:3002/workOrders/executed')
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
            <h2 className={styles.title}>ÓRDENES EJECUTADAS</h2>

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
                        <th>Entregado</th>
                        <th>Técnico</th>
                        <th>FichaT</th>
                        <th>Ver más</th>
                        <th>Imprimir</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredOrders.map((order, index) => (
                        <tr key={index}>
                            <td>{order.id_order}</td>
                            <td>{order.code_equip}-{order.name_equip}</td>
                            <td>{order.brand_equip}</td>
                            <td>{order.name_area}</td>
                            <td>{order.completion_date}</td>
                            <td>{order.name_tech}</td>
                            <td>{order.id_tech}</td>
                            <td className={styles.iconCell}>
                                <button
                                    className={`${styles.subLink} ${styles.buttonLink}`}
                                    onClick={() => navigate(`/order/executed/${order.id_order}`)}
                                >
                                    <img src="/seeMore.png" alt="seeMore" className={styles.img} />
                                </button>
                            </td>
                            <td className={styles.iconCell}>
                                <button
                                    className={styles.buttonLink}
                                    onClick={() => navigate(`/order/print/${order.id_order}`)}
                                >
                                    <img src="/print.png" alt="printOrder" className={styles.img} />
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
