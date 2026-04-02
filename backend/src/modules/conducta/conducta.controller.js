const pool = require('../../config/database');
const { enviarEmail } = require('../../config/email');

const registrarConducta = async (req, res) => {
    try {
        const { estudiante_id, nivel, descripcion } = req.body;
        const docente_id = req.usuario.id;

        if (!estudiante_id || !nivel) {
            return res.status(400).json({ mensaje: 'Estudiante y nivel son requeridos' });
        }

        const resultado = await pool.query(
            `INSERT INTO conducta (estudiante_id, docente_id, nivel, descripcion)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [estudiante_id, docente_id, nivel, descripcion]
        );

        if (nivel === 'malo' || nivel === 'regular') {
            const mensaje = nivel === 'malo'
                ? `Su hijo/a tuvo una conducta MALA hoy: ${descripcion || 'Sin detalle'}`
                : `Su hijo/a tuvo una conducta REGULAR hoy: ${descripcion || 'Sin detalle'}`;

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
                     SELECT tutor_id, 'conducta', $1, 'email'
                     FROM estudiantes WHERE id = $2 AND tutor_id IS NOT NULL`,
                    [mensaje, estudiante_id]
                );

                await enviarEmail(
                    tutor.rows[0].email,
                    `EduTrack: Conducta de ${tutor.rows[0].nombre} ${tutor.rows[0].apellido}`,
                    mensaje
                );
            }
        }
        await pool.query(
            `INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, valor_nuevo, ip)
             VALUES ($1, 'crear', 'conducta', $2, $3, $4)`,
            [docente_id, resultado.rows[0].id, JSON.stringify(resultado.rows[0]), req.ip]
        );
        res.status(201).json({
            mensaje: 'Conducta registrada exitosamente',
            conducta: resultado.rows[0]
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const obtenerConductaPorEstudiante = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `SELECT c.*, u.nombre AS docente_nombre
             FROM conducta c
             JOIN usuarios u ON c.docente_id = u.id
             WHERE c.estudiante_id = $1
             ORDER BY c.fecha DESC`,
            [id]
        );

        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = { registrarConducta, obtenerConductaPorEstudiante };