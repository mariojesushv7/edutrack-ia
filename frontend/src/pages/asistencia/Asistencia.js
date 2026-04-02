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

    useEffect(() => {
        cargarDatos();
    }, []);

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

    const yaRegistrado = (estudiante_id) => asistenciaHoy.some(a => a.estudiante_id === estudiante_id);
    const obtenerEstado = (estudiante_id) => {
        const registro = asistenciaHoy.find(a => a.estudiante_id === estudiante_id);
        return registro ? registro.estado : null;
    };

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

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.navbar}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>
                    ← Volver
                </button>
                <div style={estilos.navTitulo}>
                    <span style={estilos.navIcono}>📋</span>
                    <div>
                        <h2 style={estilos.titulo}>Asistencia</h2>
                        <p style={estilos.fecha}>{hoy}</p>
                    </div>
                </div>
            </div>

            <div style={estilos.contenido}>
                {error && <div style={estilos.error}>⚠️ {error}</div>}
                {exito && <div style={estilos.exito}>✓ {exito}</div>}

                <div style={estilos.statsGrid}>
                    <div style={{ ...estilos.statCard, borderTop: '4px solid #16a34a' }}>
                        <div style={{ ...estilos.statNum, color: '#16a34a' }}>{presentes}</div>
                        <div style={estilos.statLabel}>Presentes</div>
                    </div>
                    <div style={{ ...estilos.statCard, borderTop: '4px solid #dc2626' }}>
                        <div style={{ ...estilos.statNum, color: '#dc2626' }}>{ausentes}</div>
                        <div style={estilos.statLabel}>Ausentes</div>
                    </div>
                    <div style={{ ...estilos.statCard, borderTop: '4px solid #d97706' }}>
                        <div style={{ ...estilos.statNum, color: '#d97706' }}>{tardanzas}</div>
                        <div style={estilos.statLabel}>Tardanzas</div>
                    </div>
                    <div style={{ ...estilos.statCard, borderTop: '4px solid #94a3b8' }}>
                        <div style={{ ...estilos.statNum, color: '#94a3b8' }}>{pendientes}</div>
                        <div style={estilos.statLabel}>Pendientes</div>
                    </div>
                </div>

                {cargando ? (
                    <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>Cargando...</p>
                ) : (
                    <div style={estilos.lista}>
                        {estudiantes.map(estudiante => {
                            const estado = obtenerEstado(estudiante.id);
                            const registrado = yaRegistrado(estudiante.id);

                            const colores = {
                                presente: { bg: '#dcfce7', color: '#16a34a', texto: '✓ Presente' },
                                ausente: { bg: '#fee2e2', color: '#dc2626', texto: '✗ Ausente' },
                                tardanza: { bg: '#fef3c7', color: '#d97706', texto: '⏰ Tardanza' },
                            };

                            return (
                                <div key={estudiante.id} style={{
                                    ...estilos.tarjeta,
                                    borderLeft: registrado ? `4px solid ${colores[estado]?.color}` : '4px solid #e2e8f0'
                                }}>
                                    <div style={estilos.tarjetaInfo}>
                                        <div style={{
                                            ...estilos.avatar,
                                            backgroundColor: registrado ? colores[estado]?.bg : '#dbeafe',
                                            color: registrado ? colores[estado]?.color : '#1e40af',
                                        }}>
                                            {estudiante.nombre[0]}{estudiante.apellido[0]}
                                        </div>
                                        <div>
                                            <div style={estilos.nombre}>{estudiante.nombre} {estudiante.apellido}</div>
                                            <div style={estilos.grado}>Grado {estudiante.grado} · Sección {estudiante.seccion}</div>
                                        </div>
                                    </div>

                                    {registrado ? (
                                        <span style={{
                                            backgroundColor: colores[estado]?.bg,
                                            color: colores[estado]?.color,
                                            padding: '8px 20px',
                                            borderRadius: '20px',
                                            fontWeight: '700',
                                            fontSize: '13px',
                                        }}>
                                            {colores[estado]?.texto}
                                        </span>
                                    ) : (
                                        <div style={estilos.botones}>
                                            <button onClick={() => registrar(estudiante.id, 'presente')} style={{ ...estilos.boton, backgroundColor: '#16a34a' }}>
                                                ✓ Presente
                                            </button>
                                            <button onClick={() => registrar(estudiante.id, 'tardanza')} style={{ ...estilos.boton, backgroundColor: '#d97706' }}>
                                                ⏰ Tardanza
                                            </button>
                                            <button onClick={() => registrar(estudiante.id, 'ausente')} style={{ ...estilos.boton, backgroundColor: '#dc2626' }}>
                                                ✗ Ausente
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
    );
};

const estilos = {
    contenedor: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
    navbar: {
        backgroundColor: 'white',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    botonVolver: { background: 'none', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', color: '#374151', fontSize: '14px' },
    navTitulo: { display: 'flex', alignItems: 'center', gap: '12px' },
    navIcono: { fontSize: '28px' },
    titulo: { color: '#1e293b', margin: 0, fontSize: '20px', fontWeight: '700' },
    fecha: { color: '#64748b', fontSize: '13px', margin: '2px 0 0 0', textTransform: 'capitalize' },
    contenido: { padding: '24px 32px' },
    error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
    exito: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
    statCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    statNum: { fontSize: '32px', fontWeight: '800' },
    statLabel: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
    lista: { display: 'flex', flexDirection: 'column', gap: '10px' },
    tarjeta: { backgroundColor: 'white', padding: '16px 20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    tarjetaInfo: { display: 'flex', alignItems: 'center', gap: '14px' },
    avatar: { width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', flexShrink: 0 },
    nombre: { fontWeight: '600', color: '#1e293b', fontSize: '15px' },
    grado: { color: '#64748b', fontSize: '13px', marginTop: '2px' },
    botones: { display: 'flex', gap: '8px' },
    boton: { color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
};

export default Asistencia;