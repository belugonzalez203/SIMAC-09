import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';
import { useAuth } from '../context/AuthContext.tsx'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleLogin = async () => {
        if (username === '' || password === '') {
            setError('Debe completar todos los campos.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3002/user/login', {
                user: username,
                password: password,
            });

            if (response.data.success) {
                setError('');

                const user = response.data.user;
                login(user);

                navigate('/dashboard');
            } else {
                setError('Usuario o contraseña incorrectos.');
            }
        } catch (error: any) {
            if (error.response) {
                setError(error.response.data.message || 'Error en la autenticación.');
            } else if (error.request) {
                // La petición fue hecha pero no hubo respuesta
                setError('No se recibió respuesta del servidor.');
            } else {
                setError('Error al procesar la solicitud.');
            }
            console.error('Error al iniciar sesión:', error);
        }
    };

    const handleCreateAccount = () => {
        navigate('/register');
    };

    return (
        <div className={styles.loginContainer}>
            <h2 className={styles.loginTitle}>Iniciar Sesión</h2>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.field}>
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ingrese su usuario"
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingrese su contraseña"
                    />
                </div>
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.buttonGroup}>
                    <button className={styles.createButton} onClick={handleCreateAccount}>
                        Crear Cuenta
                    </button>
                    <button className={styles.loginButton} onClick={handleLogin}>
                        Iniciar Sesión
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;

