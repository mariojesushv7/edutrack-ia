const { RandomForestClassifier } = require('ml-random-forest');

const datosEntrenamiento = [
    [95, 0, 0, 0], [90, 5, 10, 0], [88, 2, 5, 0], [92, 0, 0, 0],
    [85, 8, 15, 0], [80, 10, 20, 0], [78, 5, 10, 0], [83, 7, 12, 0],
    [91, 3, 8, 0], [87, 6, 14, 0], [94, 1, 2, 0], [82, 9, 18, 0],
    [79, 4, 16, 0], [89, 2, 6, 0], [86, 5, 11, 0], [93, 0, 4, 0],
    [68, 18, 30, 1], [65, 20, 35, 0], [70, 15, 28, 1], [62, 22, 40, 0],
    [67, 16, 32, 1], [64, 19, 38, 0], [69, 14, 26, 1], [63, 21, 42, 1],
    [66, 17, 34, 0], [71, 13, 24, 1], [60, 23, 45, 0], [68, 16, 30, 2],
    [72, 12, 22, 1], [61, 24, 44, 1], [69, 15, 33, 0], [65, 20, 36, 2],
    [45, 40, 60, 3], [38, 50, 70, 4], [42, 35, 55, 2], [30, 60, 80, 5],
    [48, 32, 52, 3], [35, 45, 65, 4], [40, 38, 58, 3], [28, 65, 85, 5],
    [44, 36, 54, 2], [33, 48, 68, 4], [47, 33, 50, 3], [25, 70, 90, 6],
    [41, 42, 62, 3], [36, 47, 66, 4], [43, 37, 56, 2], [31, 55, 75, 5],
];

const etiquetas = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
];

const opciones = {
    seed: 42,
    maxFeatures: 0.8,
    replacement: true,
    nEstimators: 25,
};

let modelo = null;

const entrenarModelo = () => {
    modelo = new RandomForestClassifier(opciones);
    modelo.train(datosEntrenamiento, etiquetas);
    console.log('Modelo de Machine Learning entrenado correctamente');
    return modelo;
};

const predecirRiesgo = (datos) => {
    if (!modelo) entrenarModelo();

    const promedio = datos.promedio_notas !== null ? parseFloat(datos.promedio_notas) : 100;
    const pctAusencias = datos.total_asistencias > 0
        ? (datos.ausencias / datos.total_asistencias) * 100 : 0;
    const pctTareas = datos.total_tareas > 0
        ? (datos.tareas_pendientes / datos.total_tareas) * 100 : 0;
    const malaConducta = datos.conductas_malas;

    const entrada = [promedio, pctAusencias, pctTareas, malaConducta];
    const prediccion = modelo.predict([entrada])[0];

    const factores = [];
    if (promedio < 51) factores.push(`Promedio de notas crítico: ${promedio.toFixed(1)}`);
    else if (promedio < 70) factores.push(`Promedio de notas bajo: ${promedio.toFixed(1)}`);
    if (pctAusencias > 30) factores.push(`Ausencias críticas: ${pctAusencias.toFixed(1)}%`);
    else if (pctAusencias > 15) factores.push(`Ausencias elevadas: ${pctAusencias.toFixed(1)}%`);
    if (pctTareas > 50) factores.push(`Muchas tareas sin entregar: ${pctTareas.toFixed(1)}%`);
    else if (pctTareas > 25) factores.push(`Tareas pendientes: ${pctTareas.toFixed(1)}%`);
    if (malaConducta > 2) factores.push(`Múltiples registros de mala conducta: ${malaConducta}`);
    else if (malaConducta > 0) factores.push(`Registros de conducta negativa: ${malaConducta}`);

    const niveles = ['bajo', 'medio', 'alto'];
    const nivel = niveles[prediccion];

    return { nivel, prediccion, factores };
};

entrenarModelo();

module.exports = { predecirRiesgo, entrenarModelo };