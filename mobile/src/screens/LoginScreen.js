import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
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
                <View style={styles.logoCirculo}>
                    <Image
                        source={require('../../assets/icon.png')}
                        style={styles.logo}
                    />
                </View>
                <Text style={styles.nombre}>Unidad Educativa</Text>
                <Text style={styles.nombreBold}>Adventista Salomón</Text>
                <Text style={styles.subtitulo}>Portal para Padres de Familia</Text>
            </View>

            <View style={styles.formulario}>
                <Text style={styles.titulo}>Iniciar sesión</Text>

                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="correo@email.com"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    secureTextEntry
                />

                <TouchableOpacity
                    style={[styles.boton, cargando && styles.botonDesactivado]}
                    onPress={handleLogin}
                    disabled={cargando}
                >
                    {cargando ? (
                        <ActivityIndicator color="#001040" />
                    ) : (
                        <Text style={styles.botonTexto}>Ingresar al sistema</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.footer}>Acceso exclusivo para padres de familia</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: '#001040',
    },
    header: {
        backgroundColor: '#001a5c',
        paddingTop: 60,
        paddingBottom: 40,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    logoCirculo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FFD700',
        overflow: 'hidden',
        marginBottom: 16,
    },
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    nombre: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        fontWeight: '400',
    },
    nombreBold: {
        color: 'white',
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 6,
    },
    subtitulo: {
        color: '#FFD700',
        fontSize: 13,
        fontWeight: '600',
    },
    formulario: {
        padding: 28,
        marginTop: 20,
    },
    titulo: {
        color: 'white',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 24,
    },
    label: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        borderRadius: 10,
        padding: 14,
        fontSize: 15,
        color: 'white',
        marginBottom: 18,
    },
    boton: {
        backgroundColor: '#FFD700',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    botonDesactivado: {
        opacity: 0.7,
    },
    botonTexto: {
        color: '#001040',
        fontSize: 16,
        fontWeight: '800',
    },
    footer: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.25)',
        fontSize: 12,
        marginTop: 20,
    },
});

export default LoginScreen;