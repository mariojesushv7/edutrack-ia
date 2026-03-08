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

    const yaRegistrado = (estudiante_id) => {
        return asistenciaHoy.some(a => a.estudiante_id === estudiante_id);
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

    const obtenerEstado = (estudiante_id) => {
        const registro = asistenciaHoy.find(a => a.estudiante_id === estudiante_id);
        return registro ? registro.estado : null;
    };

    const coloresEstado = {
        presente: { bg: '#dcfce7', color: '#16a34a' },
        ausente: { bg: '#fee2e2', color: '#dc2626' },
        tardanza: { bg: '#fef3c7', color: '#d97706' },
    };

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.header}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>
                    ← Volver
                </button>
                <div>
                    <h2 style={estilos.titulo}>Asistencia</h2>
                    <p style={estilos.fecha}>{hoy}</p>
                </div>
            </div>

            {error && <div style={estilos.error}>{error}</div>}
            {exito && <div style={estilos.exito}>{exito}</div>}

            {cargando ? (
                <p style={{ textAlign: 'center', color: '#64748b' }}>Cargando...</p>
            ) : (
                <div style={estilos.lista}>
                    {estudiantes.map(estudiante => {
                        const estado = obtenerEstado(estudiante.id);
                        const registrado = yaRegistrado(estudiante.id);

                        return (
                            <div key={estudiante.id} style={estilos.tarjeta}>
                                <div style={estilos.tarjetaInfo}>
                                    <div style={estilos.avatar}>
                                        {estudiante.nombre[0]}{estudiante.apellido[0]}
                                    </div>
                                    <div>
                                        <div style={estilos.nombre}>{estudiante.nombre} {estudiante.apellido}</div>
                                        <div style={estilos.grado}>Grado {estudiante.grado} · Sección {estudiante.seccion}</div>
                                    </div>
                                </div>

                                {registrado ? (
                                    <span style={{
                                        ...estilos.estadoBadge,
                                        backgroundColor: coloresEstado[estado]?.bg,
                                        color: coloresEstado[estado]?.color
                                    }}>
                                        {estado}
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
    );
};

const estilos = {
    contenedor: { padding: '24px', backgroundColor: '#f0f4f8', minHeight: '100vh' },
    header: { display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' },
    titulo: { color: '#1e293b', margin: 0 },
    fecha: { color: '#64748b', fontSize: '14px', margin: '4px 0 0 0', textTransform: 'capitalize' },
    botonVolver: { background: 'none', border: '1px solid #d1d5db', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', color: '#374151', marginTop: '4px' },
    error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' },
    exito: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' },
    lista: { display: 'flex', flexDirection: 'column', gap: '12px' },
    tarjeta: { backgroundColor: 'white', padding: '16px 20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    tarjetaInfo: { display: 'flex', alignItems: 'center', gap: '14px' },
    avatar: { width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#1e40af', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' },
    nombre: { fontWeight: '600', color: '#1e293b', fontSize: '15px' },
    grado: { color: '#64748b', fontSize: '13px', marginTop: '2px' },
    botones: { display: 'flex', gap: '8px' },
    boton: { color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
    estadoBadge: { padding: '6px 16px', borderRadius: '20px', fontWeight: '600', fontSize: '13px', textTransform: 'capitalize' },
};

export default Asistencia;