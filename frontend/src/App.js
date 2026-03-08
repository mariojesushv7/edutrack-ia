import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Estudiantes from './pages/estudiantes/Estudiantes';
import Asistencia from './pages/asistencia/Asistencia';
import Notas from './pages/notas/Notas';
import Tareas from './pages/tareas/Tareas';

const RutaProtegida = ({ children }) => {
    const { usuario } = useAuth();
    return usuario ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={
                        <RutaProtegida>
                            <Dashboard />
                        </RutaProtegida>
                    } />
                    <Route path="/estudiantes" element={
                        <RutaProtegida>
                            <Estudiantes />
                        </RutaProtegida>
                    } />
                    <Route path="/asistencia" element={
                        <RutaProtegida>
                            <Asistencia />
                        </RutaProtegida>
                    } />
                    <Route path="/notas" element={
                        <RutaProtegida>
                            <Notas />
                        </RutaProtegida>
                    } />
                    <Route path="/tareas" element={
                        <RutaProtegida>
                            <Tareas />
                        </RutaProtegida>
                    } />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;