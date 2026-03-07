const express = require('express');
const router = express.Router();
const { registrarNota, obtenerNotasPorEstudiante, obtenerPromedioEstudiante } = require('./notas.controller');
const { verificarToken } = require('../../middleware/auth');
const { verificarRol } = require('../../middleware/roles');

router.post('/', verificarToken, verificarRol('director', 'docente'), registrarNota);
router.get('/estudiante/:id', verificarToken, verificarRol('director', 'docente'), obtenerNotasPorEstudiante);
router.get('/promedio/:id', verificarToken, verificarRol('director', 'docente', 'padre'), obtenerPromedioEstudiante);

module.exports = router;