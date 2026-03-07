const pool = require('../../config/database');

const registrarTarea = async (req, res) => {
    try {
        const { estudiante_id, materia, descripcion, fecha_asignacion } = req.body;
        const docente_id = req.usuario.id;

        if (!estudiante_id || !materia || !descripcion) {
            return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
        }

        const resultado = await pool.query(
            `INSERT INTO tareas (estudiante_id, docente_id, materia, descripcion, fecha_asignacion)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [estudiante_id, docente_id, materia, descripcion, fecha_asignacion || new Date().toISOString().split('T')[0]]
        );

        res.status(201).json({
            mensaje: 'Tarea registrada exitosamente',
            tarea: resultado.rows[0]
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const marcarTareaEntregada = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `UPDATE tareas SET entregada = true, fecha_entrega = CURRENT_DATE
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }

        res.json({
            mensaje: 'Tarea marcada como entregada',
            tarea: resultado.rows[0]
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const obtenerTareasPorEstudiante = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `SELECT t.*, u.nombre AS docente_nombre
             FROM tareas t
             JOIN usuarios u ON t.docente_id = u.id
             WHERE t.estudiante_id = $1
             ORDER BY t.fecha_asignacion DESC`,
            [id]
        );

        const resumen = await pool.query(
            `SELECT 
                COUNT(*) AS total,
                COUNT(CASE WHEN entregada = true THEN 1 END) AS entregadas,
                COUNT(CASE WHEN entregada = false THEN 1 END) AS pendientes
             FROM tareas WHERE estudiante_id = $1`,
            [id]
        );

        res.json({
            tareas: resultado.rows,
            resumen: resumen.rows[0]
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const notificarTareasPendientes = async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];

        const tareasPendientes = await pool.query(
            `SELECT t.id, t.materia, t.descripcion, e.tutor_id
             FROM tareas t
             JOIN estudiantes e ON t.estudiante_id = e.id
             WHERE t.entregada = false 
             AND t.fecha_asignacion = $1
             AND e.tutor_id IS NOT NULL`,
            [hoy]
        );

        for (const tarea of tareasPendientes.rows) {
            await pool.query(
                `INSERT INTO notificaciones (usuario_id, tipo, mensaje, canal)
                 VALUES ($1, 'tarea', $2, 'email')`,
                [tarea.tutor_id, `Tarea pendiente en ${tarea.materia}: ${tarea.descripcion}`]
            );
        }

        res.json({
            mensaje: `${tareasPendientes.rows.length} notificaciones enviadas`
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = { registrarTarea, marcarTareaEntregada, obtenerTareasPorEstudiante, notificarTareasPendientes };