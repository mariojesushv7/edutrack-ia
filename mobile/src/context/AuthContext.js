import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        verificarToken();
    }, []);

    const verificarToken = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const usuarioGuardado = await SecureStore.getItemAsync('usuario');
            if (token && usuarioGuardado) {
                setUsuario(JSON.parse(usuarioGuardado));
            }
        } catch (error) {
            console.log('Error verificando token:', error);
        } finally {
            setCargando(false);
        }
    };

    const login = async (email, password) => {
        const respuesta = await api.post('/auth/login', { email, password });
        const { token, usuario } = respuesta.data;
        await SecureStore.setItemAsync('token', token);
        await SecureStore.setItemAsync('usuario', JSON.stringify(usuario));
        setUsuario(usuario);
        return usuario;
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('usuario');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);