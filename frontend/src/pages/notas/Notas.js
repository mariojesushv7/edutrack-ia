import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Notas = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
    const [notas, setNotas] = useState([]);
    const [promedio, setPromedio] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [form, setForm] = useState({
        materia: '', parcial: 'primero', valor: '', observacion: ''
    });

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

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.header}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>
                    ← Volver
                </button>
                <h2 style={estilos.titulo}>Notas</h2>
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

                <div style={estilos.panelNotas}>
                    {!estudianteSeleccionado ? (
                        <div style={estilos.sinSeleccion}>
                            <p>Selecciona un estudiante para ver sus notas</p>
                        </div>
                    ) : (
                        <>
                            <div style={estilos.panelHeader}>
                                <h3 style={{ margin: 0, color: '#1e293b' }}>
                                    {estudianteSeleccionado.nombre} {estudianteSeleccionado.apellido}
                                </h3>
                                <button onClick={() => setMostrarFormulario(!mostrarFormulario)} style={estilos.botonAgregar}>
                                    + Agregar nota
                                </button>
                            </div>

                            {promedio && (
                                <div style={estilos.promedioBox}>
                                    <span style={estilos.promedioLabel}>Promedio general:</span>
                                    <span style={{ ...estilos.promedioValor, color: colorNota(promedio.promedio_general) }}>
                                        {promedio.promedio_general || 'Sin notas'}
                                    </span>
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
                                        <button type="submit" style={estilos.botonGuardar}>Guardar nota</button>
                                    </form>
                                </div>
                            )}

                            <table style={estilos.tabla}>
                                <thead>
                                    <tr style={estilos.thead}>
                                        <th style={estilos.th}>Materia</th>
                                        <th style={estilos.th}>Parcial</th>
                                        <th style={estilos.th}>Nota</th>
                                        <th style={estilos.th}>Observación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notas.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                                                Sin notas registradas
                                            </td>
                                        </tr>
                                    ) : (
                                        notas.map(n => (
                                            <tr key={n.id} style={estilos.tr}>
                                                <td style={estilos.td}>{n.materia}</td>
                                                <td style={estilos.td}>{n.parcial}</td>
                                                <td style={{ ...estilos.td, fontWeight: '700', color: colorNota(n.valor) }}>{n.valor}</td>
                                                <td style={estilos.td}>{n.observacion || '-'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
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
    tarjetaEstudiante: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px', transition: 'all 0.2s' },
    avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0 },
    panelNotas: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    sinSeleccion: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#94a3b8' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    botonAgregar: { backgroundColor: '#1e40af', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    promedioBox: { backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
    promedioLabel: { color: '#64748b', fontSize: '14px' },
    promedioValor: { fontSize: '22px', fontWeight: '700' },
    formulario: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
    campo: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '13px', color: '#374151', marginBottom: '6px', fontWeight: '500' },
    input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' },
    botonGuardar: { marginTop: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    tabla: { width: '100%', borderCollapse: 'collapse' },
    thead: { backgroundColor: '#f8fafc' },
    th: { padding: '12px 16px', color: '#64748b', textAlign: 'left', fontSize: '13px', fontWeight: '600', borderBottom: '1px solid #e2e8f0' },
    tr: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '12px 16px', color: '#374151', fontSize: '14px' },
};

export default Notas;