const express = require('express');
const router = express.Router();
const { asignarEstudiante, obtenerEstudiantesDeDocente, obtenerDocentesDeEstudiante, eliminarAsignacion } = require('./asignaciones.controller');
const { verificarToken } = require('../../middleware/auth');
const { verificarRol } = require('../../middleware/roles');

router.post('/', verificarToken, verificarRol('director'), asignarEstudiante);
router.get('/docente/:docente_id', verificarToken, verificarRol('director', 'docente'), obtenerEstudiantesDeDocente);
router.get('/estudiante/:estudiante_id', verificarToken, verificarRol('director', 'docente'), obtenerDocentesDeEstudiante);
router.delete('/', verificarToken, verificarRol('director'), eliminarAsignacion);

module.exports = router;