import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const niveles = [
    { valor: 'excelente', color: '#16a34a', bg: '#dcfce7', emoji: '⭐', label: 'Excelente' },
    { valor: 'bueno', color: '#2563eb', bg: '#dbeafe', emoji: '👍', label: 'Bueno' },
    { valor: 'regular', color: '#d97706', bg: '#fef3c7', emoji: '⚠️', label: 'Regular' },
    { valor: 'malo', color: '#dc2626', bg: '#fee2e2', emoji: '❌', label: 'Malo' },
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
            const respuesta = await api.get(`/conducta/estudiante/${estudiante.id}`);
            setHistorial(respuesta.data);
        } catch (err) {
            setError('Error al cargar historial');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/conducta', { ...form, estudiante_id: estudianteSeleccionado.id });
            setExito(form.nivel === 'malo' || form.nivel === 'regular'
                ? '📧 Conducta registrada y padre notificado'
                : '✓ Conducta registrada exitosamente'
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

    const resumenConducta = () => {
        const conteo = { excelente: 0, bueno: 0, regular: 0, malo: 0 };
        historial.forEach(h => { if (conteo[h.nivel] !== undefined) conteo[h.nivel]++; });
        return conteo;
    };

    const resumen = resumenConducta();

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.navbar}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>← Volver</button>
                <div style={estilos.navTitulo}>
                    <span style={estilos.navIcono}>😊</span>
                    <h2 style={estilos.titulo}>Conducta</h2>
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

                    <div style={estilos.panelConducta}>
                        {!estudianteSeleccionado ? (
                            <div style={estilos.sinSeleccion}>
                                <div style={estilos.sinSeleccionIcono}>😊</div>
                                <p style={{ color: '#94a3b8', fontSize: '15px' }}>Selecciona un estudiante para ver su conducta</p>
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
                                        + Registrar conducta
                                    </button>
                                </div>

                                {historial.length > 0 && (
                                    <div style={estilos.resumenBox}>
                                        {niveles.map(n => (
                                            <div key={n.valor} style={{ ...estilos.resumenItem, backgroundColor: n.bg }}>
                                                <span style={{ fontSize: '20px' }}>{n.emoji}</span>
                                                <span style={{ ...estilos.resumenNum, color: n.color }}>{resumen[n.valor]}</span>
                                                <span style={{ ...estilos.resumenLabel, color: n.color }}>{n.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {mostrarFormulario && (
                                    <div style={estilos.formulario}>
                                        <h4 style={{ margin: '0 0 14px', color: '#1e40af' }}>Registrar conducta</h4>
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
                                                            transform: form.nivel === n.valor ? 'scale(1.05)' : 'scale(1)',
                                                        }}
                                                    >
                                                        <span style={{ fontSize: '24px' }}>{n.emoji}</span>
                                                        <span style={{ fontWeight: '700', fontSize: '13px' }}>{n.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ marginTop: '14px' }}>
                                                <label style={estilos.label}>Descripción (opcional)</label>
                                                <textarea
                                                    value={form.descripcion}
                                                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                                    style={{ ...estilos.input, height: '80px', resize: 'vertical' }}
                                                    placeholder="Describe el comportamiento del estudiante..."
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                                <button type="submit" style={estilos.botonGuardar}>Guardar</button>
                                                <button type="button" onClick={() => setMostrarFormulario(false)} style={estilos.botonCancelar}>Cancelar</button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div style={estilos.historial}>
                                    {historial.length === 0 ? (
                                        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Sin registros de conducta</p>
                                    ) : (
                                        historial.map(h => {
                                            const nivel = getNivel(h.nivel);
                                            return (
                                                <div key={h.id} style={{ ...estilos.registroConducta, borderLeft: `4px solid ${nivel?.color}` }}>
                                                    <div style={{ ...estilos.nivelBadge, backgroundColor: nivel?.bg, color: nivel?.color }}>
                                                        {nivel?.emoji} {nivel?.label}
                                                    </div>
                                                    <div style={estilos.conductaInfo}>
                                                        <div style={estilos.conductaDesc}>{h.descripcion || 'Sin descripción'}</div>
                                                        <div style={estilos.conductaMeta}>
                                                            📅 {new Date(h.fecha).toLocaleDateString()} · 👨‍🏫 {h.docente_nombre}
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
    panelConducta: { backgroundColor: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    sinSeleccion: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px' },
    sinSeleccionIcono: { fontSize: '48px', opacity: 0.3 },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
    botonAgregar: { backgroundColor: '#1e40af', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    resumenBox: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' },
    resumenItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px', borderRadius: '10px', gap: '4px' },
    resumenNum: { fontSize: '22px', fontWeight: '800' },
    resumenLabel: { fontSize: '11px', fontWeight: '600' },
    formulario: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' },
    nivelesGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
    nivelOpcion: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '14px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' },
    label: { fontSize: '13px', color: '#374151', marginBottom: '6px', fontWeight: '600', display: 'block' },
    input: { width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    botonGuardar: { backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    botonCancelar: { backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    historial: { display: 'flex', flexDirection: 'column', gap: '10px' },
    registroConducta: { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: '10px' },
    nivelBadge: { padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' },
    conductaInfo: { flex: 1 },
    conductaDesc: { color: '#374151', fontSize: '14px', lineHeight: '1.4' },
    conductaMeta: { color: '#94a3b8', fontSize: '12px', marginTop: '6px' },
};

export default Conducta;