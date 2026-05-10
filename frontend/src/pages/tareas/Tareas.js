import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const materias = [
    'Matemáticas', 'Lenguaje', 'Ciencias Naturales', 'Ciencias Sociales',
    'Inglés', 'Educación Física', 'Arte', 'Música', 'Computación', 'Religión'
];

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

    useEffect(() => { cargarEstudiantes(); }, []);

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
            await api.post('/tareas', { ...form, estudiante_id: estudianteSeleccionado.id });
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
            setExito(entregada ? '✓ Tarea marcada como entregada' : '📧 Padre notificado: tarea no entregada');
            setTimeout(() => setExito(''), 3000);
            seleccionarEstudiante(estudianteSeleccionado);
        } catch (err) {
            setError('Error al actualizar tarea');
            setTimeout(() => setError(''), 3000);
        }
    };

    const porcentajeEntrega = resumen?.total > 0
        ? Math.round((resumen.entregadas / resumen.total) * 100)
        : 0;

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.navbar}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>← Volver</button>
                <div style={estilos.navTitulo}>
                    <span style={estilos.navIcono}>📚</span>
                    <h2 style={estilos.titulo}>Tareas</h2>
                </div>
            </div>

            <div style={estilos.contenido}>
                {error && <div style={estilos.error}>⚠️ {error}</div>}
                {exito && <div style={estilos.exito}>{exito}</div>}

                <div style={estilos.layout}>
                    <div style={estilos.listaEstudiantes}>
                        <h3 style={estilos.subtitulo}>Estudiantes</h3>
                        {estudiantes.map(e => (
                            <div
                                key={e.id}
                                onClick={() => seleccionarEstudiante(e)}
                                style={{
                                    ...estilos.tarjetaEstudiante,
                                    backgroundColor: estudianteSeleccionado?.id === e.id ? '#1e40af' : 'white',
                                    color: estudianteSeleccionado?.id === e.id ? 'white' : '#1e293b',
                                    boxShadow: estudianteSeleccionado?.id === e.id ? '0 4px 12px rgba(30,64,175,0.3)' : 'none',
                                }}
                            >
                                <div style={{
                                    ...estilos.avatar,
                                    backgroundColor: estudianteSeleccionado?.id === e.id ? 'rgba(255,255,255,0.2)' : '#dbeafe',
                                    color: estudianteSeleccionado?.id === e.id ? 'white' : '#1e40af',
                                }}>
                                    {e.nombre[0]}{e.apellido[0]}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{e.nombre} {e.apellido}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.7 }}>Grado {e.grado} · {e.seccion}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={estilos.panelTareas}>
                        {!estudianteSeleccionado ? (
                            <div style={estilos.sinSeleccion}>
                                <div style={estilos.sinSeleccionIcono}>📚</div>
                                <p style={{ color: '#94a3b8', fontSize: '15px' }}>Selecciona un estudiante para ver sus tareas</p>
                            </div>
                        ) : (
                            <>
                                <div style={estilos.panelHeader}>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>
                                            {estudianteSeleccionado.nombre} {estudianteSeleccionado.apellido}
                                        </h3>
                                        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                                            Grado {estudianteSeleccionado.grado} · Sección {estudianteSeleccionado.seccion}
                                        </p>
                                    </div>
                                    <button onClick={() => setMostrarFormulario(!mostrarFormulario)} style={estilos.botonAgregar}>
                                        + Agregar tarea
                                    </button>
                                </div>

                                {resumen && (
                                    <div style={estilos.resumenBox}>
                                        <div style={estilos.resumenStats}>
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
                                        <div style={estilos.progreso}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <span style={{ fontSize: '12px', color: '#64748b' }}>Tasa de entrega</span>
                                                <span style={{ fontSize: '12px', fontWeight: '700', color: porcentajeEntrega >= 70 ? '#16a34a' : '#dc2626' }}>
                                                    {porcentajeEntrega}%
                                                </span>
                                            </div>
                                            <div style={estilos.progresoBar}>
                                                <div style={{
                                                    ...estilos.progresoFill,
                                                    width: `${porcentajeEntrega}%`,
                                                    backgroundColor: porcentajeEntrega >= 70 ? '#16a34a' : porcentajeEntrega >= 50 ? '#d97706' : '#dc2626'
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {mostrarFormulario && (
                                    <div style={estilos.formulario}>
                                        <h4 style={{ margin: '0 0 12px', color: '#1e40af' }}>Nueva tarea</h4>
                                        <form onSubmit={handleSubmit}>
                                            <div style={estilos.grid}>
                                                <div style={estilos.campo}>
                                                    <label style={estilos.label}>Materia</label>
                                                    <select
                                                        value={form.materia}
                                                        onChange={(e) => setForm({ ...form, materia: e.target.value })}
                                                        style={estilos.input}
                                                        required
                                                    >
                                                        <option value="">Seleccionar materia...</option>
                                                        {materias.map(m => (
                                                            <option key={m} value={m}>{m}</option>
                                                        ))}
                                                    </select>
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
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                                <button type="submit" style={estilos.botonGuardar}>Guardar tarea</button>
                                                <button type="button" onClick={() => setMostrarFormulario(false)} style={estilos.botonCancelar}>Cancelar</button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div style={estilos.listaTareas}>
                                    {tareas.length === 0 ? (
                                        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Sin tareas registradas</p>
                                    ) : (
                                        tareas.map(t => (
                                            <div key={t.id} style={{
                                                ...estilos.tarjetaTarea,
                                                borderLeft: `4px solid ${t.entregada ? '#16a34a' : '#ef4444'}`
                                            }}>
                                                <div style={estilos.tareaIcono}>
                                                    {t.entregada ? '✓' : '⏳'}
                                                </div>
                                                <div style={estilos.tareaInfo}>
                                                    <div style={estilos.tareaMateria}>{t.materia}</div>
                                                    <div style={estilos.tareaDesc}>{t.descripcion}</div>
                                                    <div style={estilos.tareaFecha}>
                                                        📅 Asignada: {new Date(t.fecha_asignacion).toLocaleDateString()}
                                                        {t.fecha_entrega && ` · Entregada: ${new Date(t.fecha_entrega).toLocaleDateString()}`}
                                                    </div>
                                                </div>
                                                <div style={estilos.tareaAccion}>
                                                    {t.entregada ? (
                                                        <span style={estilos.badgeEntregada}>✓ Entregada</span>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
    exito: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
    layout: { display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' },
    listaEstudiantes: { backgroundColor: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'fit-content' },
    subtitulo: { color: '#64748b', fontSize: '11px', fontWeight: '700', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.08em' },
    tarjetaEstudiante: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', marginBottom: '6px', transition: 'all 0.2s' },
    avatar: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0 },
    panelTareas: { backgroundColor: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    sinSeleccion: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px' },
    sinSeleccionIcono: { fontSize: '48px', opacity: 0.3 },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
    botonAgregar: { backgroundColor: '#1e40af', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    resumenBox: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' },
    resumenStats: { display: 'flex', gap: '24px', marginBottom: '12px' },
    resumenItem: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    resumenNum: { fontSize: '24px', fontWeight: '800', color: '#1e293b' },
    resumenLabel: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
    progreso: { marginTop: '4px' },
    progresoBar: { width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' },
    progresoFill: { height: '100%', borderRadius: '4px', transition: 'width 0.5s ease' },
    formulario: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
    campo: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '13px', color: '#374151', marginBottom: '6px', fontWeight: '600' },
    input: { padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none' },
    botonGuardar: { backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    botonCancelar: { backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    listaTareas: { display: 'flex', flexDirection: 'column', gap: '10px' },
    tarjetaTarea: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#fafafa' },
    tareaIcono: { fontSize: '20px', flexShrink: 0 },
    tareaInfo: { flex: 1 },
    tareaMateria: { fontWeight: '700', color: '#1e40af', fontSize: '14px' },
    tareaDesc: { color: '#374151', fontSize: '14px', marginTop: '2px' },
    tareaFecha: { color: '#94a3b8', fontSize: '12px', marginTop: '4px' },
    tareaAccion: { marginLeft: '8px', flexShrink: 0 },
    badgeEntregada: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' },
    botonEntregar: { backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', width: '100%' },
};

export default Tareas;