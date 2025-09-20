// ============================================================================
// CONTROLLERS INDEX - BARREL EXPORTS
// ============================================================================
// Archivo: src/controllers/index.ts
// Propósito: Exportar todos los controladores desde un punto central

// User Controller exports
export {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorUID,
    actualizarUsuario,
    eliminarUsuario,
    crearAdminPorDefecto,
    obtenerEstadisticasUsuarios
} from './userController';

// TODO: Agregar exports de otros controladores cuando se creen
// export { ... } from './exerciseSetController';
// export { ... } from './questionController';
// export { ... } from './attemptController';