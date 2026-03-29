import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

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

    const materias = [
        'Matemáticas', 'Lenguaje', 'Ciencias Naturales', 'Ciencias Sociales',
        'Inglés', 'Educación Física', 'Arte', 'Música', 'Computación', 'Religión'
    ];

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [respDocentes, respEstudiantes] = await Promise.all([
                api.get('/usuarios'),
                api.get('/estudiantes')
            ]);
            setDocentes(respDocentes.data.filter(u => u.rol === 'docente'));
            setEstudiantes(respEstudiantes.data);
        } catch (err) {
            setError('Error al cargar datos');
        }
    };

    const seleccionarDocente = async (docente) => {
        setDocenteSeleccionado(docente);
        setMostrarFormulario(false);
        try {
            const respuesta = await api.get(`/asignaciones/docente/${docente.id}`);
            setEstudiantesAsignados(respuesta.data);
        } catch (err) {
            setError('Error al cargar asignaciones');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/asignaciones', {
                docente_id: docenteSeleccionado.id,
                estudiante_id: parseInt(form.estudiante_id),
                materia: form.materia
            });
            setExito('Estudiante asignado exitosamente');
            setMostrarFormulario(false);
            setForm({ estudiante_id: '', materia: '' });
            setTimeout(() => setExito(''), 3000);
            seleccionarDocente(docenteSeleccionado);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al asignar estudiante');
            setTimeout(() => setError(''), 3000);
        }
    };

    const eliminarAsignacion = async (estudiante_id, materia) => {
        try {
            await api.delete('/asignaciones', {
                data: {
                    docente_id: docenteSeleccionado.id,
                    estudiante_id,
                    materia
                }
            });
            setExito('Asignación eliminada');
            setTimeout(() => setExito(''), 3000);
            seleccionarDocente(docenteSeleccionado);
        } catch (err) {
            setError('Error al eliminar asignación');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.header}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>
                    ← Volver
                </button>
                <h2 style={estilos.titulo}>Asignaciones de Docentes</h2>
            </div>

            {error && <div style={estilos.error}>{error}</div>}
            {exito && <div style={estilos.exito}>{exito}</div>}

            <div style={estilos.layout}>
                <div style={estilos.listaDocentes}>
                    <h3 style={estilos.subtitulo}>Docentes</h3>
                    {docentes.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontSize: '13px' }}>Sin docentes registrados</p>
                    ) : (
                        docentes.map(d => (
                            <div
                                key={d.id}
                                onClick={() => seleccionarDocente(d)}
                                style={{
                                    ...estilos.tarjetaDocente,
                                    backgroundColor: docenteSeleccionado?.id === d.id ? '#1e40af' : 'white',
                                    color: docenteSeleccionado?.id === d.id ? 'white' : '#1e293b',
                                }}
                            >
                                <div style={estilos.avatar}>{d.nombre[0]}{d.apellido[0]}</div>
                                <div>
                                    <div style={{ fontWeight: '600' }}>{d.nombre} {d.apellido}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.7 }}>{d.email}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={estilos.panelAsignaciones}>
                    {!docenteSeleccionado ? (
                        <div style={estilos.sinSeleccion}>
                            <p>Selecciona un docente para ver sus asignaciones</p>
                        </div>
                    ) : (
                        <>
                            <div style={estilos.panelHeader}>
                                <h3 style={{ margin: 0, color: '#1e293b' }}>
                                    {docenteSeleccionado.nombre} {docenteSeleccionado.apellido}
                                </h3>
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
                                                <select
                                                    value={form.estudiante_id}
                                                    onChange={(e) => setForm({ ...form, estudiante_id: e.target.value })}
                                                    style={estilos.input}
                                                    required
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    {estudiantes.map(e => (
                                                        <option key={e.id} value={e.id}>
                                                            {e.nombre} {e.apellido} - Grado {e.grado}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
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
                                        </div>
                                        <button type="submit" style={estilos.botonGuardar}>Guardar asignación</button>
                                    </form>
                                </div>
                            )}

                            <div style={estilos.listaAsignados}>
                                {estudiantesAsignados.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>Sin estudiantes asignados</p>
                                ) : (
                                    estudiantesAsignados.map((e, i) => (
                                        <div key={i} style={estilos.tarjetaAsignado}>
                                            <div style={estilos.asignadoInfo}>
                                                <div style={estilos.asignadoNombre}>{e.nombre} {e.apellido}</div>
                                                <div style={estilos.asignadoDetalle}>Grado {e.grado} · {e.seccion} · <span style={{ color: '#1e40af', fontWeight: '600' }}>{e.materia}</span></div>
                                            </div>
                                            <button
                                                onClick={() => eliminarAsignacion(e.id, e.materia)}
                                                style={estilos.botonEliminar}
                                            >
                                                ✕
                                            </button>
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
    listaDocentes: { backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'fit-content' },
    subtitulo: { color: '#64748b', fontSize: '13px', fontWeight: '600', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' },
    tarjetaDocente: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px' },
    avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0 },
    panelAsignaciones: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    sinSeleccion: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#94a3b8' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    botonAgregar: { backgroundColor: '#1e40af', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    formulario: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
    campo: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '13px', color: '#374151', marginBottom: '6px', fontWeight: '500' },
    input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' },
    botonGuardar: { marginTop: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    listaAsignados: { display: 'flex', flexDirection: 'column', gap: '10px' },
    tarjetaAsignado: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px' },
    asignadoInfo: { flex: 1 },
    asignadoNombre: { fontWeight: '600', color: '#1e293b', fontSize: '14px' },
    asignadoDetalle: { color: '#64748b', fontSize: '13px', marginTop: '2px' },
    botonEliminar: { backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },
};

export default Asignaciones;