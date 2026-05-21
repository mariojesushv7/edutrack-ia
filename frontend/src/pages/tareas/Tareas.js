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
            const r = await api.get('/estudiantes');
            setEstudiantes(r.data);
        } catch { setError('Error al cargar estudiantes'); }
    };

    const seleccionarEstudiante = async (e) => {
        setEstudianteSeleccionado(e);
        setMostrarFormulario(false);
        try {
            const r = await api.get(`/tareas/estudiante/${e.id}`);
            setTareas(r.data.tareas);
            setResumen(r.data.resumen);
        } catch { setError('Error al cargar tareas'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tareas', { ...form, estudiante_id: estudianteSeleccionado.id });
            setExito('Tarea registrada');
            setMostrarFormulario(false);
            setForm({ materia: '', descripcion: '' });
            setTimeout(() => setExito(''), 3000);
            seleccionarEstudiante(estudianteSeleccionado);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error');
            setTimeout(() => setError(''), 3000);
        }
    };

    const marcarEstado = async (tareaId, entregada) => {
        try {
            await api.put(`/tareas/${tareaId}/estado`, { entregada });
            setExito(entregada ? 'Tarea entregada' : 'Padre notificado');
            setTimeout(() => setExito(''), 3000);
            seleccionarEstudiante(estudianteSeleccionado);
        } catch {
            setError('Error al actualizar');
            setTimeout(() => setError(''), 3000);
        }
    };

    const porcentaje = resumen?.total > 0 ? Math.round((resumen.entregadas / resumen.total) * 100) : 0;

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.fondo} />
            <div style={estilos.circulo1} />
            <div style={estilos.inner}>
                <div style={estilos.navbar}>
                    <div style={estilos.navIzq}>
                        <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>← Volver</button>
                        <div>
                            <div style={estilos.navTituloTexto}>Tareas</div>
                            <div style={estilos.navSubtitulo}>Seguimiento académico</div>
                        </div>
                    </div>
                </div>

                <div style={estilos.contenido}>
                    {error && <div style={estilos.error}>⚠ {error}</div>}
                    {exito && <div style={estilos.exito}>✓ {exito}</div>}

                    <div style={estilos.layout}>
                        <div style={estilos.sidebar}>
                            <div style={estilos.sidebarHeader}>Estudiantes</div>
                            {estudiantes.map(e => (
                                <div key={e.id} onClick={() => seleccionarEstudiante(e)} style={{
                                    ...estilos.sidebarItem,
                                    backgroundColor: estudianteSeleccionado?.id === e.id ? 'rgba(255,215,0,0.08)' : 'transparent',
                                    borderLeft: estudianteSeleccionado?.id === e.id ? '3px solid #FFD700' : '3px solid transparent',
                                }}>
                                    <div style={{ ...estilos.sidebarAvatar, color: estudianteSeleccionado?.id === e.id ? '#FFD700' : 'rgba(255,255,255,0.4)' }}>
                                        {e.nombre[0]}{e.apellido[0]}
                                    </div>
                                    <div>
                                        <div style={{ ...estilos.sidebarNombre, color: estudianteSeleccionado?.id === e.id ? 'white' : 'rgba(255,255,255,0.6)' }}>
                                            {e.nombre} {e.apellido}
                                        </div>
                                        <div style={estilos.sidebarGrado}>Grado {e.grado} · {e.seccion}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={estilos.panel}>
                            {!estudianteSeleccionado ? (
                                <div style={estilos.sinSeleccion}>
                                    <p style={estilos.sinSeleccionTexto}>Selecciona un estudiante</p>
                                </div>
                            ) : (
                                <>
                                    <div style={estilos.panelHeader}>
                                        <div>
                                            <div style={estilos.panelTitulo}>{estudianteSeleccionado.nombre} {estudianteSeleccionado.apellido}</div>
                                            <div style={estilos.panelSubtitulo}>Grado {estudianteSeleccionado.grado} · Sección {estudianteSeleccionado.seccion}</div>
                                        </div>
                                        <button onClick={() => setMostrarFormulario(!mostrarFormulario)} style={estilos.botonAgregar}>
                                            + Nueva tarea
                                        </button>
                                    </div>

                                    {resumen && (
                                        <div style={estilos.resumenBox}>
                                            <div style={estilos.resumenStats}>
                                                {[
                                                    { num: resumen.total, label: 'Total', color: 'rgba(255,255,255,0.7)' },
                                                    { num: resumen.entregadas, label: 'Entregadas', color: '#34d399' },
                                                    { num: resumen.pendientes, label: 'Pendientes', color: '#f87171' },
                                                ].map((s, i) => (
                                                    <div key={i} style={estilos.resumenItem}>
                                                        <div style={{ ...estilos.resumenNum, color: s.color }}>{s.num}</div>
                                                        <div style={estilos.resumenLabel}>{s.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={estilos.progresoArea}>
                                                <div style={estilos.progresoLabels}>
                                                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Tasa de entrega</span>
                                                    <span style={{ color: porcentaje >= 70 ? '#34d399' : '#f87171', fontWeight: '700', fontSize: '12px' }}>{porcentaje}%</span>
                                                </div>
                                                <div style={estilos.progresoBar}>
                                                    <div style={{ ...estilos.progresoFill, width: `${porcentaje}%`, backgroundColor: porcentaje >= 70 ? '#34d399' : porcentaje >= 50 ? '#fbbf24' : '#f87171' }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {mostrarFormulario && (
                                        <div style={estilos.formulario}>
                                            <form onSubmit={handleSubmit}>
                                                <div style={estilos.grid}>
                                                    <div style={estilos.campo}>
                                                        <label style={estilos.label}>Materia</label>
                                                        <select value={form.materia} onChange={(e) => setForm({ ...form, materia: e.target.value })} style={estilos.input} required>
                                                            <option value="">Seleccionar...</option>
                                                            {materias.map(m => <option key={m} value={m}>{m}</option>)}
                                                        </select>
                                                    </div>
                                                    <div style={estilos.campo}>
                                                        <label style={estilos.label}>Descripción</label>
                                                        <input type="text" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} style={estilos.input} placeholder="Ej: Ejercicios del capítulo 3" required />
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                                                    <button type="submit" style={estilos.botonGuardar}>Guardar</button>
                                                    <button type="button" onClick={() => setMostrarFormulario(false)} style={estilos.botonCancelar}>Cancelar</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <div style={estilos.listaTareas}>
                                        {tareas.length === 0 ? (
                                            <p style={estilos.vacio}>Sin tareas registradas</p>
                                        ) : tareas.map(t => (
                                            <div key={t.id} style={{ ...estilos.tareaFila, borderLeft: `3px solid ${t.entregada ? '#34d399' : '#f87171'}` }}>
                                                <div style={estilos.tareaInfo}>
                                                    <div style={estilos.tareaMateria}>{t.materia}</div>
                                                    <div style={estilos.tareaDesc}>{t.descripcion}</div>
                                                    <div style={estilos.tareaFecha}>{new Date(t.fecha_asignacion).toLocaleDateString()}</div>
                                                </div>
                                                <div>
                                                    {t.entregada ? (
                                                        <span style={estilos.badgeEntregada}>Entregada</span>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                            <button onClick={() => marcarEstado(t.id, true)} style={estilos.botonEntregar}>Entregó</button>
                                                            <button onClick={() => marcarEstado(t.id, false)} style={estilos.botonNoEntregar}>No entregó</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
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
    exito: { backgroundColor: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#6ee7b7', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
    layout: { display: 'grid', gridTemplateColumns: '240px 1fr', gap: '16px' },
    sidebar: { backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' },
    sidebarHeader: { padding: '14px 18px', color: 'rgba(255,255,255,0.25)', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    sidebarItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'all 0.2s' },
    sidebarAvatar: { width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', flexShrink: 0 },
    sidebarNombre: { fontSize: '13px', fontWeight: '600' },
    sidebarGrado: { color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '1px' },
    panel: { backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' },
    sinSeleccion: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' },
    sinSeleccionTexto: { color: 'rgba(255,255,255,0.2)', fontSize: '14px' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    panelTitulo: { color: 'white', fontWeight: '700', fontSize: '16px' },
    panelSubtitulo: { color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '2px' },
    botonAgregar: { backgroundColor: '#FFD700', color: '#001a5c', border: 'none', padding: '8px 18px', borderRadius: '7px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' },
    resumenBox: { padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    resumenStats: { display: 'flex', gap: '24px', marginBottom: '12px' },
    resumenItem: { textAlign: 'center' },
    resumenNum: { fontSize: '24px', fontWeight: '800' },
    resumenLabel: { color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '2px' },
    progresoArea: {},
    progresoLabels: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
    progresoBar: { height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' },
    progresoFill: { height: '100%', borderRadius: '3px', transition: 'width 0.5s' },
    formulario: { padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
    campo: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' },
    input: { padding: '9px 12px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', fontSize: '13px', color: 'white', outline: 'none' },
    botonGuardar: { backgroundColor: '#FFD700', color: '#001a5c', border: 'none', padding: '9px 22px', borderRadius: '7px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },
    botonCancelar: { backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', padding: '9px 18px', borderRadius: '7px', cursor: 'pointer', fontSize: '13px' },
    listaTareas: { display: 'flex', flexDirection: 'column' },
    tareaFila: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    tareaInfo: { flex: 1 },
    tareaMateria: { color: '#93c5fd', fontWeight: '700', fontSize: '13px' },
    tareaDesc: { color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginTop: '2px' },
    tareaFecha: { color: 'rgba(255,255,255,0.25)', fontSize: '11px', marginTop: '4px' },
    badgeEntregada: { backgroundColor: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#6ee7b7', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
    botonEntregar: { backgroundColor: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#6ee7b7', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
    botonNoEntregar: { backgroundColor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
    vacio: { textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '40px', fontSize: '14px' },
    footer: { display: 'flex', justifyContent: 'center', padding: '14px 40px', color: 'rgba(255,255,255,0.15)', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.05)' },
};

export default Tareas;