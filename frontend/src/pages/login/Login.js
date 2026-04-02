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
            {/* Panel izquierdo */}
            <div style={estilos.panelIzquierdo}>
                <div style={estilos.logoArea}>
                    <div style={estilos.logoIcono}>🎓</div>
                    <h1 style={estilos.logoNombre}>EduTrack IA</h1>
                    <p style={estilos.logoDesc}>Plataforma Inteligente de Seguimiento Académico</p>
                </div>
                <div style={estilos.features}>
                    <div style={estilos.feature}>
                        <span style={estilos.featureIcono}>🤖</span>
                        <span style={estilos.featureTexto}>Análisis de riesgo con Inteligencia Artificial</span>
                    </div>
                    <div style={estilos.feature}>
                        <span style={estilos.featureIcono}>📊</span>
                        <span style={estilos.featureTexto}>Seguimiento de notas, asistencia y conducta</span>
                    </div>
                    <div style={estilos.feature}>
                        <span style={estilos.featureIcono}>🔔</span>
                        <span style={estilos.featureTexto}>Notificaciones automáticas a padres de familia</span>
                    </div>
                    <div style={estilos.feature}>
                        <span style={estilos.featureIcono}>📱</span>
                        <span style={estilos.featureTexto}>App móvil para padres de familia</span>
                    </div>
                </div>
            </div>

            {/* Panel derecho */}
            <div style={estilos.panelDerecho}>
                <div style={estilos.formularioBox}>
                    <h2 style={estilos.titulo}>Bienvenido</h2>
                    <p style={estilos.subtitulo}>Ingresa tus credenciales para continuar</p>

                    {error && <div style={estilos.error}>⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={estilos.campo}>
                            <label style={estilos.label}>Correo electrónico</label>
                            <div style={estilos.inputWrapper}>
                                <span style={estilos.inputIcono}>✉️</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={estilos.input}
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div style={estilos.campo}>
                            <label style={estilos.label}>Contraseña</label>
                            <div style={estilos.inputWrapper}>
                                <span style={estilos.inputIcono}>🔒</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={estilos.input}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{ ...estilos.boton, opacity: cargando ? 0.7 : 1 }}
                            disabled={cargando}
                        >
                            {cargando ? '⏳ Iniciando sesión...' : 'Iniciar sesión →'}
                        </button>
                    </form>

                    <p style={estilos.footer}>
                        Sistema exclusivo para personal autorizado de la institución educativa
                    </p>
                </div>
            </div>
        </div>
    );
};

const estilos = {
    contenedor: {
        minHeight: '100vh',
        display: 'flex',
    },
    panelIzquierdo: {
        flex: 1,
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        color: 'white',
    },
    logoArea: {
        marginBottom: '48px',
    },
    logoIcono: {
        fontSize: '56px',
        marginBottom: '16px',
    },
    logoNombre: {
        fontSize: '36px',
        fontWeight: '800',
        margin: '0 0 8px 0',
        letterSpacing: '-0.5px',
    },
    logoDesc: {
        fontSize: '16px',
        color: '#bfdbfe',
        margin: 0,
        lineHeight: '1.5',
    },
    features: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    feature: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '14px 18px',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
    },
    featureIcono: {
        fontSize: '24px',
        flexShrink: 0,
    },
    featureTexto: {
        fontSize: '14px',
        color: '#dbeafe',
        lineHeight: '1.4',
    },
    panelDerecho: {
        width: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        padding: '40px',
    },
    formularioBox: {
        width: '100%',
        maxWidth: '380px',
    },
    titulo: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1e293b',
        margin: '0 0 8px 0',
    },
    subtitulo: {
        fontSize: '14px',
        color: '#64748b',
        margin: '0 0 32px 0',
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
    },
    campo: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#374151',
        fontSize: '14px',
        fontWeight: '600',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        border: '1.5px solid #e2e8f0',
        borderRadius: '10px',
        overflow: 'hidden',
    },
    inputIcono: {
        padding: '0 12px',
        fontSize: '16px',
    },
    input: {
        flex: 1,
        padding: '12px 14px 12px 0',
        border: 'none',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: 'transparent',
        width: '100%',
    },
    boton: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #1e40af, #2563eb)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '8px',
        letterSpacing: '0.3px',
    },
    footer: {
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '12px',
        marginTop: '24px',
        lineHeight: '1.5',
    },
};

export default Login;