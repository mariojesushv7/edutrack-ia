import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const NotificacionesScreen = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const { usuario } = useAuth();

    useEffect(() => {
        cargarNotificaciones();
    }, []);

    const cargarNotificaciones = async () => {
        try {
            const respuesta = await api.get(`/notificaciones/${usuario.id}`);
            setNotificaciones(respuesta.data);
        } catch (err) {
            setError('Error al cargar notificaciones');
        } finally {
            setCargando(false);
        }
    };

    const iconoTipo = (tipo) => {
        if (tipo === 'ausencia') return '📋';
        if (tipo === 'tarea') return '📚';
        if (tipo === 'nota') return '📝';
        if (tipo === 'conducta') return '😊';
        if (tipo === 'riesgo') return '⚠️';
        return '🔔';
    };

    if (cargando) return (
        <View style={styles.centrado}>
            <ActivityIndicator size="large" color="#1e40af" />
        </View>
    );

    return (
        <ScrollView style={styles.contenedor}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Notificaciones</Text>
            </View>

            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : notificaciones.length === 0 ? (
                <Text style={styles.vacio}>Sin notificaciones</Text>
            ) : (
                <View style={styles.lista}>
                    {notificaciones.map((n, i) => (
                        <View key={i} style={[styles.item, !n.leida && styles.itemNoLeido]}>
                            <Text style={styles.icono}>{iconoTipo(n.tipo)}</Text>
                            <View style={styles.itemInfo}>
                                <Text style={styles.mensaje}>{n.mensaje}</Text>
                                <Text style={styles.fecha}>{new Date(n.created_at).toLocaleDateString()}</Text>
                            </View>
                            {!n.leida && <View style={styles.puntito} />}
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
    error: { color: '#dc2626', padding: 20, textAlign: 'center' },
    vacio: { color: '#94a3b8', padding: 20, textAlign: 'center' },
    lista: { padding: 16 },
    item: { backgroundColor: 'white', borderRadius: 8, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-start', elevation: 2 },
    itemNoLeido: { borderLeftWidth: 3, borderLeftColor: '#1e40af' },
    icono: { fontSize: 24, marginRight: 12 },
    itemInfo: { flex: 1 },
    mensaje: { fontSize: 14, color: '#1e293b', lineHeight: 20 },
    fecha: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
    puntito: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1e40af', marginTop: 4 },
});

export default NotificacionesScreen;
