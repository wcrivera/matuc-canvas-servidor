// ============================================================================
// CONTROLLERS INDEX - EXPORTS CORREGIDOS
// ============================================================================

// Import de exercise set controller con nombres correctos
import {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
} from './exerciseSetController';

// TODO: Import de question controller cuando esté corregido
// import {
//     obtenerTodos as obtenerTodasPreguntas,
//     obtenerPorId as obtenerPreguntaPorId,
//     crear as crearPregunta,
//     actualizar as actualizarPregunta,
//     eliminar as eliminarPregunta
// } from './questionController';

// Export con nombres consistentes para ejercicios
export const exerciseSetController = {
    // Nombres nuevos y consistentes
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,

    // Alias para compatibilidad con routes existentes
    obtenerExerciseSets: obtenerTodos,
    obtenerExerciseSetPorId: obtenerPorId,
    crearExerciseSet: crear,
    actualizarExerciseSet: actualizar,
    eliminarExerciseSet: eliminar,

    // Funciones que faltan - TODO: implementar
    togglePublicarExerciseSet: async (req: any, res: any) => {
        return res.status(501).json({
            ok: false,
            message: 'togglePublicarExerciseSet no implementado aún'
        });
    },

    obtenerPorInstructor: async (req: any, res: any) => {
        return res.status(501).json({
            ok: false,
            message: 'obtenerPorInstructor no implementado aún'
        });
    }
};

// Export individual para imports directos
export {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};

// TODO: Export de question controller cuando esté listo
// export const questionController = {
//     obtenerTodos: obtenerTodasPreguntas,
//     obtenerPorId: obtenerPreguntaPorId,
//     crear: crearPregunta,
//     actualizar: actualizarPregunta,
//     eliminar: eliminarPregunta
// };