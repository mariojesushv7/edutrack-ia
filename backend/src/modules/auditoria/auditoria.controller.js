const pool = require('../../config/database');

const obtenerAuditoria = async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT a.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido, u.rol AS usuario_rol
             FROM auditoria a
             LEFT JOIN usuarios u ON a.usuario_id = u.id
             ORDER BY a.created_at DESC
             LIMIT 200`
        );

        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = { obtenerAuditoria };