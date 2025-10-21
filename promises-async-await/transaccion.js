// ========================================
// EJERCICIO: PROMISES Y ASYNC/AWAIT EN JAVASCRIPT
// Sistema de Transacciones de E-commerce
// ========================================

/*
OBJETIVO DEL EJERCICIO:
- Demostrar el uso de Promises para operaciones asíncronas
- Mostrar cómo async/await mejora la legibilidad del código
- Simular un flujo real de transacción con validaciones
- Manejar errores con try/catch en operaciones asíncronas
*/

// ========================================
// PARTE 1: CREACIÓN DE UNA PROMISE
// ========================================

// Función base que devuelve una Promesa
// Una Promise representa una operación que puede completarse en el futuro
function validarStock(productoId) {
    // new Promise() crea una nueva promesa con dos parámetros:
    // - resolve: función para cuando la operación es exitosa
    // - reject: función para cuando la operación falla
    return new Promise((resolve, reject) => {
        
        // SIMULACIÓN DE OPERACIÓN ASÍNCRONA:
        // setTimeout simula una consulta a base de datos o API externa
        // En la vida real esto sería: consulta a DB, llamada a API, etc.
        setTimeout(() => {
            
            // LÓGICA DE VALIDACIÓN:
            // Simulamos que el producto 99 no tiene stock disponible
            if (productoId === 99) {
                // reject() se llama cuando hay un error o falla
                // Esto hará que la Promise sea "rejected" (rechazada)
                reject("Producto 99 no tiene stock.");
            } else {
                // resolve() se llama cuando la operación es exitosa
                // Esto hará que la Promise sea "resolved" (resuelta)
                resolve(`Stock validado para producto ${productoId}.`);
            }
        }, 500); // 500ms = medio segundo de latencia simulada
    });
}

// ========================================
// PARTE 2: USANDO ASYNC/AWAIT
// ========================================

// Función que utiliza async/await para ejecutar pasos en orden legible
// ASYNC: declara que esta función contiene operaciones asíncronas
// Permite usar AWAIT dentro de la función
async function procesarTransaccion(productoId, metodoPago) {
    
    // TRY/CATCH: maneja errores de las operaciones asíncronas
    // Si cualquier Promise es rechazada, saltará al bloque CATCH
    try {
        console.log("1. Iniciando proceso de transacción...");
        
        // AWAIT: PAUSA la ejecución y ESPERA a que la Promise se resuelva
        // Es como decir: "espera hasta que validarStock() termine"
        // Convierte código asíncrono en código que PARECE síncrono
        const validacion = await validarStock(productoId);
        console.log("2. Stock verificado:", validacion); 
        
        // SEGUNDA OPERACIÓN ASÍNCRONA:
        // Si el stock es OK, procedemos al pago (otra simulación asíncrona)
        // Creamos una Promise inline que simula procesamiento de pago
        const pago = await new Promise(resolve => {
            setTimeout(() => {
                // Simulamos que el pago tarda 800ms en procesarse
                resolve(`Pago ${metodoPago} procesado con éxito.`);
            }, 800);
        });
        console.log("3. Pago completado:", pago);

        // Si llegamos hasta aquí, todo salió bien
        return "Transacción Finalizada con Éxito.";

    } catch (error) {
        // CATCH: captura cualquier 'reject' de las Promises
        // Esto incluye errores de validarStock() o del procesamiento de pago
        console.error("ERROR CRÍTICO:", error);
        return "Transacción Fallida.";
    }
}

// ========================================
// PARTE 3: EJECUCIÓN Y PRUEBAS
// ========================================

// CASO DE ÉXITO: Ejecutar el flujo exitoso
// procesarTransaccion() devuelve una Promise porque es una función async
// Usamos .then() para manejar el resultado cuando se complete
console.log("=".repeat(50));
console.log("INICIANDO PRUEBAS DE TRANSACCIONES");
console.log("=".repeat(50));

// PRUEBA 1: Transacción exitosa (producto con stock disponible)
console.log("\n PRUEBA 1: Transacción exitosa");
console.log("-".repeat(30));
procesarTransaccion(10, "Tarjeta").then(resultado => {
    console.log(" RESULTADO FINAL:", resultado);
    console.log("-".repeat(30));
});

// PRUEBA 2: Transacción fallida (producto sin stock)
// Esperamos un poco antes de la segunda prueba para mejor visualización
setTimeout(() => {
    console.log("\n PRUEBA 2: Transacción fallida (sin stock)");
    console.log("-".repeat(30));
    procesarTransaccion(99, "Paypal").then(resultado => {
        console.log("RESULTADO FINAL:", resultado);
        console.log("=".repeat(50));
        console.log("EJERCICIO COMPLETADO");
        console.log("=".repeat(50));
    });
}, 2000); // Esperamos 2 segundos para que termine la primera prueba

// ========================================
// CONCEPTOS CLAVE DEMOSTRADOS:
// ========================================

/*
1. PROMISES (Promesas):
   - Representan operaciones que pueden completarse en el futuro
   - Tienen 3 estados: pending, resolved, rejected
   - Permiten manejar código asíncrono de forma más elegante

2. ASYNC/AWAIT:
   - async: declara que una función contiene operaciones asíncronas
   - await: pausa la ejecución hasta que una Promise se resuelve
   - Hace que el código asíncrono se lea como código síncrono

3. TRY/CATCH:
   - Maneja errores en operaciones asíncronas
   - Captura automáticamente Promises rechazadas (reject)

4. FLUJO DE EJECUCIÓN:
   - Las operaciones se ejecutan en orden secuencial
   - Cada await espera a que termine antes de continuar
   - Si hay error, salta inmediatamente al catch

5. CASOS DE USO REALES:
   - Validación de stock en base de datos
   - Procesamiento de pagos con APIs externas
   - Cualquier operación que tome tiempo (red, archivos, etc.)
*/ 