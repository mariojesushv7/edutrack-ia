import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const NotasScreen = () => {
    const [notas, setNotas] = useState([]);
    const [promedio, setPromedio] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const { usuario } = useAuth();

    useEffect(() => {
        cargarNotas();
    }, []);

    const cargarNotas = async () => {
        try {
            const estudiantes = await api.get('/estudiantes');
            const misHijos = estudiantes.data.filter(e => e.tutor_email === usuario.email);

            if (misHijos.length > 0) {
                const [respNotas, respPromedio] = await Promise.all([
                    api.get(`/notas/estudiante/${misHijos[0].id}`),
                    api.get(`/notas/promedio/${misHijos[0].id}`)
                ]);
                setNotas(respNotas.data);
                setPromedio(respPromedio.data);
            }
        } catch (err) {
            setError('Error al cargar notas');
        } finally {
            setCargando(false);
        }
    };

    const colorNota = (valor) => {
        if (valor >= 70) return '#16a34a';
        if (valor >= 51) return '#d97706';
        return '#dc2626';
    };

    if (cargando) return (
        <View style={styles.centrado}>
            <ActivityIndicator size="large" color="#1e40af" />
        </View>
    );

    return (
        <ScrollView style={styles.contenedor}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Notas</Text>
            </View>

            {promedio && (
                <View style={styles.promedioBox}>
                    <Text style={styles.promedioLabel}>Promedio general</Text>
                    <Text style={[styles.promedioValor, { color: colorNota(promedio.promedio_general) }]}>
                        {promedio.promedio_general || 'Sin notas'}
                    </Text>
                </View>
            )}

            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : notas.length === 0 ? (
                <Text style={styles.vacio}>Sin notas registradas</Text>
            ) : (
                <View style={styles.lista}>
                    {notas.map((n, i) => (
                        <View key={i} style={styles.item}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.materia}>{n.materia}</Text>
                                <Text style={styles.parcial}>{n.parcial} parcial</Text>
                                {n.observacion ? <Text style={styles.observacion}>{n.observacion}</Text> : null}
                            </View>
                            <Text style={[styles.nota, { color: colorNota(n.valor) }]}>{n.valor}</Text>
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
    promedioBox: { backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
    promedioLabel: { color: '#64748b', fontSize: 14 },
    promedioValor: { fontSize: 36, fontWeight: 'bold', marginTop: 4 },
    error: { color: '#dc2626', padding: 20, textAlign: 'center' },
    vacio: { color: '#94a3b8', padding: 20, textAlign: 'center' },
    lista: { padding: 16 },
    item: { backgroundColor: 'white', borderRadius: 8, padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
    itemInfo: { flex: 1 },
    materia: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
    parcial: { fontSize: 12, color: '#64748b', marginTop: 2, textTransform: 'capitalize' },
    observacion: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
    nota: { fontSize: 28, fontWeight: 'bold' },
});

export default NotasScreen;