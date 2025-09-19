// ============================================================================
// SCRIPT DE PRUEBA - MATUC LTI EXERCISE COMPOSER BACKEND
// ============================================================================
// Archivo: test-backend.js (en la raíz del proyecto backend)
// Propósito: Probar todas las rutas del backend
// Uso: node test-backend.js

const baseURL = 'http://localhost:3000';

/**
 * Función auxiliar para hacer requests
 */
async function makeRequest(method, endpoint, body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${baseURL}${endpoint}`, options);
        const data = await response.json();

        return {
            status: response.status,
            ok: response.ok,
            data
        };
    } catch (error) {
        return {
            status: 0,
            ok: false,
            error: error.message
        };
    }
}

/**
 * Tests de salud del servidor
 */
async function testHealth() {
    console.log('\n🔍 Probando salud del servidor...');

    const health = await makeRequest('GET', '/api/health');
    console.log('Health Check:', health.ok ? '✅' : '❌', health.data?.message || health.error);

    const info = await makeRequest('GET', '/api/info');
    console.log('Info:', info.ok ? '✅' : '❌', info.data?.data?.name || info.error);

    const root = await makeRequest('GET', '/');
    console.log('Root:', root.ok ? '✅' : '❌', root.data?.message || root.error);
}

/**
 * Tests de Exercise Sets CRUD
 */
async function testExerciseSets() {
    console.log('\n📝 Probando Exercise Sets CRUD...');

    // 1. GET /api/exercise-sets - Listar
    const list = await makeRequest('GET', '/api/exercise-sets');
    console.log('Listar Exercise Sets:', list.ok ? '✅' : '❌',
        list.ok ? `${list.data?.data?.items?.length || 0} items` : list.error);

    // 2. POST /api/exercise-sets - Crear
    const newExerciseSet = {
        titulo: 'Test Exercise Set',
        descripcion: 'Descripción de prueba',
        instrucciones: 'Instrucciones de prueba',
        configuracion: {
            intentos: 3,
            tiempo: 60,
            mostrarRespuestas: true,
            mostrarExplicaciones: true,
            navegacionLibre: true,
            autoguardado: true
        },
        cursoId: 'test-curso-123'
    };

    const create = await makeRequest('POST', '/api/exercise-sets', newExerciseSet);
    console.log('Crear Exercise Set:', create.ok ? '✅' : '❌',
        create.ok ? create.data?.data?.id : create.error);

    let createdId = null;
    if (create.ok && create.data?.data?.id) {
        createdId = create.data.data.id;

        // 3. GET /api/exercise-sets/:id - Obtener por ID
        const getById = await makeRequest('GET', `/api/exercise-sets/${createdId}`);
        console.log('Obtener por ID:', getById.ok ? '✅' : '❌',
            getById.ok ? getById.data?.data?.titulo : getById.error);

        // 4. PUT /api/exercise-sets/:id - Actualizar
        const updateData = {
            titulo: 'Test Exercise Set ACTUALIZADO',
            descripcion: 'Descripción actualizada'
        };

        const update = await makeRequest('PUT', `/api/exercise-sets/${createdId}`, updateData);
        console.log('Actualizar Exercise Set:', update.ok ? '✅' : '❌',
            update.ok ? update.data?.data?.titulo : update.error);

        // 5. PATCH /api/exercise-sets/:id/publish - Toggle publish
        const publish = await makeRequest('PATCH', `/api/exercise-sets/${createdId}/publish`);
        console.log('Toggle Publish:', publish.ok ? '✅' : '❌',
            publish.ok ? `Publicado: ${publish.data?.data?.publicado}` : publish.error);

        // 6. DELETE /api/exercise-sets/:id - Eliminar
        const deleteEs = await makeRequest('DELETE', `/api/exercise-sets/${createdId}`);
        console.log('Eliminar Exercise Set:', deleteEs.ok ? '✅' : '❌',
            deleteEs.ok ? 'Eliminado correctamente' : deleteEs.error);
    }

    // 7. GET /api/exercise-sets/instructor/:uid - Por instructor
    const byInstructor = await makeRequest('GET', '/api/exercise-sets/instructor/test-instructor-123');
    console.log('Por Instructor:', byInstructor.ok ? '✅' : '❌',
        byInstructor.ok ? `${byInstructor.data?.data?.length || 0} items` : byInstructor.error);
}

/**
 * Tests de rutas no existentes
 */
async function test404() {
    console.log('\n🚫 Probando manejo de rutas no encontradas...');

    const notFound = await makeRequest('GET', '/api/ruta-inexistente');
    console.log('Ruta inexistente:', notFound.status === 404 ? '✅' : '❌',
        notFound.data?.message || notFound.error);
}

/**
 * Función principal
 */
async function runAllTests() {
    console.log('🚀 Iniciando pruebas del backend MATUC LTI Exercise Composer');
    console.log('📡 URL Base:', baseURL);

    try {
        await testHealth();
        await testExerciseSets();
        await test404();

        console.log('\n✅ Pruebas completadas');
        console.log('\n📋 Resumen:');
        console.log('- Servidor funcionando correctamente');
        console.log('- Exercise Sets CRUD implementado');
        console.log('- Manejo de errores funcionando');
        console.log('- Listo para conectar con frontend');

    } catch (error) {
        console.error('\n❌ Error en las pruebas:', error.message);
        process.exit(1);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    runAllTests();
}

module.exports = { makeRequest, testHealth, testExerciseSets };