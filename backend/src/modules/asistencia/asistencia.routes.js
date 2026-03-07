const express = require('express');
const router = express.Router();
const { registrarAsistencia, obtenerAsistenciaPorEstudiante, obtenerAsistenciaHoy } = require('./asistencia.controller');
const { verificarToken } = require('../../middleware/auth');
const { verificarRol } = require('../../middleware/roles');

router.post('/', verificarToken, verificarRol('director', 'docente'), registrarAsistencia);
router.get('/hoy', verificarToken, verificarRol('director', 'docente'), obtenerAsistenciaHoy);
router.get('/estudiante/:id', verificarToken, verificarRol('director', 'docente'), obtenerAsistenciaPorEstudiante);

module.exports = router;