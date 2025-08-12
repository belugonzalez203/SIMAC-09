import React from 'react';
import { Navbar } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import styles from '../styles/MainLayout.module.css';

interface Props {
    children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
    return (
        <div className={styles.container}>
            <div className={styles.navbar}>
                <Navbar />
            </div>
            <div className={styles.body}>
                <Sidebar />
                <main className={styles.main}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
