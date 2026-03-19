import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AsistenciaScreen from './src/screens/AsistenciaScreen';
import NotasScreen from './src/screens/NotasScreen';
import TareasScreen from './src/screens/TareasScreen';
import NotificacionesScreen from './src/screens/NotificacionesScreen';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

const Navegacion = () => {
    const { usuario, cargando } = useAuth();

    if (cargando) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#1e40af" />
        </View>
    );

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!usuario ? (
                <Stack.Screen name="Login" component={LoginScreen} />
            ) : (
                <>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Asistencia" component={AsistenciaScreen} />
                    <Stack.Screen name="Notas" component={NotasScreen} />
                    <Stack.Screen name="Tareas" component={TareasScreen} />
                    <Stack.Screen name="Notificaciones" component={NotificacionesScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Navegacion />
            </NavigationContainer>
        </AuthProvider>
    );
}