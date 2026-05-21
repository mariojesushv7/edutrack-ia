import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Asistencia = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [asistenciaHoy, setAsistenciaHoy] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const navigate = useNavigate();
    const hoy = new Date().toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => { cargarDatos(); }, []);

    const cargarDatos = async () => {
        try {
            const [respEstudiantes, respAsistencia] = await Promise.all([
                api.get('/estudiantes'),
                api.get('/asistencia/hoy')
            ]);
            setEstudiantes(respEstudiantes.data);
            setAsistenciaHoy(respAsistencia.data);
        } catch (err) {
            setError('Error al cargar datos');
        } finally {
            setCargando(false);
        }
    };

    const yaRegistrado = (id) => asistenciaHoy.some(a => a.estudiante_id === id);
    const obtenerEstado = (id) => asistenciaHoy.find(a => a.estudiante_id === id)?.estado || null;

    const registrar = async (estudiante_id, estado) => {
        try {
            await api.post('/asistencia', { estudiante_id, estado });
            setExito('Asistencia registrada');
            setTimeout(() => setExito(''), 3000);
            cargarDatos();
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al registrar');
            setTimeout(() => setError(''), 3000);
        }
    };

    const presentes = asistenciaHoy.filter(a => a.estado === 'presente').length;
    const ausentes = asistenciaHoy.filter(a => a.estado === 'ausente').length;
    const tardanzas = asistenciaHoy.filter(a => a.estado === 'tardanza').length;
    const pendientes = estudiantes.length - asistenciaHoy.length;

    const colores = {
        presente: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', texto: 'Presente' },
        ausente: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', texto: 'Ausente' },
        tardanza: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', texto: 'Tardanza' },
    };

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.fondo} />
            <div style={estilos.circulo1} />

            <div style={estilos.inner}>
                <div style={estilos.navbar}>
                    <div style={estilos.navIzq}>
                        <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>← Volver</button>
                        <div>
                            <div style={estilos.navTituloTexto}>Asistencia</div>
                            <div style={estilos.navSubtitulo} dangerouslySetInnerHTML={{ __html: hoy }} />
                        </div>
                    </div>
                </div>

                <div style={estilos.contenido}>
                    {error && <div style={estilos.error}>⚠ {error}</div>}
                    {exito && <div style={estilos.exito}>✓ {exito}</div>}

                    <div style={estilos.statsGrid}>
                        {[
                            { num: presentes, label: 'Presentes', color: '#34d399' },
                            { num: ausentes, label: 'Ausentes', color: '#f87171' },
                            { num: tardanzas, label: 'Tardanzas', color: '#fbbf24' },
                            { num: pendientes, label: 'Pendientes', color: '#94a3b8' },
                        ].map((s, i) => (
                            <div key={i} style={{ ...estilos.statCard, borderTop: `2px solid ${s.color}` }}>
                                <div style={{ ...estilos.statNum, color: s.color }}>{s.num}</div>
                                <div style={estilos.statLabel}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={estilos.panel}>
                        <div style={estilos.panelHeader}>
                            <span style={estilos.panelTitulo}>Registro del día</span>
                            <span style={estilos.panelMeta}>{estudiantes.length} estudiantes</span>
                        </div>

                        {cargando ? (
                            <p style={estilos.vacio}>Cargando...</p>
                        ) : (
                            <div style={estilos.lista}>
                                {estudiantes.map(e => {
                                    const estado = obtenerEstado(e.id);
                                    const registrado = yaRegistrado(e.id);
                                    const c = estado ? colores[estado] : null;

                                    return (
                                        <div key={e.id} style={{
                                            ...estilos.fila,
                                            borderLeft: registrado ? `3px solid ${c?.color}` : '3px solid rgba(255,255,255,0.05)'
                                        }}>
                                            <div style={estilos.estudianteInfo}>
                                                <div style={{ ...estilos.avatar, backgroundColor: registrado ? c?.bg : 'rgba(255,255,255,0.05)', color: registrado ? c?.color : 'rgba(255,255,255,0.4)', border: `1px solid ${registrado ? c?.border : 'rgba(255,255,255,0.08)'}` }}>
                                                    {e.nombre[0]}{e.apellido[0]}
                                                </div>
                                                <div>
                                                    <div style={estilos.nombre}>{e.nombre} {e.apellido}</div>
                                                    <div style={estilos.grado}>Grado {e.grado} · Sección {e.seccion}</div>
                                                </div>
                                            </div>

                                            {registrado ? (
                                                <span style={{ ...estilos.badge, backgroundColor: c?.bg, color: c?.color, border: `1px solid ${c?.border}` }}>
                                                    {c?.texto}
                                                </span>
                                            ) : (
                                                <div style={estilos.botones}>
                                                    <button onClick={() => registrar(e.id, 'presente')} style={{ ...estilos.boton, borderColor: 'rgba(52,211,153,0.3)', color: '#34d399' }}>
                                                        Presente
                                                    </button>
                                                    <button onClick={() => registrar(e.id, 'tardanza')} style={{ ...estilos.boton, borderColor: 'rgba(251,191,36,0.3)', color: '#fbbf24' }}>
                                                        Tardanza
                                                    </button>
                                                    <button onClick={() => registrar(e.id, 'ausente')} style={{ ...estilos.boton, borderColor: 'rgba(248,113,113,0.3)', color: '#f87171' }}>
                                                        Ausente
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div style={estilos.footer}>
                    <span>© {new Date().getFullYear()} Unidad Educativa Adventista Salomón</span>
                </div>
            </div>
        </div>
    );
};

const estilos = {
    contenedor: { minHeight: '100vh', background: 'linear-gradient(140deg, #000d2e 0%, #001a5c 40%, #002d8a 100%)', position: 'relative', overflow: 'hidden' },
    fondo: { position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 41px)` },
    circulo1: { position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,220,0.12) 0%, transparent 65%)', filter: 'blur(80px)', top: '-200px', right: '-150px' },
    inner: { position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    navbar: { backgroundColor: 'rgba(0,8,30,0.7)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    navIzq: { display: 'flex', alignItems: 'center', gap: '20px' },
    botonVolver: { backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
    navTituloTexto: { color: 'white', fontWeight: '700', fontSize: '16px' },
    navSubtitulo: { color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '2px', textTransform: 'capitalize' },
    contenido: { padding: '32px 40px', flex: 1 },
    error: { backgroundColor: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', color: '#fca5a5', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
    exito: { backgroundColor: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#6ee7b7', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' },
    statCard: { backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px 20px', textAlign: 'center' },
    statNum: { fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' },
    statLabel: { color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '4px', fontWeight: '500' },
    panel: { backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    panelTitulo: { color: 'white', fontWeight: '700', fontSize: '14px' },
    panelMeta: { color: 'rgba(255,255,255,0.3)', fontSize: '12px' },
    lista: {},
    fila: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    estudianteInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: { width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0 },
    nombre: { color: 'white', fontSize: '14px', fontWeight: '600' },
    grado: { color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '2px' },
    botones: { display: 'flex', gap: '8px' },
    boton: { backgroundColor: 'transparent', border: '1px solid', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', letterSpacing: '0.2px' },
    badge: { padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
    vacio: { textAlign: 'center', color: 'rgba(255,255,255,0.25)', padding: '40px', fontSize: '14px' },
    footer: { display: 'flex', justifyContent: 'center', padding: '14px 40px', color: 'rgba(255,255,255,0.15)', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.05)' },
};

export default Asistencia;