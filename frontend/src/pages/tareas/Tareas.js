import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Tareas = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
    const [tareas, setTareas] = useState([]);
    const [resumen, setResumen] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [form, setForm] = useState({ materia: '', descripcion: '' });

    const navigate = useNavigate();

    useEffect(() => {
        cargarEstudiantes();
    }, []);

    const cargarEstudiantes = async () => {
        try {
            const respuesta = await api.get('/estudiantes');
            setEstudiantes(respuesta.data);
        } catch (err) {
            setError('Error al cargar estudiantes');
        }
    };

    const seleccionarEstudiante = async (estudiante) => {
        setEstudianteSeleccionado(estudiante);
        setMostrarFormulario(false);
        try {
            const respuesta = await api.get(`/tareas/estudiante/${estudiante.id}`);
            setTareas(respuesta.data.tareas);
            setResumen(respuesta.data.resumen);
        } catch (err) {
            setError('Error al cargar tareas');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tareas', {
                ...form,
                estudiante_id: estudianteSeleccionado.id
            });
            setExito('Tarea registrada exitosamente');
            setMostrarFormulario(false);
            setForm({ materia: '', descripcion: '' });
            setTimeout(() => setExito(''), 3000);
            seleccionarEstudiante(estudianteSeleccionado);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al registrar tarea');
            setTimeout(() => setError(''), 3000);
        }
    };

    const marcarEstado = async (tareaId, entregada) => {
        try {
            await api.put(`/tareas/${tareaId}/estado`, { entregada });
            setExito(entregada ? 'Tarea marcada como entregada' : 'Padre notificado: tarea no entregada');
            setTimeout(() => setExito(''), 3000);
            seleccionarEstudiante(estudianteSeleccionado);
        } catch (err) {
            setError('Error al actualizar tarea');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.header}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>
                    ← Volver
                </button>
                <h2 style={estilos.titulo}>Tareas</h2>
            </div>

            {error && <div style={estilos.error}>{error}</div>}
            {exito && <div style={estilos.exito}>{exito}</div>}

            <div style={estilos.layout}>
                <div style={estilos.listaEstudiantes}>
                    <h3 style={estilos.subtitulo}>Selecciona un estudiante</h3>
                    {estudiantes.map(e => (
                        <div
                            key={e.id}
                            onClick={() => seleccionarEstudiante(e)}
                            style={{
                                ...estilos.tarjetaEstudiante,
                                backgroundColor: estudianteSeleccionado?.id === e.id ? '#1e40af' : 'white',
                                color: estudianteSeleccionado?.id === e.id ? 'white' : '#1e293b',
                            }}
                        >
                            <div style={estilos.avatar}>{e.nombre[0]}{e.apellido[0]}</div>
                            <div>
                                <div style={{ fontWeight: '600' }}>{e.nombre} {e.apellido}</div>
                                <div style={{ fontSize: '12px', opacity: 0.7 }}>Grado {e.grado} · {e.seccion}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={estilos.panelTareas}>
                    {!estudianteSeleccionado ? (
                        <div style={estilos.sinSeleccion}>
                            <p>Selecciona un estudiante para ver sus tareas</p>
                        </div>
                    ) : (
                        <>
                            <div style={estilos.panelHeader}>
                                <h3 style={{ margin: 0, color: '#1e293b' }}>
                                    {estudianteSeleccionado.nombre} {estudianteSeleccionado.apellido}
                                </h3>
                                <button onClick={() => setMostrarFormulario(!mostrarFormulario)} style={estilos.botonAgregar}>
                                    + Agregar tarea
                                </button>
                            </div>

                            {resumen && (
                                <div style={estilos.resumenBox}>
                                    <div style={estilos.resumenItem}>
                                        <span style={estilos.resumenNum}>{resumen.total}</span>
                                        <span style={estilos.resumenLabel}>Total</span>
                                    </div>
                                    <div style={estilos.resumenItem}>
                                        <span style={{ ...estilos.resumenNum, color: '#16a34a' }}>{resumen.entregadas}</span>
                                        <span style={estilos.resumenLabel}>Entregadas</span>
                                    </div>
                                    <div style={estilos.resumenItem}>
                                        <span style={{ ...estilos.resumenNum, color: '#dc2626' }}>{resumen.pendientes}</span>
                                        <span style={estilos.resumenLabel}>Pendientes</span>
                                    </div>
                                </div>
                            )}

                            {mostrarFormulario && (
                                <div style={estilos.formulario}>
                                    <form onSubmit={handleSubmit}>
                                        <div style={estilos.grid}>
                                            <div style={estilos.campo}>
                                                <label style={estilos.label}>Materia</label>
                                                <input
                                                    type="text"
                                                    value={form.materia}
                                                    onChange={(e) => setForm({ ...form, materia: e.target.value })}
                                                    style={estilos.input}
                                                    placeholder="Ej: Matemáticas"
                                                    required
                                                />
                                            </div>
                                            <div style={estilos.campo}>
                                                <label style={estilos.label}>Descripción</label>
                                                <input
                                                    type="text"
                                                    value={form.descripcion}
                                                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                                    style={estilos.input}
                                                    placeholder="Ej: Ejercicios del capítulo 3"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" style={estilos.botonGuardar}>Guardar tarea</button>
                                    </form>
                                </div>
                            )}

                            <div style={estilos.listaTareas}>
                                {tareas.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>Sin tareas registradas</p>
                                ) : (
                                    tareas.map(t => (
                                        <div key={t.id} style={estilos.tarjetaTarea}>
                                            <div style={estilos.tareaInfo}>
                                                <div style={estilos.tareaMateria}>{t.materia}</div>
                                                <div style={estilos.tareaDesc}>{t.descripcion}</div>
                                                <div style={estilos.tareaFecha}>Asignada: {new Date(t.fecha_asignacion).toLocaleDateString()}</div>
                                            </div>
                                            <div style={estilos.tareaAccion}>
                                                {t.entregada ? (
                                                    <span style={estilos.badgeEntregada}>✓ Entregada</span>
                                                ) : (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => marcarEstado(t.id, true)} style={estilos.botonEntregar}>
                                                            ✓ Entregó
                                                        </button>
                                                        <button onClick={() => marcarEstado(t.id, false)} style={{ ...estilos.botonEntregar, backgroundColor: '#dc2626' }}>
                                                            ✗ No entregó
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
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
    exito: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' },
    layout: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px' },
    listaEstudiantes: { backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'fit-content' },
    subtitulo: { color: '#64748b', fontSize: '13px', fontWeight: '600', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' },
    tarjetaEstudiante: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px' },
    avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0 },
    panelTareas: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    sinSeleccion: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#94a3b8' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    botonAgregar: { backgroundColor: '#1e40af', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    resumenBox: { display: 'flex', gap: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px' },
    resumenItem: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    resumenNum: { fontSize: '24px', fontWeight: '700', color: '#1e293b' },
    resumenLabel: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
    formulario: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
    campo: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '13px', color: '#374151', marginBottom: '6px', fontWeight: '500' },
    input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' },
    botonGuardar: { marginTop: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    listaTareas: { display: 'flex', flexDirection: 'column', gap: '10px' },
    tarjetaTarea: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: '8px' },
    tareaInfo: { flex: 1 },
    tareaMateria: { fontWeight: '600', color: '#1e40af', fontSize: '14px' },
    tareaDesc: { color: '#374151', fontSize: '14px', marginTop: '2px' },
    tareaFecha: { color: '#94a3b8', fontSize: '12px', marginTop: '4px' },
    tareaAccion: { marginLeft: '16px' },
    badgeEntregada: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
    botonEntregar: { backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
};

export default Tareas;