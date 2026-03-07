const pool = require('../../config/database');

const registrarNota = async (req, res) => {
    try {
        const { estudiante_id, materia, parcial, valor, observacion } = req.body;
        const docente_id = req.usuario.id;

        if (!estudiante_id || !materia || !parcial || valor === undefined) {
            return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
        }

        const existe = await pool.query(
            'SELECT id FROM notas WHERE estudiante_id = $1 AND materia = $2 AND parcial = $3',
            [estudiante_id, materia, parcial]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ mensaje: 'Ya existe una nota para esta materia y parcial' });
        }

        const resultado = await pool.query(
            `INSERT INTO notas (estudiante_id, docente_id, materia, parcial, valor, observacion)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [estudiante_id, docente_id, materia, parcial, valor, observacion]
        );

        await pool.query(
            `INSERT INTO notificaciones (usuario_id, tipo, mensaje, canal)
             SELECT tutor_id, 'nota',
             'Se registró una nota de ' || $1 || ' en ' || $2 || ': ' || $3 || ' puntos',
             'email'
             FROM estudiantes WHERE id = $4 AND tutor_id IS NOT NULL`,
            [parcial, materia, valor, estudiante_id]
        );

        await pool.query(
            `INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, valor_nuevo, ip)
             VALUES ($1, 'crear', 'notas', $2, $3, $4)`,
            [docente_id, resultado.rows[0].id, JSON.stringify(resultado.rows[0]), req.ip]
        );

        res.status(201).json({
            mensaje: 'Nota registrada exitosamente',
            nota: resultado.rows[0]
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const obtenerNotasPorEstudiante = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `SELECT n.*, u.nombre AS docente_nombre
             FROM notas n
             JOIN usuarios u ON n.docente_id = u.id
             WHERE n.estudiante_id = $1
             ORDER BY n.parcial ASC, n.materia ASC`,
            [id]
        );

        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const obtenerPromedioEstudiante = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `SELECT materia, 
                    ROUND(AVG(valor), 2) AS promedio,
                    COUNT(*) AS total_notas
             FROM notas
             WHERE estudiante_id = $1
             GROUP BY materia
             ORDER BY materia ASC`,
            [id]
        );

        const promedioGeneral = await pool.query(
            `SELECT ROUND(AVG(valor), 2) AS promedio_general
             FROM notas WHERE estudiante_id = $1`,
            [id]
        );

        res.json({
            por_materia: resultado.rows,
            promedio_general: promedioGeneral.rows[0].promedio_general
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = { registrarNota, obtenerNotasPorEstudiante, obtenerPromedioEstudiante };