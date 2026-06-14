import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PadreDashboard = () => {
    const [hijos, setHijos] = useState([]);
    const [hijoSeleccionado, setHijoSeleccionado] = useState(null);
    const [asistencia, setAsistencia] = useState([]);
    const [notas, setNotas] = useState([]);
    const [promedio, setPromedio] = useState(null);
    const [tareas, setTareas] = useState([]);
    const [notificaciones, setNotificaciones] = useState([]);
    const [pestana, setPestana] = useState('asistencia');
    const [cargando, setCargando] = useState(true);
    const { usuario, logout } = useAuth();
    const [conducta, setConducta] = useState([]);
    const navigate = useNavigate();

    const cargarHijos = async () => {
        try {
            const respuesta = await api.get('/estudiantes');
            const misHijos = respuesta.data.filter(e => String(e.tutor_id) === String(usuario.id));
            setHijos(misHijos);
            if (misHijos.length > 0) {
                const primerHijo = misHijos[0];
                setHijoSeleccionado(primerHijo);
                const [rA, rN, rP, rT, rC] = await Promise.all([
                    api.get(`/asistencia/estudiante/${primerHijo.id}`),
                    api.get(`/notas/estudiante/${primerHijo.id}`),
                    api.get(`/notas/promedio/${primerHijo.id}`),
                    api.get(`/tareas/estudiante/${primerHijo.id}`),
                    api.get(`/conducta/estudiante/${primerHijo.id}`),
                ]);
                setAsistencia(rA.data);
                setNotas(rN.data);
                setPromedio(rP.data);
                setTareas(rT.data.tareas);
                setConducta(rC.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setCargando(false);
        }
    };
    
    const seleccionarHijo = async (hijo) => {
        setHijoSeleccionado(hijo);
        setAsistencia([]);
        setConducta([]);
        setNotas([]);
        setPromedio(null);
        setTareas([]);
        try {
            const [rA, rN, rP, rT, rC] = await Promise.all([
                api.get(`/asistencia/estudiante/${hijo.id}`),
                api.get(`/notas/estudiante/${hijo.id}`),
                api.get(`/notas/promedio/${hijo.id}`),
                api.get(`/tareas/estudiante/${hijo.id}`),
                api.get(`/conducta/estudiante/${hijo.id}`),
            ]);
            setAsistencia(rA.data);
            setNotas(rN.data);
            setPromedio(rP.data);
            setTareas(rT.data.tareas);
            setConducta(rC.data);
        } catch (err) {
            console.error(err);
        }
    };
    const cargarNotificaciones = async () => {
        try {
            const respuesta = await api.get(`/notificaciones/${usuario.id}`);
            setNotificaciones(respuesta.data);
        } catch (err) {
            console.error(err);
        }
    };
    
    useEffect(() => {
        cargarHijos();
        cargarNotificaciones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const colorNota = (v) => v >= 70 ? '#34d399' : v >= 51 ? '#fbbf24' : '#f87171';

    const colorAsistencia = {
        presente: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
        ausente: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
        tardanza: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (cargando) return (
        <div style={{ ...estilos.contenedor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: 'white' }}>Cargando...</div>
        </div>
    );

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.fondo} />
            <div style={estilos.circulo1} />
            <div style={estilos.inner}>
                {/* Navbar */}
                <div style={estilos.navbar}>
                    <div style={estilos.navLogo}>
                        <img src="/logo-salomon.jpg" alt="logo" style={estilos.navLogoImg} />
                        <div>
                            <div style={estilos.navNombre}>U.E. Adventista Salomón</div>
                            <div style={estilos.navSistema}>Portal de Padres de Familia</div>
                        </div>
                    </div>
                    <div style={estilos.navDerecha}>
                        <div style={estilos.rolBadge}>👨‍👩‍👧 Padre de familia</div>
                        <div style={estilos.usuarioInfo}>
                            <div style={estilos.usuarioAvatar}>{usuario?.nombre[0]}{usuario?.apellido[0]}</div>
                            <div>
                                <div style={estilos.usuarioNombre}>{usuario?.nombre} {usuario?.apellido}</div>
                                <div style={estilos.usuarioEmail}>{usuario?.email}</div>
                            </div>
                        </div>
                        <button onClick={handleLogout} style={estilos.botonSalir}>Cerrar sesión</button>
                    </div>
                </div>

                <div style={estilos.contenido}>
                    {hijos.length === 0 ? (
                        <div style={estilos.sinHijos}>
                            <p style={{ color: 'rgba(255,255,255,0.5)' }}>No tienes estudiantes asignados. Contacta a la institución.</p>
                        </div>
                    ) : (
                        <>
                            {/* Selector de hijo */}
                            {hijos.length > 1 && (
                                <div style={estilos.hijosRow}>
                                    {hijos.map(h => (
                                        <div key={h.id} onClick={() => seleccionarHijo(h)} style={{
                                            ...estilos.hijoChip,
                                            backgroundColor: hijoSeleccionado?.id === h.id ? '#FFD700' : 'rgba(255,255,255,0.06)',
                                            color: hijoSeleccionado?.id === h.id ? '#001a5c' : 'rgba(255,255,255,0.6)',
                                            border: `1px solid ${hijoSeleccionado?.id === h.id ? '#FFD700' : 'rgba(255,255,255,0.1)'}`,
                                        }}>
                                            {h.nombre} {h.apellido}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Info del hijo */}
                            {hijoSeleccionado && (
                                <div style={estilos.hijoInfo}>
                                    <div style={estilos.hijoAvatar}>{hijoSeleccionado.nombre[0]}{hijoSeleccionado.apellido[0]}</div>
                                    <div>
                                        <div style={estilos.hijoNombre}>{hijoSeleccionado.nombre} {hijoSeleccionado.apellido}</div>
                                        <div style={estilos.hijoGrado}>Grado {hijoSeleccionado.grado} · Sección {hijoSeleccionado.seccion}</div>
                                    </div>
                                    {promedio && (
                                        <div style={estilos.promedioBox}>
                                            <div style={estilos.promedioLabel}>Promedio general</div>
                                            <div style={{ ...estilos.promedioValor, color: colorNota(promedio.promedio_general) }}>
                                                {promedio.promedio_general || '—'}
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ marginLeft: 'auto' }}>
                                        <div style={{ ...estilos.notifBadge, display: notificaciones.filter(n => !n.leida).length > 0 ? 'flex' : 'none' }}>
                                            {notificaciones.filter(n => !n.leida).length} nuevas notificaciones
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pestañas */}
                            <div style={estilos.pestanas}>
                            {['asistencia', 'notas', 'tareas', 'conducta', 'notificaciones'].map(p => (
                                    <button key={p} onClick={() => setPestana(p)} style={{
                                        ...estilos.pestana,
                                        backgroundColor: pestana === p ? '#FFD700' : 'transparent',
                                        color: pestana === p ? '#001a5c' : 'rgba(255,255,255,0.4)',
                                        border: `1px solid ${pestana === p ? '#FFD700' : 'rgba(255,255,255,0.1)'}`,
                                    }}>
                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                        {p === 'notificaciones' && notificaciones.filter(n => !n.leida).length > 0 && (
                                            <span style={estilos.pestanaDot} />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Contenido de pestañas */}
                            <div style={estilos.panel}>
                                {pestana === 'asistencia' && (
                                    <div>
                                        <div style={estilos.panelHeader}>
                                            <span style={estilos.panelTitulo}>Registro de asistencia</span>
                                            <span style={estilos.panelMeta}>{asistencia.length} registros</span>
                                        </div>
                                        {asistencia.length === 0 ? (
                                            <p style={estilos.vacio}>Sin registros de asistencia</p>
                                        ) : asistencia.map((a, i) => {
                                            const c = colorAsistencia[a.estado];
                                            return (
                                                <div key={i} style={{ ...estilos.fila, borderLeft: `3px solid ${c?.color}` }}>
                                                    <div style={estilos.filaFecha}>{new Date(a.fecha).toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                                                    <span style={{ ...estilos.badge, backgroundColor: c?.bg, color: c?.color, border: `1px solid ${c?.border}` }}>
                                                        {a.estado}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {pestana === 'notas' && (
                                    <div>
                                        <div style={estilos.panelHeader}>
                                            <span style={estilos.panelTitulo}>Calificaciones</span>
                                        </div>
                                        {notas.length === 0 ? (
                                            <p style={estilos.vacio}>Sin notas registradas</p>
                                        ) : (
                                            <div style={estilos.notasGrid}>
                                                {notas.map((n, i) => (
                                                    <div key={i} style={estilos.notaCard}>
                                                        <div style={estilos.notaMateria}>{n.materia}</div>
                                                        <div style={estilos.notaParcial}>{n.parcial} parcial</div>
                                                        <div style={{ ...estilos.notaValor, color: colorNota(n.valor) }}>{n.valor}</div>
                                                        {n.observacion && <div style={estilos.notaObs}>{n.observacion}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {pestana === 'tareas' && (
                                    <div>
                                        <div style={estilos.panelHeader}>
                                            <span style={estilos.panelTitulo}>Tareas asignadas</span>
                                        </div>
                                        {tareas.length === 0 ? (
                                            <p style={estilos.vacio}>Sin tareas registradas</p>
                                        ) : tareas.map((t, i) => (
                                            <div key={i} style={{ ...estilos.fila, borderLeft: `3px solid ${t.entregada ? '#34d399' : '#f87171'}` }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={estilos.tareaMateria}>{t.materia}</div>
                                                    <div style={estilos.tareaDesc}>{t.descripcion}</div>
                                                    <div style={estilos.tareaFecha}>{new Date(t.fecha_asignacion).toLocaleDateString()}</div>
                                                </div>
                                                <span style={{
                                                    ...estilos.badge,
                                                    backgroundColor: t.entregada ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                                                    color: t.entregada ? '#34d399' : '#f87171',
                                                    border: `1px solid ${t.entregada ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
                                                }}>
                                                    {t.entregada ? 'Entregada' : 'Pendiente'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
{pestana === 'conducta' && (
    <div>
        <div style={estilos.panelHeader}>
            <span style={estilos.panelTitulo}>Registro de conducta</span>
            <span style={estilos.panelMeta}>{conducta.length} registros</span>
        </div>
        {conducta.length === 0 ? (
            <p style={estilos.vacio}>Sin registros de conducta</p>
        ) : conducta.map((c, i) => {
            const colores = {
                excelente: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
                bueno: { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
                regular: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
                malo: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
            };
            const col = colores[c.nivel];
            return (
                <div key={i} style={{ ...estilos.fila, borderLeft: `3px solid ${col?.color}` }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{c.descripcion || 'Sin descripción'}</div>
                        <div style={estilos.tareaFecha}>{new Date(c.fecha).toLocaleDateString()} · {c.docente_nombre}</div>
                    </div>
                    <span style={{ ...estilos.badge, backgroundColor: col?.bg, color: col?.color, border: `1px solid ${col?.border}` }}>
                        {c.nivel}
                    </span>
                </div>
            );
        })}
    </div>
)}
                                {pestana === 'notificaciones' && (
                                    <div>
                                        <div style={estilos.panelHeader}>
                                            <span style={estilos.panelTitulo}>Notificaciones</span>
                                            <span style={estilos.panelMeta}>{notificaciones.length} total</span>
                                        </div>
                                        {notificaciones.length === 0 ? (
                                            <p style={estilos.vacio}>Sin notificaciones</p>
                                        ) : notificaciones.map((n, i) => (
                                            <div key={i} style={{ ...estilos.fila, borderLeft: n.leida ? '3px solid rgba(255,255,255,0.05)' : '3px solid #FFD700' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ color: n.leida ? 'rgba(255,255,255,0.5)' : 'white', fontSize: '13px', lineHeight: '1.5' }}>{n.mensaje}</div>
                                                    <div style={estilos.tareaFecha}>{new Date(n.created_at).toLocaleDateString()}</div>
                                                </div>
                                                {!n.leida && <div style={estilos.nuevoDot} />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
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
    navLogo: { display: 'flex', alignItems: 'center', gap: '14px' },
    navLogoImg: { width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(255,215,0,0.6)', objectFit: 'cover' },
    navNombre: { color: 'white', fontWeight: '700', fontSize: '14px' },
    navSistema: { color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '2px' },
    navDerecha: { display: 'flex', alignItems: 'center', gap: '14px' },
    rolBadge: { backgroundColor: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', color: '#FFD700', padding: '5px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' },
    usuarioInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
    usuarioAvatar: { width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#FFD700', color: '#001a5c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px' },
    usuarioNombre: { color: 'white', fontSize: '13px', fontWeight: '600' },
    usuarioEmail: { color: 'rgba(255,255,255,0.35)', fontSize: '11px' },
    botonSalir: { backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
    contenido: { padding: '32px 40px', flex: 1 },
    sinHijos: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' },
    hijosRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
    hijoChip: { padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' },
    hijoInfo: { display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px 24px', marginBottom: '20px' },
    hijoAvatar: { width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(255,215,0,0.15)', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0 },
    hijoNombre: { color: 'white', fontWeight: '700', fontSize: '18px' },
    hijoGrado: { color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '2px' },
    promedioBox: { marginLeft: '24px', textAlign: 'center' },
    promedioLabel: { color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
    promedioValor: { fontSize: '28px', fontWeight: '800', marginTop: '2px' },
    notifBadge: { backgroundColor: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', alignItems: 'center' },
    pestanas: { display: 'flex', gap: '8px', marginBottom: '16px' },
    pestana: { padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' },
    pestanaDot: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#dc2626' },
    panel: { backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    panelTitulo: { color: 'white', fontWeight: '700', fontSize: '14px' },
    panelMeta: { color: 'rgba(255,255,255,0.3)', fontSize: '12px' },
    fila: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    filaFecha: { color: 'rgba(255,255,255,0.6)', fontSize: '13px', textTransform: 'capitalize' },
    badge: { padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize', whiteSpace: 'nowrap' },
    notasGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', padding: '16px 24px' },
    notaCard: { backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px', textAlign: 'center' },
    notaMateria: { color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '600', marginBottom: '4px' },
    notaParcial: { color: 'rgba(255,255,255,0.3)', fontSize: '10px', textTransform: 'capitalize', marginBottom: '6px' },
    notaValor: { fontSize: '28px', fontWeight: '800' },
    notaObs: { color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: '4px' },
    tareaMateria: { color: '#93c5fd', fontWeight: '700', fontSize: '13px' },
    tareaDesc: { color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '2px' },
    tareaFecha: { color: 'rgba(255,255,255,0.25)', fontSize: '11px', marginTop: '4px' },
    nuevoDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFD700', flexShrink: 0 },
    vacio: { textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '40px', fontSize: '14px' },
    footer: { display: 'flex', justifyContent: 'center', padding: '14px 40px', color: 'rgba(255,255,255,0.15)', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.05)' },
};

export default PadreDashboard;