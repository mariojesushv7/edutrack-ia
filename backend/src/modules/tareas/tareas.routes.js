const express = require('express');
const router = express.Router();
const { registrarTarea, marcarEstadoTarea, obtenerTareasPorEstudiante, notificarTareasPendientes } = require('./tareas.controller');
const { verificarToken } = require('../../middleware/auth');
const { verificarRol } = require('../../middleware/roles');

router.post('/', verificarToken, verificarRol('director', 'docente'), registrarTarea);
router.put('/:id/estado', verificarToken, verificarRol('director', 'docente'), marcarEstadoTarea);
router.get('/estudiante/:id', verificarToken, verificarRol('director', 'docente', 'padre'), obtenerTareasPorEstudiante);
router.post('/notificar-pendientes', verificarToken, verificarRol('director', 'docente'), notificarTareasPendientes);

module.exports = router;