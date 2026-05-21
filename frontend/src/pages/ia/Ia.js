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
            const r = await api.get('/ia/analizar');
            setResultados(r.data);
        } catch { setError('Error al analizar estudiantes'); }
        finally { setCargando(false); }
    };

    const colorRiesgo = (nivel) => {
        if (nivel === 'alto') return { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', texto: 'Riesgo Alto' };
        if (nivel === 'medio') return { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', texto: 'Riesgo Medio' };
        return { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', texto: 'Riesgo Bajo' };
    };

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.fondo} />
            <div style={estilos.circulo1} />
            <div style={estilos.inner}>
                <div style={estilos.navbar}>
                    <div style={estilos.navIzq}>
                        <button onClick={() => navigate('/dashboard')} style={estilos.botonVolver}>← Volver</button>
                        <div>
                            <div style={estilos.navTituloTexto}>Análisis de Riesgo</div>
                            <div style={estilos.navSubtitulo}>Inteligencia Artificial · Detección temprana</div>
                        </div>
                    </div>
                </div>

                <div style={estilos.contenido}>
                    {error && <div style={estilos.error}>⚠ {error}</div>}

                    <div style={estilos.heroBanner}>
                        <div style={estilos.heroIzq}>
                            <div style={estilos.heroTitulo}>Sistema de detección de riesgo académico</div>
                            <div style={estilos.heroDesc}>
                                El sistema analiza automáticamente las notas, asistencia, tareas y conducta de cada estudiante
                                para identificar quiénes necesitan atención inmediata.
                            </div>
                            <div style={estilos.factoresRow}>
                                {[
                                    { label: 'Notas', peso: '40%', color: '#60a5fa' },
                                    { label: 'Asistencia', peso: '30%', color: '#34d399' },
                                    { label: 'Tareas', peso: '20%', color: '#fbbf24' },
                                    { label: 'Conducta', peso: '10%', color: '#c084fc' },
                                ].map((f, i) => (
                                    <div key={i} style={{ ...estilos.factorChip, borderColor: f.color + '40' }}>
                                        <span style={{ color: f.color, fontWeight: '700' }}>{f.peso}</span>
                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{f.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={analizarEstudiantes} disabled={cargando} style={{ ...estilos.botonAnalizar, opacity: cargando ? 0.7 : 1 }}>
                            {cargando ? 'Analizando...' : 'Iniciar análisis'}
                        </button>
                    </div>

                    {resultados && (
                        <>
                            <div style={estilos.resumenGrid}>
                                {[
                                    { num: resultados.en_riesgo_alto, label: 'Riesgo Alto', color: '#f87171' },
                                    { num: resultados.en_riesgo_medio, label: 'Riesgo Medio', color: '#fbbf24' },
                                    { num: resultados.en_riesgo_bajo, label: 'Riesgo Bajo', color: '#34d399' },
                                    { num: resultados.total, label: 'Total analizados', color: '#60a5fa' },
                                ].map((s, i) => (
                                    <div key={i} style={{ ...estilos.resumenCard, borderTop: `2px solid ${s.color}` }}>
                                        <div style={{ ...estilos.resumenNum, color: s.color }}>{s.num}</div>
                                        <div style={estilos.resumenLabel}>{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={estilos.separador}>
                                <div style={estilos.separadorLinea} />
                                <span style={estilos.separadorTexto}>RESULTADOS POR ESTUDIANTE</span>
                                <div style={estilos.separadorLinea} />
                            </div>

                            <div style={estilos.listaResultados}>
                                {resultados.resultados
                                    .sort((a, b) => b.riesgo.puntos - a.riesgo.puntos)
                                    .map((r, i) => {
                                        const riesgo = colorRiesgo(r.riesgo.nivel);
                                        return (
                                            <div key={i} style={{ ...estilos.tarjetaResultado, borderLeft: `3px solid ${riesgo.color}` }}>
                                                <div style={estilos.resultadoHeader}>
                                                    <div style={estilos.estudianteInfo}>
                                                        <div style={estilos.avatar}>{r.estudiante.nombre[0]}{r.estudiante.apellido[0]}</div>
                                                        <div>
                                                            <div style={estilos.nombreEstudiante}>{r.estudiante.nombre} {r.estudiante.apellido}</div>
                                                            <div style={estilos.gradoEstudiante}>Grado {r.estudiante.grado} · {r.estudiante.seccion}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ ...estilos.badgeRiesgo, backgroundColor: riesgo.bg, color: riesgo.color, border: `1px solid ${riesgo.border}` }}>
                                                        {riesgo.texto}
                                                    </div>
                                                </div>

                                                <div style={estilos.datosGrid}>
                                                    {[
                                                        { label: 'Promedio', valor: r.datos.promedio_notas || '—' },
                                                        { label: 'Ausencias', valor: `${r.datos.ausencias}/${r.datos.total_asistencias}` },
                                                        { label: 'Tareas pend.', valor: `${r.datos.tareas_pendientes}/${r.datos.total_tareas}` },
                                                        { label: 'Conducta neg.', valor: r.datos.conductas_malas },
                                                    ].map((d, j) => (
                                                        <div key={j} style={estilos.dato}>
                                                            <div style={estilos.datoLabel}>{d.label}</div>
                                                            <div style={estilos.datoValor}>{d.valor}</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {r.riesgo.factores.length > 0 && (
                                                    <div style={estilos.factoresBox}>
                                                        <div style={estilos.factoresTitulo}>Factores detectados</div>
                                                        {r.riesgo.factores.map((f, j) => (
                                                            <div key={j} style={estilos.factorItem}>· {f}</div>
                                                        ))}
                                                    </div>
                                                )}

                                                {r.riesgo.factores.length === 0 && (
                                                    <div style={estilos.sinFactores}>Sin factores de riesgo detectados</div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        </>
                    )}
                </div>
                <div style={estilos.footer}><span>© {new Date().getFullYear()} Unidad Educativa Adventista Salomón</span></div>
            </div>
        </div>
    );
};

const estilos = {
    contenedor: { minHeight: '100vh', background: 'linear-gradient(140deg, #000d2e 0%, #001a5c 40%, #002d8a 100%)', position: 'relative', overflow: 'hidden' },
    fondo: { position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 41px)` },
    circulo1: { position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,220,0.12) 0%, transparent 65%)', filter: 'blur(80px)', top: '-200px', right: '-150px' },
    inner: { position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    navbar: { backgroundColor: 'rgba(0,8,30,0.7)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '14px 40px', display: 'flex', alignItems: 'center' },
    navIzq: { display: 'flex', alignItems: 'center', gap: '20px' },
    botonVolver: { backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
    navTituloTexto: { color: 'white', fontWeight: '700', fontSize: '16px' },
    navSubtitulo: { color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '2px' },
    contenido: { padding: '32px 40px', flex: 1 },
    error: { backgroundColor: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', color: '#fca5a5', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
    heroBanner: { backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' },
    heroIzq: { flex: 1 },
    heroTitulo: { color: 'white', fontWeight: '700', fontSize: '17px', marginBottom: '8px' },
    heroDesc: { color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px', maxWidth: '500px' },
    factoresRow: { display: 'flex', gap: '10px' },
    factorChip: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid', borderRadius: '8px', gap: '2px' },
    botonAnalizar: { backgroundColor: '#FFD700', color: '#001a5c', border: 'none', padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '14px', whiteSpace: 'nowrap', letterSpacing: '0.3px' },
    resumenGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' },
    resumenCard: { backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px 20px', textAlign: 'center' },
    resumenNum: { fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' },
    resumenLabel: { color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '4px' },
    separador: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' },
    separadorLinea: { flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' },
    separadorTexto: { color: 'rgba(255,255,255,0.2)', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', whiteSpace: 'nowrap' },
    listaResultados: { display: 'flex', flexDirection: 'column', gap: '10px' },
    tarjetaResultado: { backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' },
    resultadoHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    estudianteInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: { width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,215,0,0.1)', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px' },
    nombreEstudiante: { color: 'white', fontWeight: '700', fontSize: '14px' },
    gradoEstudiante: { color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '2px' },
    badgeRiesgo: { padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
    datosGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', backgroundColor: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.04)' },
    dato: { padding: '12px 20px', backgroundColor: 'rgba(0,10,40,0.3)' },
    datoLabel: { color: 'rgba(255,255,255,0.25)', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
    datoValor: { color: 'white', fontSize: '18px', fontWeight: '700', marginTop: '4px' },
    factoresBox: { padding: '12px 20px', backgroundColor: 'rgba(251,191,36,0.04)', borderTop: '1px solid rgba(251,191,36,0.1)' },
    factoresTitulo: { color: '#fbbf24', fontSize: '11px', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    factorItem: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '3px' },
    sinFactores: { padding: '10px 20px', color: 'rgba(52,211,153,0.6)', fontSize: '12px', borderTop: '1px solid rgba(52,211,153,0.08)' },
    footer: { display: 'flex', justifyContent: 'center', padding: '14px 40px', color: 'rgba(255,255,255,0.15)', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.05)' },
};

export default Ia;