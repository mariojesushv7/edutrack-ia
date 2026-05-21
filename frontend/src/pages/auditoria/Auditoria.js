import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Auditoria = () => {
    const [registros, setRegistros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [filtro, setFiltro] = useState('');
    const navigate = useNavigate();

    useEffect(() => { cargarAuditoria(); }, []);

    const cargarAuditoria = async () => {
        try {
            const r = await api.get('/auditoria');
            setRegistros(r.data);
        } catch { setError('Error al cargar auditoría'); }
        finally { setCargando(false); }
    };

    const colorAccion = (accion) => {
        if (accion === 'crear') return { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' };
        if (accion === 'modificar') return { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' };
        return { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' };
    };

    const iconoTabla = (tabla) => {
        const iconos = { notas: 'N', asistencia: 'A', tareas: 'T', conducta: 'C', estudiantes: 'E' };
        return iconos[tabla] || '·';
    };

    const registrosFiltrados = registros.filter(r =>
        `${r.usuario_nombre} ${r.usuario_apellido} ${r.tabla_afectada} ${r.accion}`.toLowerCase().includes(filtro.toLowerCase())
    );

    const stats = {
        crear: registros.filter(r => r.accion === 'crear').length,
        modificar: registros.filter(r => r.accion === 'modificar').length,
        eliminar: registros.filter(r => r.accion === 'eliminar').length,
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
                            <div style={estilos.navTituloTexto}>Auditoría</div>
                            <div style={estilos.navSubtitulo}>Historial inmutable del sistema</div>
                        </div>
                    </div>
                </div>

                <div style={estilos.contenido}>
                    {error && <div style={estilos.error}>⚠ {error}</div>}

                    <div style={estilos.statsGrid}>
                        {[
                            { num: stats.crear, label: 'Creaciones', color: '#34d399' },
                            { num: stats.modificar, label: 'Modificaciones', color: '#fbbf24' },
                            { num: stats.eliminar, label: 'Eliminaciones', color: '#f87171' },
                            { num: registros.length, label: 'Total registros', color: '#60a5fa' },
                        ].map((s, i) => (
                            <div key={i} style={{ ...estilos.statCard, borderTop: `2px solid ${s.color}` }}>
                                <div style={{ ...estilos.statNum, color: s.color }}>{s.num}</div>
                                <div style={estilos.statLabel}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={estilos.panel}>
                        <div style={estilos.panelHeader}>
                            <div>
                                <div style={estilos.panelTitulo}>Registro de actividad</div>
                                <div style={estilos.panelSubtitulo}>Todos los cambios del sistema — no modificable</div>
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por usuario, tabla o acción..."
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                                style={estilos.buscador}
                            />
                        </div>

                        <div style={estilos.tablaHeader}>
                            <span style={{ flex: 1 }}>Acción</span>
                            <span style={{ flex: 1 }}>Tabla</span>
                            <span style={{ flex: 2 }}>Usuario</span>
                            <span style={{ flex: 1 }}>Rol</span>
                            <span style={{ flex: 2 }}>Fecha y hora</span>
                            <span style={{ flex: 1 }}>IP</span>
                        </div>

                        {cargando ? (
                            <p style={estilos.vacio}>Cargando...</p>
                        ) : registrosFiltrados.length === 0 ? (
                            <p style={estilos.vacio}>Sin registros de auditoría</p>
                        ) : (
                            registrosFiltrados.map((r, i) => {
                                const c = colorAccion(r.accion);
                                return (
                                    <div key={i} style={estilos.fila}>
                                        <span style={{ flex: 1 }}>
                                            <span style={{ ...estilos.badge, backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                                                {r.accion}
                                            </span>
                                        </span>
                                        <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={estilos.tablaIcono}>{iconoTabla(r.tabla_afectada)}</span>
                                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{r.tabla_afectada}</span>
                                        </span>
                                        <span style={{ flex: 2, color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{r.usuario_nombre} {r.usuario_apellido}</span>
                                        <span style={{ flex: 1 }}>
                                            <span style={estilos.rolChip}>{r.usuario_rol}</span>
                                        </span>
                                        <span style={{ flex: 2, color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>{new Date(r.created_at).toLocaleString()}</span>
                                        <span style={{ flex: 1, color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>{r.ip || '—'}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                <div style={estilos.footer}><span>© {new Date().getFullYear()} Unidad Educativa Adventista Salomón</span></div>
            </div>
        </div>
    );
};

const estilos = {
    contenedor: { minHeight: '100vh', background: 'linear-gradient(140deg, #000d2e 0%, #001a5c 40%, #002d8a 100%)', position: 'relative', overflow: 'hidden' },
    fondo: { position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 41px)` },
    circulo1: { position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,220,0.12) 0%, transparent 65%)', filter: 'blur(80px)', top: '-200px', right: '-150px' },
    inner: { position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    navbar: { backgroundColor: 'rgba(0,8,30,0.7)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '14px 40px', display: 'flex', alignItems: 'center' },
    navIzq: { display: 'flex', alignItems: 'center', gap: '20px' },
    botonVolver: { backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
    navTituloTexto: { color: 'white', fontWeight: '700', fontSize: '16px' },
    navSubtitulo: { color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '2px' },
    contenido: { padding: '32px 40px', flex: 1 },
    error: { backgroundColor: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', color: '#fca5a5', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' },
    statCard: { backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px 20px', textAlign: 'center' },
    statNum: { fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' },
    statLabel: { color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '4px' },
    panel: { backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    panelTitulo: { color: 'white', fontWeight: '700', fontSize: '14px' },
    panelSubtitulo: { color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '2px' },
    buscador: { padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', fontSize: '12px', color: 'white', outline: 'none', width: '280px' },
    tablaHeader: { display: 'flex', padding: '10px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' },
    fila: { display: 'flex', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'capitalize' },
    tablaIcono: { width: '22px', height: '22px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' },
    rolChip: { backgroundColor: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)', color: 'rgba(255,215,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize' },
    vacio: { textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '40px', fontSize: '14px' },
    footer: { display: 'flex', justifyContent: 'center', padding: '14px 40px', color: 'rgba(255,255,255,0.15)', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.05)' },
};

export default Auditoria;