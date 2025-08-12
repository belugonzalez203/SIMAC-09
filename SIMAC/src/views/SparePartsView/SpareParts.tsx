import styles from '../../styles/ListView.module.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import {useNavigate} from "react-router-dom";

const mockSpareParts = [
    { Código: "W7-3/4-S", Nombre: "Filtro de aceite de motor W7 MULT 3/4-S", Existencia: "20" },
    { Código: "W7-3/4-S", Nombre: "Filtro de aceite de motor W7 MULT 3/4-S", Existencia: "20" },
    { Código: "W7-3/4-S", Nombre: "Filtro de aceite de motor W7 MULT 3/4-S", Existencia: "20" },
    { Código: "W7-3/4-S", Nombre: "Filtro de aceite de motor W7 MULT 3/4-S", Existencia: "20" },
    { Código: "W7-3/4-S", Nombre: "Filtro de aceite de motor W7 MULT 3/4-S", Existencia: "20" },
    { Código: "W7-3/4-S", Nombre: "Filtro de aceite de motor W7 MULT 3/4-S", Existencia: "20" },
    { Código: "W7-3/4-S", Nombre: "Filtro de aceite de motor W7 MULT 3/4-S", Existencia: "20" },
    { Código: "W7-3/4-S", Nombre: "Filtro de aceite de motor W7 MULT 3/4-S", Existencia: "20" },
];

const SparePartsView = () => {
    const navigate = useNavigate();

    const handleCreateClick = () => {
        navigate('/spareParts/create');
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>REPUESTOS</h2>
            <div className={styles.actions}>
                <button className={styles.createButton} onClick={handleCreateClick}>
                    Crear Nuevo
                </button>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Existencia</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mockSpareParts.map((tech, index) => (
                        <tr key={index}>
                            <td>{tech.Código}</td>
                            <td>{tech.Nombre}</td>
                            <td>{tech.Existencia}</td>
                            <td className={styles.iconCell}>
                                <FaEdit className={styles.editIcon} />
                            </td>
                            <td className={styles.iconCell}>
                                <FaTrashAlt className={styles.deleteIcon} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SparePartsView;
