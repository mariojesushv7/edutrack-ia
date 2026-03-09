const pool = require('../../config/database');
const { enviarEmail } = require('../../config/email');

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

const marcarEstadoTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const { entregada } = req.body;

        const resultado = await pool.query(
            `UPDATE tareas SET entregada = $1, fecha_entrega = CASE WHEN $1 = true THEN CURRENT_DATE ELSE NULL END
             WHERE id = $2
             RETURNING *`,
            [entregada, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }

        const tarea = resultado.rows[0];

        if (entregada === false) {
            const mensaje = `Su hijo/a no entregó la tarea de ${tarea.materia}: ${tarea.descripcion}`;

            const tutor = await pool.query(
                `SELECT u.email, e.nombre, e.apellido
                 FROM estudiantes e
                 JOIN usuarios u ON e.tutor_id = u.id
                 WHERE e.id = $1 AND e.tutor_id IS NOT NULL`,
                [tarea.estudiante_id]
            );

            if (tutor.rows.length > 0) {
                await pool.query(
                    `INSERT INTO notificaciones (usuario_id, tipo, mensaje, canal)
                     SELECT tutor_id, 'tarea', $1, 'email'
                     FROM estudiantes WHERE id = $2 AND tutor_id IS NOT NULL`,
                    [mensaje, tarea.estudiante_id]
                );

                await enviarEmail(
                    tutor.rows[0].email,
                    `EduTrack: Tarea no entregada de ${tutor.rows[0].nombre} ${tutor.rows[0].apellido}`,
                    mensaje
                );
            }
        }

        res.json({
            mensaje: entregada ? 'Tarea marcada como entregada' : 'Tarea marcada como no entregada, padre notificado',
            tarea
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

module.exports = { registrarTarea, marcarEstadoTarea, obtenerTareasPorEstudiante, notificarTareasPendientes };