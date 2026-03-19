import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AsistenciaScreen = () => {
    const [asistencias, setAsistencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const { usuario } = useAuth();

    useEffect(() => {
        cargarAsistencia();
    }, []);

    const cargarAsistencia = async () => {
        try {
            const estudiantes = await api.get('/estudiantes');
            const misHijos = estudiantes.data.filter(e => e.tutor_id === usuario.id || e.tutor_email === usuario.email);
            
            if (misHijos.length > 0) {
                const respuesta = await api.get(`/asistencia/estudiante/${misHijos[0].id}`);
                setAsistencias(respuesta.data);
            }
        } catch (err) {
            setError('Error al cargar asistencia');
        } finally {
            setCargando(false);
        }
    };

    const colorEstado = (estado) => {
        if (estado === 'presente') return { bg: '#dcfce7', color: '#16a34a', texto: '✓ Presente' };
        if (estado === 'tardanza') return { bg: '#fef3c7', color: '#d97706', texto: '⚠ Tardanza' };
        return { bg: '#fee2e2', color: '#dc2626', texto: '✗ Ausente' };
    };

    if (cargando) return (
        <View style={styles.centrado}>
            <ActivityIndicator size="large" color="#1e40af" />
        </View>
    );

    return (
        <ScrollView style={styles.contenedor}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Asistencia</Text>
            </View>

            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : asistencias.length === 0 ? (
                <Text style={styles.vacio}>Sin registros de asistencia</Text>
            ) : (
                <View style={styles.lista}>
                    {asistencias.map((a, i) => {
                        const estado = colorEstado(a.estado);
                        return (
                            <View key={i} style={styles.item}>
                                <View style={styles.itemFecha}>
                                    <Text style={styles.fecha}>{new Date(a.fecha).toLocaleDateString()}</Text>
                                    <Text style={styles.docente}>{a.docente_nombre}</Text>
                                </View>
                                <View style={[styles.badge, { backgroundColor: estado.bg }]}>
                                    <Text style={[styles.badgeTexto, { color: estado.color }]}>{estado.texto}</Text>
                                </View>
                            </View>
                        );
                    })}
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
    error: { color: '#dc2626', padding: 20, textAlign: 'center' },
    vacio: { color: '#94a3b8', padding: 20, textAlign: 'center' },
    lista: { padding: 16 },
    item: { backgroundColor: 'white', borderRadius: 8, padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
    itemFecha: { flex: 1 },
    fecha: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
    docente: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
    badge: { padding: 6, paddingHorizontal: 12, borderRadius: 20 },
    badgeTexto: { fontSize: 13, fontWeight: '600' },
});

export default AsistenciaScreen;