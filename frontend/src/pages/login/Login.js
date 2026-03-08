import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            const respuesta = await api.post('/auth/login', { email, password });
            login(respuesta.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.tarjeta}>
                <h1 style={estilos.titulo}>EduTrack IA</h1>
                <p style={estilos.subtitulo}>Sistema de Seguimiento Académico</p>

                {error && <div style={estilos.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={estilos.campo}>
                        <label style={estilos.label}>Correo electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={estilos.input}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div style={estilos.campo}>
                        <label style={estilos.label}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={estilos.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={estilos.boton}
                        disabled={cargando}
                    >
                        {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const estilos = {
    contenedor: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8',
    },
    tarjeta: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    titulo: {
        textAlign: 'center',
        color: '#1e40af',
        fontSize: '28px',
        marginBottom: '8px',
    },
    subtitulo: {
        textAlign: 'center',
        color: '#64748b',
        marginBottom: '32px',
        fontSize: '14px',
    },
    campo: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '6px',
        color: '#374151',
        fontSize: '14px',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
        boxSizing: 'border-box',
        outline: 'none',
    },
    boton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#1e40af',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '10px 14px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
    },
};

export default Login;