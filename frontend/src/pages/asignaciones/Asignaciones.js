import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const materias = [
    'Matemáticas', 'Lenguaje', 'Ciencias Naturales', 'Ciencias Sociales',
    'Inglés', 'Educación Física', 'Arte', 'Música', 'Computación', 'Religión'
];

const Asignaciones = () => {
    const [docentes, setDocentes] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
    const [estudiantesAsignados, setEstudiantesAsignados] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [form, setForm] = useState({ estudiante_id: '', materia: '' });
    const navigate = useNavigate();

    useEffect(() => { cargarDatos(); }, []);

    const cargarDatos = async () => {
        try {
            const [rU, rE] = await Promise.all([api.get('/usuarios'), api.get('/estudiantes')]);
            setDocentes(rU.data.filter(u => u.rol === 'docente'));
            setEstudiantes(rE.data);
        } catch { setError('Error al cargar datos'); }
    };

    const seleccionarDocente = async (d) => {
        setDocenteSeleccionado(d);
        setMostrarFormulario(false);
        try {
            const r = await api.get(`/asignaciones/docente/${d.id}`);
            setEstudiantesAsignados(r.data);
        } catch { setError('Error al cargar asignaciones'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/asignaciones', { docente_id: docenteSeleccionado.id, estudiante_id: parseInt(form.estudiante_id), materia: form.materia });
            setExito('Asignación guardada');
            setMostrarFormulario(false);
            setForm({ estudiante_id: '', materia: '' });
            setTimeout(() => setExito(''), 3000);
            seleccionarDocente(docenteSeleccionado);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error');
            setTimeout(() => setError(''), 3000);
        }
    };

    const eliminar = async (estudiante_id, materia) => {
        try {
            await api.delete('/asignaciones', { data: { docente_id: docenteSeleccionado.id, estudiante_id, materia } });
            setExito('Asignación eliminada');
            setTimeout(() => setExito(''), 3000);
            seleccionarDocente(docenteSeleccionado);
        } catch { setError('Error al eliminar'); setTimeout(() => setError(''), 3000); }
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
                            <div style={estilos.navTituloTexto}>Asignaciones</div>
                            <div style={estilos.navSubtitulo}>Gestión docente — estudiante</div>
                        </div>
                    </div>
                </div>

                <div style={estilos.contenido}>
                    {error && <div style={estilos.error}>⚠ {error}</div>}
                    {exito && <div style={estilos.exito}>✓ {exito}</div>}

                    <div style={estilos.layout}>
                        <div style={estilos.sidebar}>
                            <div style={estilos.sidebarHeader}>Docentes</div>
                            {docentes.length === 0 ? (
                                <p style={estilos.vacio}>Sin docentes registrados</p>
                            ) : docentes.map(d => (
                                <div key={d.id} onClick={() => seleccionarDocente(d)} style={{
                                    ...estilos.sidebarItem,
                                    backgroundColor: docenteSeleccionado?.id === d.id ? 'rgba(255,215,0,0.08)' : 'transparent',
                                    borderLeft: docenteSeleccionado?.id === d.id ? '3px solid #FFD700' : '3px solid transparent',
                                }}>
                                    <div style={{ ...estilos.sidebarAvatar, color: docenteSeleccionado?.id === d.id ? '#FFD700' : 'rgba(255,255,255,0.4)' }}>
                                        {d.nombre[0]}{d.apellido[0]}
                                    </div>
                                    <div>
                                        <div style={{ ...estilos.sidebarNombre, color: docenteSeleccionado?.id === d.id ? 'white' : 'rgba(255,255,255,0.6)' }}>
                                            {d.nombre} {d.apellido}
                                        </div>
                                        <div style={estilos.sidebarEmail}>{d.email}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={estilos.panel}>
                            {!docenteSeleccionado ? (
                                <div style={estilos.sinSeleccion}>
                                    <p style={estilos.sinSeleccionTexto}>Selecciona un docente</p>
                                </div>
                            ) : (
                                <>
                                    <div style={estilos.panelHeader}>
                                        <div>
                                            <div style={estilos.panelTitulo}>{docenteSeleccionado.nombre} {docenteSeleccionado.apellido}</div>
                                            <div style={estilos.panelSubtitulo}>{docenteSeleccionado.email} · {estudiantesAsignados.length} asignaciones</div>
                                        </div>
                                        <button onClick={() => setMostrarFormulario(!mostrarFormulario)} style={estilos.botonAgregar}>
                                            + Asignar estudiante
                                        </button>
                                    </div>

                                    {mostrarFormulario && (
                                        <div style={estilos.formulario}>
                                            <form onSubmit={handleSubmit}>
                                                <div style={estilos.grid}>
                                                    <div style={estilos.campo}>
                                                        <label style={estilos.label}>Estudiante</label>
                                                        <select value={form.estudiante_id} onChange={(e) => setForm({ ...form, estudiante_id: e.target.value })} style={estilos.input} required>
                                                            <option value="">Seleccionar...</option>
                                                            {estudiantes.map(e => <option key={e.id} value={e.id}>{e.nombre} {e.apellido} — Grado {e.grado}</option>)}
                                                        </select>
                                                    </div>
                                                    <div style={estilos.campo}>
                                                        <label style={estilos.label}>Materia</label>
                                                        <select value={form.materia} onChange={(e) => setForm({ ...form, materia: e.target.value })} style={estilos.input} required>
                                                            <option value="">Seleccionar...</option>
                                                            {materias.map(m => <option key={m} value={m}>{m}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                                                    <button type="submit" style={estilos.botonGuardar}>Guardar asignación</button>
                                                    <button type="button" onClick={() => setMostrarFormulario(false)} style={estilos.botonCancelar}>Cancelar</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <div style={estilos.tablaHeader}>
                                        <span style={{ flex: 2 }}>Estudiante</span>
                                        <span style={{ flex: 1 }}>Grado</span>
                                        <span style={{ flex: 1 }}>Materia</span>
                                        <span style={{ flex: 1 }}>Acción</span>
                                    </div>

                                    {estudiantesAsignados.length === 0 ? (
                                        <p style={estilos.vacio}>Sin estudiantes asignados</p>
                                    ) : estudiantesAsignados.map((e, i) => (
                                        <div key={i} style={estilos.fila}>
                                            <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={estilos.avatar}>{e.nombre[0]}{e.apellido[0]}</div>
                                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600' }}>{e.nombre} {e.apellido}</span>
                                            </div>
                                            <span style={{ flex: 1 }}>
                                                <span style={estilos.gradoBadge}>{e.grado} — {e.seccion}</span>
                                            </span>
                                            <span style={{ flex: 1 }}>
                                                <span style={estilos.materiaBadge}>{e.materia}</span>
                                            </span>
                                            <span style={{ flex: 1 }}>
                                                <button onClick={() => eliminar(e.id, e.materia)} style={estilos.botonEliminar}>Eliminar</button>
                                            </span>
                                        </div>
                                    ))}
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
    layout: { display: 'grid', gridTemplateColumns: '260px 1fr', gap: '16px' },
    sidebar: { backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' },
    sidebarHeader: { padding: '14px 18px', color: 'rgba(255,255,255,0.25)', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    sidebarItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'all 0.2s' },
    sidebarAvatar: { width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', flexShrink: 0 },
    sidebarNombre: { fontSize: '13px', fontWeight: '600' },
    sidebarEmail: { color: 'rgba(255,255,255,0.25)', fontSize: '11px', marginTop: '1px' },
    panel: { backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' },
    sinSeleccion: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' },
    sinSeleccionTexto: { color: 'rgba(255,255,255,0.2)', fontSize: '14px' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    panelTitulo: { color: 'white', fontWeight: '700', fontSize: '16px' },
    panelSubtitulo: { color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '2px' },
    botonAgregar: { backgroundColor: '#FFD700', color: '#001a5c', border: 'none', padding: '8px 18px', borderRadius: '7px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' },
    formulario: { padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
    campo: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' },
    input: { padding: '9px 12px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', fontSize: '13px', color: 'white', outline: 'none' },
    botonGuardar: { backgroundColor: '#FFD700', color: '#001a5c', border: 'none', padding: '9px 22px', borderRadius: '7px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },
    botonCancelar: { backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', padding: '9px 18px', borderRadius: '7px', cursor: 'pointer', fontSize: '13px' },
    tablaHeader: { display: 'flex', padding: '10px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' },
    fila: { display: 'flex', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    avatar: { width: '30px', height: '30px', borderRadius: '6px', backgroundColor: 'rgba(255,215,0,0.1)', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', flexShrink: 0 },
    gradoBadge: { backgroundColor: 'rgba(96,165,250,0.1)', color: '#93c5fd', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
    materiaBadge: { backgroundColor: 'rgba(167,139,250,0.1)', color: '#c4b5fd', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
    botonEliminar: { backgroundColor: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' },
    vacio: { textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '40px', fontSize: '14px' },
    footer: { display: 'flex', justifyContent: 'center', padding: '14px 40px', color: 'rgba(255,255,255,0.15)', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.05)' },
};

export default Asignaciones;