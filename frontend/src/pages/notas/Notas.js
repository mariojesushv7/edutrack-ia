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
            const [respNotas, respPromedio] = await Promise.all([
                api.get(`/notas/estudiante/${estudiante.id}`),
                api.get(`/notas/promedio/${estudiante.id}`)
            ]);
            setNotas(respNotas.data);
            setPromedio(respPromedio.data);
        } catch (err) {
            setError('Error al cargar notas');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/notas', {
                ...form,
                estudiante_id: estudianteSeleccionado.id,
                valor: parseFloat(form.valor)
            });
            setExito('Nota registrada exitosamente');
            setMostrarFormulario(false);
            setForm({ materia: '', parcial: 'primero', valor: '', observacion: '' });
            setTimeout(() => setExito(''), 3000);
            seleccionarEstudiante(estudianteSeleccionado);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al registrar nota');
            setTimeout(() => setError(''), 3000);
        }
    };

    const colorNota = (valor) => {
        if (valor >= 70) return '#16a34a';
        if (valor >= 51) return '#d97706';
        return '#dc2626';
    };

    const notasPorParcial = (parcial) => notas.filter(n => n.parcial === parcial);

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.navbar}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>← Volver</button>
                <div style={estilos.navTitulo}>
                    <span style={estilos.navIcono}>📝</span>
                    <h2 style={estilos.titulo}>Notas</h2>
                </div>
            </div>

            <div style={estilos.contenido}>
                {error && <div style={estilos.error}>⚠️ {error}</div>}
                {exito && <div style={estilos.exito}>✓ {exito}</div>}

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

                    <div style={estilos.panelNotas}>
                        {!estudianteSeleccionado ? (
                            <div style={estilos.sinSeleccion}>
                                <div style={estilos.sinSeleccionIcono}>📝</div>
                                <p style={{ color: '#94a3b8', fontSize: '15px' }}>Selecciona un estudiante para ver sus notas</p>
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
                                        + Agregar nota
                                    </button>
                                </div>

                                {promedio && (
                                    <div style={estilos.promedioBox}>
                                        <div style={estilos.promedioItem}>
                                            <span style={estilos.promedioLabel}>Promedio general</span>
                                            <span style={{ ...estilos.promedioValor, color: colorNota(promedio.promedio_general) }}>
                                                {promedio.promedio_general || '—'}
                                            </span>
                                        </div>
                                        {promedio.por_materia?.map((m, i) => (
                                            <div key={i} style={estilos.promedioItem}>
                                                <span style={estilos.promedioLabel}>{m.materia}</span>
                                                <span style={{ ...estilos.promedioValor, fontSize: '18px', color: colorNota(m.promedio) }}>
                                                    {m.promedio}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {mostrarFormulario && (
                                    <div style={estilos.formulario}>
                                        <h4 style={{ margin: '0 0 12px', color: '#1e40af' }}>Nueva nota</h4>
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
                                                        <option value="">Seleccionar...</option>
                                                        {materias.map(m => (
                                                            <option key={m} value={m}>{m}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div style={estilos.campo}>
                                                    <label style={estilos.label}>Parcial</label>
                                                    <select
                                                        value={form.parcial}
                                                        onChange={(e) => setForm({ ...form, parcial: e.target.value })}
                                                        style={estilos.input}
                                                    >
                                                        <option value="primero">Primer parcial</option>
                                                        <option value="segundo">Segundo parcial</option>
                                                        <option value="tercero">Tercer parcial</option>
                                                    </select>
                                                </div>
                                                <div style={estilos.campo}>
                                                    <label style={estilos.label}>Nota (0-100)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={form.valor}
                                                        onChange={(e) => setForm({ ...form, valor: e.target.value })}
                                                        style={estilos.input}
                                                        required
                                                    />
                                                </div>
                                                <div style={estilos.campo}>
                                                    <label style={estilos.label}>Observación</label>
                                                    <input
                                                        type="text"
                                                        value={form.observacion}
                                                        onChange={(e) => setForm({ ...form, observacion: e.target.value })}
                                                        style={estilos.input}
                                                        placeholder="Opcional"
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                                <button type="submit" style={estilos.botonGuardar}>Guardar nota</button>
                                                <button type="button" onClick={() => setMostrarFormulario(false)} style={estilos.botonCancelar}>Cancelar</button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {['primero', 'segundo', 'tercero'].map(parcial => {
                                    const notasParcial = notasPorParcial(parcial);
                                    if (notasParcial.length === 0) return null;
                                    return (
                                        <div key={parcial} style={estilos.parcialSeccion}>
                                            <h4 style={estilos.parcialTitulo}>
                                                {parcial === 'primero' ? '1er' : parcial === 'segundo' ? '2do' : '3er'} Parcial
                                            </h4>
                                            <div style={estilos.notasGrid}>
                                                {notasParcial.map(n => (
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

                                {notas.length === 0 && (
                                    <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Sin notas registradas</p>
                                )}
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
    panelNotas: { backgroundColor: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    sinSeleccion: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px' },
    sinSeleccionIcono: { fontSize: '48px', opacity: 0.3 },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
    botonAgregar: { backgroundColor: '#1e40af', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    promedioBox: { display: 'flex', flexWrap: 'wrap', gap: '12px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '20px' },
    promedioItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' },
    promedioLabel: { color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' },
    promedioValor: { fontSize: '24px', fontWeight: '800', marginTop: '2px' },
    formulario: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
    campo: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '13px', color: '#374151', marginBottom: '6px', fontWeight: '600' },
    input: { padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none' },
    botonGuardar: { backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    botonCancelar: { backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    parcialSeccion: { marginBottom: '20px' },
    parcialTitulo: { color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px', paddingBottom: '8px', borderBottom: '2px solid #f1f5f9' },
    notasGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' },
    notaCard: { backgroundColor: '#f8fafc', borderRadius: '10px', padding: '14px', textAlign: 'center', border: '1px solid #e2e8f0' },
    notaMateria: { fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
    notaValor: { fontSize: '28px', fontWeight: '800' },
    notaObs: { fontSize: '11px', color: '#94a3b8', marginTop: '4px' },
};

export default Notas;