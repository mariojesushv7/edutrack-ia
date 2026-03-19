import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cargando, setCargando] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Ingresa email y contraseña');
            return;
        }
        setCargando(true);
        try {
            await login(email, password);
        } catch (error) {
            Alert.alert('Error', 'Email o contraseña incorrectos');
        } finally {
            setCargando(false);
        }
    };

    return (
        <View style={styles.contenedor}>
            <View style={styles.header}>
                <Text style={styles.logo}>EduTrack IA</Text>
                <Text style={styles.subtitulo}>Portal para Padres</Text>
            </View>

            <View style={styles.formulario}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="tu@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••"
                    secureTextEntry
                />

                <TouchableOpacity
                    style={[styles.boton, cargando && styles.botonDesactivado]}
                    onPress={handleLogin}
                    disabled={cargando}
                >
                    {cargando ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.botonTexto}>Ingresar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: '#f0f4f8' },
    header: { backgroundColor: '#1e40af', padding: 48, alignItems: 'center' },
    logo: { color: 'white', fontSize: 28, fontWeight: 'bold' },
    subtitulo: { color: '#bfdbfe', fontSize: 14, marginTop: 4 },
    formulario: { padding: 24, marginTop: 24 },
    label: { fontSize: 14, color: '#374151', fontWeight: '600', marginBottom: 6 },
    input: { backgroundColor: 'white', padding: 14, borderRadius: 8, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    boton: { backgroundColor: '#1e40af', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    botonDesactivado: { opacity: 0.7 },
    botonTexto: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default LoginScreen;