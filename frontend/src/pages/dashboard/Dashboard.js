import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const iconos = {
    estudiantes: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
    ),
    asignaciones: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
    ),
    asistencia: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
    ),
    notas: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
        </svg>
    ),
    tareas: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
    ),
    conducta: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
    ),
    ia: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
    ),
    auditoria: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
    ),
};

const Dashboard = () => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const tarjetasDirector = [
        { titulo: 'Estudiantes', subtitulo: 'Gestión y registro', ruta: '/estudiantes', icono: 'estudiantes', color: '#60a5fa' },
        { titulo: 'Asignaciones', subtitulo: 'Docente — Estudiante', ruta: '/asignaciones', icono: 'asignaciones', color: '#a78bfa' },
        { titulo: 'Asistencia', subtitulo: 'Control diario', ruta: '/asistencia', icono: 'asistencia', color: '#34d399' },
        { titulo: 'Notas', subtitulo: 'Calificaciones', ruta: '/notas', icono: 'notas', color: '#fbbf24' },
        { titulo: 'Tareas', subtitulo: 'Seguimiento académico', ruta: '/tareas', icono: 'tareas', color: '#f87171' },
        { titulo: 'Conducta', subtitulo: 'Comportamiento', ruta: '/conducta', icono: 'conducta', color: '#38bdf8' },
        { titulo: 'Análisis IA', subtitulo: 'Riesgo académico', ruta: '/ia', icono: 'ia', color: '#c084fc' },
        { titulo: 'Auditoría', subtitulo: 'Historial del sistema', ruta: '/auditoria', icono: 'auditoria', color: '#94a3b8' },
    ];

    const tarjetasDocente = [
        { titulo: 'Mis Estudiantes', subtitulo: 'Estudiantes asignados', ruta: '/estudiantes', icono: 'estudiantes', color: '#60a5fa' },
        { titulo: 'Asistencia', subtitulo: 'Control diario', ruta: '/asistencia', icono: 'asistencia', color: '#34d399' },
        { titulo: 'Notas', subtitulo: 'Calificaciones', ruta: '/notas', icono: 'notas', color: '#fbbf24' },
        { titulo: 'Tareas', subtitulo: 'Seguimiento académico', ruta: '/tareas', icono: 'tareas', color: '#f87171' },
        { titulo: 'Conducta', subtitulo: 'Comportamiento', ruta: '/conducta', icono: 'conducta', color: '#38bdf8' },
    ];

    const tarjetas = usuario?.rol === 'director' ? tarjetasDirector : tarjetasDocente;
    const hora = new Date().getHours();
    const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.fondo} />
            <div style={estilos.circulo1} />
            <div style={estilos.circulo2} />

            <div style={estilos.inner}>
                {/* Navbar */}
                <div style={estilos.navbar}>
                    <div style={estilos.navLogo}>
                        <img src="/logo-salomon.jpg" alt="logo" style={estilos.navLogoImg} />
                        <div>
                            <div style={estilos.navNombre}>U.E. Adventista Salomón</div>
                            <div style={estilos.navSistema}>Sistema Inteligente de Seguimiento Académico</div>
                        </div>
                    </div>
                    <div style={estilos.navDerecha}>
                        <div style={estilos.rolBadge}>
                            {usuario?.rol === 'director' ? 'Director' : 'Docente'}
                        </div>
                        <div style={estilos.divider} />
                        <div style={estilos.usuarioInfo}>
                            <div style={estilos.usuarioAvatar}>
                                {usuario?.nombre[0]}{usuario?.apellido[0]}
                            </div>
                            <div>
                                <div style={estilos.usuarioNombre}>{usuario?.nombre} {usuario?.apellido}</div>
                                <div style={estilos.usuarioEmail}>{usuario?.email}</div>
                            </div>
                        </div>
                        <button onClick={handleLogout} style={estilos.botonSalir}>
                            Cerrar sesión
                        </button>
                    </div>
                </div>

                <div style={estilos.contenido}>
                    {/* Bienvenida */}
                    <div style={estilos.bienvenidaBox}>
                        <div style={estilos.bienvenidaLeft}>
                            <p style={estilos.saludoTexto}>{saludo}</p>
                            <h2 style={estilos.bienvenidaTitulo}>{usuario?.nombre} {usuario?.apellido}</h2>
                            <p style={estilos.bienvenidaSubtitulo}>
                                {usuario?.rol === 'director'
                                    ? 'Acceso completo al sistema de gestión académica inteligente'
                                    : 'Gestiona la información académica de tus estudiantes'}
                            </p>
                            <div style={estilos.badgeRow}>
                                <div style={estilos.badge}>
                                    <div style={estilos.badgeDot} />
                                    Sistema activo
                                </div>
                                <div style={estilos.badge}>
                                    IA habilitada
                                </div>
                            </div>
                        </div>
                        <div style={estilos.bienvenidaRight}>
                            <div style={estilos.fechaBox}>
                                <div style={estilos.fechaDia}>{new Date().getDate()}</div>
                                <div style={estilos.fechaMes}>
                                    {new Date().toLocaleDateString('es-BO', { month: 'long' })}
                                </div>
                                <div style={estilos.fechaAnio}>
                                    {new Date().getFullYear()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Separador */}
                    <div style={estilos.separador}>
                        <div style={estilos.separadorLinea} />
                        <span style={estilos.separadorTexto}>MÓDULOS</span>
                        <div style={estilos.separadorLinea} />
                    </div>

                    {/* Tarjetas */}
                    <div style={estilos.tarjetas}>
                        {tarjetas.map((t, i) => (
                            <div
                                key={i}
                                style={estilos.tarjeta}
                                onClick={() => navigate(t.ruta)}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.borderColor = t.color + '50';
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.11)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                }}
                            >
                                <div style={estilos.tarjetaHeader}>
                                    <div style={{ ...estilos.tarjetaIcono, backgroundColor: t.color + '18' }}>
                                        {iconos[t.icono](t.color)}
                                    </div>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                        <polyline points="12 5 19 12 12 19"/>
                                    </svg>
                                </div>
                                <div style={estilos.tarjetaBody}>
                                    <h3 style={{ ...estilos.tarjetaTitulo, color: 'white' }}>{t.titulo}</h3>
                                    <p style={estilos.tarjetaSubtitulo}>{t.subtitulo}</p>
                                </div>
                                <div style={{ ...estilos.tarjetaAccent, backgroundColor: t.color }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div style={estilos.footer}>
                    <span>© {new Date().getFullYear()} Unidad Educativa Adventista Salomón</span>
                    <span style={estilos.footerDot}>·</span>
                    <span>EduTrack IA — Sistema de Seguimiento Académico</span>
                </div>
            </div>
        </div>
    );
};

const estilos = {
    contenedor: {
        minHeight: '100vh',
        background: 'linear-gradient(140deg, #000d2e 0%, #001a5c 40%, #002d8a 100%)',
        position: 'relative',
        overflow: 'hidden',
    },
    fondo: {
        position: 'absolute', inset: 0,
        background: `
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 41px),
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 41px)
        `,
    },
    circulo1: {
        position: 'absolute', width: '800px', height: '800px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,80,220,0.14) 0%, transparent 65%)',
        filter: 'blur(80px)', top: '-350px', right: '-250px',
    },
    circulo2: {
        position: 'absolute', width: '600px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 65%)',
        filter: 'blur(80px)', bottom: '-100px', left: '-100px',
    },
    inner: { position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    navbar: {
        backgroundColor: 'rgba(0,8,30,0.7)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '14px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navLogo: { display: 'flex', alignItems: 'center', gap: '14px' },
    navLogoImg: { width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(255,215,0,0.6)', objectFit: 'cover' },
    navNombre: { color: 'white', fontWeight: '700', fontSize: '14px', letterSpacing: '0.2px' },
    navSistema: { color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '0.3px', marginTop: '2px' },
    navDerecha: { display: 'flex', alignItems: 'center', gap: '14px' },
    rolBadge: {
        backgroundColor: 'rgba(255,215,0,0.1)',
        border: '1px solid rgba(255,215,0,0.25)',
        color: '#FFD700',
        padding: '5px 14px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '1px',
        textTransform: 'uppercase',
    },
    divider: { width: '1px', height: '28px', backgroundColor: 'rgba(255,255,255,0.08)' },
    usuarioInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
    usuarioAvatar: {
        width: '34px', height: '34px', borderRadius: '8px',
        backgroundColor: '#FFD700', color: '#001a5c',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: '800', fontSize: '13px',
    },
    usuarioNombre: { color: 'white', fontSize: '13px', fontWeight: '600' },
    usuarioEmail: { color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '1px' },
    botonSalir: {
        backgroundColor: 'transparent',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.5)',
        padding: '7px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500',
        letterSpacing: '0.2px',
        transition: 'all 0.2s',
    },
    contenido: { padding: '36px 40px', flex: 1 },
    bienvenidaBox: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '32px 36px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
    },
    bienvenidaLeft: {},
    saludoTexto: { color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '0 0 6px', letterSpacing: '0.5px' },
    bienvenidaTitulo: { color: 'white', fontSize: '28px', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-0.5px' },
    bienvenidaSubtitulo: { color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '0 0 16px', maxWidth: '460px', lineHeight: '1.5' },
    badgeRow: { display: 'flex', gap: '8px' },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.5)',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    badgeDot: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34d399' },
    bienvenidaRight: {},
    fechaBox: { textAlign: 'right' },
    fechaDia: { color: '#FFD700', fontSize: '56px', fontWeight: '900', lineHeight: 1, letterSpacing: '-2px' },
    fechaMes: { color: 'rgba(255,255,255,0.4)', fontSize: '13px', textTransform: 'capitalize', marginTop: '4px', letterSpacing: '0.5px' },
    fechaAnio: { color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '2px' },
    separador: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' },
    separadorLinea: { flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' },
    separadorTexto: { color: 'rgba(255,255,255,0.2)', fontSize: '11px', fontWeight: '700', letterSpacing: '2.5px' },
    tarjetas: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
        gap: '12px',
    },
    tarjeta: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        cursor: 'pointer',
        transition: 'transform 0.2s, border-color 0.2s, background-color 0.2s',
        overflow: 'hidden',
        position: 'relative',
    },
    tarjetaHeader: {
        padding: '18px 18px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    tarjetaIcono: {
        width: '44px', height: '44px', borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    tarjetaBody: { padding: '0 18px 18px' },
    tarjetaTitulo: { fontSize: '15px', fontWeight: '700', margin: '0 0 4px', letterSpacing: '-0.2px' },
    tarjetaSubtitulo: { fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: '1.4' },
    tarjetaAccent: { height: '2px', width: '100%', opacity: 0.5 },
    footer: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
        padding: '14px 40px',
        color: 'rgba(255,255,255,0.18)',
        fontSize: '11px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        letterSpacing: '0.3px',
    },
    footerDot: { color: 'rgba(255,255,255,0.1)' },
};

export default Dashboard;