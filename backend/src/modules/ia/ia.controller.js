const pool = require('../../config/database');
const { enviarEmail } = require('../../config/email');

const calcularRiesgo = (datos) => {
    let puntos = 0;
    let factores = [];

    // Análisis de notas (peso: 40%)
    if (datos.promedio_notas !== null) {
        if (datos.promedio_notas < 51) {
            puntos += 40;
            factores.push(`Promedio de notas crítico: ${datos.promedio_notas}`);
        } else if (datos.promedio_notas < 70) {
            puntos += 20;
            factores.push(`Promedio de notas bajo: ${datos.promedio_notas}`);
        }
    }

    // Análisis de asistencia (peso: 30%)
    if (datos.total_asistencias > 0) {
        const porcentajeAusencias = (datos.ausencias / datos.total_asistencias) * 100;
        if (porcentajeAusencias > 30) {
            puntos += 30;
            factores.push(`Ausencias críticas: ${porcentajeAusencias.toFixed(1)}%`);
        } else if (porcentajeAusencias > 15) {
            puntos += 15;
            factores.push(`Ausencias elevadas: ${porcentajeAusencias.toFixed(1)}%`);
        }
    }

    // Análisis de tareas (peso: 20%)
    if (datos.total_tareas > 0) {
        const porcentajePendientes = (datos.tareas_pendientes / datos.total_tareas) * 100;
        if (porcentajePendientes > 50) {
            puntos += 20;
            factores.push(`Muchas tareas sin entregar: ${porcentajePendientes.toFixed(1)}%`);
        } else if (porcentajePendientes > 25) {
            puntos += 10;
            factores.push(`Tareas pendientes: ${porcentajePendientes.toFixed(1)}%`);
        }
    }

    // Análisis de conducta (peso: 10%)
    if (datos.conductas_malas > 2) {
        puntos += 10;
        factores.push(`Múltiples registros de mala conducta: ${datos.conductas_malas}`);
    } else if (datos.conductas_malas > 0) {
        puntos += 5;
        factores.push(`Registros de conducta negativa: ${datos.conductas_malas}`);
    }

    let nivel;
    if (puntos >= 50) nivel = 'alto';
    else if (puntos >= 25) nivel = 'medio';
    else nivel = 'bajo';

    return { nivel, puntos, factores };
};

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
                `SELECT 
                    COUNT(*) AS total,
                    COUNT(CASE WHEN estado = 'ausente' THEN 1 END) AS ausencias
                 FROM asistencia WHERE estudiante_id = $1`,
                [estudiante.id]
            );

            const tareas = await pool.query(
                `SELECT 
                    COUNT(*) AS total,
                    COUNT(CASE WHEN entregada = false THEN 1 END) AS pendientes
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

            const riesgo = calcularRiesgo(datos);

            resultados.push({
                estudiante,
                datos,
                riesgo
            });

            if (riesgo.nivel === 'alto') {
                const director = await pool.query(
                    `SELECT email FROM usuarios WHERE rol = 'director' AND activo = true LIMIT 1`
                );

                if (director.rows.length > 0) {
                    const mensaje = `
                        El estudiante <strong>${estudiante.nombre} ${estudiante.apellido}</strong> 
                        (Grado ${estudiante.grado} - ${estudiante.seccion}) 
                        ha sido identificado en <strong>RIESGO ALTO</strong>.<br><br>
                        <strong>Factores detectados:</strong><br>
                        ${riesgo.factores.map(f => `• ${f}`).join('<br>')}
                    `;

                    await enviarEmail(
                        director.rows[0].email,
                        `⚠️ EduTrack: Alerta de riesgo - ${estudiante.nombre} ${estudiante.apellido}`,
                        mensaje
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

        const riesgo = calcularRiesgo(datos);

        res.json({ estudiante: estudiante.rows[0], datos, riesgo });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = { analizarEstudiantes, obtenerRiesgoEstudiante };