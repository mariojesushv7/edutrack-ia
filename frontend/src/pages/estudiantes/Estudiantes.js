import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const grados = ['1°', '2°', '3°', '4°', '5°', '6°'];
const secciones = ['A', 'B', 'C', 'D'];

const Estudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [tutores, setTutores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [form, setForm] = useState({
        nombre: '', apellido: '', ci: '',
        fecha_nacimiento: '', grado: '', seccion: '', tutor_id: ''
    });

    const navigate = useNavigate();
    const { usuario } = useAuth();

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [respEstudiantes, respUsuarios] = await Promise.all([
                api.get('/estudiantes'),
                api.get('/usuarios')
            ]);
            setEstudiantes(respEstudiantes.data);
            setTutores(respUsuarios.data.filter(u => u.rol === 'padre'));
        } catch (err) {
            setError('Error al cargar datos');
        } finally {
            setCargando(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/estudiantes', form);
            setExito('Estudiante registrado exitosamente');
            setMostrarFormulario(false);
            setForm({ nombre: '', apellido: '', ci: '', fecha_nacimiento: '', grado: '', seccion: '', tutor_id: '' });
            setTimeout(() => setExito(''), 3000);
            cargarDatos();
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al crear estudiante');
            setTimeout(() => setError(''), 3000);
        }
    };

    const estudiantesFiltrados = estudiantes.filter(e =>
        `${e.nombre} ${e.apellido} ${e.ci}`.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.navbar}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>
                    ← Volver
                </button>
                <div style={estilos.navTitulo}>
                    <span style={estilos.navIcono}>👨‍🎓</span>
                    <h2 style={estilos.titulo}>Estudiantes</h2>
                </div>
                {usuario?.rol === 'director' && (
                    <button onClick={() => setMostrarFormulario(!mostrarFormulario)} style={estilos.botonAgregar}>
                        + Agregar estudiante
                    </button>
                )}
            </div>

            <div style={estilos.contenido}>
                {error && <div style={estilos.error}>⚠️ {error}</div>}
                {exito && <div style={estilos.exito}>✓ {exito}</div>}

                {mostrarFormulario && (
                    <div style={estilos.formularioCard}>
                        <h3 style={estilos.formTitulo}>📋 Nuevo Estudiante</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={estilos.grid}>
                                <div style={estilos.campo}>
                                    <label style={estilos.label}>Nombre</label>
                                    <input
                                        type="text"
                                        value={form.nombre}
                                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                        style={estilos.input}
                                        placeholder="Nombre del estudiante"
                                        required
                                    />
                                </div>
                                <div style={estilos.campo}>
                                    <label style={estilos.label}>Apellido</label>
                                    <input
                                        type="text"
                                        value={form.apellido}
                                        onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                                        style={estilos.input}
                                        placeholder="Apellido del estudiante"
                                        required
                                    />
                                </div>
                                <div style={estilos.campo}>
                                    <label style={estilos.label}>CI</label>
                                    <input
                                        type="text"
                                        value={form.ci}
                                        onChange={(e) => setForm({ ...form, ci: e.target.value })}
                                        style={estilos.input}
                                        placeholder="Cédula de identidad"
                                        required
                                    />
                                </div>
                                <div style={estilos.campo}>
                                    <label style={estilos.label}>Fecha de nacimiento</label>
                                    <input
                                        type="date"
                                        value={form.fecha_nacimiento}
                                        onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
                                        style={estilos.input}
                                    />
                                </div>
                                <div style={estilos.campo}>
                                    <label style={estilos.label}>Grado</label>
                                    <select
                                        value={form.grado}
                                        onChange={(e) => setForm({ ...form, grado: e.target.value })}
                                        style={estilos.input}
                                        required
                                    >
                                        <option value="">Seleccionar grado...</option>
                                        {grados.map(g => (
                                            <option key={g} value={g}>{g} Grado</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={estilos.campo}>
                                    <label style={estilos.label}>Sección</label>
                                    <select
                                        value={form.seccion}
                                        onChange={(e) => setForm({ ...form, seccion: e.target.value })}
                                        style={estilos.input}
                                        required
                                    >
                                        <option value="">Seleccionar sección...</option>
                                        {secciones.map(s => (
                                            <option key={s} value={s}>Sección {s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ ...estilos.campo, gridColumn: 'span 3' }}>
                                    <label style={estilos.label}>Padre/Tutor</label>
                                    <select
                                        value={form.tutor_id}
                                        onChange={(e) => setForm({ ...form, tutor_id: e.target.value })}
                                        style={estilos.input}
                                    >
                                        <option value="">Seleccionar tutor...</option>
                                        {tutores.map(t => (
                                            <option key={t.id} value={t.id}>
                                                {t.nombre} {t.apellido} - {t.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                <button type="submit" style={estilos.botonGuardar}>✓ Guardar estudiante</button>
                                <button type="button" onClick={() => setMostrarFormulario(false)} style={estilos.botonCancelar}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                )}

                <div style={estilos.panelLista}>
                    <div style={estilos.panelHeader}>
                        <div style={estilos.stats}>
                            <span style={estilos.statNum}>{estudiantes.length}</span>
                            <span style={estilos.statLabel}>estudiantes registrados</span>
                        </div>
                        <input
                            type="text"
                            placeholder="🔍 Buscar por nombre o CI..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            style={estilos.buscador}
                        />
                    </div>

                    {cargando ? (
                        <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>Cargando...</p>
                    ) : estudiantesFiltrados.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No se encontraron estudiantes</p>
                    ) : (
                        <div style={estilos.listaEstudiantes}>
                            {estudiantesFiltrados.map(e => (
                                <div key={e.id} style={estilos.tarjetaEstudiante}>
                                    <div style={estilos.estudianteAvatar}>
                                        {e.nombre[0]}{e.apellido[0]}
                                    </div>
                                    <div style={estilos.estudianteInfo}>
                                        <div style={estilos.estudianteNombre}>{e.nombre} {e.apellido}</div>
                                        <div style={estilos.estudianteDatos}>
                                            CI: {e.ci} · Grado {e.grado} · Sección {e.seccion}
                                        </div>
                                        <div style={estilos.estudianteTutor}>
                                            👤 {e.tutor_nombre ? `${e.tutor_nombre} ${e.tutor_apellido}` : 'Sin tutor asignado'}
                                        </div>
                                    </div>
                                    <div style={estilos.gradoBadge}>{e.grado}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const estilos = {
    contenedor: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
    navbar: {
        backgroundColor: 'white',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    botonVolver: { background: 'none', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', color: '#374151', fontSize: '14px' },
    navTitulo: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1 },
    navIcono: { fontSize: '24px' },
    titulo: { color: '#1e293b', margin: 0, fontSize: '20px', fontWeight: '700' },
    botonAgregar: { backgroundColor: '#1e40af', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    contenido: { padding: '24px 32px' },
    error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
    exito: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
    formularioCard: { backgroundColor: 'white', padding: '24px', borderRadius: '14px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' },
    formTitulo: { color: '#1e40af', marginTop: 0, fontSize: '16px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
    campo: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '13px', color: '#374151', marginBottom: '6px', fontWeight: '600' },
    input: { padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none' },
    botonGuardar: { backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    botonCancelar: { backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    panelLista: { backgroundColor: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    stats: { display: 'flex', alignItems: 'baseline', gap: '8px' },
    statNum: { fontSize: '28px', fontWeight: '800', color: '#1e40af' },
    statLabel: { fontSize: '14px', color: '#64748b' },
    buscador: { padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', width: '280px', outline: 'none' },
    listaEstudiantes: { display: 'flex', flexDirection: 'column', gap: '10px' },
    tarjetaEstudiante: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', border: '1px solid #f1f5f9', borderRadius: '10px', transition: 'background 0.2s' },
    estudianteAvatar: { width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '15px', flexShrink: 0 },
    estudianteInfo: { flex: 1 },
    estudianteNombre: { fontWeight: '700', color: '#1e293b', fontSize: '15px' },
    estudianteDatos: { color: '#64748b', fontSize: '13px', marginTop: '2px' },
    estudianteTutor: { color: '#94a3b8', fontSize: '12px', marginTop: '2px' },
    gradoBadge: { backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' },
};

export default Estudiantes;