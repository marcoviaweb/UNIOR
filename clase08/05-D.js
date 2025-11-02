/*
=========================================================
PRINCIPIO SOLID: D - Dependency Inversion Principle (DIP)
=========================================================

DEFINICIÓN: Los módulos de alto nivel no deberían depender de módulos de bajo nivel.
Ambos deberían depender de abstracciones. Las abstracciones no deberían depender 
de detalles; los detalles deberían depender de abstracciones.

En otras palabras: Programa contra interfaces/abstracciones, no contra implementaciones concretas.
Esto permite flexibilidad, testabilidad y facilita el cambio de implementaciones.

CONTEXTO: Sistema de E-commerce - Gestión de Pagos, Notificaciones y Persistencia
*/

console.log("=== PRINCIPIO SOLID: D - Dependency Inversion Principle ===\n");

// EJEMPLO INCORRECTO - Violación del DIP
console.log("EJEMPLO INCORRECTO - Violación del DIP");
console.log("--------------------------------------");

/**
 * CLASE DE BAJO NIVEL - Implementación concreta de base de datos MySQL
 * Esta es una implementación específica que será usada directamente por módulos de alto nivel
 */
class MySQLDatabase {
    /**
     * Conecta específicamente a MySQL
     */
    conectar() {
        console.log("Conectando a base de datos MySQL...");
        return true;
    }

    /**
     * Guarda datos específicamente en MySQL
     * @param {string} tabla - Nombre de la tabla MySQL
     * @param {object} datos - Datos a guardar
     */
    guardar(tabla, datos) {
        console.log(`Ejecutando INSERT en tabla MySQL '${tabla}': ${JSON.stringify(datos)}`);
        return { id: Math.floor(Math.random() * 1000), tabla, datos };
    }

    /**
     * Busca datos específicamente en MySQL
     * @param {string} tabla - Nombre de la tabla MySQL
     * @param {number} id - ID a buscar
     */
    buscar(tabla, id) {
        console.log(`Ejecutando SELECT en tabla MySQL '${tabla}' WHERE id = ${id}`);
        return { id, encontrado: true, fuente: 'MySQL' };
    }

    /**
     * Cierra conexión específica de MySQL
     */
    desconectar() {
        console.log("Cerrando conexión MySQL");
        return true;
    }
}

/**
 * CLASE DE BAJO NIVEL - Servicio específico de email SMTP
 */
class SMTPEmailService {
    /**
     * Configura específicamente servidor SMTP
     * @param {string} servidor - Servidor SMTP
     * @param {number} puerto - Puerto SMTP
     */
    configurar(servidor, puerto) {
        this.servidor = servidor;
        this.puerto = puerto;
        console.log(`Configurando servidor SMTP: ${servidor}:${puerto}`);
        return true;
    }

    /**
     * Envía email específicamente vía SMTP
     * @param {string} destinatario - Email destinatario
     * @param {string} asunto - Asunto del email
     * @param {string} mensaje - Contenido del mensaje
     */
    enviarEmail(destinatario, asunto, mensaje) {
        console.log(`Enviando email SMTP a ${destinatario}`);
        console.log(`Asunto: ${asunto}`);
        console.log(`Mensaje: ${mensaje}`);
        console.log(`Via servidor SMTP: ${this.servidor}:${this.puerto}`);
        return { enviado: true, protocolo: 'SMTP' };
    }
}

/**
 * CLASE DE BAJO NIVEL - Procesador específico de PayPal
 */
class PayPalProcessor {
    /**
     * Configura específicamente credenciales de PayPal
     * @param {string} clientId - Client ID de PayPal
     * @param {string} clientSecret - Client Secret de PayPal
     */
    configurarCredenciales(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        console.log(`Configurando PayPal con Client ID: ${clientId}`);
        return true;
    }

    /**
     * Procesa pago específicamente con PayPal
     * @param {number} monto - Monto a cobrar
     * @param {string} moneda - Tipo de moneda
     */
    procesarPago(monto, moneda) {
        console.log(`Procesando pago PayPal: ${monto} ${moneda}`);
        console.log(`Usando credenciales PayPal: ${this.clientId}`);
        return {
            transaccionId: `PAYPAL_${Date.now()}`,
            monto,
            moneda,
            gateway: 'PayPal'
        };
    }
}

/**
 * MÓDULO DE ALTO NIVEL - Violación del DIP
 * Esta clase depende directamente de implementaciones concretas de bajo nivel
 */
class ServicioPedidosIncorrecto {
    /**
     * Constructor que viola DIP: depende de clases concretas
     */
    constructor() {
        // VIOLACIÓN DIP: Dependencia directa de implementaciones concretas
        this.baseDatos = new MySQLDatabase();           // Acoplado a MySQL específicamente
        this.emailService = new SMTPEmailService();     // Acoplado a SMTP específicamente
        this.procesadorPago = new PayPalProcessor();    // Acoplado a PayPal específicamente
        
        // Configuraciones específicas hardcodeadas
        this.baseDatos.conectar();
        this.emailService.configurar('smtp.gmail.com', 587);
        this.procesadorPago.configurarCredenciales('CLIENT_ID_123', 'SECRET_456');
    }

    /**
     * Procesa un pedido - MÉTODO DE ALTO NIVEL que depende de detalles
     * @param {object} pedido - Datos del pedido
     */
    async procesarPedido(pedido) {
        console.log(`\nProcesando pedido: ${pedido.id}`);
        
        try {
            // PROBLEMA: Dependencia directa de MySQL específicamente
            const pedidoGuardado = this.baseDatos.guardar('pedidos', pedido);
            console.log(`Pedido guardado en MySQL con ID: ${pedidoGuardado.id}`);
            
            // PROBLEMA: Dependencia directa de PayPal específicamente
            const resultadoPago = this.procesadorPago.procesarPago(pedido.total, 'USD');
            console.log(`Pago procesado: ${resultadoPago.transaccionId}`);
            
            // Actualizar pedido con información de pago (otra consulta MySQL específica)
            const pedidoActualizado = this.baseDatos.guardar('pedidos', {
                ...pedido,
                transaccionId: resultadoPago.transaccionId,
                estado: 'pagado'
            });
            
            // PROBLEMA: Dependencia directa de SMTP específicamente
            const emailEnviado = this.emailService.enviarEmail(
                pedido.cliente.email,
                'Confirmación de Pedido',
                `Su pedido ${pedido.id} ha sido procesado exitosamente.`
            );
            
            console.log(`Pedido ${pedido.id} procesado completamente`);
            return {
                success: true,
                pedidoId: pedidoGuardado.id,
                transaccionId: resultadoPago.transaccionId,
                emailEnviado: emailEnviado.enviado
            };
            
        } catch (error) {
            console.log(`Error procesando pedido: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    /**
     * PROBLEMA: Si queremos cambiar a otra base de datos (ej: PostgreSQL),
     * tenemos que modificar esta clase de alto nivel
     */
    cambiarAPostgreSQL() {
        // Esto requiere modificar el código de alto nivel
        this.baseDatos.desconectar();
        // this.baseDatos = new PostgreSQLDatabase(); // Nueva dependencia concreta
        throw new Error("Cambio requiere modificación del código de alto nivel");
    }

    /**
     * PROBLEMA: Si queremos usar otro servicio de email (ej: SendGrid),
     * tenemos que modificar esta clase de alto nivel
     */
    cambiarASendGrid() {
        // Esto requiere modificar el código de alto nivel
        throw new Error("Cambio requiere modificación del código de alto nivel");
    }
}

// Demostración del problema con DIP violado
console.log("Demostrando violaciones del DIP:");

const servicioIncorrecto = new ServicioPedidosIncorrecto();

const pedidoEjemplo = {
    id: 'PED-001',
    cliente: {
        nombre: 'Juan Pérez',
        email: 'juan@email.com'
    },
    productos: [
        { nombre: 'Laptop', precio: 1000 },
        { nombre: 'Mouse', precio: 25 }
    ],
    total: 1025
};

servicioIncorrecto.procesarPedido(pedidoEjemplo);

console.log("\nProblemas del diseño actual:");
console.log("1. Acoplado específicamente a MySQL - difícil cambiar a PostgreSQL");
console.log("2. Acoplado específicamente a SMTP - difícil cambiar a SendGrid");
console.log("3. Acoplado específicamente a PayPal - difícil agregar Stripe");
console.log("4. Imposible hacer testing unitario - dependencias reales hardcodeadas");
console.log("5. Violación del principio abierto/cerrado");

console.log("\n" + "=".repeat(80) + "\n");





// EJEMPLO CORRECTO - Cumpliendo con DIP
console.log("EJEMPLO CORRECTO - Cumpliendo con DIP");
console.log("------------------------------------------------");

/*
==========================================
EXPLICACIÓN: ¿Por qué usamos ASYNC/AWAIT?
==========================================

En el ejemplo correcto, utilizamos async/await por las siguientes razones importantes:

1. OPERACIONES ASÍNCRONAS REALES:
   • Las bases de datos requieren conexiones de red (latencia)
   • Los servicios de email hacen llamadas HTTP a APIs externas
   • Los procesadores de pago comunican con gateways remotos
   • Estas operaciones toman tiempo y no deben bloquear el hilo principal

2. MEJOR EXPERIENCIA DE USUARIO:
   • Sin async/await: La aplicación se "congela" esperando respuestas
   • Con async/await: La aplicación permanece responsiva

3. ESCALABILIDAD:
   • Node.js puede manejar miles de operaciones concurrentes
   • Async/await permite que otras operaciones continúen mientras esperamos

4. MANEJO DE ERRORES MEJORADO:
   • try/catch funciona naturalmente con async/await
   • Mejor control de errores en operaciones asíncronas

5. CÓDIGO MÁS LEGIBLE:
   • Evita "callback hell" (anidación excesiva)
   • El código se lee de forma secuencial y natural

EJEMPLO DE LA DIFERENCIA:

// SIN ASYNC/AWAIT (Síncrono - Bloquea el hilo)
function procesarPedidoSincrono(pedido) {
    const resultado = baseDatos.guardar(pedido);        // Espera bloqueando
    const pago = procesador.procesar(pedido.total);     // Espera bloqueando  
    const email = servicio.enviar(pedido.cliente);     // Espera bloqueando
    return { resultado, pago, email };
}

// CON ASYNC/AWAIT (Asíncrono - No bloquea)
async function procesarPedidoAsincrono(pedido) {
    const resultado = await baseDatos.guardar(pedido);     // Espera sin bloquear
    const pago = await procesador.procesar(pedido.total); // Espera sin bloquear
    const email = await servicio.enviar(pedido.cliente);  // Espera sin bloquear
    return { resultado, pago, email };
}

NOTA IMPORTANTE: En este ejemplo, simulamos operaciones asíncronas 
que en la realidad serían llamadas a bases de datos, APIs y servicios externos.
*/

/**
 * ABSTRACCIONES (INTERFACES) - Alto nivel
 * Estas abstracciones definen contratos que pueden tener múltiples implementaciones
 * 
 * NOTA ASYNC/AWAIT: Todos los métodos son async porque en aplicaciones reales:
 * - Las consultas a bases de datos son operaciones de red (asíncronas)
 * - Los servicios de email hacen llamadas HTTP a APIs (asíncronas)
 * - Los procesadores de pago comunican con servicios externos (asíncronas)
 */

// Abstracción para persistencia de datos
class IRepositorio {
    /**
     * Conecta al repositorio de datos
     * @returns {Promise<boolean>} true si la conexión fue exitosa
     */
    async conectar() {
        throw new Error("Método conectar debe ser implementado");
    }

    /**
     * Guarda una entidad en el repositorio
     * @param {string} entidad - Tipo de entidad
     * @param {object} datos - Datos a guardar
     * @returns {Promise<object>} Entidad guardada con ID
     */
    async guardar(entidad, datos) {
        throw new Error("Método guardar debe ser implementado");
    }

    /**
     * Busca una entidad por ID
     * @param {string} entidad - Tipo de entidad
     * @param {string} id - ID de la entidad
     * @returns {Promise<object>} Entidad encontrada
     */
    async buscarPorId(entidad, id) {
        throw new Error("Método buscarPorId debe ser implementado");
    }

    /**
     * Actualiza una entidad existente
     * @param {string} entidad - Tipo de entidad
     * @param {string} id - ID de la entidad
     * @param {object} datos - Nuevos datos
     * @returns {Promise<object>} Entidad actualizada
     */
    async actualizar(entidad, id, datos) {
        throw new Error("Método actualizar debe ser implementado");
    }

    /**
     * Desconecta del repositorio
     * @returns {Promise<boolean>} true si la desconexión fue exitosa
     */
    async desconectar() {
        throw new Error("Método desconectar debe ser implementado");
    }
}

// Abstracción para servicios de notificación
class IServicioNotificacion {
    /**
     * Configura el servicio de notificación
     * @param {object} configuracion - Configuración específica del servicio
     * @returns {Promise<boolean>} true si la configuración fue exitosa
     */
    async configurar(configuracion) {
        throw new Error("Método configurar debe ser implementado");
    }

    /**
     * Envía una notificación
     * @param {string} destinatario - Destinatario de la notificación
     * @param {string} asunto - Asunto de la notificación
     * @param {string} mensaje - Contenido de la notificación
     * @returns {Promise<object>} Resultado del envío
     */
    async enviarNotificacion(destinatario, asunto, mensaje) {
        throw new Error("Método enviarNotificacion debe ser implementado");
    }
}

// Abstracción para procesadores de pago
class IProcesadorPago {
    /**
     * Configura el procesador de pago
     * @param {object} credenciales - Credenciales del procesador
     * @returns {Promise<boolean>} true si la configuración fue exitosa
     */
    async configurar(credenciales) {
        throw new Error("Método configurar debe ser implementado");
    }

    /**
     * Procesa un pago
     * @param {number} monto - Monto a procesar
     * @param {string} moneda - Tipo de moneda
     * @param {object} datosPago - Información adicional del pago
     * @returns {Promise<object>} Resultado del procesamiento
     */
    async procesarPago(monto, moneda, datosPago) {
        throw new Error("Método procesarPago debe ser implementado");
    }

    /**
     * Verifica el estado de una transacción
     * @param {string} transaccionId - ID de la transacción
     * @returns {Promise<object>} Estado de la transacción
     */
    async verificarTransaccion(transaccionId) {
        throw new Error("Método verificarTransaccion debe ser implementado");
    }
}

/**
 * IMPLEMENTACIONES CONCRETAS - Bajo nivel
 * Estas implementan las abstracciones definidas arriba
 */

// Implementación concreta para MySQL
class RepositorioMySQL extends IRepositorio {
    constructor() {
        super();
        this.conexion = null;
    }

    async conectar() {
        console.log("Conectando a base de datos MySQL...");
        this.conexion = "mysql_connection_active";
        return true;
    }

    async guardar(entidad, datos) {
        console.log(`MySQL: Insertando en tabla '${entidad}': ${JSON.stringify(datos)}`);
        return { 
            id: `mysql_${Date.now()}`, 
            ...datos, 
            fechaCreacion: new Date(),
            fuente: 'MySQL'
        };
    }

    async buscarPorId(entidad, id) {
        console.log(`MySQL: SELECT * FROM ${entidad} WHERE id = '${id}'`);
        return { id, entidad, encontrado: true, fuente: 'MySQL' };
    }

    async actualizar(entidad, id, datos) {
        console.log(`MySQL: UPDATE ${entidad} SET ${JSON.stringify(datos)} WHERE id = '${id}'`);
        return { id, ...datos, fechaActualizacion: new Date(), fuente: 'MySQL' };
    }

    async desconectar() {
        console.log("Desconectando de MySQL");
        this.conexion = null;
        return true;
    }
}

// Implementación concreta para PostgreSQL
class RepositorioPostgreSQL extends IRepositorio {
    constructor() {
        super();
        this.pool = null;
    }

    async conectar() {
        console.log("Conectando a base de datos PostgreSQL...");
        this.pool = "postgresql_pool_active";
        return true;
    }

    async guardar(entidad, datos) {
        console.log(`PostgreSQL: INSERT INTO ${entidad} VALUES (${JSON.stringify(datos)})`);
        return { 
            id: `pg_${Date.now()}`, 
            ...datos, 
            created_at: new Date(),
            fuente: 'PostgreSQL'
        };
    }

    async buscarPorId(entidad, id) {
        console.log(`PostgreSQL: SELECT * FROM ${entidad} WHERE id = $1 [${id}]`);
        return { id, entidad, encontrado: true, fuente: 'PostgreSQL' };
    }

    async actualizar(entidad, id, datos) {
        console.log(`PostgreSQL: UPDATE ${entidad} SET ... WHERE id = $1 [${id}]`);
        return { id, ...datos, updated_at: new Date(), fuente: 'PostgreSQL' };
    }

    async desconectar() {
        console.log("Cerrando pool de conexiones PostgreSQL");
        this.pool = null;
        return true;
    }
}

// Implementación concreta para MongoDB
class RepositorioMongoDB extends IRepositorio {
    constructor() {
        super();
        this.cliente = null;
    }

    async conectar() {
        console.log("Conectando a MongoDB...");
        this.cliente = "mongodb_client_active";
        return true;
    }

    async guardar(entidad, datos) {
        console.log(`MongoDB: db.${entidad}.insertOne(${JSON.stringify(datos)})`);
        return { 
            _id: `mongo_${Date.now()}`, 
            ...datos, 
            createdAt: new Date(),
            fuente: 'MongoDB'
        };
    }

    async buscarPorId(entidad, id) {
        console.log(`MongoDB: db.${entidad}.findOne({_id: ObjectId("${id}")})`);
        return { _id: id, entidad, encontrado: true, fuente: 'MongoDB' };
    }

    async actualizar(entidad, id, datos) {
        console.log(`MongoDB: db.${entidad}.updateOne({_id: "${id}"}, {$set: ${JSON.stringify(datos)}})`);
        return { _id: id, ...datos, updatedAt: new Date(), fuente: 'MongoDB' };
    }

    async desconectar() {
        console.log("Cerrando cliente MongoDB");
        this.cliente = null;
        return true;
    }
}

// Implementación concreta para Email SMTP
class ServicioEmailSMTP extends IServicioNotificacion {
    constructor() {
        super();
        this.configuracion = null;
    }

    async configurar(configuracion) {
        this.configuracion = configuracion;
        console.log(`SMTP configurado: ${configuracion.servidor}:${configuracion.puerto}`);
        return true;
    }

    async enviarNotificacion(destinatario, asunto, mensaje) {
        console.log(`SMTP: Enviando email a ${destinatario}`);
        console.log(`Servidor: ${this.configuracion.servidor}:${this.configuracion.puerto}`);
        console.log(`Asunto: ${asunto}`);
        console.log(`Mensaje: ${mensaje}`);
        return { 
            enviado: true, 
            proveedor: 'SMTP',
            timestamp: new Date(),
            messageId: `smtp_${Date.now()}`
        };
    }
}

// Implementación concreta para SendGrid
class ServicioEmailSendGrid extends IServicioNotificacion {
    constructor() {
        super();
        this.apiKey = null;
    }

    async configurar(configuracion) {
        this.apiKey = configuracion.apiKey;
        console.log(`SendGrid configurado con API Key: ${configuracion.apiKey.substring(0, 10)}...`);
        return true;
    }

    async enviarNotificacion(destinatario, asunto, mensaje) {
        console.log(`SendGrid API: Enviando email a ${destinatario}`);
        console.log(`API Key: ${this.apiKey.substring(0, 10)}...`);
        console.log(`Asunto: ${asunto}`);
        console.log(`Mensaje: ${mensaje}`);
        return { 
            enviado: true, 
            proveedor: 'SendGrid',
            timestamp: new Date(),
            messageId: `sendgrid_${Date.now()}`
        };
    }
}

// Implementación concreta para SMS
class ServicioSMS extends IServicioNotificacion {
    constructor() {
        super();
        this.credenciales = null;
    }

    async configurar(configuracion) {
        this.credenciales = configuracion;
        console.log(`SMS configurado con proveedor: ${configuracion.proveedor}`);
        return true;
    }

    async enviarNotificacion(destinatario, asunto, mensaje) {
        console.log(`SMS: Enviando mensaje a ${destinatario}`);
        console.log(`Proveedor: ${this.credenciales.proveedor}`);
        console.log(`Mensaje: ${asunto} - ${mensaje}`);
        return { 
            enviado: true, 
            proveedor: 'SMS',
            timestamp: new Date(),
            messageId: `sms_${Date.now()}`
        };
    }
}

// Implementación concreta para PayPal
class ProcesadorPayPal extends IProcesadorPago {
    constructor() {
        super();
        this.credenciales = null;
    }

    async configurar(credenciales) {
        this.credenciales = credenciales;
        console.log(`PayPal configurado con Client ID: ${credenciales.clientId}`);
        return true;
    }

    async procesarPago(monto, moneda, datosPago) {
        console.log(`PayPal: Procesando pago de ${monto} ${moneda}`);
        console.log(`Client ID: ${this.credenciales.clientId}`);
        return {
            transaccionId: `paypal_${Date.now()}`,
            monto,
            moneda,
            estado: 'completado',
            procesador: 'PayPal',
            comision: monto * 0.035
        };
    }

    async verificarTransaccion(transaccionId) {
        console.log(`PayPal: Verificando transacción ${transaccionId}`);
        return { transaccionId, estado: 'completado', verificado: true };
    }
}

// Implementación concreta para Stripe
class ProcesadorStripe extends IProcesadorPago {
    constructor() {
        super();
        this.secretKey = null;
    }

    async configurar(credenciales) {
        this.secretKey = credenciales.secretKey;
        console.log(`Stripe configurado con Secret Key: ${credenciales.secretKey.substring(0, 10)}...`);
        return true;
    }

    async procesarPago(monto, moneda, datosPago) {
        console.log(`Stripe: Procesando pago de ${monto} ${moneda}`);
        console.log(`Secret Key: ${this.secretKey.substring(0, 10)}...`);
        return {
            transaccionId: `stripe_${Date.now()}`,
            monto,
            moneda,
            estado: 'succeeded',
            procesador: 'Stripe',
            comision: monto * 0.029 + 0.30
        };
    }

    async verificarTransaccion(transaccionId) {
        console.log(`Stripe: Verificando transacción ${transaccionId}`);
        return { transaccionId, estado: 'succeeded', verificado: true };
    }
}

/**
 * MÓDULO DE ALTO NIVEL - Cumple con DIP
 * Esta clase depende SOLO de abstracciones, no de implementaciones concretas
 */
class ServicioPedidos {
    /**
     * Constructor que cumple DIP: recibe abstracciones por inyección de dependencias
     * @param {IRepositorio} repositorio - Abstracción para persistencia
     * @param {IServicioNotificacion} servicioNotificacion - Abstracción para notificaciones
     * @param {IProcesadorPago} procesadorPago - Abstracción para pagos
     */
    constructor(repositorio, servicioNotificacion, procesadorPago) {
        // CUMPLE DIP: Depende de abstracciones, no de implementaciones concretas
        if (!(repositorio instanceof IRepositorio)) {
            throw new Error("repositorio debe implementar IRepositorio");
        }
        if (!(servicioNotificacion instanceof IServicioNotificacion)) {
            throw new Error("servicioNotificacion debe implementar IServicioNotificacion");
        }
        if (!(procesadorPago instanceof IProcesadorPago)) {
            throw new Error("procesadorPago debe implementar IProcesadorPago");
        }

        this.repositorio = repositorio;
        this.servicioNotificacion = servicioNotificacion;
        this.procesadorPago = procesadorPago;
    }

    /**
     * Inicializa el servicio conectando a todas las dependencias
     */
    async inicializar() {
        console.log("Inicializando ServicioPedidos...");
        await this.repositorio.conectar();
        console.log("ServicioPedidos iniciado correctamente");
    }

    /**
     * Procesa un pedido - MÉTODO DE ALTO NIVEL que usa abstracciones
     * @param {object} pedido - Datos del pedido
     */
    async procesarPedido(pedido) {
        console.log(`\nProcesando pedido: ${pedido.id}`);
        
        try {
            // VENTAJA DIP: Usa abstracción - funciona con cualquier implementación de IRepositorio
            const pedidoGuardado = await this.repositorio.guardar('pedidos', pedido);
            console.log(`Pedido guardado con ID: ${pedidoGuardado.id || pedidoGuardado._id}`);
            
            // VENTAJA DIP: Usa abstracción - funciona con cualquier implementación de IProcesadorPago
            const resultadoPago = await this.procesadorPago.procesarPago(
                pedido.total, 
                'USD', 
                { cliente: pedido.cliente }
            );
            console.log(`Pago procesado: ${resultadoPago.transaccionId}`);
            
            // Actualizar pedido con información de pago
            const pedidoActualizado = await this.repositorio.actualizar('pedidos', 
                pedidoGuardado.id || pedidoGuardado._id, 
                {
                    transaccionId: resultadoPago.transaccionId,
                    estado: 'pagado',
                    comision: resultadoPago.comision
                }
            );
            
            // VENTAJA DIP: Usa abstracción - funciona con cualquier implementación de IServicioNotificacion
            const notificacionEnviada = await this.servicioNotificacion.enviarNotificacion(
                pedido.cliente.email,
                'Confirmación de Pedido',
                `Su pedido ${pedido.id} ha sido procesado exitosamente. ID de transacción: ${resultadoPago.transaccionId}`
            );
            
            console.log(`Pedido ${pedido.id} procesado completamente`);
            return {
                success: true,
                pedidoId: pedidoGuardado.id || pedidoGuardado._id,
                transaccionId: resultadoPago.transaccionId,
                notificacionEnviada: notificacionEnviada.enviado,
                comision: resultadoPago.comision
            };
            
        } catch (error) {
            console.log(`Error procesando pedido: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Consulta un pedido por ID
     * @param {string} pedidoId - ID del pedido a consultar
     */
    async consultarPedido(pedidoId) {
        console.log(`\nConsultando pedido: ${pedidoId}`);
        const pedido = await this.repositorio.buscarPorId('pedidos', pedidoId);
        console.log(`Pedido encontrado en: ${pedido.fuente}`);
        return pedido;
    }

    /**
     * Finaliza el servicio cerrando todas las conexiones
     */
    async finalizar() {
        console.log("Finalizando ServicioPedidos...");
        await this.repositorio.desconectar();
        console.log("ServicioPedidos finalizado");
    }
}

/**
 * FACTORY/CONFIGURATOR - Maneja la inyección de dependencias
 * Esta clase encapsula la creación y configuración de dependencias
 */
class ConfiguradorServicioPedidos {
    /**
     * Crea un ServicioPedidos con dependencias MySQL + SMTP + PayPal
     */
    static async crearConMySQL_SMTP_PayPal() {
        console.log("\nConfigurando servicio con: MySQL + SMTP + PayPal");
        
        const repositorio = new RepositorioMySQL();
        const notificacion = new ServicioEmailSMTP();
        const procesadorPago = new ProcesadorPayPal();
        
        await notificacion.configurar({
            servidor: 'smtp.gmail.com',
            puerto: 587,
            usuario: 'app@empresa.com'
        });
        
        await procesadorPago.configurar({
            clientId: 'PAYPAL_CLIENT_123',
            clientSecret: 'PAYPAL_SECRET_456'
        });
        
        const servicio = new ServicioPedidos(repositorio, notificacion, procesadorPago);
        await servicio.inicializar();
        
        return servicio;
    }

    /**
     * Crea un ServicioPedidos con dependencias PostgreSQL + SendGrid + Stripe
     */
    static async crearConPostgreSQL_SendGrid_Stripe() {
        console.log("\nConfigurando servicio con: PostgreSQL + SendGrid + Stripe");
        
        const repositorio = new RepositorioPostgreSQL();
        const notificacion = new ServicioEmailSendGrid();
        const procesadorPago = new ProcesadorStripe();
        
        await notificacion.configurar({
            apiKey: 'SENDGRID_API_KEY_789'
        });
        
        await procesadorPago.configurar({
            secretKey: 'STRIPE_SECRET_KEY_ABC'
        });
        
        const servicio = new ServicioPedidos(repositorio, notificacion, procesadorPago);
        await servicio.inicializar();
        
        return servicio;
    }

    /**
     * Crea un ServicioPedidos con dependencias MongoDB + SMS + PayPal
     */
    static async crearConMongoDB_SMS_PayPal() {
        console.log("\nConfigurando servicio con: MongoDB + SMS + PayPal");
        
        const repositorio = new RepositorioMongoDB();
        const notificacion = new ServicioSMS();
        const procesadorPago = new ProcesadorPayPal();
        
        await notificacion.configurar({
            proveedor: 'Twilio',
            accountSid: 'TWILIO_SID_123',
            authToken: 'TWILIO_TOKEN_456'
        });
        
        await procesadorPago.configurar({
            clientId: 'PAYPAL_CLIENT_789',
            clientSecret: 'PAYPAL_SECRET_ABC'
        });
        
        const servicio = new ServicioPedidos(repositorio, notificacion, procesadorPago);
        await servicio.inicializar();
        
        return servicio;
    }
}

// Demostración del diseño correcto que respeta DIP
console.log("Demostrando DIP correctamente implementado:");

const pedidoEjemplo2 = {
    id: 'PED-002',
    cliente: {
        nombre: 'María García',
        email: 'maria@email.com'
    },
    productos: [
        { nombre: 'Tablet', precio: 500 },
        { nombre: 'Funda', precio: 30 }
    ],
    total: 530
};

// Demostración 1: MySQL + SMTP + PayPal
(async () => {
    const servicio1 = await ConfiguradorServicioPedidos.crearConMySQL_SMTP_PayPal();
    const resultado1 = await servicio1.procesarPedido(pedidoEjemplo2);
    await servicio1.consultarPedido(resultado1.pedidoId);
    await servicio1.finalizar();
})();

// Simular delay para separar las demostraciones
setTimeout(async () => {
    // Demostración 2: PostgreSQL + SendGrid + Stripe
    const servicio2 = await ConfiguradorServicioPedidos.crearConPostgreSQL_SendGrid_Stripe();
    const resultado2 = await servicio2.procesarPedido({
        ...pedidoEjemplo2,
        id: 'PED-003'
    });
    await servicio2.consultarPedido(resultado2.pedidoId);
    await servicio2.finalizar();
}, 1000);

setTimeout(async () => {
    // Demostración 3: MongoDB + SMS + PayPal
    const servicio3 = await ConfiguradorServicioPedidos.crearConMongoDB_SMS_PayPal();
    const resultado3 = await servicio3.procesarPedido({
        ...pedidoEjemplo2,
        id: 'PED-004'
    });
    await servicio3.consultarPedido(resultado3.pedidoId);
    await servicio3.finalizar();
}, 2000);

setTimeout(() => {
    console.log("\n" + "=".repeat(80));
    console.log("VENTAJAS DEL DEPENDENCY INVERSION PRINCIPLE:");
    console.log("• Módulos de alto nivel independientes de implementaciones específicas");
    console.log("• Fácil intercambio de implementaciones sin modificar código de alto nivel");
    console.log("• Testing unitario simplificado con mocks e inyección de dependencias");
    console.log("• Cumple con principio abierto/cerrado - extensible sin modificaciones");
    console.log("• Reduce acoplamiento y aumenta cohesión del sistema");
    console.log("• Facilita configuración flexible y ambientes múltiples");
    console.log("• Mejora mantenibilidad y escalabilidad del código");
    console.log("=".repeat(80));
}, 3000);