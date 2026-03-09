const pool = require('../../config/database');
const { enviarEmail } = require('../../config/email');
const registrarAsistencia = async (req, res) => {
    try {
        const { estudiante_id, estado, observacion } = req.body;
        const docente_id = req.usuario.id;
        const fecha = new Date().toISOString().split('T')[0];

        if (!estudiante_id || !estado) {
            return res.status(400).json({ mensaje: 'Estudiante y estado son requeridos' });
        }

        const yaRegistrada = await pool.query(
            'SELECT id FROM asistencia WHERE estudiante_id = $1 AND fecha = $2',
            [estudiante_id, fecha]
        );

        if (yaRegistrada.rows.length > 0) {
            return res.status(400).json({ mensaje: 'La asistencia ya fue registrada hoy' });
        }

        const resultado = await pool.query(
            `INSERT INTO asistencia (estudiante_id, docente_id, fecha, estado, observacion)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [estudiante_id, docente_id, fecha, estado, observacion]
        );

        if (estado === 'ausente' || estado === 'tardanza') {
            const mensaje = estado === 'ausente'
                ? `Su hijo/a estuvo AUSENTE el día ${fecha}`
                : `Su hijo/a llegó TARDE el día ${fecha}`;
        
            const tutor = await pool.query(
                `SELECT u.email, e.nombre, e.apellido
                 FROM estudiantes e
                 JOIN usuarios u ON e.tutor_id = u.id
                 WHERE e.id = $1 AND e.tutor_id IS NOT NULL`,
                [estudiante_id]
            );
        
            if (tutor.rows.length > 0) {
                await pool.query(
                    `INSERT INTO notificaciones (usuario_id, tipo, mensaje, canal)
                     SELECT tutor_id, 'ausencia', $1, 'email'
                     FROM estudiantes WHERE id = $2 AND tutor_id IS NOT NULL`,
                    [mensaje, estudiante_id]
                );
        
                await enviarEmail(
                    tutor.rows[0].email,
                    `EduTrack: Asistencia de ${tutor.rows[0].nombre} ${tutor.rows[0].apellido}`,
                    mensaje
                );
            }
        }
        res.status(201).json({
            mensaje: 'Asistencia registrada exitosamente',
            asistencia: resultado.rows[0]
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const obtenerAsistenciaPorEstudiante = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `SELECT a.*, e.nombre AS estudiante_nombre, e.apellido AS estudiante_apellido,
                    u.nombre AS docente_nombre
             FROM asistencia a
             JOIN estudiantes e ON a.estudiante_id = e.id
             JOIN usuarios u ON a.docente_id = u.id
             WHERE a.estudiante_id = $1
             ORDER BY a.fecha DESC`,
            [id]
        );

        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const obtenerAsistenciaHoy = async (req, res) => {
    try {
        const fecha = new Date().toISOString().split('T')[0];

        const resultado = await pool.query(
            `SELECT a.*, e.nombre AS estudiante_nombre, e.apellido AS estudiante_apellido
             FROM asistencia a
             JOIN estudiantes e ON a.estudiante_id = e.id
             WHERE a.fecha = $1
             ORDER BY e.apellido ASC`,
            [fecha]
        );

        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = { registrarAsistencia, obtenerAsistenciaPorEstudiante, obtenerAsistenciaHoy };