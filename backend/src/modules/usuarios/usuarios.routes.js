const express = require('express');
const router = express.Router();
const { crearUsuario, obtenerUsuarios, desactivarUsuario } = require('./usuarios.controller');
const { verificarToken } = require('../../middleware/auth');
const { verificarRol } = require('../../middleware/roles');

router.post('/', verificarToken, verificarRol('director'), crearUsuario);
router.get('/', verificarToken, verificarRol('director'), obtenerUsuarios);
router.put('/:id/desactivar', verificarToken, verificarRol('director'), desactivarUsuario);

module.exports = router;