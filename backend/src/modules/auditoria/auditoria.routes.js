const express = require('express');
const router = express.Router();
const { obtenerAuditoria } = require('./auditoria.controller');
const { verificarToken } = require('../../middleware/auth');
const { verificarRol } = require('../../middleware/roles');

router.get('/', verificarToken, verificarRol('director'), obtenerAuditoria);

module.exports = router;