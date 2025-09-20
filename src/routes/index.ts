// ============================================================================
// ROUTES INDEX - BARREL EXPORTS
// ============================================================================
// Archivo: src/routes/index.ts
// Propósito: Exportar todas las rutas desde un punto central

import userRoutes from './userRoutes';

// Exportar rutas individuales
export { default as userRoutes } from './userRoutes';

// TODO: Agregar exports de otras rutas cuando se creen
// export { default as exerciseSetRoutes } from './exerciseSetRoutes';
// export { default as questionRoutes } from './questionRoutes';
// export { default as attemptRoutes } from './attemptRoutes';

// Objeto consolidado de todas las rutas (opcional)
export const routes = {
    users: userRoutes,
    // TODO: Agregar otras rutas
    // exerciseSets: exerciseSetRoutes,
    // questions: questionRoutes,
    // attempts: attemptRoutes,
};

export default routes;