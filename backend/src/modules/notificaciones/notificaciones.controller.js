const pool = require('../../config/database');

const obtenerNotificaciones = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `SELECT * FROM notificaciones 
             WHERE usuario_id = $1 
             ORDER BY created_at DESC`,
            [id]
        );

        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const marcarLeida = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            `UPDATE notificaciones SET leida = true WHERE id = $1`,
            [id]
        );

        res.json({ mensaje: 'Notificación marcada como leída' });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = { obtenerNotificaciones, marcarLeida };