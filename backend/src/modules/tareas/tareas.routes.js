const express = require('express');
const router = express.Router();
const { registrarTarea, marcarTareaEntregada, obtenerTareasPorEstudiante, notificarTareasPendientes } = require('./tareas.controller');
const { verificarToken } = require('../../middleware/auth');
const { verificarRol } = require('../../middleware/roles');

router.post('/', verificarToken, verificarRol('director', 'docente'), registrarTarea);
router.put('/:id/entregar', verificarToken, verificarRol('director', 'docente'), marcarTareaEntregada);
router.get('/estudiante/:id', verificarToken, verificarRol('director', 'docente', 'padre'), obtenerTareasPorEstudiante);
router.post('/notificar-pendientes', verificarToken, verificarRol('director', 'docente'), notificarTareasPendientes);

module.exports = router;