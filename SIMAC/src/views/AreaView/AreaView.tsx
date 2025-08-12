import styles from '../../styles/ListView.module.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import {useNavigate} from "react-router-dom";

const mockAreas = [
    { Código: "BARB", Área: "Molienda de barbotina", Responsable: "Julio Suarez", Contacto: "78945612" },
    { Código: "COM", Área: "Comercialización", Responsable: "Mario Perez", Contacto: "78945612" },
    { Código: "PROD", Área: "Producción", Responsable: "Ramiro Veizaga", Contacto: "78945612" },
    { Código: "ESM", Área: "Molienda de esmaltes", Responsable: "Eduardo Ferrer", Contacto: "78945612" },
    { Código: "EQP", Área: "Renovación de equipos", Responsable: "Pedro Molina", Contacto: "78945612"},
    { Código: "PRD-2", Área: "Producción", Responsable: "Lucio Gomez", Contacto: "78945612" },
    { Código: "COM-EX", Área: "Comercialización", Responsable: "Fernando Sejas", Contacto: "78945612" },
    { Código: "ESM-2", Área: "Molienda de esmaltes", Responsable: "Ivar Mamani", Contacto: "78945612" },
];

const AreaView = () => {
    const navigate = useNavigate();

    const handleCreateClick = () => {
        navigate('/area/create');
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>ÁREAS</h2>
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
                        <th>Área</th>
                        <th>Responsable</th>
                        <th>Contacto</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mockAreas.map((tech, index) => (
                        <tr key={index}>
                            <td>{tech.Código}</td>
                            <td>{tech.Área}</td>
                            <td>{tech.Responsable}</td>
                            <td>{tech.Contacto}</td>
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

export default AreaView;
