import styles from '../styles/Navbar.module.css';
import NotificationBell from './NotificationBell.tsx';


export const Navbar = () => {

    return (
        <header className={styles.navbar}>
            <div className={styles.marca}>
                <img src="/LogoCoboce.png" alt="Coboce Ltda." className={styles.logo} />
                <h2>SIMAC</h2>
            </div>

                <div className={`${styles.userInfo} ${styles.userSection}`}>
                    <NotificationBell />
                    <img src="/user.png" alt="Usuario" className={styles.avatar} />
                </div>

        </header>
    );
};

