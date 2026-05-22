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
        fecha_nacimiento: '', grado: '', seccion: '', tutor_id: '',
        email_padre: '', nombre_padre: '', apellido_padre: ''
    });

    const navigate = useNavigate();
    const { usuario } = useAuth();

    useEffect(() => { cargarDatos(); }, []);

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
            const respuesta = await api.post('/estudiantes', form);
            setExito(respuesta.data.mensaje);
            setMostrarFormulario(false);
            setForm({ nombre: '', apellido: '', ci: '', fecha_nacimiento: '', grado: '', seccion: '', tutor_id: '', email_padre: '', nombre_padre: '', apellido_padre: '' });
            setTimeout(() => setExito(''), 4000);
            cargarDatos();
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al crear estudiante');
            setTimeout(() => setError(''), 3000);
        }
    };

    const eliminarEstudiante = async (id, nombre) => {
        const confirmacion1 = window.confirm(`¿Estás seguro de eliminar a ${nombre}?`);
        if (!confirmacion1) return;
        const confirmacion2 = window.confirm(`⚠ ADVERTENCIA: Esta acción es irreversible y eliminará todos los registros de ${nombre}. ¿Confirmas la eliminación?`);
        if (!confirmacion2) return;
        try {
            await api.delete(`/estudiantes/${id}`);
            setExito(`Estudiante ${nombre} eliminado`);
            setTimeout(() => setExito(''), 3000);
            cargarDatos();
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al eliminar estudiante');
            setTimeout(() => setError(''), 3000);
        }
    };

    const estudiantesFiltrados = estudiantes.filter(e =>
        `${e.nombre} ${e.apellido} ${e.ci}`.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.fondo} />
            <div style={estilos.circulo1} />

            <div style={estilos.inner}>
                <div style={estilos.navbar}>
                    <div style={estilos.navIzq}>
                        <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>← Volver</button>
                        <div>
                            <div style={estilos.navTituloTexto}>Estudiantes</div>
                            <div style={estilos.navSubtitulo}>Gestión y registro de estudiantes</div>
                        </div>
                    </div>
                    {usuario?.rol === 'director' && (
                        <button onClick={() => setMostrarFormulario(!mostrarFormulario)} style={estilos.botonAgregar}>
                            + Nuevo estudiante
                        </button>
                    )}
                </div>

                <div style={estilos.contenido}>
                    {error && <div style={estilos.error}>⚠ {error}</div>}
                    {exito && <div style={estilos.exito}>✓ {exito}</div>}

                    {mostrarFormulario && (
                        <div style={estilos.formularioCard}>
                            <h3 style={estilos.formTitulo}>Registrar nuevo estudiante</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={estilos.grid}>
                                    <div style={estilos.campo}>
                                        <label style={estilos.label}>Nombre</label>
                                        <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} style={estilos.input} placeholder="Nombre" required />
                                    </div>
                                    <div style={estilos.campo}>
                                        <label style={estilos.label}>Apellido</label>
                                        <input type="text" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} style={estilos.input} placeholder="Apellido" required />
                                    </div>
                                    <div style={estilos.campo}>
                                        <label style={estilos.label}>C.I.</label>
                                        <input type="text" value={form.ci} onChange={(e) => setForm({ ...form, ci: e.target.value })} style={estilos.input} placeholder="Cédula de identidad" required />
                                    </div>
                                    <div style={estilos.campo}>
                                        <label style={estilos.label}>Fecha de nacimiento</label>
                                        <input type="date" value={form.fecha_nacimiento} onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })} style={estilos.input} />
                                    </div>
                                    <div style={estilos.campo}>
                                        <label style={estilos.label}>Grado</label>
                                        <select value={form.grado} onChange={(e) => setForm({ ...form, grado: e.target.value })} style={estilos.input} required>
                                            <option value="">Seleccionar...</option>
                                            {grados.map(g => <option key={g} value={g}>{g} Grado</option>)}
                                        </select>
                                    </div>
                                    <div style={estilos.campo}>
                                        <label style={estilos.label}>Sección</label>
                                        <select value={form.seccion} onChange={(e) => setForm({ ...form, seccion: e.target.value })} style={estilos.input} required>
                                            <option value="">Seleccionar...</option>
                                            {secciones.map(s => <option key={s} value={s}>Sección {s}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ ...estilos.campo, gridColumn: 'span 3' }}>
                                        <label style={estilos.label}>Tutor existente en el sistema</label>
                                        <select value={form.tutor_id} onChange={(e) => setForm({ ...form, tutor_id: e.target.value, email_padre: '', nombre_padre: '', apellido_padre: '' })} style={estilos.input}>
                                            <option value="">Seleccionar tutor existente...</option>
                                            {tutores.map(t => <option key={t.id} value={t.id}>{t.nombre} {t.apellido} — {t.email}</option>)}
                                        </select>
                                    </div>
                                    {!form.tutor_id && (
                                        <>
                                            <div style={{ ...estilos.campo, gridColumn: 'span 3' }}>
                                                <div style={estilos.separador}>
                                                    <div style={estilos.separadorLinea} />
                                                    <span style={estilos.separadorTexto}>O REGISTRAR NUEVO PADRE</span>
                                                    <div style={estilos.separadorLinea} />
                                                </div>
                                            </div>
                                            <div style={estilos.campo}>
                                                <label style={estilos.label}>Email del padre</label>
                                                <input type="email" value={form.email_padre} onChange={(e) => setForm({ ...form, email_padre: e.target.value })} style={estilos.input} placeholder="padre@email.com" />
                                            </div>
                                            <div style={estilos.campo}>
                                                <label style={estilos.label}>Nombre del padre</label>
                                                <input type="text" value={form.nombre_padre} onChange={(e) => setForm({ ...form, nombre_padre: e.target.value })} style={estilos.input} placeholder="Nombre" />
                                            </div>
                                            <div style={estilos.campo}>
                                                <label style={estilos.label}>Apellido del padre</label>
                                                <input type="text" value={form.apellido_padre} onChange={(e) => setForm({ ...form, apellido_padre: e.target.value })} style={estilos.input} placeholder="Apellido" />
                                            </div>
                                            {form.email_padre && (
                                                <div style={{ ...estilos.campo, gridColumn: 'span 3' }}>
                                                    <div style={estilos.infoEmail}>
                                                        Se enviará un correo a <strong>{form.email_padre}</strong> con las credenciales de acceso a la app móvil
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <button type="submit" style={estilos.botonGuardar}>Guardar estudiante</button>
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
                                placeholder="Buscar por nombre o C.I..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                style={estilos.buscador}
                            />
                        </div>

                        {cargando ? (
                            <p style={estilos.vacio}>Cargando...</p>
                        ) : estudiantesFiltrados.length === 0 ? (
                            <p style={estilos.vacio}>No se encontraron estudiantes</p>
                        ) : (
                            <div style={estilos.listaEstudiantes}>
                                <div style={estilos.tablaHeader}>
                                    <span style={{ flex: 2 }}>Estudiante</span>
                                    <span style={{ flex: 1 }}>C.I.</span>
                                    <span style={{ flex: 1 }}>Grado</span>
                                    <span style={{ flex: 2 }}>Tutor / Email</span>
                                    {usuario?.rol === 'director' && <span style={{ flex: 1 }}>Acción</span>}
                                </div>
                                {estudiantesFiltrados.map(e => (
                                    <div key={e.id} style={estilos.fila}>
                                        <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={estilos.avatar}>{e.nombre[0]}{e.apellido[0]}</div>
                                            <div style={estilos.nombreEstudiante}>{e.nombre} {e.apellido}</div>
                                        </div>
                                        <div style={{ flex: 1, color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{e.ci}</div>
                                        <div style={{ flex: 1 }}>
                                            <span style={estilos.gradoBadge}>{e.grado} — {e.seccion}</span>
                                        </div>
                                        <div style={{ flex: 2 }}>
                                            {e.tutor_nombre ? (
                                                <div>
                                                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600' }}>
                                                        {e.tutor_nombre} {e.tutor_apellido}
                                                    </div>
                                                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '2px' }}>
                                                        {e.tutor_email}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>Sin tutor asignado</span>
                                            )}
                                        </div>
                                        {usuario?.rol === 'director' && (
                                            <div style={{ flex: 1 }}>
                                                <button onClick={() => eliminarEstudiante(e.id, `${e.nombre} ${e.apellido}`)} style={estilos.botonEliminar}>
                                                    Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div style={estilos.footer}>
                    <span>© {new Date().getFullYear()} Unidad Educativa Adventista Salomón</span>
                </div>
            </div>
        </div>
    );
};

const estilos = {
    contenedor: { minHeight: '100vh', background: 'linear-gradient(140deg, #000d2e 0%, #001a5c 40%, #002d8a 100%)', position: 'relative', overflow: 'hidden' },
    fondo: { position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 41px)` },
    circulo1: { position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,220,0.12) 0%, transparent 65%)', filter: 'blur(80px)', top: '-200px', right: '-150px' },
    inner: { position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    navbar: { backgroundColor: 'rgba(0,8,30,0.7)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    navIzq: { display: 'flex', alignItems: 'center', gap: '20px' },
    botonVolver: { backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
    navTituloTexto: { color: 'white', fontWeight: '700', fontSize: '16px' },
    navSubtitulo: { color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '2px' },
    botonAgregar: { backgroundColor: '#FFD700', color: '#001a5c', border: 'none', padding: '9px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },
    contenido: { padding: '32px 40px', flex: 1 },
    error: { backgroundColor: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', color: '#fca5a5', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
    exito: { backgroundColor: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#6ee7b7', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
    formularioCard: { backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '28px', marginBottom: '24px' },
    formTitulo: { color: 'white', fontSize: '15px', fontWeight: '700', margin: '0 0 20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' },
    campo: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' },
    input: { padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '14px', color: 'white', outline: 'none' },
    separador: { display: 'flex', alignItems: 'center', gap: '12px' },
    separadorLinea: { flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' },
    separadorTexto: { color: 'rgba(255,255,255,0.2)', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', whiteSpace: 'nowrap' },
    infoEmail: { backgroundColor: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: '#93c5fd', padding: '10px 14px', borderRadius: '8px', fontSize: '12px' },
    botonGuardar: { backgroundColor: '#FFD700', color: '#001a5c', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },
    botonCancelar: { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
    panelLista: { backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    stats: { display: 'flex', alignItems: 'baseline', gap: '8px' },
    statNum: { fontSize: '26px', fontWeight: '800', color: '#FFD700' },
    statLabel: { fontSize: '13px', color: 'rgba(255,255,255,0.35)' },
    buscador: { padding: '9px 16px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '13px', color: 'white', outline: 'none', width: '260px' },
    listaEstudiantes: {},
    tablaHeader: { display: 'flex', padding: '10px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' },
    fila: { display: 'flex', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    avatar: { width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,215,0,0.15)', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0 },
    nombreEstudiante: { color: 'white', fontSize: '14px', fontWeight: '600' },
    gradoBadge: { backgroundColor: 'rgba(96,165,250,0.12)', color: '#93c5fd', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
    botonEliminar: { backgroundColor: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' },
    vacio: { textAlign: 'center', color: 'rgba(255,255,255,0.25)', padding: '40px', fontSize: '14px' },
    footer: { display: 'flex', justifyContent: 'center', padding: '14px 40px', color: 'rgba(255,255,255,0.15)', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.05)' },
};

export default Estudiantes;