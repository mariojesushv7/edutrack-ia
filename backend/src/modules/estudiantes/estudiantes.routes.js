const express = require('express');
const router = express.Router();
const { crearEstudiante, obtenerEstudiantes, obtenerEstudiante, eliminarEstudiante } = require('./estudiantes.controller');
const { verificarToken } = require('../../middleware/auth');
const { verificarRol } = require('../../middleware/roles');

router.post('/', verificarToken, verificarRol('director', 'docente'), crearEstudiante);
router.get('/', verificarToken, verificarRol('director', 'docente', 'padre'), obtenerEstudiantes);
router.get('/:id', verificarToken, verificarRol('director', 'docente'), obtenerEstudiante);
router.delete('/:id', verificarToken, verificarRol('director'), eliminarEstudiante);

module.exports = router;