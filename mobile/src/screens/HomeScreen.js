import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const HomeScreen = () => {
    const { usuario, logout } = useAuth();
    const [hijos, setHijos] = useState([]);
    const [hijoSeleccionado, setHijoSeleccionado] = useState(null);
    const [asistencia, setAsistencia] = useState([]);
    const [notas, setNotas] = useState([]);
    const [promedio, setPromedio] = useState(null);
    const [tareas, setTareas] = useState([]);
    const [conducta, setConducta] = useState([]);
    const [notificaciones, setNotificaciones] = useState([]);
    const [pestana, setPestana] = useState('asistencia');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarTodo();
    }, []);

    const cargarTodo = async () => {
        try {
            const resp = await api.get('/estudiantes');
            const misHijos = resp.data.filter(e => String(e.tutor_id) === String(usuario.id));
            setHijos(misHijos);
            if (misHijos.length > 0) {
                await cargarDatosHijo(misHijos[0]);
                setHijoSeleccionado(misHijos[0]);
            }
            try {
                const rNotif = await api.get(`/notificaciones/${usuario.id}`);
                setNotificaciones(rNotif.data);
            } catch (e) {}
        } catch (err) {
            console.log(err);
        } finally {
            setCargando(false);
        }
    };

    const cargarDatosHijo = async (hijo) => {
        try {
            const [rA, rN, rP, rT, rC] = await Promise.all([
                api.get(`/asistencia/estudiante/${hijo.id}`),
                api.get(`/notas/estudiante/${hijo.id}`),
                api.get(`/notas/promedio/${hijo.id}`),
                api.get(`/tareas/estudiante/${hijo.id}`),
                api.get(`/conducta/estudiante/${hijo.id}`),
            ]);
            setAsistencia(rA.data);
            setNotas(rN.data);
            setPromedio(rP.data);
            setTareas(rT.data.tareas);
            setConducta(rC.data);
        } catch (err) {
            console.log(err);
        }
    };

    const seleccionarHijo = async (hijo) => {
        setHijoSeleccionado(hijo);
        setAsistencia([]); setNotas([]); setPromedio(null); setTareas([]); setConducta([]);
        await cargarDatosHijo(hijo);
    };

    const colorNota = (v) => v >= 70 ? '#34d399' : v >= 51 ? '#fbbf24' : '#f87171';
    const colorAsis = {
        presente: { c: '#34d399', bg: 'rgba(52,211,153,0.12)' },
        ausente: { c: '#f87171', bg: 'rgba(248,113,113,0.12)' },
        tardanza: { c: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
    };
    const colorConducta = {
        excelente: { c: '#34d399', bg: 'rgba(52,211,153,0.12)' },
        bueno: { c: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
        regular: { c: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
        malo: { c: '#f87171', bg: 'rgba(248,113,113,0.12)' },
    };

    if (cargando) return (
        <View style={[styles.contenedor, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#FFD700" />
        </View>
    );

    const pestanas = ['asistencia', 'notas', 'tareas', 'conducta', 'notificaciones'];

    return (
        <ScrollView style={styles.contenedor}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.headerLogo}>
                        <Image source={require('../../assets/icon.png')} style={styles.logoImg} />
                        <View>
                            <Text style={styles.institucion}>U.E. Adventista Salomón</Text>
                            <Text style={styles.portalTexto}>Portal de Padres</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={logout} style={styles.botonSalir}>
                        <Text style={styles.botonSalirTexto}>Salir</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.usuarioRow}>
                    <View style={styles.usuarioAvatar}>
                        <Text style={styles.usuarioAvatarTexto}>{usuario?.nombre[0]}{usuario?.apellido[0]}</Text>
                    </View>
                    <View>
                        <Text style={styles.usuarioNombre}>{usuario?.nombre} {usuario?.apellido}</Text>
                        <Text style={styles.usuarioEmail}>{usuario?.email}</Text>
                    </View>
                </View>
            </View>

            {hijos.length === 0 ? (
                <View style={styles.vacioBox}>
                    <Text style={styles.vacioTexto}>No tienes estudiantes asignados. Contacta a la institución.</Text>
                </View>
            ) : (
                <View style={styles.contenido}>
                    {/* Selector de hijo */}
                    {hijos.length > 1 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hijosRow}>
                            {hijos.map(h => (
                                <TouchableOpacity
                                    key={h.id}
                                    onPress={() => seleccionarHijo(h)}
                                    style={[styles.hijoChip, hijoSeleccionado?.id === h.id && styles.hijoChipActivo]}
                                >
                                    <Text style={[styles.hijoChipTexto, hijoSeleccionado?.id === h.id && styles.hijoChipTextoActivo]}>
                                        {h.nombre} {h.apellido}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    {/* Info del hijo */}
                    {hijoSeleccionado && (
                        <View style={styles.hijoInfo}>
                            <View style={styles.hijoAvatar}>
                                <Text style={styles.hijoAvatarTexto}>{hijoSeleccionado.nombre[0]}{hijoSeleccionado.apellido[0]}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.hijoNombre}>{hijoSeleccionado.nombre} {hijoSeleccionado.apellido}</Text>
                                <Text style={styles.hijoGrado}>Grado {hijoSeleccionado.grado} · Sección {hijoSeleccionado.seccion}</Text>
                            </View>
                            {promedio && (
                                <View style={styles.promedioBox}>
                                    <Text style={styles.promedioLabel}>Promedio</Text>
                                    <Text style={[styles.promedioValor, { color: colorNota(promedio.promedio_general) }]}>
                                        {promedio.promedio_general || '—'}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Pestañas */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pestanasRow}>
                        {pestanas.map(p => (
                            <TouchableOpacity
                                key={p}
                                onPress={() => setPestana(p)}
                                style={[styles.pestana, pestana === p && styles.pestanaActiva]}
                            >
                                <Text style={[styles.pestanaTexto, pestana === p && styles.pestanaTextoActivo]}>
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Contenido */}
                    <View style={styles.panel}>
                        {pestana === 'asistencia' && (
                            asistencia.length === 0 ? <Text style={styles.vacio}>Sin registros de asistencia</Text> :
                            asistencia.map((a, i) => (
                                <View key={i} style={[styles.fila, { borderLeftColor: colorAsis[a.estado]?.c }]}>
                                    <Text style={styles.filaTexto}>{new Date(a.fecha).toLocaleDateString()}</Text>
                                    <View style={[styles.badge, { backgroundColor: colorAsis[a.estado]?.bg }]}>
                                        <Text style={[styles.badgeTexto, { color: colorAsis[a.estado]?.c }]}>{a.estado}</Text>
                                    </View>
                                </View>
                            ))
                        )}

                        {pestana === 'notas' && (
                            notas.length === 0 ? <Text style={styles.vacio}>Sin notas registradas</Text> :
                            notas.map((n, i) => (
                                <View key={i} style={styles.fila}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.notaMateria}>{n.materia}</Text>
                                        <Text style={styles.notaParcial}>{n.parcial} parcial</Text>
                                    </View>
                                    <Text style={[styles.notaValor, { color: colorNota(n.valor) }]}>{n.valor}</Text>
                                </View>
                            ))
                        )}

                        {pestana === 'tareas' && (
                            tareas.length === 0 ? <Text style={styles.vacio}>Sin tareas registradas</Text> :
                            tareas.map((t, i) => (
                                <View key={i} style={[styles.fila, { borderLeftColor: t.entregada ? '#34d399' : '#f87171' }]}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.notaMateria}>{t.materia}</Text>
                                        <Text style={styles.tareaDesc}>{t.descripcion}</Text>
                                    </View>
                                    <View style={[styles.badge, { backgroundColor: t.entregada ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)' }]}>
                                        <Text style={[styles.badgeTexto, { color: t.entregada ? '#34d399' : '#f87171' }]}>
                                            {t.entregada ? 'Entregada' : 'Pendiente'}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        )}

                        {pestana === 'conducta' && (
                            conducta.length === 0 ? <Text style={styles.vacio}>Sin registros de conducta</Text> :
                            conducta.map((c, i) => (
                                <View key={i} style={[styles.fila, { borderLeftColor: colorConducta[c.nivel]?.c }]}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.tareaDesc}>{c.descripcion || 'Sin descripción'}</Text>
                                        <Text style={styles.notaParcial}>{new Date(c.fecha).toLocaleDateString()}</Text>
                                    </View>
                                    <View style={[styles.badge, { backgroundColor: colorConducta[c.nivel]?.bg }]}>
                                        <Text style={[styles.badgeTexto, { color: colorConducta[c.nivel]?.c }]}>{c.nivel}</Text>
                                    </View>
                                </View>
                            ))
                        )}

                        {pestana === 'notificaciones' && (
                            notificaciones.length === 0 ? <Text style={styles.vacio}>Sin notificaciones</Text> :
                            notificaciones.map((n, i) => (
                                <View key={i} style={[styles.fila, { borderLeftColor: n.leida ? 'rgba(255,255,255,0.1)' : '#FFD700' }]}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.notifTexto}>{n.mensaje}</Text>
                                        <Text style={styles.notaParcial}>{new Date(n.created_at).toLocaleDateString()}</Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>

                    <Text style={styles.footer}>© {new Date().getFullYear()} U.E. Adventista Salomón</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: '#001040' },
    header: { backgroundColor: '#001a5c', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    headerLogo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    logoImg: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: '#FFD700' },
    institucion: { color: 'white', fontWeight: '700', fontSize: 14 },
    portalTexto: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
    botonSalir: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8 },
    botonSalirTexto: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
    usuarioRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    usuarioAvatar: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center' },
    usuarioAvatarTexto: { color: '#001a5c', fontWeight: '800', fontSize: 14 },
    usuarioNombre: { color: 'white', fontWeight: '600', fontSize: 14 },
    usuarioEmail: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
    vacioBox: { padding: 40, alignItems: 'center' },
    vacioTexto: { color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
    contenido: { padding: 16 },
    hijosRow: { flexDirection: 'row', marginBottom: 14 },
    hijoChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginRight: 8 },
    hijoChipActivo: { backgroundColor: '#FFD700', borderColor: '#FFD700' },
    hijoChipTexto: { color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: 13 },
    hijoChipTextoActivo: { color: '#001a5c' },
    hijoInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, marginBottom: 16 },
    hijoAvatar: { width: 46, height: 46, borderRadius: 10, backgroundColor: 'rgba(255,215,0,0.15)', justifyContent: 'center', alignItems: 'center' },
    hijoAvatarTexto: { color: '#FFD700', fontWeight: '800', fontSize: 16 },
    hijoNombre: { color: 'white', fontWeight: '700', fontSize: 16 },
    hijoGrado: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
    promedioBox: { alignItems: 'center' },
    promedioLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 10, textTransform: 'uppercase' },
    promedioValor: { fontSize: 24, fontWeight: '800' },
    pestanasRow: { flexDirection: 'row', marginBottom: 14 },
    pestana: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginRight: 8 },
    pestanaActiva: { backgroundColor: '#FFD700', borderColor: '#FFD700' },
    pestanaTexto: { color: 'rgba(255,255,255,0.4)', fontWeight: '600', fontSize: 13 },
    pestanaTextoActivo: { color: '#001a5c' },
    panel: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: 8, minHeight: 200 },
    fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)', borderLeftWidth: 3, borderLeftColor: 'transparent' },
    filaTexto: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
    badge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20 },
    badgeTexto: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
    notaMateria: { color: '#93c5fd', fontWeight: '700', fontSize: 13 },
    notaParcial: { color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 },
    notaValor: { fontSize: 22, fontWeight: '800' },
    tareaDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
    notifTexto: { color: 'white', fontSize: 13, lineHeight: 18 },
    vacio: { color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 30 },
    footer: { textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 11, padding: 20 },
});

export default HomeScreen;