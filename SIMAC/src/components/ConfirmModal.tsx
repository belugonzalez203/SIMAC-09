import React from "react";
import styles from "../styles/Modal.module.css";

interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                       isOpen,
                                                       title = "Confirmación",
                                                       message,
                                                       onConfirm,
                                                       onCancel,
                                                   }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modalConfirm}>
                <h3 className={styles.title}>{title}</h3>
                <p style={{ textAlign: "center", marginBottom: "1.5rem" }}>{message}</p>

                <div className={styles.buttonGroup}>
                    <button
                        className={styles.saveButton}
                        onClick={onConfirm}
                    >
                        Aceptar
                    </button>
                    <button
                        className={styles.cancelButton}
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
