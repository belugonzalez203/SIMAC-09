import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import NewOrderModal from '../views/OrderView/NewOrderModal.tsx';
import  { NavLink } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';

const Sidebar = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleConfirm = (data: any) => {
        navigate('/order/create', { state: data });
    };

    return (
        <aside className={styles.sidebar}>
            <nav>
                <ul className={styles.navList}>
                    <li>
                        <NavLink
                            to="/order/received"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Órdenes de Trabajo
                        </NavLink>
                    </li>
                    <li>
                        <button
                            className={`${styles.subLink} ${styles.buttonLink}`}
                            onClick={() => setShowModal(true)}
                        >   <img src="/add.png" alt="addNew" className={styles.img} />
                            Nuevo
                        </button>
                    </li>
                    <li>
                        <NavLink
                            to="/horometros"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Control de Horómetros
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/equipos"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Equipos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink ///////////////////////////////////////////////////////////////////////////////////////////
                            to="/equipment/create"
                            className={({ isActive }) =>
                                isActive ? `${styles.subLink} ${styles.active}` : styles.subLink
                            }
                        >
                            <img src="/add.png" alt="addNew" className={styles.img} />Nuevo
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/repuestos"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Repuestos
                        </NavLink>
                        <button
                            className={`${styles.subLink} ${styles.buttonLink}`}
                            onClick={() => setActiveModal("spareParts")}
                        >   <img src="/add.png" alt="addNew" className={styles.img} />
                        </button>
                    </li>
                    <li className={styles.combinedItem}>
                        <NavLink
                            to="/areas"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Áreas
                        </NavLink>
                        <button
                            className={`${styles.subLink} ${styles.buttonLink}`}
                            onClick={() => setActiveModal("area")}
                        >   <img src="/add.png" alt="addNew" className={styles.img} />
                        </button>
                    </li>
                    <li className={styles.combinedItem}>
                        <NavLink
                            to="/tecnicos"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Técnicos
                        </NavLink>
                        <button
                            className={`${styles.subLink} ${styles.buttonLink}`}
                            onClick={() => setActiveModal("technicians")}
                        >   <img src="/add.png" alt="addNew" className={styles.img} />
                        </button>
                    </li>
                    <li className={styles.combinedItem}>
                        <NavLink
                            to="/type/maintenance"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Tipo Mantenim
                        </NavLink>
                        <button
                            className={`${styles.subLink} ${styles.buttonLink}`}
                            onClick={() => setActiveModal("typeMaintenance")}
                        >   <img src="/add.png" alt="addNew" className={styles.img} />
                        </button>
                    </li>
                </ul>
            </nav>

            {activeModal === "order" && (
                <NewOrderModal
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    onConfirm={handleConfirmOrder}
                />
            )}

            {activeModal === "area" && (
                <CreateAreaModal
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    onConfirm={handleConfirmArea}
                />
            )}

            {activeModal === "equipment" && (
                <CreateEquipmentModal
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    onConfirm={handleConfirmEquipment}
                />
            )}

            {activeModal === "spareParts" && (
                <CreateSparePartsModal
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    onConfirm={handleConfirmSparePart}
                />
            )}

            {activeModal === "technicians" && (
                <CreateTechnicianModal
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    onConfirm={handleConfirmTechnician}
                />
            )}

            {activeModal === "typeMaintenance" && (
                <CreateTypeMaintenanceModal
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    onConfirm={handleConfirmTypeMaintenance}
                />
            )}
        </aside>
    );
};

export default Sidebar;
