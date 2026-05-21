import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const materias = [
    'Matemáticas', 'Lenguaje', 'Ciencias Naturales', 'Ciencias Sociales',
    'Inglés', 'Educación Física', 'Arte', 'Música', 'Computación', 'Religión'
];

const Notas = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
    const [notas, setNotas] = useState([]);
    const [promedio, setPromedio] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [form, setForm] = useState({ materia: '', parcial: 'primero', valor: '', observacion: '' });
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
            const [rN, rP] = await Promise.all([
                api.get(`/notas/estudiante/${e.id}`),
                api.get(`/notas/promedio/${e.id}`)
            ]);
            setNotas(rN.data);
            setPromedio(rP.data);
        } catch { setError('Error al cargar notas'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/notas', { ...form, estudiante_id: estudianteSeleccionado.id, valor: parseFloat(form.valor) });
            setExito('Nota registrada');
            setMostrarFormulario(false);
            setForm({ materia: '', parcial: 'primero', valor: '', observacion: '' });
            setTimeout(() => setExito(''), 3000);
            seleccionarEstudiante(estudianteSeleccionado);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error');
            setTimeout(() => setError(''), 3000);
        }
    };

    const colorNota = (v) => v >= 70 ? '#34d399' : v >= 51 ? '#fbbf24' : '#f87171';

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.fondo} />
            <div style={estilos.circulo1} />
            <div style={estilos.inner}>
                <div style={estilos.navbar}>
                    <div style={estilos.navIzq}>
                        <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>← Volver</button>
                        <div>
                            <div style={estilos.navTituloTexto}>Notas</div>
                            <div style={estilos.navSubtitulo}>Registro de calificaciones</div>
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
                                    backgroundColor: estudianteSeleccionado?.id === e.id ? 'rgba(255,215,0,0.1)' : 'transparent',
                                    borderLeft: estudianteSeleccionado?.id === e.id ? '3px solid #FFD700' : '3px solid transparent',
                                }}>
                                    <div style={{ ...estilos.sidebarAvatar, color: estudianteSeleccionado?.id === e.id ? '#FFD700' : 'rgba(255,255,255,0.4)' }}>
                                        {e.nombre[0]}{e.apellido[0]}
                                    </div>
                                    <div>
                                        <div style={{ ...estilos.sidebarNombre, color: estudianteSeleccionado?.id === e.id ? 'white' : 'rgba(255,255,255,0.7)' }}>
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
                                    <div style={estilos.sinSeleccionIcono}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                            <polyline points="14 2 14 8 20 8"/>
                                            <line x1="16" y1="13" x2="8" y2="13"/>
                                            <line x1="16" y1="17" x2="8" y2="17"/>
                                        </svg>
                                    </div>
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
                                            + Agregar nota
                                        </button>
                                    </div>

                                    {promedio && (
                                        <div style={estilos.promedioBox}>
                                            <div style={estilos.promedioItem}>
                                                <div style={estilos.promedioLabel}>Promedio general</div>
                                                <div style={{ ...estilos.promedioValor, color: colorNota(promedio.promedio_general) }}>
                                                    {promedio.promedio_general || '—'}
                                                </div>
                                            </div>
                                            {promedio.por_materia?.map((m, i) => (
                                                <div key={i} style={estilos.promedioItem}>
                                                    <div style={estilos.promedioLabel}>{m.materia}</div>
                                                    <div style={{ ...estilos.promedioValorSm, color: colorNota(m.promedio) }}>{m.promedio}</div>
                                                </div>
                                            ))}
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
                                                        <label style={estilos.label}>Parcial</label>
                                                        <select value={form.parcial} onChange={(e) => setForm({ ...form, parcial: e.target.value })} style={estilos.input}>
                                                            <option value="primero">Primer parcial</option>
                                                            <option value="segundo">Segundo parcial</option>
                                                            <option value="tercero">Tercer parcial</option>
                                                        </select>
                                                    </div>
                                                    <div style={estilos.campo}>
                                                        <label style={estilos.label}>Nota (0-100)</label>
                                                        <input type="number" min="0" max="100" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} style={estilos.input} required />
                                                    </div>
                                                    <div style={estilos.campo}>
                                                        <label style={estilos.label}>Observación</label>
                                                        <input type="text" value={form.observacion} onChange={(e) => setForm({ ...form, observacion: e.target.value })} style={estilos.input} placeholder="Opcional" />
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                                                    <button type="submit" style={estilos.botonGuardar}>Guardar</button>
                                                    <button type="button" onClick={() => setMostrarFormulario(false)} style={estilos.botonCancelar}>Cancelar</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {['primero', 'segundo', 'tercero'].map(parcial => {
                                        const np = notas.filter(n => n.parcial === parcial);
                                        if (!np.length) return null;
                                        return (
                                            <div key={parcial} style={estilos.parcialSeccion}>
                                                <div style={estilos.parcialTitulo}>
                                                    {parcial === 'primero' ? 'Primer' : parcial === 'segundo' ? 'Segundo' : 'Tercer'} Parcial
                                                </div>
                                                <div style={estilos.notasGrid}>
                                                    {np.map(n => (
                                                        <div key={n.id} style={estilos.notaCard}>
                                                            <div style={estilos.notaMateria}>{n.materia}</div>
                                                            <div style={{ ...estilos.notaValor, color: colorNota(n.valor) }}>{n.valor}</div>
                                                            {n.observacion && <div style={estilos.notaObs}>{n.observacion}</div>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {notas.length === 0 && <p style={estilos.vacio}>Sin notas registradas</p>}
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
    sinSeleccion: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px' },
    sinSeleccionIcono: {},
    sinSeleccionTexto: { color: 'rgba(255,255,255,0.2)', fontSize: '14px', margin: 0 },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    panelTitulo: { color: 'white', fontWeight: '700', fontSize: '16px' },
    panelSubtitulo: { color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '2px' },
    botonAgregar: { backgroundColor: '#FFD700', color: '#001a5c', border: 'none', padding: '8px 18px', borderRadius: '7px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' },
    promedioBox: { display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    promedioItem: { textAlign: 'center', minWidth: '70px' },
    promedioLabel: { color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
    promedioValor: { fontSize: '28px', fontWeight: '800', marginTop: '4px' },
    promedioValorSm: { fontSize: '20px', fontWeight: '700', marginTop: '4px' },
    formulario: { padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
    campo: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' },
    input: { padding: '9px 12px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', fontSize: '13px', color: 'white', outline: 'none' },
    botonGuardar: { backgroundColor: '#FFD700', color: '#001a5c', border: 'none', padding: '9px 22px', borderRadius: '7px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },
    botonCancelar: { backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', padding: '9px 18px', borderRadius: '7px', cursor: 'pointer', fontSize: '13px' },
    parcialSeccion: { padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    parcialTitulo: { color: 'rgba(255,255,255,0.25)', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' },
    notasGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' },
    notaCard: { backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '12px', textAlign: 'center' },
    notaMateria: { color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '600', marginBottom: '6px' },
    notaValor: { fontSize: '26px', fontWeight: '800' },
    notaObs: { color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: '4px' },
    vacio: { textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '40px', fontSize: '14px' },
    footer: { display: 'flex', justifyContent: 'center', padding: '14px 40px', color: 'rgba(255,255,255,0.15)', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.05)' },
};

export default Notas;