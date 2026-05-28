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
            const rol = respuesta.data.usuario.rol;
            if (rol === 'padre') {
                navigate('/padre');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Credenciales incorrectas');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.fondo} />
            <div style={estilos.circulo1} />
            <div style={estilos.circulo2} />
            <div style={estilos.circulo3} />
            <div style={estilos.circulo4} />

            <div style={estilos.card}>
                <div style={estilos.logoArea}>
                    <div style={estilos.logoCirculo}>
                        <img src="/logo-salomon.jpg" alt="Colegio Adventista Salomón" style={estilos.logoImg} />
                    </div>
                    <h1 style={estilos.institucion}>Unidad Educativa Adventista Salomón</h1>
                    <p style={estilos.sistema}>Sistema de Seguimiento Académico</p>
                </div>

                <div style={estilos.divisor} />

                <div style={estilos.formulario}>
                    <h2 style={estilos.titulo}>Iniciar sesión</h2>

                    {error && <div style={estilos.error}>⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={estilos.campo}>
                            <label style={estilos.label}>Correo electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={estilos.input}
                                placeholder="correo@institucion.com"
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
                            style={{ ...estilos.boton, opacity: cargando ? 0.8 : 1 }}
                            disabled={cargando}
                        >
                            {cargando ? 'Verificando...' : 'Ingresar al sistema'}
                        </button>
                    </form>
                </div>

                <p style={estilos.footer}>Acceso exclusivo para personal autorizado</p>
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
        background: 'linear-gradient(135deg, #001040 0%, #002080 50%, #003399 100%)',
        position: 'relative',
        overflow: 'hidden',
    },
    fondo: {
        position: 'absolute',
        inset: 0,
        background: `
            repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.015) 2px,
                rgba(255,255,255,0.015) 4px
            ),
            repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.015) 2px,
                rgba(255,255,255,0.015) 4px
            )
        `,
    },
    circulo1: {
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,100,255,0.2) 0%, transparent 70%)',
        filter: 'blur(40px)',
        top: '-200px',
        right: '-150px',
    },
    circulo2: {
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,60,200,0.25) 0%, transparent 70%)',
        filter: 'blur(50px)',
        bottom: '-150px',
        left: '-100px',
    },
    circulo3: {
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)',
        filter: 'blur(30px)',
        top: '30%',
        left: '10%',
    },
    circulo4: {
        position: 'absolute',
        width: '400px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(100,180,255,0.12) 0%, transparent 70%)',
        filter: 'blur(40px)',
        top: '10%',
        left: '30%',
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderTop: '1px solid rgba(255,255,255,0.4)',
        borderLeft: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '24px',
        padding: '48px 44px',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1,
        boxShadow: `
            0 25px 60px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 0 rgba(0,0,0,0.1)
        `,
    },
    logoArea: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '24px',
    },
    logoCirculo: {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid #FFD700',
        marginBottom: '16px',
        boxShadow: '0 0 25px rgba(255,215,0,0.4)',
    },
    logoImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    institucion: {
        color: 'white',
        fontSize: '17px',
        fontWeight: '700',
        textAlign: 'center',
        margin: '0 0 6px 0',
        lineHeight: '1.4',
        textShadow: '0 2px 8px rgba(0,0,0,0.3)',
    },
    sistema: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: '13px',
        textAlign: 'center',
        margin: 0,
        letterSpacing: '0.5px',
    },
    divisor: {
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        margin: '24px 0',
    },
    formulario: {
        marginBottom: '16px',
    },
    titulo: {
        color: 'white',
        fontSize: '20px',
        fontWeight: '700',
        margin: '0 0 20px 0',
    },
    error: {
        backgroundColor: 'rgba(220,38,38,0.15)',
        border: '1px solid rgba(220,38,38,0.3)',
        color: '#fca5a5',
        padding: '10px 14px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '13px',
    },
    campo: {
        marginBottom: '16px',
    },
    label: {
        display: 'block',
        marginBottom: '6px',
        color: 'rgba(255,255,255,0.65)',
        fontSize: '13px',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '12px 14px',
        backgroundColor: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '10px',
        fontSize: '14px',
        color: 'white',
        outline: 'none',
        boxSizing: 'border-box',
    },
    boton: {
        width: '100%',
        padding: '13px',
        backgroundColor: '#FFD700',
        color: '#003399',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '800',
        cursor: 'pointer',
        marginTop: '8px',
        letterSpacing: '0.3px',
        boxShadow: '0 4px 20px rgba(255,215,0,0.35)',
    },
    footer: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '12px',
        margin: 0,
    },
};

export default Login;