const express = require('express');
const router = express.Router();
const { obtenerNotificaciones, marcarLeida } = require('./notificaciones.controller');
const { verificarToken } = require('../../middleware/auth');

router.get('/:id', verificarToken, obtenerNotificaciones);
router.put('/:id/leer', verificarToken, marcarLeida);

module.exports = router;