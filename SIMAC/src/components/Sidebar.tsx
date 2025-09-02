import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import  { NavLink } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';
import NewOrderModal from '../views/OrderView/NewOrderModal.tsx';
import CreateAreaModal from '../views/AreaView/CreateAreaModal.tsx';
import CreateEquipmentModal from '../views/EquipmentView/CreateEquipmentView.tsx';
import CreateSparePartsModal from "../views/SparePartsView/CreateSparePartsModal.tsx";
import CreateTechnicianModal from "../views/TechnicianView/CreateTechnicianModal.tsx";
import CreateTypeMaintenanceModal from "../views/TypeMaintenanceView/CreateTypeModal.tsx"

const Sidebar = () => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleConfirmOrder = (data: any) => {
        navigate('/order/create', { state: data });
    };

    const handleConfirmArea = (data: any) => {
        navigate('/areas', { state: data });
    };

    const handleConfirmEquipment = (data: any) => {
        navigate('/equipos', { state: data });
    };

    const handleConfirmSparePart = (data: any) => {
        navigate('/repuestos', { state: data });
    };

    const handleConfirmTechnician = (data: any) => {
        navigate('/tecnicos', { state: data });
    };

    const handleConfirmTypeMaintenance = (data: any) => {
        navigate('/type/maintenance', { state: data });
    };

    return (
        <aside className={styles.sidebar}>
            <nav>
                <ul className={styles.navList}>
                    <li className={styles.combinedItem}>
                        <NavLink
                            to="/order/received"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Órdenes Recibidas
                        </NavLink>
                        <button
                            className={`${styles.iconButton}`}
                            onClick={() => setActiveModal("order")}
                            title="Crear nueva orden"
                        >   <img src="/add.png" alt="addNew" className={styles.img} />
                        </button>
                    </li>
                    <li className={styles.combinedItem}>
                        <NavLink
                            to="/order/executedList"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Órdenes Ejecutadas
                        </NavLink>
                    </li>
                    <li className={styles.combinedItem}>
                        <NavLink
                            to="/horometros"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Control Horómetros
                        </NavLink>
                    </li>
                    <li className={styles.combinedItem}>
                        <NavLink
                            to="/equipos"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Equipos
                        </NavLink>
                        <button
                            className={`${styles.subLink} ${styles.buttonLink}`}
                            onClick={() => setActiveModal("equipment")}
                        >   <img src="/add.png" alt="addNew" className={styles.img} />
                        </button>
                    </li>
                    <li className={styles.combinedItem}>
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
