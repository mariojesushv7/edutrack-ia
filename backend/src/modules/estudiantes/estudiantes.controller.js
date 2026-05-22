const pool = require('../../config/database');
const { enviarEmail } = require('../../config/email');
const bcrypt = require('bcryptjs');

const crearEstudiante = async (req, res) => {
    try {
        const { nombre, apellido, ci, fecha_nacimiento, grado, seccion, tutor_id, email_padre, nombre_padre, apellido_padre } = req.body;

        if (!nombre || !apellido || !ci || !grado || !seccion) {
            return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
        }

        const existe = await pool.query(
            'SELECT id FROM estudiantes WHERE ci = $1',
            [ci]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ mensaje: 'Ya existe un estudiante con ese CI' });
        }

        let tutorId = tutor_id || null;

        if (email_padre && !tutor_id) {
            const padreExiste = await pool.query(
                'SELECT id FROM usuarios WHERE email = $1',
                [email_padre]
            );

            if (padreExiste.rows.length > 0) {
                tutorId = padreExiste.rows[0].id;
            } else {
                const passwordTemporal = Math.random().toString(36).slice(-8);
                const passwordHash = await bcrypt.hash(passwordTemporal, 10);

                const nuevoPadre = await pool.query(
                    `INSERT INTO usuarios (nombre, apellido, email, password, rol)
                     VALUES ($1, $2, $3, $4, 'padre')
                     RETURNING id`,
                    [nombre_padre || 'Padre', apellido_padre || 'de ' + apellido, email_padre, passwordHash]
                );

                tutorId = nuevoPadre.rows[0].id;

                await enviarEmail(
                    email_padre,
                    'EduTrack IA - Acceso al Portal de Padres',
                    `Estimado padre/madre de familia,<br><br>
                    Se ha creado una cuenta para usted en el sistema EduTrack IA para el seguimiento académico de <strong>${nombre} ${apellido}</strong>.<br><br>
                    <strong>Sus credenciales de acceso son:</strong><br>
                    Email: ${email_padre}<br>
                    Contraseña temporal: <strong>${passwordTemporal}</strong><br><br>
                    Por favor ingrese a la app móvil EduTrack IA y cambie su contraseña.<br><br>
                    Si tiene alguna duda, contacte a la institución educativa.`
                );
            }
        }

        const resultado = await pool.query(
            `INSERT INTO estudiantes (nombre, apellido, ci, fecha_nacimiento, grado, seccion, tutor_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [nombre, apellido, ci, fecha_nacimiento, grado, seccion, tutorId]
        );

        res.status(201).json({
            mensaje: email_padre && !tutor_id
                ? 'Estudiante creado y credenciales enviadas al padre por email'
                : 'Estudiante creado exitosamente',
            estudiante: resultado.rows[0]
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const obtenerEstudiantes = async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT e.id, e.nombre, e.apellido, e.ci, e.grado, e.seccion, e.activo,
                    u.id AS tutor_id, u.nombre AS tutor_nombre, u.apellido AS tutor_apellido, u.email AS tutor_email
             FROM estudiantes e
             LEFT JOIN usuarios u ON e.tutor_id = u.id
             WHERE e.activo = true
             ORDER BY e.apellido ASC`
        );

        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const obtenerEstudiante = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `SELECT e.*, u.nombre AS tutor_nombre, u.apellido AS tutor_apellido, u.email AS tutor_email
             FROM estudiantes e
             LEFT JOIN usuarios u ON e.tutor_id = u.id
             WHERE e.id = $1 AND e.activo = true`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }

        res.json(resultado.rows[0]);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};
const eliminarEstudiante = async (req, res) => {
    try {
        const { id } = req.params;

        const existe = await pool.query(
            'SELECT id, nombre, apellido FROM estudiantes WHERE id = $1',
            [id]
        );

        if (existe.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }

        await pool.query(
            'UPDATE estudiantes SET activo = false WHERE id = $1',
            [id]
        );

        res.json({ mensaje: 'Estudiante eliminado exitosamente' });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};
module.exports = { crearEstudiante, obtenerEstudiantes, obtenerEstudiante, eliminarEstudiante };