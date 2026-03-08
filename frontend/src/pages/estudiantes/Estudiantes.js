import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Estudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [form, setForm] = useState({
        nombre: '', apellido: '', ci: '',
        fecha_nacimiento: '', grado: '', seccion: ''
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
        } finally {
            setCargando(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/estudiantes', form);
            setMostrarFormulario(false);
            setForm({ nombre: '', apellido: '', ci: '', fecha_nacimiento: '', grado: '', seccion: '' });
            cargarEstudiantes();
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al crear estudiante');
        }
    };

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.header}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>
                    ← Volver
                </button>
                <h2 style={estilos.titulo}>Estudiantes</h2>
                <button onClick={() => setMostrarFormulario(!mostrarFormulario)} style={estilos.botonAgregar}>
                    + Agregar estudiante
                </button>
            </div>

            {error && <div style={estilos.error}>{error}</div>}

            {mostrarFormulario && (
                <div style={estilos.formulario}>
                    <h3 style={estilos.formTitulo}>Nuevo Estudiante</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={estilos.grid}>
                            {[
                                { label: 'Nombre', key: 'nombre', type: 'text' },
                                { label: 'Apellido', key: 'apellido', type: 'text' },
                                { label: 'CI', key: 'ci', type: 'text' },
                                { label: 'Fecha de nacimiento', key: 'fecha_nacimiento', type: 'date' },
                                { label: 'Grado', key: 'grado', type: 'text' },
                                { label: 'Sección', key: 'seccion', type: 'text' },
                            ].map(campo => (
                                <div key={campo.key} style={estilos.campo}>
                                    <label style={estilos.label}>{campo.label}</label>
                                    <input
                                        type={campo.type}
                                        value={form[campo.key]}
                                        onChange={(e) => setForm({ ...form, [campo.key]: e.target.value })}
                                        style={estilos.input}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                        <button type="submit" style={estilos.botonGuardar}>Guardar</button>
                    </form>
                </div>
            )}

            {cargando ? (
                <p style={{ textAlign: 'center', color: '#64748b' }}>Cargando...</p>
            ) : (
                <table style={estilos.tabla}>
                    <thead>
                        <tr style={estilos.thead}>
                            <th style={estilos.th}>Nombre</th>
                            <th style={estilos.th}>CI</th>
                            <th style={estilos.th}>Grado</th>
                            <th style={estilos.th}>Sección</th>
                            <th style={estilos.th}>Tutor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantes.map(e => (
                            <tr key={e.id} style={estilos.tr}>
                                <td style={estilos.td}>{e.nombre} {e.apellido}</td>
                                <td style={estilos.td}>{e.ci}</td>
                                <td style={estilos.td}>{e.grado}</td>
                                <td style={estilos.td}>{e.seccion}</td>
                                <td style={estilos.td}>{e.tutor_nombre ? `${e.tutor_nombre} ${e.tutor_apellido}` : 'Sin tutor'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const estilos = {
    contenedor: { padding: '24px', backgroundColor: '#f0f4f8', minHeight: '100vh' },
    header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
    titulo: { color: '#1e293b', flex: 1, margin: 0 },
    botonVolver: { background: 'none', border: '1px solid #d1d5db', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', color: '#374151' },
    botonAgregar: { backgroundColor: '#1e40af', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' },
    formulario: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
    formTitulo: { color: '#1e40af', marginTop: 0 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
    campo: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '13px', color: '#374151', marginBottom: '6px', fontWeight: '500' },
    input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' },
    botonGuardar: { marginTop: '16px', backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    tabla: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
    thead: { backgroundColor: '#1e40af' },
    th: { padding: '14px 16px', color: 'white', textAlign: 'left', fontSize: '14px' },
    tr: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '12px 16px', color: '#374151', fontSize: '14px' },
};

export default Estudiantes;