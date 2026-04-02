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
        { titulo: 'Estudiantes', icono: '👨‍🎓', descripcion: 'Ver y registrar estudiantes', ruta: '/estudiantes', color: '#3b82f6' },
        { titulo: 'Asignaciones', icono: '👨‍🏫', descripcion: 'Asignar estudiantes a docentes', ruta: '/asignaciones', color: '#8b5cf6' },
        { titulo: 'Asistencia', icono: '📋', descripcion: 'Registrar asistencia diaria', ruta: '/asistencia', color: '#10b981' },
        { titulo: 'Notas', icono: '📝', descripcion: 'Registrar y ver calificaciones', ruta: '/notas', color: '#f59e0b' },
        { titulo: 'Tareas', icono: '📚', descripcion: 'Control de tareas asignadas', ruta: '/tareas', color: '#ef4444' },
        { titulo: 'Conducta', icono: '😊', descripcion: 'Registro de comportamiento', ruta: '/conducta', color: '#06b6d4' },
        { titulo: 'Análisis IA', icono: '🤖', descripcion: 'Detección de riesgo académico', ruta: '/ia', color: '#6366f1' },
        { titulo: 'Auditoría', icono: '🔍', descripcion: 'Historial de cambios', ruta: '/auditoria', color: '#64748b' },
    ];

    const tarjetasDocente = [
        { titulo: 'Mis Estudiantes', icono: '👨‍🎓', descripcion: 'Ver mis estudiantes asignados', ruta: '/estudiantes', color: '#3b82f6' },
        { titulo: 'Asistencia', icono: '📋', descripcion: 'Registrar asistencia diaria', ruta: '/asistencia', color: '#10b981' },
        { titulo: 'Notas', icono: '📝', descripcion: 'Registrar y ver calificaciones', ruta: '/notas', color: '#f59e0b' },
        { titulo: 'Tareas', icono: '📚', descripcion: 'Control de tareas asignadas', ruta: '/tareas', color: '#ef4444' },
        { titulo: 'Conducta', icono: '😊', descripcion: 'Registro de comportamiento', ruta: '/conducta', color: '#06b6d4' },
    ];

    const tarjetas = usuario?.rol === 'director' ? tarjetasDirector : tarjetasDocente;

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.navbar}>
                <div style={estilos.navLogo}>
                    <span style={estilos.navLogoIcono}>🎓</span>
                    <h1 style={estilos.logo}>EduTrack IA</h1>
                </div>
                <div style={estilos.navDerecha}>
                    <div style={estilos.usuarioInfo}>
                        <div style={estilos.usuarioAvatar}>
                            {usuario?.nombre[0]}{usuario?.apellido[0]}
                        </div>
                        <div>
                            <div style={estilos.usuarioNombre}>{usuario?.nombre} {usuario?.apellido}</div>
                            <div style={estilos.usuarioRol}>
                                {usuario?.rol === 'director' ? '👑 Director' : '👨‍🏫 Docente'}
                            </div>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={estilos.botonSalir}>
                        Cerrar sesión
                    </button>
                </div>
            </div>

            <div style={estilos.contenido}>
                <div style={estilos.bienvenidaBox}>
                    <div>
                        <h2 style={estilos.bienvenidaTitulo}>
                            Buenos días, {usuario?.nombre} 👋
                        </h2>
                        <p style={estilos.bienvenidaSubtitulo}>
                            {usuario?.rol === 'director'
                                ? 'Tienes acceso completo al sistema de gestión académica'
                                : 'Gestiona la información académica de tus estudiantes asignados'}
                        </p>
                    </div>
                </div>

                <div style={estilos.tarjetas}>
                    {tarjetas.map((t, i) => (
                        <div
                            key={i}
                            style={estilos.tarjeta}
                            onClick={() => navigate(t.ruta)}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ ...estilos.tarjetaIconoBox, backgroundColor: t.color + '15' }}>
                                <span style={estilos.icono}>{t.icono}</span>
                            </div>
                            <div style={estilos.tarjetaTexto}>
                                <h3 style={{ ...estilos.tarjetaTitulo, color: t.color }}>{t.titulo}</h3>
                                <p style={estilos.tarjetaDesc}>{t.descripcion}</p>
                            </div>
                            <div style={{ ...estilos.tarjetaFlecha, color: t.color }}>→</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const estilos = {
    contenedor: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
    navbar: {
        backgroundColor: 'white',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    navLogo: { display: 'flex', alignItems: 'center', gap: '10px' },
    navLogoIcono: { fontSize: '28px' },
    logo: { color: '#1e40af', fontSize: '20px', margin: 0, fontWeight: '800' },
    navDerecha: { display: 'flex', alignItems: 'center', gap: '20px' },
    usuarioInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    usuarioAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#1e40af',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '14px',
    },
    usuarioNombre: { fontSize: '14px', fontWeight: '600', color: '#1e293b' },
    usuarioRol: { fontSize: '12px', color: '#64748b' },
    botonSalir: {
        backgroundColor: '#fee2e2',
        border: 'none',
        color: '#dc2626',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
    },
    contenido: { padding: '32px' },
    bienvenidaBox: {
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
        borderRadius: '16px',
        padding: '28px 32px',
        marginBottom: '28px',
        color: 'white',
    },
    bienvenidaTitulo: { fontSize: '22px', fontWeight: '700', margin: '0 0 6px 0' },
    bienvenidaSubtitulo: { fontSize: '14px', color: '#bfdbfe', margin: 0 },
    tarjetas: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '16px',
    },
    tarjeta: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '1px solid #f1f5f9',
    },
    tarjetaIconoBox: {
        width: '52px',
        height: '52px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    icono: { fontSize: '26px' },
    tarjetaTexto: { flex: 1 },
    tarjetaTitulo: { fontSize: '15px', fontWeight: '700', margin: '0 0 4px 0' },
    tarjetaDesc: { fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.4' },
    tarjetaFlecha: { fontSize: '18px', fontWeight: '700', flexShrink: 0 },
};

export default Dashboard;