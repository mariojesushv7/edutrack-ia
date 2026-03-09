import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Ia = () => {
    const [resultados, setResultados] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const analizarEstudiantes = async () => {
        setCargando(true);
        setError('');
        try {
            const respuesta = await api.get('/ia/analizar');
            setResultados(respuesta.data);
        } catch (err) {
            setError('Error al analizar estudiantes');
        } finally {
            setCargando(false);
        }
    };

    const colorRiesgo = (nivel) => {
        if (nivel === 'alto') return { bg: '#fee2e2', color: '#dc2626', texto: '🔴 Riesgo Alto' };
        if (nivel === 'medio') return { bg: '#fef3c7', color: '#d97706', texto: '🟡 Riesgo Medio' };
        return { bg: '#dcfce7', color: '#16a34a', texto: '🟢 Riesgo Bajo' };
    };

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.header}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>
                    ← Volver
                </button>
                <h2 style={estilos.titulo}>Análisis de Riesgo con IA</h2>
            </div>

            {error && <div style={estilos.error}>{error}</div>}

            <div style={estilos.panelCentral}>
                <div style={estilos.descripcion}>
                    <h3 style={{ color: '#1e293b', marginTop: 0 }}>¿Cómo funciona?</h3>
                    <p style={{ color: '#64748b' }}>
                        El sistema analiza automáticamente las notas, asistencia, tareas y conducta 
                        de cada estudiante para detectar quiénes están en riesgo académico.
                        Si detecta riesgo alto, notifica al director por email.
                    </p>
                    <div style={estilos.factoresGrid}>
                        <div style={estilos.factor}>
                            <span style={estilos.factorIcon}>📝</span>
                            <span style={estilos.factorLabel}>Notas (40%)</span>
                        </div>
                        <div style={estilos.factor}>
                            <span style={estilos.factorIcon}>📋</span>
                            <span style={estilos.factorLabel}>Asistencia (30%)</span>
                        </div>
                        <div style={estilos.factor}>
                            <span style={estilos.factorIcon}>📚</span>
                            <span style={estilos.factorLabel}>Tareas (20%)</span>
                        </div>
                        <div style={estilos.factor}>
                            <span style={estilos.factorIcon}>😊</span>
                            <span style={estilos.factorLabel}>Conducta (10%)</span>
                        </div>
                    </div>
                    <button
                        onClick={analizarEstudiantes}
                        disabled={cargando}
                        style={{ ...estilos.botonAnalizar, opacity: cargando ? 0.7 : 1 }}
                    >
                        {cargando ? '⏳ Analizando...' : '🤖 Iniciar Análisis de IA'}
                    </button>
                </div>

                {resultados && (
                    <>
                        <div style={estilos.resumenGrid}>
                            <div style={{ ...estilos.resumenCard, borderTop: '4px solid #dc2626' }}>
                                <div style={{ ...estilos.resumenNum, color: '#dc2626' }}>{resultados.en_riesgo_alto}</div>
                                <div style={estilos.resumenLabel}>Riesgo Alto</div>
                            </div>
                            <div style={{ ...estilos.resumenCard, borderTop: '4px solid #d97706' }}>
                                <div style={{ ...estilos.resumenNum, color: '#d97706' }}>{resultados.en_riesgo_medio}</div>
                                <div style={estilos.resumenLabel}>Riesgo Medio</div>
                            </div>
                            <div style={{ ...estilos.resumenCard, borderTop: '4px solid #16a34a' }}>
                                <div style={{ ...estilos.resumenNum, color: '#16a34a' }}>{resultados.en_riesgo_bajo}</div>
                                <div style={estilos.resumenLabel}>Riesgo Bajo</div>
                            </div>
                        </div>

                        <div style={estilos.listaResultados}>
                            {resultados.resultados.map((r, i) => {
                                const riesgo = colorRiesgo(r.riesgo.nivel);
                                return (
                                    <div key={i} style={estilos.tarjetaResultado}>
                                        <div style={estilos.resultadoHeader}>
                                            <div>
                                                <div style={estilos.nombreEstudiante}>
                                                    {r.estudiante.nombre} {r.estudiante.apellido}
                                                </div>
                                                <div style={estilos.gradoEstudiante}>
                                                    Grado {r.estudiante.grado} · {r.estudiante.seccion}
                                                </div>
                                            </div>
                                            <div style={{ ...estilos.badgeRiesgo, backgroundColor: riesgo.bg, color: riesgo.color }}>
                                                {riesgo.texto}
                                            </div>
                                        </div>

                                        <div style={estilos.datosGrid}>
                                            <div style={estilos.dato}>
                                                <span style={estilos.datoLabel}>Promedio</span>
                                                <span style={estilos.datoValor}>{r.datos.promedio_notas || 'Sin notas'}</span>
                                            </div>
                                            <div style={estilos.dato}>
                                                <span style={estilos.datoLabel}>Ausencias</span>
                                                <span style={estilos.datoValor}>{r.datos.ausencias}/{r.datos.total_asistencias}</span>
                                            </div>
                                            <div style={estilos.dato}>
                                                <span style={estilos.datoLabel}>Tareas pend.</span>
                                                <span style={estilos.datoValor}>{r.datos.tareas_pendientes}/{r.datos.total_tareas}</span>
                                            </div>
                                            <div style={estilos.dato}>
                                                <span style={estilos.datoLabel}>Conducta neg.</span>
                                                <span style={estilos.datoValor}>{r.datos.conductas_malas}</span>
                                            </div>
                                        </div>

                                        {r.riesgo.factores.length > 0 && (
                                            <div style={estilos.factoresDetectados}>
                                                <div style={estilos.factoresTitulo}>⚠️ Factores detectados:</div>
                                                {r.riesgo.factores.map((f, j) => (
                                                    <div key={j} style={estilos.factorItem}>• {f}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
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
    panelCentral: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    descripcion: { marginBottom: '24px' },
    factoresGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', margin: '16px 0' },
    factor: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', gap: '6px' },
    factorIcon: { fontSize: '24px' },
    factorLabel: { fontSize: '12px', color: '#64748b', fontWeight: '600', textAlign: 'center' },
    botonAnalizar: { backgroundColor: '#1e40af', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', width: '100%', marginTop: '8px' },
    resumenGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
    resumenCard: { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', textAlign: 'center' },
    resumenNum: { fontSize: '36px', fontWeight: '700' },
    resumenLabel: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
    listaResultados: { display: 'flex', flexDirection: 'column', gap: '12px' },
    tarjetaResultado: { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' },
    resultadoHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
    nombreEstudiante: { fontWeight: '700', color: '#1e293b', fontSize: '16px' },
    gradoEstudiante: { color: '#64748b', fontSize: '13px', marginTop: '2px' },
    badgeRiesgo: { padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' },
    datosGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' },
    dato: { display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '6px' },
    datoLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '600' },
    datoValor: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginTop: '2px' },
    factoresDetectados: { backgroundColor: '#fef3c7', padding: '10px 14px', borderRadius: '6px' },
    factoresTitulo: { fontWeight: '600', color: '#d97706', fontSize: '13px', marginBottom: '4px' },
    factorItem: { color: '#92400e', fontSize: '13px', marginTop: '2px' },
};

export default Ia;