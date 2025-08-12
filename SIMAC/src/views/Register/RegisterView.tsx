import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/AuthForm.module.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const RegisterView = () => {
    const [name, setName] = useState('');
    const [idUser, setIdUser] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [typeUser] = useState('TECH');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        setError('');
        setSuccess('');

        if (!name || !idUser || !password || !confirmPassword) {
            setError('Debe completar todos los campos.');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            await axios.post('http://localhost:3002/user/register', {
                user: idUser,
                name_user: name,
                password,
                type_user: typeUser,
            });

            setSuccess('Cuenta creada exitosamente.');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error: any) {
            if (error.response?.status === 409) {
                setError('El ID de usuario ya existe.');
            } else {
                setError('Error al crear la cuenta.');
                console.error(error);
            }
        }
    };

    return (
        <div className={styles.registerOverlay}>
            <div className={styles.registerModal}>
                <h2 className={styles.registerTitle}>Crear Cuenta</h2>
                <form className={styles.registerForm} onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                    <div className={styles.registerField}>
                        <label>Nombre completo<span>*</span></label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className={styles.registerField}>
                        <label>ID de usuario (correo o nombre)<span>*</span></label>
                        <input type="text" value={idUser} onChange={(e) => setIdUser(e.target.value)} />
                    </div>

                    <div className={styles.registerField}>
                        <label>Contraseña<span>*</span></label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                                className={styles.eyeIcon}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                    </div>

                    <div className={styles.registerField}>
                        <label>Confirmar contraseña<span>*</span></label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <span
                                className={styles.eyeIcon}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                    </div>

                    <div className={styles.registerField}>
                        <label>Tipo de usuario</label>
                        <input type="text" value={typeUser} disabled />
                    </div>

                    {error && <div className={styles.registerError}>{error}</div>}
                    {success && <div className={styles.success}>{success}</div>}

                    <div className={styles.registerButtonGroup}>
                        <button
                            type="submit"
                            className={styles.registerSaveButton}
                        >
                            Crear cuenta
                        </button>
                        <button
                            type="button"
                            className={styles.registerCancelButton}
                            onClick={() => navigate('/login')}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterView;
