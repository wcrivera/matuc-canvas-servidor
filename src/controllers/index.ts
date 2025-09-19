// ============================================================================
// EXPORTACIONES DE CONTROLADORES - MATUC LTI EXERCISE COMPOSER
// ============================================================================
// Archivo: src/controllers/index.ts
// Propósito: Exportar todas las funciones de controladores (NO clases)
// Compatible con estructura de rutas que usa funciones individuales

// ============================================================================
// CONTROLADOR EXERCISE SETS - Exportaciones individuales
// ============================================================================
export {
    obtenerExerciseSets,
    obtenerExerciseSetPorId,
    crearExerciseSet,
    actualizarExerciseSet,
    eliminarExerciseSet,
    togglePublicarExerciseSet,
    obtenerPorInstructor,
    // Aliases para compatibilidad
    crear,
    obtenerPorId,
    actualizar,
    eliminar
} from './exerciseSetController';

// ============================================================================
// CONTROLADOR PREGUNTAS - Cuando esté implementado
// ============================================================================
// export {
//     obtenerPreguntasDeExerciseSet,
//     obtenerPreguntaPorId,
//     crearPregunta,
//     actualizarPregunta,
//     eliminarPregunta,
//     reordenarPreguntas
// } from './questionController';

// ============================================================================
// CONTROLADORES FUTUROS - Para implementar después
// ============================================================================
// export {
//     iniciarIntento,
//     obtenerIntentoActual,
//     completarIntento,
//     obtenerPorEstudiante,
//     actualizarCalificacion
// } from './studentAttemptController';

// export {
//     enviarRespuesta,
//     obtenerRespuesta,
//     validarRespuesta,
//     obtenerRespuestasPorIntento
// } from './questionResponseController';