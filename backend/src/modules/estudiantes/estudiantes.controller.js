const pool = require('../../config/database');

const crearEstudiante = async (req, res) => {
    try {
        const { nombre, apellido, ci, fecha_nacimiento, grado, seccion, tutor_id } = req.body;

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

        const resultado = await pool.query(
            `INSERT INTO estudiantes (nombre, apellido, ci, fecha_nacimiento, grado, seccion, tutor_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [nombre, apellido, ci, fecha_nacimiento, grado, seccion, tutor_id]
        );

        res.status(201).json({
            mensaje: 'Estudiante creado exitosamente',
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
                    u.nombre AS tutor_nombre, u.apellido AS tutor_apellido, u.email AS tutor_email
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

module.exports = { crearEstudiante, obtenerEstudiantes, obtenerEstudiante };