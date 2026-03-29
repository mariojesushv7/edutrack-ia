const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const asignacionesRoutes = require('./modules/asignaciones/asignaciones.routes');
const authRoutes = require('./modules/auth/auth.routes');
const usuariosRoutes = require('./modules/usuarios/usuarios.routes');
const estudiantesRoutes = require('./modules/estudiantes/estudiantes.routes');
const asistenciaRoutes = require('./modules/asistencia/asistencia.routes');
const notasRoutes = require('./modules/notas/notas.routes');
const tareasRoutes = require('./modules/tareas/tareas.routes');
const conductaRoutes = require('./modules/conducta/conducta.routes');
const iaRoutes = require('./modules/ia/ia.routes');
const notificacionesRoutes = require('./modules/notificaciones/notificaciones.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/asignaciones', asignacionesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/notas', notasRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/conducta', conductaRoutes);
app.use('/api/ia', iaRoutes);
app.use('/api/notificaciones', notificacionesRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: 'EduTrack IA - API funcionando' });
});

module.exports = app;