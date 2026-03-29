import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.navbar}>
                <h1 style={estilos.logo}>EduTrack IA</h1>
                <div style={estilos.navDerecha}>
                    <span style={estilos.bienvenida}>
                        {usuario?.nombre} {usuario?.apellido} · {usuario?.rol}
                    </span>
                    <button onClick={handleLogout} style={estilos.botonSalir}>
                        Cerrar sesión
                    </button>
                </div>
            </div>

            <div style={estilos.contenido}>
                <h2 style={estilos.titulo}>Panel Principal</h2>

                <div style={estilos.tarjetas}>
                    <div style={estilos.tarjeta} onClick={() => navigate('/estudiantes')}>
                        <div style={estilos.icono}>👨‍🎓</div>
                        <h3 style={estilos.tarjetaTitulo}>Estudiantes</h3>
                        <p style={estilos.tarjetaDesc}>Ver y registrar estudiantes</p>
                    </div>

                    <div style={estilos.tarjeta} onClick={() => navigate('/asistencia')}>
                        <div style={estilos.icono}>📋</div>
                        <h3 style={estilos.tarjetaTitulo}>Asistencia</h3>
                        <p style={estilos.tarjetaDesc}>Registrar asistencia diaria</p>
                    </div>

                    <div style={estilos.tarjeta} onClick={() => navigate('/asignaciones')}>
    <div style={estilos.icono}>👨‍🏫</div>
    <h3 style={estilos.tarjetaTitulo}>Asignaciones</h3>
    <p style={estilos.tarjetaDesc}>Asignar estudiantes a docentes</p>
</div>

                    <div style={estilos.tarjeta} onClick={() => navigate('/notas')}>
                        <div style={estilos.icono}>📝</div>
                        <h3 style={estilos.tarjetaTitulo}>Notas</h3>
                        <p style={estilos.tarjetaDesc}>Registrar y ver calificaciones</p>
                    </div>

                    <div style={estilos.tarjeta} onClick={() => navigate('/tareas')}>
                        <div style={estilos.icono}>📚</div>
                        <h3 style={estilos.tarjetaTitulo}>Tareas</h3>
                        <p style={estilos.tarjetaDesc}>Control de tareas asignadas</p>
                    </div>

                    <div style={estilos.tarjeta} onClick={() => navigate('/conducta')}>
                        <div style={estilos.icono}>😊</div>
                        <h3 style={estilos.tarjetaTitulo}>Conducta</h3>
                        <p style={estilos.tarjetaDesc}>Registro de comportamiento</p>
                        </div>  
                        <div style={estilos.tarjeta} onClick={() => navigate('/ia')}>
    <div style={estilos.icono}>🤖</div>
    <h3 style={estilos.tarjetaTitulo}>Análisis IA</h3>
    <p style={estilos.tarjetaDesc}>Detección de riesgo académico</p>
</div>
                    </div>
                </div>
            </div>
        
    );
};

const estilos = {
    contenedor: {
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
    },
    navbar: {
        backgroundColor: '#1e40af',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        color: 'white',
        fontSize: '22px',
        margin: 0,
    },
    navDerecha: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    bienvenida: {
        color: 'white',
        fontSize: '14px',
        textTransform: 'capitalize',
    },
    botonSalir: {
        backgroundColor: 'transparent',
        border: '1px solid white',
        color: 'white',
        padding: '6px 14px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
    },
    contenido: {
        padding: '32px',
    },
    titulo: {
        color: '#1e293b',
        marginBottom: '24px',
    },
    tarjetas: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
    },
    tarjeta: {
        backgroundColor: 'white',
        padding: '28px 24px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'transform 0.2s',
    },
    icono: {
        fontSize: '40px',
        marginBottom: '12px',
    },
    tarjetaTitulo: {
        color: '#1e40af',
        marginBottom: '8px',
        fontSize: '18px',
    },
    tarjetaDesc: {
        color: '#64748b',
        fontSize: '13px',
        margin: 0,
    },
};

export default Dashboard;