const express = require('express');
const router = express.Router();
const { crearEstudiante, obtenerEstudiantes, obtenerEstudiante } = require('./estudiantes.controller');
const { verificarToken } = require('../../middleware/auth');
const { verificarRol } = require('../../middleware/roles');

router.post('/', verificarToken, verificarRol('director', 'docente'), crearEstudiante);
router.get('/', verificarToken, verificarRol('director', 'docente'), obtenerEstudiantes);
router.get('/:id', verificarToken, verificarRol('director', 'docente'), obtenerEstudiante);

module.exports = router;