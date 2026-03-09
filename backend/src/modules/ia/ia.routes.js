const express = require('express');
const router = express.Router();
const { analizarEstudiantes, obtenerRiesgoEstudiante } = require('./ia.controller');
const { verificarToken } = require('../../middleware/auth');
const { verificarRol } = require('../../middleware/roles');

router.get('/analizar', verificarToken, verificarRol('director', 'docente'), analizarEstudiantes);
router.get('/riesgo/:id', verificarToken, verificarRol('director', 'docente'), obtenerRiesgoEstudiante);

module.exports = router;