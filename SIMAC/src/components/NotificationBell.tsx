import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaBell } from 'react-icons/fa';
import styles from '../styles/NotificationBell.module.css';
import api from "../services/api";

const NotificationBell = () => {
    const [hasAlerts, setHasAlerts] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/hourmeters")
            .then(response => {
                const data = response.data.data;
                const anyAlert = data.some((row: any) =>
                    Object.values(row.maintenance).some((m: any) => m.hourAlert <= 36)
                );
                setHasAlerts(anyAlert);
            })
            .catch(error => {
                console.error("Error al verificar alertas de horómetro:", error);
            });
    }, []);

    const handleClick = () => {
        navigate("/hourmeters/alerts");
    };

    return (
        <div className={styles.bellContainer} onClick={handleClick}>
            <FaBell className={styles.bell} />
            {hasAlerts && <span className={styles.alertDot}></span>}
        </div>
    );
};

export default NotificationBell;
