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
        if (nivel === 'alto') return { bg: '#fee2e2', color: '#dc2626', texto: '⚠️ Riesgo Alto', borde: '#dc2626' };
        if (nivel === 'medio') return { bg: '#fef3c7', color: '#d97706', texto: '📊 Riesgo Medio', borde: '#d97706' };
        return { bg: '#dcfce7', color: '#16a34a', texto: '✅ Riesgo Bajo', borde: '#16a34a' };
    };

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.navbar}>
                <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>← Volver</button>
                <div style={estilos.navTitulo}>
                    <span style={estilos.navIcono}>🤖</span>
                    <h2 style={estilos.titulo}>Análisis de Riesgo con IA</h2>
                </div>
            </div>

            <div style={estilos.contenido}>
                {error && <div style={estilos.error}>⚠️ {error}</div>}

                <div style={estilos.heroBanner}>
                    <div style={estilos.heroTexto}>
                        <h3 style={estilos.heroTitulo}>¿Cómo funciona el análisis?</h3>
                        <p style={estilos.heroDesc}>
                            El sistema analiza automáticamente las notas, asistencia, tareas y conducta
                            de cada estudiante para detectar quiénes están en riesgo académico.
                            Si detecta riesgo alto, notifica al director por email de forma inmediata.
                        </p>
                    </div>
                    <div style={estilos.factoresGrid}>
                        {[
                            { icon: '📝', label: 'Notas', peso: '40%', color: '#3b82f6' },
                            { icon: '📋', label: 'Asistencia', peso: '30%', color: '#10b981' },
                            { icon: '📚', label: 'Tareas', peso: '20%', color: '#f59e0b' },
                            { icon: '😊', label: 'Conducta', peso: '10%', color: '#8b5cf6' },
                        ].map((f, i) => (
                            <div key={i} style={{ ...estilos.factor, borderTop: `3px solid ${f.color}` }}>
                                <span style={estilos.factorIcon}>{f.icon}</span>
                                <span style={estilos.factorLabel}>{f.label}</span>
                                <span style={{ ...estilos.factorPeso, color: f.color }}>{f.peso}</span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={analizarEstudiantes}
                        disabled={cargando}
                        style={{ ...estilos.botonAnalizar, opacity: cargando ? 0.7 : 1 }}
                    >
                        {cargando ? '⏳ Analizando datos...' : '🤖 Iniciar Análisis de IA'}
                    </button>
                </div>

                {resultados && (
                    <>
                        <div style={estilos.resumenGrid}>
                            {[
                                { num: resultados.en_riesgo_alto, label: 'Riesgo Alto', color: '#dc2626', bg: '#fee2e2', icon: '⚠️' },
                                { num: resultados.en_riesgo_medio, label: 'Riesgo Medio', color: '#d97706', bg: '#fef3c7', icon: '📊' },
                                { num: resultados.en_riesgo_bajo, label: 'Riesgo Bajo', color: '#16a34a', bg: '#dcfce7', icon: '✅' },
                                { num: resultados.total, label: 'Total Analizados', color: '#1e40af', bg: '#dbeafe', icon: '👨‍🎓' },
                            ].map((s, i) => (
                                <div key={i} style={{ ...estilos.resumenCard, backgroundColor: s.bg }}>
                                    <div style={estilos.resumenIcono}>{s.icon}</div>
                                    <div style={{ ...estilos.resumenNum, color: s.color }}>{s.num}</div>
                                    <div style={{ ...estilos.resumenLabel, color: s.color }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div style={estilos.listaResultados}>
                            {resultados.resultados
                                .sort((a, b) => b.riesgo.puntos - a.riesgo.puntos)
                                .map((r, i) => {
                                    const riesgo = colorRiesgo(r.riesgo.nivel);
                                    return (
                                        <div key={i} style={{ ...estilos.tarjetaResultado, borderLeft: `5px solid ${riesgo.borde}` }}>
                                            <div style={estilos.resultadoHeader}>
                                                <div style={estilos.estudianteInfo}>
                                                    <div style={estilos.estudianteAvatar}>
                                                        {r.estudiante.nombre[0]}{r.estudiante.apellido[0]}
                                                    </div>
                                                    <div>
                                                        <div style={estilos.nombreEstudiante}>
                                                            {r.estudiante.nombre} {r.estudiante.apellido}
                                                        </div>
                                                        <div style={estilos.gradoEstudiante}>
                                                            Grado {r.estudiante.grado} · Sección {r.estudiante.seccion}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ ...estilos.badgeRiesgo, backgroundColor: riesgo.bg, color: riesgo.color }}>
                                                    {riesgo.texto}
                                                </div>
                                            </div>

                                            <div style={estilos.datosGrid}>
                                                {[
                                                    { label: '📝 Promedio', valor: r.datos.promedio_notas || 'Sin notas' },
                                                    { label: '📋 Ausencias', valor: `${r.datos.ausencias}/${r.datos.total_asistencias}` },
                                                    { label: '📚 Tareas pend.', valor: `${r.datos.tareas_pendientes}/${r.datos.total_tareas}` },
                                                    { label: '😊 Conducta neg.', valor: r.datos.conductas_malas },
                                                ].map((d, j) => (
                                                    <div key={j} style={estilos.dato}>
                                                        <span style={estilos.datoLabel}>{d.label}</span>
                                                        <span style={estilos.datoValor}>{d.valor}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {r.riesgo.factores.length > 0 && (
                                                <div style={estilos.factoresDetectados}>
                                                    <div style={estilos.factoresTitulo}>⚠️ Factores de riesgo detectados:</div>
                                                    <div style={estilos.factoresLista}>
                                                        {r.riesgo.factores.map((f, j) => (
                                                            <span key={j} style={estilos.factorChip}>• {f}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {r.riesgo.factores.length === 0 && (
                                                <div style={estilos.sinFactores}>
                                                    ✓ Sin factores de riesgo detectados
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
    contenedor: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
    navbar: { backgroundColor: 'white', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 },
    botonVolver: { background: 'none', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', color: '#374151', fontSize: '14px' },
    navTitulo: { display: 'flex', alignItems: 'center', gap: '10px' },
    navIcono: { fontSize: '24px' },
    titulo: { color: '#1e293b', margin: 0, fontSize: '20px', fontWeight: '700' },
    contenido: { padding: '24px 32px' },
    error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
    heroBanner: { backgroundColor: 'white', borderRadius: '14px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' },
    heroTexto: { marginBottom: '20px' },
    heroTitulo: { color: '#1e293b', margin: '0 0 8px', fontSize: '18px', fontWeight: '700' },
    heroDesc: { color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 },
    factoresGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' },
    factor: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', gap: '4px' },
    factorIcon: { fontSize: '28px' },
    factorLabel: { fontSize: '13px', color: '#374151', fontWeight: '600' },
    factorPeso: { fontSize: '18px', fontWeight: '800' },
    botonAnalizar: { background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', width: '100%', letterSpacing: '0.3px' },
    resumenGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
    resumenCard: { padding: '20px', borderRadius: '12px', textAlign: 'center' },
    resumenIcono: { fontSize: '28px', marginBottom: '8px' },
    resumenNum: { fontSize: '36px', fontWeight: '800' },
    resumenLabel: { fontSize: '13px', fontWeight: '600', marginTop: '4px' },
    listaResultados: { display: 'flex', flexDirection: 'column', gap: '14px' },
    tarjetaResultado: { backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
    resultadoHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    estudianteInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    estudianteAvatar: { width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '15px', flexShrink: 0 },
    nombreEstudiante: { fontWeight: '700', color: '#1e293b', fontSize: '16px' },
    gradoEstudiante: { color: '#64748b', fontSize: '13px', marginTop: '2px' },
    badgeRiesgo: { padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' },
    datosGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' },
    dato: { display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px' },
    datoLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '600' },
    datoValor: { fontSize: '18px', fontWeight: '800', color: '#1e293b', marginTop: '4px' },
    factoresDetectados: { backgroundColor: '#fef3c7', padding: '12px 16px', borderRadius: '8px', border: '1px solid #fde68a' },
    factoresTitulo: { fontWeight: '700', color: '#d97706', fontSize: '13px', marginBottom: '8px' },
    factoresLista: { display: 'flex', flexDirection: 'column', gap: '4px' },
    factorChip: { color: '#92400e', fontSize: '13px' },
    sinFactores: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
};

export default Ia;