const pool = require('../../config/database');
const { enviarEmail } = require('../../config/email');
const { predecirRiesgo } = require('./modeloML');

const analizarEstudiantes = async (req, res) => {
    try {
        const estudiantes = await pool.query(
            `SELECT id, nombre, apellido, grado, seccion FROM estudiantes WHERE activo = true`
        );

        const resultados = [];

        for (const estudiante of estudiantes.rows) {
            const notas = await pool.query(
                `SELECT AVG(valor) AS promedio FROM notas WHERE estudiante_id = $1`,
                [estudiante.id]
            );
            const asistencia = await pool.query(
                `SELECT COUNT(*) AS total, COUNT(CASE WHEN estado = 'ausente' THEN 1 END) AS ausencias
                 FROM asistencia WHERE estudiante_id = $1`,
                [estudiante.id]
            );
            const tareas = await pool.query(
                `SELECT COUNT(*) AS total, COUNT(CASE WHEN entregada = false THEN 1 END) AS pendientes
                 FROM tareas WHERE estudiante_id = $1`,
                [estudiante.id]
            );
            const conducta = await pool.query(
                `SELECT COUNT(*) AS malas FROM conducta 
                 WHERE estudiante_id = $1 AND nivel IN ('malo', 'regular')`,
                [estudiante.id]
            );

            const datos = {
                promedio_notas: notas.rows[0].promedio ? parseFloat(notas.rows[0].promedio).toFixed(1) : null,
                total_asistencias: parseInt(asistencia.rows[0].total),
                ausencias: parseInt(asistencia.rows[0].ausencias),
                total_tareas: parseInt(tareas.rows[0].total),
                tareas_pendientes: parseInt(tareas.rows[0].pendientes),
                conductas_malas: parseInt(conducta.rows[0].malas),
            };

            const riesgo = predecirRiesgo(datos);
            resultados.push({ estudiante, datos, riesgo });

            if (riesgo.nivel === 'alto') {
                const director = await pool.query(
                    `SELECT email FROM usuarios WHERE rol = 'director' AND activo = true LIMIT 1`
                );

                if (director.rows.length > 0) {
                    const mensaje = `
                        <p>Estimada Dirección,</p>
                        <p>El sistema de análisis inteligente ha identificado al estudiante
                        <strong>${estudiante.nombre} ${estudiante.apellido}</strong>
                        (Grado ${estudiante.grado} · Sección ${estudiante.seccion}) en
                        <strong style="color:#dc2626">RIESGO ALTO</strong>, lo que sugiere la conveniencia
                        de una intervención temprana.</p>
                        <p><strong>Factores detectados por el modelo:</strong></p>
                        <ul>
                            ${riesgo.factores.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                        <p>Se recomienda coordinar el acompañamiento correspondiente con los docentes y la familia.</p>
                        <p><strong>Unidad Educativa Adventista Salomón</strong><br><em>#MásQueEnseñanza</em></p>
                    `;

                    await enviarEmail(
                        director.rows[0].email,
                        `Alerta de riesgo académico — ${estudiante.nombre} ${estudiante.apellido}`,
                        mensaje
                    );
                }

                const tutor = await pool.query(
                    `SELECT u.email, u.nombre FROM usuarios u
                     JOIN estudiantes e ON e.tutor_id = u.id
                     WHERE e.id = $1`,
                    [estudiante.id]
                );

                if (tutor.rows.length > 0) {
                    await enviarEmail(
                        tutor.rows[0].email,
                        `Acompañemos juntos a ${estudiante.nombre} — U.E. Adventista Salomón`,
                        `
                        <p>Estimado/a ${tutor.rows[0].nombre},</p>
                        <p>Le escribimos con cariño y con el sincero deseo de acompañar a
                        <strong>${estudiante.nombre} ${estudiante.apellido}</strong> en su camino escolar.</p>
                        <p>Hemos notado algunas señales en su desempeño reciente que nos gustaría compartir con usted,
                        no como motivo de preocupación, sino como una oportunidad para apoyarle juntos a tiempo:</p>
                        <ul>
                            ${riesgo.factores.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                        <p>Creemos de corazón que, con el acompañamiento de su familia y de nuestros docentes,
                        ${estudiante.nombre} puede superar este momento y alcanzar todo su potencial.</p>
                        <p>Le invitamos a comunicarse con nosotros cuando guste, para conversar y trabajar
                        de la mano por su bienestar y crecimiento.</p>
                        <p>Con aprecio,<br><strong>Unidad Educativa Adventista Salomón</strong><br><em>#MásQueEnseñanza</em></p>
                        `
                    );
                }
            }
        }

        res.json({
            mensaje: 'Análisis completado',
            total: resultados.length,
            en_riesgo_alto: resultados.filter(r => r.riesgo.nivel === 'alto').length,
            en_riesgo_medio: resultados.filter(r => r.riesgo.nivel === 'medio').length,
            en_riesgo_bajo: resultados.filter(r => r.riesgo.nivel === 'bajo').length,
            resultados
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const obtenerRiesgoEstudiante = async (req, res) => {
    try {
        const { id } = req.params;

        const estudiante = await pool.query(
            `SELECT id, nombre, apellido, grado, seccion FROM estudiantes WHERE id = $1`,
            [id]
        );

        if (estudiante.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }

        const notas = await pool.query(
            `SELECT AVG(valor) AS promedio FROM notas WHERE estudiante_id = $1`, [id]
        );
        const asistencia = await pool.query(
            `SELECT COUNT(*) AS total, COUNT(CASE WHEN estado = 'ausente' THEN 1 END) AS ausencias
             FROM asistencia WHERE estudiante_id = $1`, [id]
        );
        const tareas = await pool.query(
            `SELECT COUNT(*) AS total, COUNT(CASE WHEN entregada = false THEN 1 END) AS pendientes
             FROM tareas WHERE estudiante_id = $1`, [id]
        );
        const conducta = await pool.query(
            `SELECT COUNT(*) AS malas FROM conducta 
             WHERE estudiante_id = $1 AND nivel IN ('malo', 'regular')`, [id]
        );

        const datos = {
            promedio_notas: notas.rows[0].promedio ? parseFloat(notas.rows[0].promedio).toFixed(1) : null,
            total_asistencias: parseInt(asistencia.rows[0].total),
            ausencias: parseInt(asistencia.rows[0].ausencias),
            total_tareas: parseInt(tareas.rows[0].total),
            tareas_pendientes: parseInt(tareas.rows[0].pendientes),
            conductas_malas: parseInt(conducta.rows[0].malas),
        };

        const riesgo = predecirRiesgo(datos);

        res.json({ estudiante: estudiante.rows[0], datos, riesgo });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = { analizarEstudiantes, obtenerRiesgoEstudiante };