import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Auditoria = () => {
    const [registros, setRegistros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
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
        if (accion === 'crear') return { bg: '#dcfce7', color: '#16a34a' };
        if (accion === 'modificar') return { bg: '#fef3c7', color: '#d97706' };
        return { bg: '#fee2e2', color: '#dc2626' };
    };

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.header}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>
                    ← Volver
                </button>
                <h2 style={estilos.titulo}>Auditoría del Sistema</h2>
            </div>

            {error && <div style={estilos.error}>{error}</div>}

            <div style={estilos.panel}>
                <div style={estilos.panelHeader}>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Historial de cambios</h3>
                    <span style={estilos.totalBadge}>{registros.length} registros</span>
                </div>

                {cargando ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8' }}>Cargando...</p>
                ) : registros.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>Sin registros de auditoría</p>
                ) : (
                    <table style={estilos.tabla}>
                        <thead>
                            <tr style={estilos.thead}>
                                <th style={estilos.th}>Fecha</th>
                                <th style={estilos.th}>Usuario</th>
                                <th style={estilos.th}>Rol</th>
                                <th style={estilos.th}>Acción</th>
                                <th style={estilos.th}>Tabla</th>
                                <th style={estilos.th}>IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((r, i) => {
                                const accion = colorAccion(r.accion);
                                return (
                                    <tr key={i} style={estilos.tr}>
                                        <td style={estilos.td}>{new Date(r.created_at).toLocaleString()}</td>
                                        <td style={estilos.td}>{r.usuario_nombre} {r.usuario_apellido}</td>
                                        <td style={estilos.td}>{r.usuario_rol}</td>
                                        <td style={estilos.td}>
                                            <span style={{ ...estilos.accionBadge, backgroundColor: accion.bg, color: accion.color }}>
                                                {r.accion}
                                            </span>
                                        </td>
                                        <td style={estilos.td}>{r.tabla_afectada}</td>
                                        <td style={estilos.td}>{r.ip || '-'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const estilos = {
    contenedor: { padding: '24px', backgroundColor: '#f0f4f8', minHeight: '100vh' },
    header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
    titulo: { color: '#1e293b', margin: 0 },
    botonVolver: { background: 'none', border: '1px solid #d1d5db', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', color: '#374151' },
    error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' },
    panel: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    totalBadge: { backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
    tabla: { width: '100%', borderCollapse: 'collapse' },
    thead: { backgroundColor: '#f8fafc' },
    th: { padding: '12px 16px', color: '#64748b', textAlign: 'left', fontSize: '13px', fontWeight: '600', borderBottom: '1px solid #e2e8f0' },
    tr: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '12px 16px', color: '#374151', fontSize: '14px' },
    accionBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' },
};

export default Auditoria;