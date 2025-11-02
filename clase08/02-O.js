/*
=====================================
PRINCIPIO SOLID: O - Open/Closed Principle (OCP)
=====================================

DEFINICIÓN: Las clases deben estar abiertas para extensión, pero cerradas para modificación.
Esto significa que deberías poder extender el comportamiento de una clase sin modificar su código existente.

CONTEXTO: Sistema de E-commerce - Métodos de Pago
*/

console.log("=== PRINCIPIO SOLID: O - Open/Closed Principle ===\n");

// EJEMPLO INCORRECTO - Violación del OCP
console.log("EJEMPLO INCORRECTO - Violación del OCP");
console.log("--------------------------------------");

// Esta clase viola el OCP porque cada vez que agregamos un nuevo método de pago,
// tenemos que modificar la clase existente
class ProcesadorPagosIncorrecto {
    /**
     * Procesa un pago según el tipo especificado
     * PROBLEMA: Este método viola OCP porque requiere modificación cada vez que se agrega un nuevo tipo de pago
     * @param {string} tipoPago - Tipo de método de pago ('tarjeta_credito', 'paypal', etc.)
     * @param {number} monto - Cantidad a procesar
     * @param {object} datos - Datos específicos del método de pago
     * @returns {object} Resultado del procesamiento del pago
     */
    procesarPago(tipoPago, monto, datos) {
        console.log(`\n Procesando pago de $${monto} con ${tipoPago}...`);
        
        // PROBLEMA: Cada nuevo método de pago requiere modificar esta clase
        switch (tipoPago) {
            case 'tarjeta_credito':
                return this.procesarTarjetaCredito(monto, datos);
            
            case 'paypal':
                return this.procesarPayPal(monto, datos);
            
            case 'transferencia':
                return this.procesarTransferencia(monto, datos);
            
            // Si queremos agregar Bitcoin, tenemos que modificar esta clase
            case 'bitcoin':
                return this.procesarBitcoin(monto, datos);
            
            // Si queremos agregar Apple Pay, tenemos que modificar esta clase
            case 'apple_pay':
                return this.procesarApplePay(monto, datos);
            
            default:
                throw new Error(`Método de pago ${tipoPago} no soportado`);
        }
    }

    /**
     * Procesa pagos con tarjeta de crédito
     * Incluye validación de tarjeta, CVV y procesamiento bancario
     * @param {number} monto - Monto a cobrar
     * @param {object} datos - Objeto con numero de tarjeta y CVV
     * @returns {object} Resultado con transaccionId y comisión aplicada
     */
    procesarTarjetaCredito(monto, datos) {
        console.log(`   → Validando tarjeta: ${datos.numero.slice(-4)}`);
        console.log(`   → Verificando CVV: ${datos.cvv}`);
        console.log(`   → Procesando con gateway bancario...`);
        return { 
            exitoso: true, 
            transaccionId: `TC_${Date.now()}`,
            comision: monto * 0.03 // 3% comisión
        };
    }

    /**
     * Procesa pagos a través de PayPal
     * Redirige al usuario a PayPal para autenticación y procesamiento
     * @param {number} monto - Monto a cobrar
     * @param {object} datos - Objeto con email del usuario
     * @returns {object} Resultado con transaccionId y comisión aplicada
     */
    procesarPayPal(monto, datos) {
        console.log(`   → Redirigiendo a PayPal para ${datos.email}`);
        console.log(`   → Verificando cuenta PayPal...`);
        return { 
            exitoso: true, 
            transaccionId: `PP_${Date.now()}`,
            comision: monto * 0.035 // 3.5% comisión
        };
    }

    /**
     * Procesa transferencias bancarias directas
     * Valida la cuenta bancaria y procesa mediante ACH (Automated Clearing House)
     * @param {number} monto - Monto a transferir
     * @param {object} datos - Objeto con número de cuenta bancaria
     * @returns {object} Resultado con transaccionId y comisión aplicada
     */
    procesarTransferencia(monto, datos) {
        console.log(`   → Validando cuenta bancaria: ${datos.numeroCuenta}`);
        console.log(`   → Procesando transferencia ACH...`);
        return { 
            exitoso: true, 
            transaccionId: `TR_${Date.now()}`,
            comision: monto * 0.01 // 1% comisión
        };
    }

    // Nuevos métodos agregados - violando OCP
    /**
     * Procesa pagos con Bitcoin (criptomoneda)
     * VIOLACIÓN OCP: Este método se agregó modificando la clase existente
     * @param {number} monto - Monto en Bitcoin a transferir
     * @param {object} datos - Objeto con dirección de wallet Bitcoin
     * @returns {object} Resultado con transaccionId y comisión aplicada
     */
    procesarBitcoin(monto, datos) {
        console.log(`   → Validando wallet Bitcoin: ${datos.walletAddress}`);
        console.log(`   → Calculando fees de red...`);
        return { 
            exitoso: true, 
            transaccionId: `BTC_${Date.now()}`,
            comision: monto * 0.02 // 2% comisión
        };
    }

    /**
     * Procesa pagos con Apple Pay
     * VIOLACIÓN OCP: Este método se agregó modificando la clase existente
     * @param {number} monto - Monto a cobrar
     * @param {object} datos - Objeto con información del dispositivo Apple
     * @returns {object} Resultado con transaccionId y comisión aplicada
     */
    procesarApplePay(monto, datos) {
        console.log(`   → Verificando Touch ID/Face ID`);
        console.log(`   → Procesando con Apple Pay...`);
        return { 
            exitoso: true, 
            transaccionId: `AP_${Date.now()}`,
            comision: monto * 0.025 // 2.5% comisión
        };
    }
}

// Demostración del problema
console.log("🔧 Simulando uso del procesador incorrecto:");
const procesadorIncorrecto = new ProcesadorPagosIncorrecto();

try {
    // Pagos existentes
    let resultado1 = procesadorIncorrecto.procesarPago('tarjeta_credito', 100, {
        numero: '1234567890123456',
        cvv: '123'
    });
    console.log(`Resultado: ${resultado1.transaccionId}, Comisión: $${resultado1.comision}`);

    let resultado2 = procesadorIncorrecto.procesarPago('paypal', 150, {
        email: 'usuario@email.com'
    });
    console.log(`Resultado: ${resultado2.transaccionId}, Comisión: $${resultado2.comision}`);

    // Intentar usar un método no implementado aún
    procesadorIncorrecto.procesarPago('google_pay', 75, {});
    
} catch (error) {
    console.log(`Error: ${error.message}`);
}

console.log("\n" + "=".repeat(80) + "\n");




// EJEMPLO CORRECTO - Aplicando OCP
console.log("EJEMPLO CORRECTO - Aplicando OCP");
console.log("--------------------------------");

// Interfaz/Contrato base para todos los métodos de pago
class MetodoPago {
    /**
     * Procesa un pago con el método específico
     * Método abstracto que debe ser implementado por cada subclase
     * @param {number} monto - Monto a procesar
     * @param {object} datos - Datos específicos del método de pago
     * @returns {object} Resultado del procesamiento
     * @throws {Error} Si no se implementa en la subclase
     */
    procesar(monto, datos) {
        throw new Error("El método procesar debe ser implementado");
    }

    /**
     * Calcula la comisión específica para este método de pago
     * Método abstracto que permite diferentes estructuras de comisiones
     * @param {number} monto - Monto base para calcular comisión
     * @returns {number} Monto de la comisión
     * @throws {Error} Si no se implementa en la subclase
     */
    calcularComision(monto) {
        throw new Error("El método calcularComision debe ser implementado");
    }

    /**
     * Retorna el nombre descriptivo del método de pago
     * Método abstracto para identificación del tipo de pago
     * @returns {string} Nombre del método de pago
     * @throws {Error} Si no se implementa en la subclase
     */
    obtenerTipo() {
        throw new Error("El método obtenerTipo debe ser implementado");
    }
}

// Implementaciones específicas - Cada una es una extensión
class TarjetaCredito extends MetodoPago {
    /**
     * Procesa pagos con tarjeta de crédito
     * Implementación específica que extiende MetodoPago sin modificar la clase base
     * @param {number} monto - Monto a cobrar
     * @param {object} datos - Objeto con {numero, cvv}
     * @returns {object} Resultado completo del procesamiento
     */
    procesar(monto, datos) {
        console.log(`   → Validando tarjeta: ****${datos.numero.slice(-4)}`);
        console.log(`   → Verificando CVV: ${datos.cvv}`);
        console.log(`   → Procesando con gateway bancario...`);
        
        return {
            exitoso: true,
            transaccionId: `TC_${Date.now()}`,
            comision: this.calcularComision(monto),
            metodoPago: this.obtenerTipo()
        };
    }

    /**
     * Calcula la comisión para tarjetas de crédito
     * Implementación específica del cálculo de comisión (3%)
     * @param {number} monto - Monto base
     * @returns {number} Comisión calculada
     */
    calcularComision(monto) {
        return monto * 0.03; // 3% comisión
    }

    /**
     * Retorna el tipo de método de pago
     * Identificador específico para este método
     * @returns {string} Nombre del método de pago
     */
    obtenerTipo() {
        return 'Tarjeta de Crédito';
    }
}

class PayPal extends MetodoPago {
    /**
     * Procesa pagos a través de PayPal
     * Nueva implementación que extiende sin modificar código existente
     * @param {number} monto - Monto a cobrar
     * @param {object} datos - Objeto con {email}
     * @returns {object} Resultado completo del procesamiento
     */
    procesar(monto, datos) {
        console.log(`   → Redirigiendo a PayPal para ${datos.email}`);
        console.log(`   → Verificando cuenta PayPal...`);
        
        return {
            exitoso: true,
            transaccionId: `PP_${Date.now()}`,
            comision: this.calcularComision(monto),
            metodoPago: this.obtenerTipo()
        };
    }

    /**
     * Calcula la comisión para PayPal
     * Comisión específica de PayPal (3.5%)
     * @param {number} monto - Monto base
     * @returns {number} Comisión calculada
     */
    calcularComision(monto) {
        return monto * 0.035; // 3.5% comisión
    }

    /**
     * Retorna el tipo de método de pago
     * Identificador específico para PayPal
     * @returns {string} Nombre del método de pago
     */
    obtenerTipo() {
        return 'PayPal';
    }
}

class TransferenciaBancaria extends MetodoPago {
    /**
     * Procesa transferencias bancarias directas
     * Implementación específica para transferencias ACH
     * @param {number} monto - Monto a transferir
     * @param {object} datos - Objeto con {numeroCuenta}
     * @returns {object} Resultado completo del procesamiento
     */
    procesar(monto, datos) {
        console.log(`   → Validando cuenta bancaria: ****${datos.numeroCuenta.slice(-4)}`);
        console.log(`   → Procesando transferencia ACH...`);
        
        return {
            exitoso: true,
            transaccionId: `TR_${Date.now()}`,
            comision: this.calcularComision(monto),
            metodoPago: this.obtenerTipo()
        };
    }

    /**
     * Calcula la comisión para transferencias bancarias
     * Comisión más baja para transferencias directas (1%)
     * @param {number} monto - Monto base
     * @returns {number} Comisión calculada
     */
    calcularComision(monto) {
        return monto * 0.01; // 1% comisión
    }

    /**
     * Retorna el tipo de método de pago
     * Identificador específico para transferencias
     * @returns {string} Nombre del método de pago
     */
    obtenerTipo() {
        return 'Transferencia Bancaria';
    }
}

// NUEVAS EXTENSIONES - Sin modificar código existente
class Bitcoin extends MetodoPago {
    /**
     * Procesa pagos con Bitcoin (criptomoneda)
     * EXTENSIÓN: Nueva funcionalidad agregada SIN modificar clases existentes
     * @param {number} monto - Monto en Bitcoin a transferir
     * @param {object} datos - Objeto con {walletAddress}
     * @returns {object} Resultado completo del procesamiento blockchain
     */
    procesar(monto, datos) {
        console.log(`   → Validando wallet Bitcoin: ${datos.walletAddress.slice(0, 8)}...`);
        console.log(`   → Calculando fees de red blockchain...`);
        console.log(`   → Enviando transacción a la red Bitcoin...`);
        
        return {
            exitoso: true,
            transaccionId: `BTC_${Date.now()}`,
            comision: this.calcularComision(monto),
            metodoPago: this.obtenerTipo()
        };
    }

    /**
     * Calcula la comisión para Bitcoin
     * Comisión específica para transacciones blockchain (2%)
     * @param {number} monto - Monto base
     * @returns {number} Comisión calculada
     */
    calcularComision(monto) {
        return monto * 0.02; // 2% comisión
    }

    /**
     * Retorna el tipo de método de pago
     * Identificador específico para Bitcoin
     * @returns {string} Nombre del método de pago
     */
    obtenerTipo() {
        return 'Bitcoin';
    }
}

class ApplePay extends MetodoPago {
    /**
     * Procesa pagos con Apple Pay
     * EXTENSIÓN: Método de pago móvil agregado sin tocar código existente
     * @param {number} monto - Monto a cobrar
     * @param {object} datos - Objeto con {deviceId}
     * @returns {object} Resultado completo del procesamiento móvil
     */
    procesar(monto, datos) {
        console.log(`   → Verificando Touch ID/Face ID`);
        console.log(`   → Validando dispositivo autorizado`);
        console.log(`   → Procesando con Apple Pay...`);
        
        return {
            exitoso: true,
            transaccionId: `AP_${Date.now()}`,
            comision: this.calcularComision(monto),
            metodoPago: this.obtenerTipo()
        };
    }

    /**
     * Calcula la comisión para Apple Pay
     * Comisión competitiva para pagos móviles (2.5%)
     * @param {number} monto - Monto base
     * @returns {number} Comisión calculada
     */
    calcularComision(monto) {
        return monto * 0.025; // 2.5% comisión
    }

    /**
     * Retorna el tipo de método de pago
     * Identificador específico para Apple Pay
     * @returns {string} Nombre del método de pago
     */
    obtenerTipo() {
        return 'Apple Pay';
    }
}

class GooglePay extends MetodoPago {
    /**
     * Procesa pagos con Google Pay
     * EXTENSIÓN: Otro método de pago móvil agregado independientemente
     * @param {number} monto - Monto a cobrar
     * @param {object} datos - Objeto con {googleAccount}
     * @returns {object} Resultado completo del procesamiento
     */
    procesar(monto, datos) {
        console.log(`   → Verificando cuenta Google`);
        console.log(`   → Validando autenticación biométrica`);
        console.log(`   → Procesando con Google Pay...`);
        
        return {
            exitoso: true,
            transaccionId: `GP_${Date.now()}`,
            comision: this.calcularComision(monto),
            metodoPago: this.obtenerTipo()
        };
    }

    /**
     * Calcula la comisión para Google Pay
     * Comisión específica para el ecosistema Google (2.8%)
     * @param {number} monto - Monto base
     * @returns {number} Comisión calculada
     */
    calcularComision(monto) {
        return monto * 0.028; // 2.8% comisión
    }

    /**
     * Retorna el tipo de método de pago
     * Identificador específico para Google Pay
     * @returns {string} Nombre del método de pago
     */
    obtenerTipo() {
        return 'Google Pay';
    }
}

// Procesador que cumple con OCP - Cerrado para modificación, abierto para extensión
class ProcesadorPagos {
    /**
     * Constructor del procesador de pagos
     * Inicializa el Map para almacenar métodos de pago registrados
     */
    constructor() {
        this.metodosPago = new Map();
    }

    /**
     * Registra un nuevo método de pago en el sistema
     * EXTENSIÓN: Permite agregar nuevos métodos sin modificar la clase
     * @param {string} nombre - Nombre identificador del método de pago
     * @param {MetodoPago} metodoPago - Instancia que implementa la interfaz MetodoPago
     * @throws {Error} Si el método no extiende MetodoPago
     */
    registrarMetodoPago(nombre, metodoPago) {
        if (!(metodoPago instanceof MetodoPago)) {
            throw new Error("El método de pago debe extender la clase MetodoPago");
        }
        this.metodosPago.set(nombre, metodoPago);
        console.log(`Método de pago '${nombre}' registrado exitosamente`);
    }

    /**
     * Procesa un pago usando el método especificado
     * CERRADO PARA MODIFICACIÓN: Este método nunca necesita cambios
     * ABIERTO PARA EXTENSIÓN: Funciona con cualquier método que implemente MetodoPago
     * @param {string} nombreMetodo - Nombre del método de pago registrado
     * @param {number} monto - Monto a procesar
     * @param {object} datos - Datos específicos del método de pago
     * @returns {object} Resultado completo del procesamiento
     * @throws {Error} Si el método no está registrado
     */
    procesarPago(nombreMetodo, monto, datos) {
        console.log(`\n Procesando pago de $${monto} con ${nombreMetodo}...`);
        
        const metodoPago = this.metodosPago.get(nombreMetodo);
        if (!metodoPago) {
            throw new Error(`Método de pago '${nombreMetodo}' no está registrado`);
        }

        const resultado = metodoPago.procesar(monto, datos);
        console.log(`Pago procesado: ${resultado.transaccionId}`);
        console.log(`Comisión aplicada: $${resultado.comision.toFixed(2)}`);
        
        return resultado;
    }

    /**
     * Lista todos los métodos de pago disponibles en el sistema
     * Utilidad para mostrar opciones disponibles al usuario
     * Funciona automáticamente con cualquier método registrado
     */
    listarMetodosDisponibles() {
        console.log("\n Métodos de pago disponibles:");
        this.metodosPago.forEach((metodo, nombre) => {
            console.log(`   • ${nombre} (${metodo.obtenerTipo()})`);
        });
    }
}

// Demostración del diseño correcto
console.log("Configurando procesador que cumple con OCP:");

const procesador = new ProcesadorPagos();

// Registrar métodos de pago iniciales
procesador.registrarMetodoPago('tarjeta', new TarjetaCredito());
procesador.registrarMetodoPago('paypal', new PayPal());
procesador.registrarMetodoPago('transferencia', new TransferenciaBancaria());

console.log("\n FASE 1: Métodos de pago tradicionales");
procesador.listarMetodosDisponibles();

// Procesar algunos pagos
let resultado1 = procesador.procesarPago('tarjeta', 200, {
    numero: '1234567890123456',
    cvv: '123'
});

let resultado2 = procesador.procesarPago('paypal', 150, {
    email: 'cliente@tienda.com'
});

console.log("\n" + "-".repeat(60));

// EXTENDER funcionalidad SIN MODIFICAR código existente
console.log("\n FASE 2: Agregando métodos de pago modernos (SIN MODIFICAR código existente)");

procesador.registrarMetodoPago('bitcoin', new Bitcoin());
procesador.registrarMetodoPago('apple_pay', new ApplePay());
procesador.registrarMetodoPago('google_pay', new GooglePay());

procesador.listarMetodosDisponibles();

// Usar los nuevos métodos
let resultado3 = procesador.procesarPago('bitcoin', 500, {
    walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
});

let resultado4 = procesador.procesarPago('apple_pay', 75, {
    deviceId: 'iPhone12Pro'
});

let resultado5 = procesador.procesarPago('google_pay', 120, {
    googleAccount: 'usuario@gmail.com'
});

console.log("\n" + "=".repeat(80));
console.log("VENTAJAS DEL OPEN/CLOSED PRINCIPLE:");
console.log("• Agregar nuevos métodos de pago SIN modificar código existente");
console.log("• Reduce el riesgo de introducir bugs en funcionalidad existente");
console.log("• Facilita el mantenimiento y las pruebas");
console.log("• Permite desarrollo paralelo por equipos diferentes");
console.log("• Código más robusto y estable");
console.log("• Cumple con el principio de responsabilidad única");
console.log("=".repeat(80));

// Demostrar manejo de errores
console.log("\n PRUEBA: Intentando usar método no registrado");
try {
    procesador.procesarPago('metodo_inexistente', 100, {});
} catch (error) {
    console.log(` Error controlado: ${error.message}`);
}