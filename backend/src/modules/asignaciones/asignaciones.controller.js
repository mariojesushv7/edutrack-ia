const pool = require('../../config/database');

const asignarEstudiante = async (req, res) => {
    try {
        const { docente_id, estudiante_id, materia } = req.body;

        if (!docente_id || !estudiante_id || !materia) {
            return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
        }

        const resultado = await pool.query(
            `INSERT INTO docente_estudiantes (docente_id, estudiante_id, materia)
             VALUES ($1, $2, $3)
             ON CONFLICT (docente_id, estudiante_id, materia) DO NOTHING
             RETURNING *`,
            [docente_id, estudiante_id, materia]
        );

        res.status(201).json({
            mensaje: 'Estudiante asignado exitosamente',
            asignacion: resultado.rows[0]
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const obtenerEstudiantesDeDocente = async (req, res) => {
    try {
        const { docente_id } = req.params;

        const resultado = await pool.query(
            `SELECT e.*, de.materia, u.nombre AS tutor_nombre, u.email AS tutor_email
             FROM docente_estudiantes de
             JOIN estudiantes e ON de.estudiante_id = e.id
             LEFT JOIN usuarios u ON e.tutor_id = u.id
             WHERE de.docente_id = $1 AND e.activo = true
             ORDER BY e.apellido ASC`,
            [docente_id]
        );

        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const obtenerDocentesDeEstudiante = async (req, res) => {
    try {
        const { estudiante_id } = req.params;

        const resultado = await pool.query(
            `SELECT u.id, u.nombre, u.apellido, u.email, de.materia
             FROM docente_estudiantes de
             JOIN usuarios u ON de.docente_id = u.id
             WHERE de.estudiante_id = $1`,
            [estudiante_id]
        );

        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const eliminarAsignacion = async (req, res) => {
    try {
        const { docente_id, estudiante_id, materia } = req.body;

        await pool.query(
            `DELETE FROM docente_estudiantes 
             WHERE docente_id = $1 AND estudiante_id = $2 AND materia = $3`,
            [docente_id, estudiante_id, materia]
        );

        res.json({ mensaje: 'Asignación eliminada exitosamente' });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = { asignarEstudiante, obtenerEstudiantesDeDocente, obtenerDocentesDeEstudiante, eliminarAsignacion };