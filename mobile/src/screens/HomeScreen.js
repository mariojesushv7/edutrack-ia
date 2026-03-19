import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
    const { usuario, logout } = useAuth();

    const modulos = [
        { titulo: 'Asistencia', icono: '📋', descripcion: 'Ver asistencia de tu hijo', pantalla: 'Asistencia' },
        { titulo: 'Notas', icono: '📝', descripcion: 'Ver calificaciones', pantalla: 'Notas' },
        { titulo: 'Tareas', icono: '📚', descripcion: 'Ver tareas asignadas', pantalla: 'Tareas' },
        { titulo: 'Notificaciones', icono: '🔔', descripcion: 'Ver alertas recibidas', pantalla: 'Notificaciones' },
    ];

    return (
        <ScrollView style={styles.contenedor}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.bienvenida}>Hola, {usuario?.nombre}</Text>
                    <Text style={styles.subtitulo}>Portal de Padres</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.botonSalir}>
                    <Text style={styles.botonSalirTexto}>Salir</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contenido}>
                <Text style={styles.seccionTitulo}>¿Qué deseas ver?</Text>
                <View style={styles.grid}>
                    {modulos.map((m, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.tarjeta}
                            onPress={() => navigation.navigate(m.pantalla)}
                        >
                            <Text style={styles.icono}>{m.icono}</Text>
                            <Text style={styles.tarjetaTitulo}>{m.titulo}</Text>
                            <Text style={styles.tarjetaDesc}>{m.descripcion}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: '#f0f4f8' },
    header: { backgroundColor: '#1e40af', padding: 24, paddingTop: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    bienvenida: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    subtitulo: { color: '#bfdbfe', fontSize: 13, marginTop: 2 },
    botonSalir: { borderWidth: 1, borderColor: 'white', padding: 8, borderRadius: 6 },
    botonSalirTexto: { color: 'white', fontSize: 13 },
    contenido: { padding: 20 },
    seccionTitulo: { fontSize: 16, fontWeight: '600', color: '#64748b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    tarjeta: { backgroundColor: 'white', borderRadius: 12, padding: 20, alignItems: 'center', width: '47%', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
    icono: { fontSize: 36, marginBottom: 8 },
    tarjetaTitulo: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 4 },
    tarjetaDesc: { fontSize: 12, color: '#64748b', textAlign: 'center' },
});

export default HomeScreen;