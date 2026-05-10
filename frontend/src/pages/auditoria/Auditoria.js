import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Auditoria = () => {
    const [registros, setRegistros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [filtro, setFiltro] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        cargarAuditoria();
    }, []);

    const cargarAuditoria = async () => {
        try {
            const respuesta = await api.get('/auditoria');
            setRegistros(respuesta.data);
        } catch (err) {
            setError('Error al cargar auditoría');
        } finally {
            setCargando(false);
        }
    };

    const colorAccion = (accion) => {
        if (accion === 'crear') return { bg: '#dcfce7', color: '#16a34a', icon: '➕' };
        if (accion === 'modificar') return { bg: '#fef3c7', color: '#d97706', icon: '✏️' };
        return { bg: '#fee2e2', color: '#dc2626', icon: '🗑️' };
    };

    const iconoTabla = (tabla) => {
        if (tabla === 'notas') return '📝';
        if (tabla === 'asistencia') return '📋';
        if (tabla === 'tareas') return '📚';
        if (tabla === 'conducta') return '😊';
        if (tabla === 'estudiantes') return '👨‍🎓';
        return '📄';
    };

    const registrosFiltrados = registros.filter(r =>
        `${r.usuario_nombre} ${r.usuario_apellido} ${r.tabla_afectada} ${r.accion}`
            .toLowerCase().includes(filtro.toLowerCase())
    );

    const stats = {
        crear: registros.filter(r => r.accion === 'crear').length,
        modificar: registros.filter(r => r.accion === 'modificar').length,
        eliminar: registros.filter(r => r.accion === 'eliminar').length,
    };

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.navbar}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>← Volver</button>
                <div style={estilos.navTitulo}>
                    <span style={estilos.navIcono}>🔍</span>
                    <h2 style={estilos.titulo}>Auditoría del Sistema</h2>
                </div>
            </div>

            <div style={estilos.contenido}>
                {error && <div style={estilos.error}>⚠️ {error}</div>}

                <div style={estilos.statsGrid}>
                    <div style={{ ...estilos.statCard, borderTop: '4px solid #16a34a' }}>
                        <div style={estilos.statIcono}>➕</div>
                        <div style={{ ...estilos.statNum, color: '#16a34a' }}>{stats.crear}</div>
                        <div style={estilos.statLabel}>Creaciones</div>
                    </div>
                    <div style={{ ...estilos.statCard, borderTop: '4px solid #d97706' }}>
                        <div style={estilos.statIcono}>✏️</div>
                        <div style={{ ...estilos.statNum, color: '#d97706' }}>{stats.modificar}</div>
                        <div style={estilos.statLabel}>Modificaciones</div>
                    </div>
                    <div style={{ ...estilos.statCard, borderTop: '4px solid #dc2626' }}>
                        <div style={estilos.statIcono}>🗑️</div>
                        <div style={{ ...estilos.statNum, color: '#dc2626' }}>{stats.eliminar}</div>
                        <div style={estilos.statLabel}>Eliminaciones</div>
                    </div>
                    <div style={{ ...estilos.statCard, borderTop: '4px solid #1e40af' }}>
                        <div style={estilos.statIcono}>📊</div>
                        <div style={{ ...estilos.statNum, color: '#1e40af' }}>{registros.length}</div>
                        <div style={estilos.statLabel}>Total Registros</div>
                    </div>
                </div>

                <div style={estilos.panel}>
                    <div style={estilos.panelHeader}>
                        <div>
                            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: '700' }}>Historial de cambios</h3>
                            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                                Registro inmutable de todas las acciones del sistema
                            </p>
                        </div>
                        <input
                            type="text"
                            placeholder="🔍 Buscar por usuario, tabla o acción..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            style={estilos.buscador}
                        />
                    </div>

                    {cargando ? (
                        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Cargando...</p>
                    ) : registrosFiltrados.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Sin registros de auditoría</p>
                    ) : (
                        <div style={estilos.listaRegistros}>
                            {registrosFiltrados.map((r, i) => {
                                const accion = colorAccion(r.accion);
                                return (
                                    <div key={i} style={estilos.registroItem}>
                                        <div style={{ ...estilos.accionIcono, backgroundColor: accion.bg, color: accion.color }}>
                                            {accion.icon}
                                        </div>
                                        <div style={estilos.registroInfo}>
                                            <div style={estilos.registroTitulo}>
                                                <span style={{ ...estilos.accionBadge, backgroundColor: accion.bg, color: accion.color }}>
                                                    {r.accion}
                                                </span>
                                                <span style={estilos.tablaChip}>
                                                    {iconoTabla(r.tabla_afectada)} {r.tabla_afectada}
                                                </span>
                                            </div>
                                            <div style={estilos.registroMeta}>
                                                👤 {r.usuario_nombre} {r.usuario_apellido}
                                                <span style={estilos.rolChip}>{r.usuario_rol}</span>
                                                · 📅 {new Date(r.created_at).toLocaleString()}
                                                · 🌐 {r.ip || 'IP no disponible'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const estilos = {
    contenedor: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
    navbar: { backgroundColor: 'white', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 },
    botonVolver: { background: 'none', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', color: '#374151', fontSize: '14px' },
    navTitulo: { display: 'flex', alignItems: 'center', gap: '10px' },
    navIcono: { fontSize: '24px' },
    titulo: { color: '#1e293b', margin: 0, fontSize: '20px', fontWeight: '700' },
    contenido: { padding: '24px 32px' },
    error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
    statCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    statIcono: { fontSize: '24px', marginBottom: '8px' },
    statNum: { fontSize: '32px', fontWeight: '800' },
    statLabel: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
    panel: { backgroundColor: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
    buscador: { padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', width: '300px', outline: 'none' },
    listaRegistros: { display: 'flex', flexDirection: 'column', gap: '8px' },
    registroItem: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', border: '1px solid #f1f5f9', borderRadius: '10px', backgroundColor: '#fafafa' },
    accionIcono: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 },
    registroInfo: { flex: 1 },
    registroTitulo: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' },
    accionBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize' },
    tablaChip: { backgroundColor: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
    registroMeta: { color: '#64748b', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' },
    rolChip: { backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize' },
};

export default Auditoria;