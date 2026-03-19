import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TareasScreen = () => {
    const [tareas, setTareas] = useState([]);
    const [resumen, setResumen] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const { usuario } = useAuth();

    useEffect(() => {
        cargarTareas();
    }, []);

    const cargarTareas = async () => {
        try {
            const estudiantes = await api.get('/estudiantes');
            const misHijos = estudiantes.data.filter(e => e.tutor_email === usuario.email);

            if (misHijos.length > 0) {
                const respuesta = await api.get(`/tareas/estudiante/${misHijos[0].id}`);
                setTareas(respuesta.data.tareas);
                setResumen(respuesta.data.resumen);
            }
        } catch (err) {
            setError('Error al cargar tareas');
        } finally {
            setCargando(false);
        }
    };

    if (cargando) return (
        <View style={styles.centrado}>
            <ActivityIndicator size="large" color="#1e40af" />
        </View>
    );

    return (
        <ScrollView style={styles.contenedor}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Tareas</Text>
            </View>

            {resumen && (
                <View style={styles.resumenBox}>
                    <View style={styles.resumenItem}>
                        <Text style={styles.resumenNum}>{resumen.total}</Text>
                        <Text style={styles.resumenLabel}>Total</Text>
                    </View>
                    <View style={styles.resumenItem}>
                        <Text style={[styles.resumenNum, { color: '#16a34a' }]}>{resumen.entregadas}</Text>
                        <Text style={styles.resumenLabel}>Entregadas</Text>
                    </View>
                    <View style={styles.resumenItem}>
                        <Text style={[styles.resumenNum, { color: '#dc2626' }]}>{resumen.pendientes}</Text>
                        <Text style={styles.resumenLabel}>Pendientes</Text>
                    </View>
                </View>
            )}

            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : tareas.length === 0 ? (
                <Text style={styles.vacio}>Sin tareas registradas</Text>
            ) : (
                <View style={styles.lista}>
                    {tareas.map((t, i) => (
                        <View key={i} style={styles.item}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.materia}>{t.materia}</Text>
                                <Text style={styles.descripcion}>{t.descripcion}</Text>
                                <Text style={styles.fecha}>Asignada: {new Date(t.fecha_asignacion).toLocaleDateString()}</Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: t.entregada ? '#dcfce7' : '#fee2e2' }]}>
                                <Text style={[styles.badgeTexto, { color: t.entregada ? '#16a34a' : '#dc2626' }]}>
                                    {t.entregada ? '✓ Entregada' : '✗ Pendiente'}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: '#f0f4f8' },
    centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { backgroundColor: '#1e40af', padding: 24, paddingTop: 48 },
    titulo: { color: 'white', fontSize: 22, fontWeight: 'bold' },
    resumenBox: { backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-around', elevation: 2 },
    resumenItem: { alignItems: 'center' },
    resumenNum: { fontSize: 28, fontWeight: 'bold', color: '#1e293b' },
    resumenLabel: { fontSize: 12, color: '#64748b', marginTop: 2 },
    error: { color: '#dc2626', padding: 20, textAlign: 'center' },
    vacio: { color: '#94a3b8', padding: 20, textAlign: 'center' },
    lista: { padding: 16 },
    item: { backgroundColor: 'white', borderRadius: 8, padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
    itemInfo: { flex: 1, marginRight: 10 },
    materia: { fontSize: 15, fontWeight: '600', color: '#1e40af' },
    descripcion: { fontSize: 13, color: '#374151', marginTop: 2 },
    fecha: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
    badge: { padding: 6, paddingHorizontal: 10, borderRadius: 20 },
    badgeTexto: { fontSize: 12, fontWeight: '600' },
});

export default TareasScreen;