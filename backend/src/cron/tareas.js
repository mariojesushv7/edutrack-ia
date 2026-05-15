const cron = require('node-cron');
const pool = require('../config/database');
const { enviarEmail } = require('../config/email');

const calcularRiesgo = (datos) => {
    let puntos = 0;
    let factores = [];

    if (datos.promedio_notas !== null) {
        if (datos.promedio_notas < 51) {
            puntos += 40;
            factores.push(`Promedio de notas crítico: ${datos.promedio_notas}`);
        } else if (datos.promedio_notas < 70) {
            puntos += 20;
            factores.push(`Promedio de notas bajo: ${datos.promedio_notas}`);
        }
    }

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

const ejecutarAnalisisMensual = async () => {
    console.log('🤖 Iniciando análisis mensual de IA...');
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

            const riesgo = calcularRiesgo(datos);
            resultados.push({ estudiante, datos, riesgo });
        }

        const enRiesgoAlto = resultados.filter(r => r.riesgo.nivel === 'alto');
        const enRiesgoMedio = resultados.filter(r => r.riesgo.nivel === 'medio');
        const enRiesgoBajo = resultados.filter(r => r.riesgo.nivel === 'bajo');

        const director = await pool.query(
            `SELECT email FROM usuarios WHERE rol = 'director' AND activo = true LIMIT 1`
        );

        if (director.rows.length > 0) {
            const resumenHTML = `
                <h2>📊 Reporte Mensual de Análisis Académico</h2>
                <p>Fecha: ${new Date().toLocaleDateString()}</p>
                <br>
                <h3>Resumen General</h3>
                <ul>
                    <li>🔴 Estudiantes en Riesgo Alto: <strong>${enRiesgoAlto.length}</strong></li>
                    <li>🟡 Estudiantes en Riesgo Medio: <strong>${enRiesgoMedio.length}</strong></li>
                    <li>🟢 Estudiantes en Riesgo Bajo: <strong>${enRiesgoBajo.length}</strong></li>
                    <li>👨‍🎓 Total analizados: <strong>${resultados.length}</strong></li>
                </ul>
                ${enRiesgoAlto.length > 0 ? `
                <h3>⚠️ Estudiantes en Riesgo Alto</h3>
                ${enRiesgoAlto.map(r => `
                    <div style="margin-bottom:10px;padding:10px;background:#fee2e2;border-radius:8px;">
                        <strong>${r.estudiante.nombre} ${r.estudiante.apellido}</strong> - Grado ${r.estudiante.grado}<br>
                        ${r.riesgo.factores.map(f => `• ${f}`).join('<br>')}
                    </div>
                `).join('')}` : ''}
            `;

            await enviarEmail(
                director.rows[0].email,
                `📊 EduTrack IA - Reporte Mensual de Riesgo Académico`,
                resumenHTML
            );
        }

        const docentes = await pool.query(
            `SELECT email, nombre FROM usuarios WHERE rol = 'docente' AND activo = true`
        );

        for (const docente of docentes.rows) {
            await enviarEmail(
                docente.email,
                `📊 EduTrack IA - Reporte Mensual Académico`,
                `
                <h2>Reporte Mensual - ${new Date().toLocaleDateString()}</h2>
                <p>Estimado/a ${docente.nombre},</p>
                <p>El análisis mensual ha sido completado:</p>
                <ul>
                    <li>🔴 Riesgo Alto: <strong>${enRiesgoAlto.length}</strong> estudiantes</li>
                    <li>🟡 Riesgo Medio: <strong>${enRiesgoMedio.length}</strong> estudiantes</li>
                    <li>🟢 Riesgo Bajo: <strong>${enRiesgoBajo.length}</strong> estudiantes</li>
                </ul>
                <p>Por favor ingrese al sistema para más detalles.</p>
                `
            );
        }

        console.log(`✅ Análisis mensual completado. ${resultados.length} estudiantes analizados.`);

    } catch (error) {
        console.error('❌ Error en análisis mensual:', error);
    }
};

const iniciarCronJobs = () => {
    // Ejecutar el día 1 de cada mes a las 8:00 AM
    cron.schedule('0 8 1 * *', ejecutarAnalisisMensual, {
        timezone: 'America/La_Paz'
    });

    console.log('⏰ Cron jobs iniciados - Análisis mensual programado para el día 1 de cada mes a las 8:00 AM');
};

module.exports = { iniciarCronJobs, ejecutarAnalisisMensual };