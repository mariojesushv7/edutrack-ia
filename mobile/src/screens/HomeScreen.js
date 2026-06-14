import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
    const { usuario, logout } = useAuth();

    const modulos = [
        { titulo: 'Asistencia', descripcion: 'Control de asistencia diaria', pantalla: 'Asistencia', color: '#34d399' },
        { titulo: 'Notas', descripcion: 'Calificaciones del estudiante', pantalla: 'Notas', color: '#fbbf24' },
        { titulo: 'Tareas', descripcion: 'Seguimiento de tareas', pantalla: 'Tareas', color: '#f87171' },
        { titulo: 'Notificaciones', descripcion: 'Alertas y avisos', pantalla: 'Notificaciones', color: '#c084fc' },
    ];

    return (
        <ScrollView style={styles.contenedor}>
            <View style={styles.header}>
                <View style={styles.headerIzq}>
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

            <View style={styles.bienvenida}>
                <Text style={styles.saludoTexto}>Bienvenido/a,</Text>
                <Text style={styles.nombreTexto}>{usuario?.nombre} {usuario?.apellido}</Text>
                <View style={styles.rolBadge}>
                    <Text style={styles.rolTexto}>Padre de familia</Text>
                </View>
            </View>

            <View style={styles.contenido}>
                <Text style={styles.seccionTitulo}>MÓDULOS</Text>
                {modulos.map((m, i) => (
                    <TouchableOpacity
                        key={i}
                        style={styles.tarjeta}
                        onPress={() => navigation.navigate(m.pantalla)}
                    >
                        <View style={{ ...styles.tarjetaAccent, backgroundColor: m.color }} />
                        <View style={styles.tarjetaContenido}>
                            <Text style={styles.tarjetaTitulo}>{m.titulo}</Text>
                            <Text style={styles.tarjetaDesc}>{m.descripcion}</Text>
                        </View>
                        <Text style={{ ...styles.tarjetaFlecha, color: m.color }}>→</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.footer}>© {new Date().getFullYear()} U.E. Adventista Salomón</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: '#001040' },
    header: {
        backgroundColor: '#001a5c',
        padding: 20,
        paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerIzq: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    logoImg: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: '#FFD700' },
    institucion: { color: 'white', fontWeight: '700', fontSize: 14 },
    portalTexto: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 },
    botonSalir: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        padding: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    botonSalirTexto: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
    bienvenida: {
        padding: 28,
        paddingBottom: 16,
    },
    saludoTexto: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
    nombreTexto: { color: 'white', fontSize: 24, fontWeight: '800', marginTop: 4, marginBottom: 12 },
    rolBadge: {
        backgroundColor: 'rgba(255,215,0,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.25)',
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    rolTexto: { color: '#FFD700', fontSize: 12, fontWeight: '700' },
    contenido: { padding: 20 },
    seccionTitulo: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 14,
    },
    tarjeta: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 14,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    tarjetaAccent: { width: 4, alignSelf: 'stretch' },
    tarjetaContenido: { flex: 1, padding: 18 },
    tarjetaTitulo: { color: 'white', fontWeight: '700', fontSize: 16 },
    tarjetaDesc: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 4 },
    tarjetaFlecha: { fontSize: 20, fontWeight: '700', paddingRight: 18 },
    footer: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.15)',
        fontSize: 11,
        padding: 20,
    },
});

export default HomeScreen;