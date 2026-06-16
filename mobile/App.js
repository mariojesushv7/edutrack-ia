import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

const Navegacion = () => {
    const { usuario, cargando } = useAuth();

    if (cargando) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#001040' }}>
            <ActivityIndicator size="large" color="#FFD700" />
        </View>
    );

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!usuario ? (
                <Stack.Screen name="Login" component={LoginScreen} />
            ) : (
                <Stack.Screen name="Home" component={HomeScreen} />
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