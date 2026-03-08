import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(() => {
        const u = localStorage.getItem('usuario');
        return u ? JSON.parse(u) : null;
    });

    const login = (datos) => {
        localStorage.setItem('token', datos.token);
        localStorage.setItem('usuario', JSON.stringify(datos.usuario));
        setUsuario(datos.usuario);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);