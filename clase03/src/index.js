"use strict";
/**
 * PRINCIPIOS SOLID EN ECOMMERCE - VERSIÓN TYPESCRIPT
 * Ejemplos prácticos con código "malo" y su mejora aplicando SOLID
 *
 * S - Single Responsibility Principle (Principio de Responsabilidad Única)
 * O - Open/Closed Principle (Principio Abierto/Cerrado)
 * L - Liskov Substitution Principle (Principio de Sustitución de Liskov)
 * I - Interface Segregation Principle (Principio de Segregación de Interfaces)
 * D - Dependency Inversion Principle (Principio de Inversión de Dependencias)
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Imprimir el título del ejemplo en la consola
console.log("=== PRINCIPIOS SOLID EN ECOMMERCE - TYPESCRIPT ===\n");
/**
 * Enumeración que define los posibles estados de una orden
 * Enum asegura que solo se usen valores predefinidos
 */
var OrderStatusTS;
(function (OrderStatusTS) {
    OrderStatusTS["PENDING"] = "pending";
    OrderStatusTS["CONFIRMED"] = "confirmed";
    OrderStatusTS["SHIPPED"] = "shipped";
    OrderStatusTS["DELIVERED"] = "delivered";
    OrderStatusTS["CANCELLED"] = "cancelled"; // Orden cancelada
})(OrderStatusTS || (OrderStatusTS = {}));
// =====================================
// 1. SINGLE RESPONSIBILITY PRINCIPLE (SRP)
// =====================================
// Imprimir encabezado del primer principio SOLID
console.log("1. SINGLE RESPONSIBILITY PRINCIPLE");
console.log("-----------------------------------");
/**
 * Clase que representa un producto del ecommerce
 * PRINCIPIO SRP: Esta clase solo se encarga de representar los datos de un producto
 * No valida, no envía emails, no calcula descuentos - solo almacena datos
 */
class ProductTS {
    // Declarar explícitamente todas las propiedades con sus tipos
    id; // Siempre será string después del constructor
    name; // Inmutable después de la creación
    price; // Inmutable después de la creación
    category; // Inmutable después de la creación
    constructor(name, // Nombre del producto (público y obligatorio)
    price, // Precio del producto (público y obligatorio)
    category, // Categoría del producto (público y obligatorio)
    id // ID opcional - se genera automáticamente si no se proporciona
    ) {
        this.name = name;
        this.price = price;
        this.category = category;
        // Si no se proporciona ID, generar uno único usando timestamp
        this.id = id ?? `PROD_${Date.now()}`; // Usar nullish coalescing operator
    }
}
/**
 * Clase dedicada ÚNICAMENTE a validar productos
 * PRINCIPIO SRP: Una sola responsabilidad = validación de productos
 * No maneja productos, no envía emails, solo valida
 */
class ProductValidatorTS {
    // Método estático para validar un producto
    static validate(product) {
        // Validar que el nombre existe y no está vacío (trim elimina espacios)
        // Usar optional chaining (?.) para propiedades que pueden ser undefined
        if (!product.name?.trim()) {
            throw new Error("El nombre del producto es requerido");
        }
        // Validar que el precio existe y es mayor a 0
        // Usar Number.isFinite para validar que es un número válido
        if (!Number.isFinite(product.price) || product.price <= 0) {
            throw new Error("El precio debe ser mayor a 0");
        }
        // Validar que la categoría existe y no está vacía
        if (!product.category?.trim()) {
            throw new Error("La categoría es requerida");
        }
        // Si todas las validaciones pasan, retornar true
        return true;
    }
}
/**
 * Clase dedicada ÚNICAMENTE a gestionar la colección de productos
 * PRINCIPIO SRP: Una sola responsabilidad = manejar el almacén de productos
 * No valida (delega al ProductValidator), no envía emails, solo gestiona la colección
 */
class ProductManagerTS {
    // Array privado que almacena todos los productos del sistema
    products = [];
    /**
     * Agregar un nuevo producto a la colección
     * Delega la validación al ProductValidator (SRP en acción)
     */
    addProduct(product) {
        // Delegar validación a la clase especializada (SRP)
        ProductValidatorTS.validate(product);
        // Agregar el producto validado al array
        this.products.push(product);
        // Retornar el producto agregado
        return product;
    }
    /**
     * Obtener todos los productos
     * Retorna una copia del array para evitar modificaciones externas
     */
    getProducts() {
        // Usar spread operator (...) para crear una copia del array
        return [...this.products];
    }
    /**
     * Buscar un producto por su ID
     * Retorna el producto o undefined si no se encuentra
     */
    getProductById(id) {
        // Usar for...of loop para compatibilidad con configuración estricta
        for (const product of this.products) {
            if (product.id === id) {
                return product;
            }
        }
        return undefined;
    }
}
/**
 * Clase dedicada ÚNICAMENTE a manejar notificaciones
 * PRINCIPIO SRP: Una sola responsabilidad = envío de notificaciones
 * No gestiona productos, no calcula precios, solo envía mensajes
 */
class NotificationServiceTS {
    /**
     * Enviar notificación cuando se agrega un producto
     * Método estático - no necesita instancia de la clase
     */
    static sendProductNotification(product) {
        // Usar template literal (``) para interpolar variables en string
        console.log(`📧 Email enviado: Nuevo producto '${product.name}' agregado al catálogo`);
    }
    /**
     * Enviar notificación cuando se confirma una orden
     */
    static sendOrderNotification(order) {
        // Interpolar múltiples variables en el mensaje
        console.log(`📧 Email enviado: Orden ${order.id} confirmada para ${order.customerEmail}`);
    }
}
/**
 * Clase dedicada ÚNICAMENTE a calcular descuentos
 * PRINCIPIO SRP: Una sola responsabilidad = cálculos de descuentos
 * No maneja productos, no envía emails, solo hace matemáticas
 */
class DiscountCalculatorTS {
    /**
     * Calcular descuento por porcentaje
     * @param price - Precio original del producto
     * @param percentage - Porcentaje de descuento (0-100)
     * @returns Monto del descuento calculado
     */
    static calculatePercentageDiscount(price, percentage) {
        // Validar que el porcentaje esté en rango válido (0-100)
        if (percentage < 0 || percentage > 100) {
            throw new Error("El porcentaje debe estar entre 0 y 100");
        }
        // Calcular el descuento: precio * (porcentaje / 100)
        // Ejemplo: $100 * (10 / 100) = $10 de descuento
        return price * (percentage / 100);
    }
    /**
     * Calcular descuento de monto fijo
     * @param price - Precio original del producto
     * @param amount - Cantidad fija de descuento
     * @returns Descuento aplicable (no puede ser mayor al precio del producto)
     */
    static calculateFixedDiscount(price, amount) {
        // Math.max(0, amount) asegura que el descuento no sea negativo
        // Math.min(price, ...) asegura que el descuento no sea mayor al precio
        return Math.min(price, Math.max(0, amount));
    }
}
// =====================================
// EJEMPLO DE USO DEL PRINCIPIO SRP
// =====================================
// Imprimir encabezado del ejemplo
console.log("✅ Ejemplo SRP mejorado:");
// Crear instancia del gestor de productos (SRP: solo gestiona productos)
const productManagerTS = new ProductManagerTS();
// Crear un producto nuevo usando el constructor
const laptopTS = new ProductTS("Laptop Gaming", 1500, "Electrónicos");
// Bloque try-catch para manejar posibles errores de validación
try {
    // 1. Agregar producto (usa ProductValidator internamente)
    productManagerTS.addProduct(laptopTS);
    // 2. Enviar notificación (SRP: clase separada para notificaciones)
    NotificationServiceTS.sendProductNotification(laptopTS);
    // 3. Calcular descuento (SRP: clase separada para cálculos)
    const discount = DiscountCalculatorTS.calculatePercentageDiscount(laptopTS.price, 10);
    // 4. Mostrar resultado formateado (toFixed(2) muestra 2 decimales)
    console.log(`💰 Descuento calculado: $${discount.toFixed(2)}`);
}
catch (error) {
    // Si hay errores de validación, mostrarlos en consola
    // (error as Error) es type casting para acceder a la propiedad message
    console.log(`❌ Error: ${error.message}`);
}
// Imprimir línea en blanco para separar secciones
console.log("\n");
// =====================================
// 2. OPEN/CLOSED PRINCIPLE (OCP)
// =====================================
// Imprimir encabezado del segundo principio SOLID
console.log("2. OPEN/CLOSED PRINCIPLE");
console.log("------------------------");
/**
 * Clase base abstracta que implementa comportamiento común
 * PRINCIPIO OCP: Proporciona funcionalidad base que se puede extender
 * - Abstract: No se puede instanciar directamente
 * - Implements: Cumple el contrato de IPaymentMethodTS
 */
class BasePaymentMethodTS {
    /**
     * Validación común para todos los métodos de pago
     * Las clases hijas pueden sobrescribir este método si necesitan validación específica
     */
    validatePayment() {
        // Validación básica común (se puede extender en clases hijas)
        return true;
    }
    /**
     * Método protegido: solo accesible por clases hijas
     * Genera IDs únicos de transacción usando timestamp + string aleatorio
     */
    generateTransactionId(prefix) {
        // Date.now() = timestamp actual
        // Math.random().toString(36).substr(2, 5) = string aleatorio de 5 caracteres
        return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
    }
}
/**
 * Implementación específica para pagos con tarjeta de crédito
 * PRINCIPIO OCP: EXTIENDE BasePaymentMethodTS sin modificar código existente
 */
class CreditCardPaymentTS extends BasePaymentMethodTS {
    cardNumber;
    cvv;
    constructor(cardNumber, // Número de tarjeta (privado)
    cvv // Código CVV (privado)
    ) {
        super(); // Llamar al constructor de la clase padre
        this.cardNumber = cardNumber;
        this.cvv = cvv;
    }
    /**
     * Validación específica para tarjetas de crédito
     * SOBRESCRIBE el método base con lógica específica
     */
    validatePayment() {
        // Validar longitud del número de tarjeta
        if (this.cardNumber.length !== 16) {
            return false;
        }
        // Validar longitud del CVV
        if (this.cvv.length !== 3) {
            return false;
        }
        return super.validatePayment();
    }
    process(amount) {
        if (!this.validatePayment()) {
            return {
                success: false,
                transactionId: '',
                message: 'Datos de tarjeta inválidos'
            };
        }
        console.log(`💳 Procesando $${amount} con tarjeta ****${this.cardNumber.slice(-4)}`);
        return {
            success: true,
            transactionId: this.generateTransactionId('CC'),
            message: 'Pago procesado exitosamente'
        };
    }
}
class PayPalPaymentTS extends BasePaymentMethodTS {
    email;
    constructor(email) {
        super();
        this.email = email;
    }
    validatePayment() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email) && super.validatePayment();
    }
    process(amount) {
        if (!this.validatePayment()) {
            return {
                success: false,
                transactionId: '',
                message: 'Email de PayPal inválido'
            };
        }
        console.log(`🅿️ Procesando $${amount} con PayPal (${this.email})`);
        return {
            success: true,
            transactionId: this.generateTransactionId('PP'),
            message: 'Pago PayPal exitoso'
        };
    }
}
class CryptocurrencyPaymentTS extends BasePaymentMethodTS {
    walletAddress;
    currency;
    constructor(walletAddress, currency = 'Bitcoin') {
        super();
        this.walletAddress = walletAddress;
        this.currency = currency;
    }
    validatePayment() {
        return this.walletAddress.length >= 26 && super.validatePayment();
    }
    process(amount) {
        if (!this.validatePayment()) {
            return {
                success: false,
                transactionId: '',
                message: 'Dirección de wallet inválida'
            };
        }
        console.log(`₿ Procesando $${amount} con ${this.currency} (${this.walletAddress.slice(0, 8)}...)`);
        return {
            success: true,
            transactionId: this.generateTransactionId('CRYPTO'),
            message: `Pago en ${this.currency} exitoso`
        };
    }
}
// Procesador que funciona con cualquier método de pago
class PaymentProcessorTS {
    static processPayment(paymentMethod, amount) {
        if (amount <= 0) {
            return {
                success: false,
                transactionId: '',
                message: 'El monto debe ser mayor a 0'
            };
        }
        return paymentMethod.process(amount);
    }
}
// Ejemplo de uso mejorado
console.log("✅ Ejemplo OCP mejorado:");
const creditCardTS = new CreditCardPaymentTS("1234567890123456", "123");
const paypalTS = new PayPalPaymentTS("usuario@email.com");
const bitcoinTS = new CryptocurrencyPaymentTS("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "Bitcoin");
const result1 = PaymentProcessorTS.processPayment(creditCardTS, 100);
const result2 = PaymentProcessorTS.processPayment(paypalTS, 250);
const result3 = PaymentProcessorTS.processPayment(bitcoinTS, 500);
console.log(`✅ Resultado CC: ${result1.message}`);
console.log(`✅ Resultado PayPal: ${result2.message}`);
console.log(`✅ Resultado Crypto: ${result3.message}`);
console.log("\n");
// =====================================
// 3. LISKOV SUBSTITUTION PRINCIPLE (LSP)
// =====================================
console.log("3. LISKOV SUBSTITUTION PRINCIPLE");
console.log("---------------------------------");
// ✅ BUENO: Jerarquía bien diseñada con TypeScript
class ShippingCalculatorTS {
    // Método protegido que valida precondiciones
    validateInputs(weight, distance) {
        if (weight <= 0 || distance <= 0) {
            throw new Error("Peso y distancia deben ser mayores a 0");
        }
        return true;
    }
    // Método template que puede ser usado por todas las subclases
    getShippingInfo(weight, distance) {
        this.validateInputs(weight, distance);
        const cost = this.calculateShipping(weight, distance);
        return `Envío: $${cost.toFixed(2)} para ${weight}kg a ${distance}km`;
    }
}
class StandardShippingTS extends ShippingCalculatorTS {
    calculateShipping(weight, distance) {
        this.validateInputs(weight, distance);
        return weight * 0.5 + distance * 0.1;
    }
}
class ExpressShippingTS extends ShippingCalculatorTS {
    expressMultiplier = 1.5;
    calculateShipping(weight, distance) {
        this.validateInputs(weight, distance);
        const standardCost = weight * 0.5 + distance * 0.1;
        return standardCost * this.expressMultiplier;
    }
}
class FreeShippingTS extends ShippingCalculatorTS {
    maxWeight;
    constructor(maxWeight = Infinity) {
        super();
        this.maxWeight = maxWeight;
    }
    calculateShipping(weight, distance) {
        this.validateInputs(weight, distance);
        if (weight > this.maxWeight) {
            throw new Error(`Envío gratis no disponible para productos sobre ${this.maxWeight}kg`);
        }
        return 0; // Siempre gratis dentro del límite
    }
}
// Función que funciona con cualquier calculadora (polimorfismo)
function processShippingOrderTS(calculator, weight, distance) {
    try {
        const cost = calculator.calculateShipping(weight, distance);
        console.log(`📦 ${calculator.constructor.name}: $${cost.toFixed(2)}`);
        return cost;
    }
    catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return 0;
    }
}
// Ejemplo de uso mejorado
console.log("✅ Ejemplo LSP mejorado:");
const standardShippingTS = new StandardShippingTS();
const expressShippingTS = new ExpressShippingTS();
const freeShippingTS = new FreeShippingTS(10); // Gratis hasta 10kg
processShippingOrderTS(standardShippingTS, 5, 100);
processShippingOrderTS(expressShippingTS, 5, 100);
processShippingOrderTS(freeShippingTS, 5, 100);
processShippingOrderTS(freeShippingTS, 15, 100); // Debería mostrar error
console.log("\n");
// =====================================
// 4. INTERFACE SEGREGATION PRINCIPLE (ISP)
// =====================================
console.log("4. INTERFACE SEGREGATION PRINCIPLE");
console.log("-----------------------------------");
// Implementaciones específicas
class InMemoryProductRepositoryTS {
    products = new Map();
    async addProduct(product) {
        const id = product.id || `PROD_${Date.now()}`;
        const newProduct = { ...product, id };
        this.products.set(id, newProduct);
        console.log(`➕ Producto agregado: ${newProduct.name} (${id})`);
        return newProduct;
    }
    async getProduct(id) {
        const product = this.products.get(id) || null;
        console.log(`🔍 Buscando producto: ${id} - ${product ? 'Encontrado' : 'No encontrado'}`);
        return product;
    }
    async removeProduct(id) {
        const deleted = this.products.delete(id);
        console.log(`➖ Producto ${id}: ${deleted ? 'Eliminado' : 'No encontrado'}`);
        return deleted;
    }
}
class InMemoryInventoryManagerTS {
    inventory = new Map();
    async updateStock(productId, quantity) {
        this.inventory.set(productId, quantity);
        console.log(`📊 Stock actualizado: ${productId} = ${quantity} unidades`);
    }
    async checkStock(productId) {
        const stock = this.inventory.get(productId) || 0;
        console.log(`📋 Stock disponible: ${productId} = ${stock} unidades`);
        return stock;
    }
    async reserveStock(productId, quantity) {
        const currentStock = this.inventory.get(productId) || 0;
        if (currentStock >= quantity) {
            this.inventory.set(productId, currentStock - quantity);
            console.log(`🔒 Stock reservado: ${quantity} unidades de ${productId}`);
            return true;
        }
        console.log(`❌ Stock insuficiente: ${productId} (disponible: ${currentStock}, solicitado: ${quantity})`);
        return false;
    }
}
// Ejemplo de uso mejorado
console.log("✅ Ejemplo ISP mejorado:");
const productRepoTS = new InMemoryProductRepositoryTS();
const inventoryManagerTS = new InMemoryInventoryManagerTS();
// Uso independiente de cada servicio
(async () => {
    const smartphone = await productRepoTS.addProduct(new ProductTS("Smartphone", 699, "Electrónicos"));
    await inventoryManagerTS.updateStock(smartphone.id, 50);
    await inventoryManagerTS.reserveStock(smartphone.id, 2);
})();
console.log("\n");
// =====================================
// 5. DEPENDENCY INVERSION PRINCIPLE (DIP)
// =====================================
console.log("5. DEPENDENCY INVERSION PRINCIPLE");
console.log("----------------------------------");
// Implementaciones concretas
class EmailNotificationServiceTS {
    async send(recipient, message) {
        console.log(`📧 Email enviado a ${recipient}: ${message}`);
        // Simulación de envío asíncrono
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}
class SMSNotificationServiceTS {
    async send(recipient, message) {
        console.log(`📱 SMS enviado a ${recipient}: ${message}`);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}
class PostgreSQLServiceTS {
    async save(entity) {
        console.log(`💾 Guardando en PostgreSQL:`, entity.id || 'nueva entidad');
        await new Promise(resolve => setTimeout(resolve, 50));
        return entity;
    }
    async findById(id) {
        console.log(`🔍 Buscando en PostgreSQL: ${id}`);
        await new Promise(resolve => setTimeout(resolve, 50));
        return null; // Simulación
    }
}
class StripePaymentGatewayTS {
    async processPayment(amount) {
        console.log(`💳 Procesando $${amount} via Stripe`);
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
            success: true,
            transactionId: `stripe_${Date.now()}`,
            message: 'Pago procesado via Stripe'
        };
    }
}
// Procesador de órdenes que depende de abstracciones
class OrderProcessorTS {
    notificationService;
    databaseService;
    paymentGateway;
    constructor(notificationService, databaseService, paymentGateway) {
        this.notificationService = notificationService;
        this.databaseService = databaseService;
        this.paymentGateway = paymentGateway;
    }
    async processOrder(order) {
        try {
            console.log(`🔄 Procesando orden ${order.id}...`);
            // Guardar en base de datos
            await this.databaseService.save(order);
            // Procesar pago
            const paymentResult = await this.paymentGateway.processPayment(order.amount);
            if (!paymentResult.success) {
                throw new Error(`Error en pago: ${paymentResult.message}`);
            }
            // Enviar notificación
            await this.notificationService.send(order.customerEmail, `Orden ${order.id} confirmada por $${order.amount}. ID Transacción: ${paymentResult.transactionId}`);
            console.log(`✅ Orden ${order.id} procesada exitosamente`);
            return true;
        }
        catch (error) {
            console.log(`❌ Error procesando orden: ${error.message}`);
            return false;
        }
    }
}
// Factory para crear diferentes configuraciones
class OrderProcessorFactoryTS {
    static createEmailProcessor() {
        return new OrderProcessorTS(new EmailNotificationServiceTS(), new PostgreSQLServiceTS(), new StripePaymentGatewayTS());
    }
    static createSMSProcessor() {
        return new OrderProcessorTS(new SMSNotificationServiceTS(), new PostgreSQLServiceTS(), new StripePaymentGatewayTS());
    }
}
// Ejemplo de uso mejorado
console.log("✅ Ejemplo DIP mejorado:");
const sampleOrderTS = {
    id: "ORD-2025-001",
    customerEmail: "cliente@email.com",
    amount: 150.00,
    products: ["Smartphone", "Funda"],
    status: OrderStatusTS.PENDING
};
// Diferentes configuraciones usando el mismo procesador
(async () => {
    console.log("Configuración 1 (Email):");
    const emailProcessor = OrderProcessorFactoryTS.createEmailProcessor();
    await emailProcessor.processOrder(sampleOrderTS);
    console.log("\nConfiguración 2 (SMS):");
    const smsProcessor = OrderProcessorFactoryTS.createSMSProcessor();
    await smsProcessor.processOrder({ ...sampleOrderTS, id: "ORD-2025-002" });
})();
setTimeout(() => {
    console.log("\n=== FIN DE EJEMPLOS SOLID TYPESCRIPT ===");
}, 1000);
//# sourceMappingURL=index.js.map