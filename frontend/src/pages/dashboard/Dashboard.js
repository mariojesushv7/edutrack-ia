import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const tarjetasDirector = [
        { titulo: 'Estudiantes', icono: '👨‍🎓', descripcion: 'Ver y registrar estudiantes', ruta: '/estudiantes' },
        { titulo: 'Asignaciones', icono: '👨‍🏫', descripcion: 'Asignar estudiantes a docentes', ruta: '/asignaciones' },
        { titulo: 'Asistencia', icono: '📋', descripcion: 'Registrar asistencia diaria', ruta: '/asistencia' },
        { titulo: 'Notas', icono: '📝', descripcion: 'Registrar y ver calificaciones', ruta: '/notas' },
        { titulo: 'Tareas', icono: '📚', descripcion: 'Control de tareas asignadas', ruta: '/tareas' },
        { titulo: 'Conducta', icono: '😊', descripcion: 'Registro de comportamiento', ruta: '/conducta' },
        { titulo: 'Análisis IA', icono: '🤖', descripcion: 'Detección de riesgo académico', ruta: '/ia' },
        { titulo: 'Auditoría', icono: '🔍', descripcion: 'Historial de cambios', ruta: '/auditoria' },
    ];

    const tarjetasDocente = [
        { titulo: 'Mis Estudiantes', icono: '👨‍🎓', descripcion: 'Ver mis estudiantes asignados', ruta: '/estudiantes' },
        { titulo: 'Asistencia', icono: '📋', descripcion: 'Registrar asistencia diaria', ruta: '/asistencia' },
        { titulo: 'Notas', icono: '📝', descripcion: 'Registrar y ver calificaciones', ruta: '/notas' },
        { titulo: 'Tareas', icono: '📚', descripcion: 'Control de tareas asignadas', ruta: '/tareas' },
        { titulo: 'Conducta', icono: '😊', descripcion: 'Registro de comportamiento', ruta: '/conducta' },
    ];

    const tarjetas = usuario?.rol === 'director' ? tarjetasDirector : tarjetasDocente;

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.navbar}>
                <h1 style={estilos.logo}>EduTrack IA</h1>
                <div style={estilos.navDerecha}>
                    <span style={estilos.rolBadge}>
                        {usuario?.rol === 'director' ? '👑 Director' : '👨‍🏫 Docente'}
                    </span>
                    <span style={estilos.bienvenida}>
                        {usuario?.nombre} {usuario?.apellido}
                    </span>
                    <button onClick={handleLogout} style={estilos.botonSalir}>
                        Cerrar sesión
                    </button>
                </div>
            </div>

            <div style={estilos.contenido}>
                <h2 style={estilos.titulo}>Panel Principal</h2>
                <div style={estilos.tarjetas}>
                    {tarjetas.map((t, i) => (
                        <div key={i} style={estilos.tarjeta} onClick={() => navigate(t.ruta)}>
                            <div style={estilos.icono}>{t.icono}</div>
                            <h3 style={estilos.tarjetaTitulo}>{t.titulo}</h3>
                            <p style={estilos.tarjetaDesc}>{t.descripcion}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const estilos = {
    contenedor: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
    navbar: { backgroundColor: '#1e40af', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo: { color: 'white', fontSize: '22px', margin: 0 },
    navDerecha: { display: 'flex', alignItems: 'center', gap: '16px' },
    rolBadge: { backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
    bienvenida: { color: 'white', fontSize: '14px' },
    botonSalir: { backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
    contenido: { padding: '32px' },
    titulo: { color: '#1e293b', marginBottom: '24px' },
    tarjetas: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
    tarjeta: { backgroundColor: 'white', padding: '28px 24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s' },
    icono: { fontSize: '40px', marginBottom: '12px' },
    tarjetaTitulo: { color: '#1e40af', marginBottom: '8px', fontSize: '18px' },
    tarjetaDesc: { color: '#64748b', fontSize: '13px', margin: 0 },
};

export default Dashboard;