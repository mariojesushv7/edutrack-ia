import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const niveles = [
    { valor: 'excelente', color: '#16a34a', bg: '#dcfce7', emoji: '⭐' },
    { valor: 'bueno', color: '#2563eb', bg: '#dbeafe', emoji: '👍' },
    { valor: 'regular', color: '#d97706', bg: '#fef3c7', emoji: '⚠️' },
    { valor: 'malo', color: '#dc2626', bg: '#fee2e2', emoji: '❌' },
];

const Conducta = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [form, setForm] = useState({ nivel: 'bueno', descripcion: '' });

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
            const respuesta = await api.get(`/conducta/estudiante/${estudiante.id}`);
            setHistorial(respuesta.data);
        } catch (err) {
            setError('Error al cargar historial');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/conducta', {
                ...form,
                estudiante_id: estudianteSeleccionado.id
            });
            setExito(form.nivel === 'malo' || form.nivel === 'regular'
                ? 'Conducta registrada y padre notificado'
                : 'Conducta registrada exitosamente'
            );
            setMostrarFormulario(false);
            setForm({ nivel: 'bueno', descripcion: '' });
            setTimeout(() => setExito(''), 3000);
            seleccionarEstudiante(estudianteSeleccionado);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al registrar conducta');
            setTimeout(() => setError(''), 3000);
        }
    };

    const getNivel = (valor) => niveles.find(n => n.valor === valor);

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.header}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>
                    ← Volver
                </button>
                <h2 style={estilos.titulo}>Conducta</h2>
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

                <div style={estilos.panelConducta}>
                    {!estudianteSeleccionado ? (
                        <div style={estilos.sinSeleccion}>
                            <p>Selecciona un estudiante para ver su conducta</p>
                        </div>
                    ) : (
                        <>
                            <div style={estilos.panelHeader}>
                                <h3 style={{ margin: 0, color: '#1e293b' }}>
                                    {estudianteSeleccionado.nombre} {estudianteSeleccionado.apellido}
                                </h3>
                                <button onClick={() => setMostrarFormulario(!mostrarFormulario)} style={estilos.botonAgregar}>
                                    + Registrar conducta
                                </button>
                            </div>

                            {mostrarFormulario && (
                                <div style={estilos.formulario}>
                                    <form onSubmit={handleSubmit}>
                                        <div style={estilos.nivelesGrid}>
                                            {niveles.map(n => (
                                                <div
                                                    key={n.valor}
                                                    onClick={() => setForm({ ...form, nivel: n.valor })}
                                                    style={{
                                                        ...estilos.nivelOpcion,
                                                        backgroundColor: form.nivel === n.valor ? n.bg : '#f8fafc',
                                                        border: `2px solid ${form.nivel === n.valor ? n.color : '#e2e8f0'}`,
                                                        color: form.nivel === n.valor ? n.color : '#64748b',
                                                    }}
                                                >
                                                    <span style={{ fontSize: '20px' }}>{n.emoji}</span>
                                                    <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{n.valor}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ marginTop: '12px' }}>
                                            <label style={estilos.label}>Descripción (opcional)</label>
                                            <textarea
                                                value={form.descripcion}
                                                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                                style={{ ...estilos.input, height: '80px', resize: 'vertical' }}
                                                placeholder="Describe el comportamiento del estudiante..."
                                            />
                                        </div>
                                        <button type="submit" style={estilos.botonGuardar}>Guardar</button>
                                    </form>
                                </div>
                            )}

                            <div style={estilos.historial}>
                                {historial.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>Sin registros de conducta</p>
                                ) : (
                                    historial.map(h => {
                                        const nivel = getNivel(h.nivel);
                                        return (
                                            <div key={h.id} style={estilos.registroConducta}>
                                                <div style={{ ...estilos.nivelBadge, backgroundColor: nivel?.bg, color: nivel?.color }}>
                                                    {nivel?.emoji} {h.nivel}
                                                </div>
                                                <div style={estilos.conductaInfo}>
                                                    <div style={estilos.conductaDesc}>{h.descripcion || 'Sin descripción'}</div>
                                                    <div style={estilos.conductaMeta}>
                                                        {new Date(h.fecha).toLocaleDateString()} · {h.docente_nombre}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
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
    panelConducta: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    sinSeleccion: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#94a3b8' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    botonAgregar: { backgroundColor: '#1e40af', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    nivelesGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
    nivelOpcion: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '12px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' },
    label: { fontSize: '13px', color: '#374151', marginBottom: '6px', fontWeight: '500', display: 'block' },
    input: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' },
    botonGuardar: { marginTop: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    historial: { display: 'flex', flexDirection: 'column', gap: '10px' },
    registroConducta: { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' },
    nivelBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize', whiteSpace: 'nowrap' },
    conductaInfo: { flex: 1 },
    conductaDesc: { color: '#374151', fontSize: '14px' },
    conductaMeta: { color: '#94a3b8', fontSize: '12px', marginTop: '4px' },
};

export default Conducta;