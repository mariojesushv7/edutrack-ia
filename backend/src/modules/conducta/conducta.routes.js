const express = require('express');
const router = express.Router();
const { registrarConducta, obtenerConductaPorEstudiante } = require('./conducta.controller');
const { verificarToken } = require('../../middleware/auth');
const { verificarRol } = require('../../middleware/roles');

router.post('/', verificarToken, verificarRol('director', 'docente'), registrarConducta);
router.get('/estudiante/:id', verificarToken, verificarRol('director', 'docente', 'padre'), obtenerConductaPorEstudiante);

module.exports = router;