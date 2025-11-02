/*
=====================================
PRINCIPIO SOLID: L - Liskov Substitution Principle (LSP)
=====================================

DEFINICIÓN: Los objetos de una clase derivada deben poder reemplazar a los objetos 
de la clase base sin alterar el funcionamiento correcto del programa.

En otras palabras: Si S es un subtipo de T, entonces los objetos de tipo T 
pueden ser reemplazados por objetos de tipo S sin afectar la funcionalidad.

CONTEXTO: Sistema de E-commerce - Productos y Descuentos
*/

console.log("=== PRINCIPIO SOLID: L - Liskov Substitution Principle ===\n");

// EJEMPLO INCORRECTO - Violación del LSP
console.log("EJEMPLO INCORRECTO - Violación del LSP");
console.log("--------------------------------------");

/**
 * Clase base para productos
 * Define el comportamiento esperado para todos los productos
 */
class ProductoIncorrecto {
    /**
     * Constructor base para productos
     * @param {string} nombre - Nombre del producto
     * @param {number} precio - Precio base del producto
     * @param {number} stock - Cantidad disponible
     */
    constructor(nombre, precio, stock) {
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }

    /**
     * Calcula el precio con descuento aplicado
     * @param {number} porcentajeDescuento - Porcentaje de descuento (0-100)
     * @returns {number} Precio final con descuento
     */
    calcularPrecioConDescuento(porcentajeDescuento) {
        if (porcentajeDescuento < 0 || porcentajeDescuento > 100) {
            throw new Error("El descuento debe estar entre 0 y 100");
        }
        const descuento = this.precio * (porcentajeDescuento / 100);
        return this.precio - descuento;
    }

    /**
     * Verifica si el producto está disponible para venta
     * @returns {boolean} true si está disponible
     */
    estaDisponible() {
        return this.stock > 0;
    }

    /**
     * Reduce el stock después de una venta
     * @param {number} cantidad - Cantidad vendida
     * @returns {boolean} true si la operación fue exitosa
     */
    vender(cantidad) {
        if (cantidad <= 0) {
            throw new Error("La cantidad debe ser mayor a 0");
        }
        if (cantidad > this.stock) {
            throw new Error("Stock insuficiente");
        }
        this.stock -= cantidad;
        return true;
    }

    /**
     * Obtiene información básica del producto
     * @returns {object} Información del producto
     */
    obtenerInfo() {
        return {
            nombre: this.nombre,
            precio: this.precio,
            stock: this.stock,
            disponible: this.estaDisponible()
        };
    }
}

/**
 * VIOLACIÓN LSP: Esta clase rompe el contrato de la clase base
 * Los productos digitales no deberían tener stock físico, pero la clase base lo requiere
 */
class ProductoDigitalIncorrecto extends ProductoIncorrecto {
    /**
     * Constructor para productos digitales
     * PROBLEMA: Forzado a usar stock que no aplica para productos digitales
     */
    constructor(nombre, precio, tipoLicencia) {
        super(nombre, precio, 999999); // Stock infinito artificial
        this.tipoLicencia = tipoLicencia;
    }

    /**
     * VIOLACIÓN LSP: Cambio de comportamiento inesperado
     * Los productos digitales no deberían tener descuentos mayores al 90%
     */
    calcularPrecioConDescuento(porcentajeDescuento) {
        // Comportamiento diferente al esperado por la clase base
        if (porcentajeDescuento > 90) {
            throw new Error("Los productos digitales no pueden tener más del 90% de descuento");
        }
        return super.calcularPrecioConDescuento(porcentajeDescuento);
    }

    /**
     * VIOLACIÓN LSP: Cambio de comportamiento del método vender
     */
    vender(cantidad) {
        // Los productos digitales no deberían reducir stock
        // pero el método heredado lo hace
        console.log(" Producto digital 'vendido' pero el stock no debería cambiar");
        return true; // No llama a super.vender() - comportamiento inconsistente
    }
}

/**
 * VIOLACIÓN LSP: Otra clase que rompe el contrato
 */
class ProductoPersonalizadoIncorrecto extends ProductoIncorrecto {
    constructor(nombre, precio) {
        super(nombre, precio, 0); // Stock 0 porque se hace bajo pedido
        this.tiempoProduccion = 15; // días
    }

    /**
     * VIOLACIÓN LSP: Lanza excepción inesperada
     */
    calcularPrecioConDescuento(porcentajeDescuento) {
        // Los productos personalizados no deberían tener descuento
        throw new Error("Los productos personalizados no admiten descuentos");
    }

    /**
     * VIOLACIÓN LSP: Comportamiento completamente diferente
     */
    vender(cantidad) {
        // No verifica stock como debería
        console.log(" Producto personalizado: Se creará bajo pedido");
        return true; // Ignora la lógica de stock
    }

    /**
     * VIOLACIÓN LSP: Cambia el significado de disponibilidad
     */
    estaDisponible() {
        // Siempre disponible aunque stock sea 0 - rompe expectativas
        return true;
    }
}

// Demostración del problema con LSP violado
console.log(" Demostrando violaciones del LSP:");

/**
 * Función que debería funcionar con cualquier producto
 * PROBLEMA: Falla con las subclases que violan LSP
 */
function procesarVentaIncorrecto(productos, descuento) {
    console.log(`\nProcesando venta con ${descuento}% de descuento:`);
    
    productos.forEach(producto => {
        try {
            console.log(`\n Producto: ${producto.nombre}`);
            console.log(`   Precio original: $${producto.precio}`);
            
            // Esto debería funcionar para todos los productos, pero no es así
            const precioFinal = producto.calcularPrecioConDescuento(descuento);
            console.log(`   Precio con descuento: $${precioFinal.toFixed(2)}`);
            
            if (producto.estaDisponible()) {
                const vendido = producto.vender(1);
                if (vendido) {
                    console.log(`   Venta exitosa`);
                    console.log(`   Stock restante: ${producto.stock}`);
                }
            } else {
                console.log(`   Producto no disponible`);
            }
            
        } catch (error) {
            console.log(`   Error inesperado: ${error.message}`);
        }
    });
}

// Crear productos que violan LSP
const productosIncorrectos = [
    new ProductoIncorrecto("Laptop", 1000, 5),
    new ProductoDigitalIncorrecto("Software Antivirus", 50, "anual"),
    new ProductoPersonalizadoIncorrecto("Camiseta Personalizada", 25)
];

// Esta función falla porque las subclases violan LSP
procesarVentaIncorrecto(productosIncorrectos, 95); // 95% descuento

console.log("\n" + "=".repeat(80) + "\n");

// EJEMPLO CORRECTO - Cumpliendo con LSP
console.log("EJEMPLO CORRECTO - Cumpliendo con LSP");
console.log("-------------------------------------");

/**
 * Clase base abstracta bien diseñada
 * Define un contrato claro que todas las subclases deben respetar
 */
class Producto {
    /**
     * Constructor base para productos
     * @param {string} nombre - Nombre del producto
     * @param {number} precio - Precio base del producto
     */
    constructor(nombre, precio) {
        if (this.constructor === Producto) {
            throw new Error("Producto es una clase abstracta");
        }
        this.nombre = nombre;
        this.precio = precio;
    }

    /**
     * Calcula el precio con descuento aplicado
     * Contrato: Debe aceptar descuentos entre 0-100% y retornar precio válido
     * @param {number} porcentajeDescuento - Porcentaje de descuento (0-100)
     * @returns {number} Precio final con descuento
     */
    calcularPrecioConDescuento(porcentajeDescuento) {
        if (porcentajeDescuento < 0 || porcentajeDescuento > 100) {
            throw new Error("El descuento debe estar entre 0 y 100");
        }
        
        // Permitir que subclases definan descuento máximo
        const descuentoMaximo = this.obtenerDescuentoMaximo();
        const descuentoAplicable = Math.min(porcentajeDescuento, descuentoMaximo);
        
        const descuento = this.precio * (descuentoAplicable / 100);
        return this.precio - descuento;
    }

    /**
     * Obtiene el descuento máximo permitido para este tipo de producto
     * Método que pueden sobrescribir las subclases
     * @returns {number} Porcentaje máximo de descuento
     */
    obtenerDescuentoMaximo() {
        return 100; // Por defecto, descuento completo
    }

    /**
     * Verifica si el producto está disponible para venta
     * Contrato: Debe retornar boolean
     * @returns {boolean} true si está disponible
     */
    estaDisponible() {
        throw new Error("El método estaDisponible debe ser implementado");
    }

    /**
     * Procesa una venta del producto
     * Contrato: Debe retornar boolean indicando éxito/fallo
     * @param {number} cantidad - Cantidad a vender
     * @returns {boolean} true si la venta fue exitosa
     */
    procesarVenta(cantidad) {
        throw new Error("El método procesarVenta debe ser implementado");
    }

    /**
     * Obtiene información básica del producto
     * Contrato: Siempre debe retornar objeto con estructura consistente
     * @returns {object} Información del producto
     */
    obtenerInfo() {
        return {
            nombre: this.nombre,
            precio: this.precio,
            tipo: this.obtenerTipo(),
            disponible: this.estaDisponible(),
            descuentoMaximo: this.obtenerDescuentoMaximo()
        };
    }

    /**
     * Retorna el tipo de producto
     * @returns {string} Tipo de producto
     */
    obtenerTipo() {
        throw new Error("El método obtenerTipo debe ser implementado");
    }
}

/**
 * Producto físico que respeta LSP
 * Mantiene el comportamiento esperado de la clase base
 */
class ProductoFisico extends Producto {
    /**
     * Constructor para productos físicos
     * @param {string} nombre - Nombre del producto
     * @param {number} precio - Precio del producto
     * @param {number} stock - Cantidad en inventario
     */
    constructor(nombre, precio, stock) {
        super(nombre, precio);
        this.stock = stock;
    }

    /**
     * Respeta LSP: Comportamiento consistente con clase base
     * @returns {boolean} true si hay stock disponible
     */
    estaDisponible() {
        return this.stock > 0;
    }

    /**
     * Respeta LSP: Implementación que cumple el contrato
     * @param {number} cantidad - Cantidad a vender
     * @returns {boolean} true si la venta fue exitosa
     */
    procesarVenta(cantidad) {
        if (cantidad <= 0) {
            throw new Error("La cantidad debe ser mayor a 0");
        }
        if (cantidad > this.stock) {
            return false; // Retorna false en lugar de lanzar excepción
        }
        this.stock -= cantidad;
        console.log(`   Stock actualizado: ${this.stock} unidades restantes`);
        return true;
    }

    /**
     * Implementación requerida
     * @returns {string} Tipo de producto
     */
    obtenerTipo() {
        return 'Físico';
    }

    /**
     * Extiende la información base de manera consistente
     * @returns {object} Información completa del producto físico
     */
    obtenerInfo() {
        const infoBase = super.obtenerInfo();
        return {
            ...infoBase,
            stock: this.stock
        };
    }
}

/**
 * Producto digital que respeta LSP
 * Implementa el contrato sin romper expectativas
 */
class ProductoDigital extends Producto {
    /**
     * Constructor para productos digitales
     * @param {string} nombre - Nombre del producto
     * @param {number} precio - Precio del producto
     * @param {string} tipoLicencia - Tipo de licencia
     */
    constructor(nombre, precio, tipoLicencia) {
        super(nombre, precio);
        this.tipoLicencia = tipoLicencia;
        this.descargas = 0;
    }

    /**
     * Respeta LSP: Los productos digitales siempre están disponibles
     * @returns {boolean} siempre true para productos digitales
     */
    estaDisponible() {
        return true; // Comportamiento consistente y esperado
    }

    /**
     * Respeta LSP: Descuento máximo específico pero comportamiento predecible
     * @returns {number} Descuento máximo del 90%
     */
    obtenerDescuentoMaximo() {
        return 90; // Restricción de negocio respetando el contrato
    }

    /**
     * Respeta LSP: Implementación que cumple el contrato
     * @param {number} cantidad - Cantidad a vender (siempre 1 para digitales)
     * @returns {boolean} true si la venta fue exitosa
     */
    procesarVenta(cantidad) {
        if (cantidad !== 1) {
            return false; // Los productos digitales se venden de uno en uno
        }
        this.descargas++;
        console.log(`   Licencia generada. Total descargas: ${this.descargas}`);
        return true;
    }

    /**
     * Implementación requerida
     * @returns {string} Tipo de producto
     */
    obtenerTipo() {
        return 'Digital';
    }

    /**
     * Extiende la información base de manera consistente
     * @returns {object} Información completa del producto digital
     */
    obtenerInfo() {
        const infoBase = super.obtenerInfo();
        return {
            ...infoBase,
            tipoLicencia: this.tipoLicencia,
            descargas: this.descargas
        };
    }
}

/**
 * Producto personalizado que respeta LSP
 * Mantiene el comportamiento esperado
 */
class ProductoPersonalizado extends Producto {
    /**
     * Constructor para productos personalizados
     * @param {string} nombre - Nombre del producto
     * @param {number} precio - Precio base del producto
     * @param {number} tiempoProduccion - Días de producción
     */
    constructor(nombre, precio, tiempoProduccion) {
        super(nombre, precio);
        this.tiempoProduccion = tiempoProduccion;
        this.pedidosEnCola = 0;
    }

    /**
     * Respeta LSP: Siempre disponible para pedidos personalizados
     * @returns {boolean} true - siempre se puede hacer bajo pedido
     */
    estaDisponible() {
        return true; // Disponible para producción bajo pedido
    }

    /**
     * Respeta LSP: Descuento limitado pero comportamiento predecible
     * @returns {number} Descuento máximo del 20%
     */
    obtenerDescuentoMaximo() {
        return 20; // Descuento limitado por ser personalizado
    }

    /**
     * Respeta LSP: Implementación que cumple el contrato
     * @param {number} cantidad - Cantidad a producir
     * @returns {boolean} true si se puede procesar el pedido
     */
    procesarVenta(cantidad) {
        if (cantidad <= 0) {
            return false;
        }
        this.pedidosEnCola += cantidad;
        const fechaEntrega = new Date();
        fechaEntrega.setDate(fechaEntrega.getDate() + this.tiempoProduccion);
        console.log(`   🎨 Pedido personalizado agregado. Entrega estimada: ${fechaEntrega.toLocaleDateString()}`);
        return true;
    }

    /**
     * Implementación requerida
     * @returns {string} Tipo de producto
     */
    obtenerTipo() {
        return 'Personalizado';
    }

    /**
     * Extiende la información base de manera consistente
     * @returns {object} Información completa del producto personalizado
     */
    obtenerInfo() {
        const infoBase = super.obtenerInfo();
        return {
            ...infoBase,
            tiempoProduccion: this.tiempoProduccion,
            pedidosEnCola: this.pedidosEnCola
        };
    }
}

/**
 * Función que funciona correctamente con cualquier subtipo de Producto
 * Gracias a que todas las subclases respetan LSP
 */
function procesarVentaCorrecta(productos, descuento) {
    console.log(`\nProcesando venta con ${descuento}% de descuento:`);
    
    productos.forEach(producto => {
        console.log(`\n Producto: ${producto.nombre} (${producto.obtenerTipo()})`);
        console.log(`   Precio original: $${producto.precio}`);
        console.log(`   Descuento máximo permitido: ${producto.obtenerDescuentoMaximo()}%`);
        
        try {
            // Esto funciona consistentemente para todos los tipos
            const precioFinal = producto.calcularPrecioConDescuento(descuento);
            console.log(`   Precio con descuento: $${precioFinal.toFixed(2)}`);
            
            if (producto.estaDisponible()) {
                const cantidad = producto.obtenerTipo() === 'Digital' ? 1 : 2;
                const vendido = producto.procesarVenta(cantidad);
                
                if (vendido) {
                    console.log(`   Venta exitosa de ${cantidad} unidad(es)`);
                } else {
                    console.log(`   No se pudo procesar la venta de ${cantidad} unidades`);
                }
            } else {
                console.log(`   Producto no disponible`);
            }
            
            // Mostrar información adicional
            const info = producto.obtenerInfo();
            console.log(`   Info: Disponible=${info.disponible}, Tipo=${info.tipo}`);
            
        } catch (error) {
            console.log(`   Error: ${error.message}`);
        }
    });
}

// Demostración del diseño correcto que respeta LSP
console.log("🔧 Demostrando LSP correctamente implementado:");

const productosCorrectos = [
    new ProductoFisico("Laptop Gaming", 1200, 8),
    new ProductoDigital("Curso JavaScript", 150, "vitalicia"),
    new ProductoPersonalizado("Taza Personalizada", 30, 7)
];

// Esta función funciona perfectamente con todas las subclases
procesarVentaCorrecta(productosCorrectos, 95); // 95% descuento (se aplican límites automáticamente)

console.log("\n" + "-".repeat(60) + "\n");

// Demostrar que LSP permite sustituibilidad completa
console.log("Demostrando sustituibilidad completa:");

/**
 * Función que trata todos los productos de manera uniforme
 * @param {Producto[]} productos - Array de cualquier tipo de producto
 */
function generarReporteVentas(productos) {
    console.log("\nREPORTE DE PRODUCTOS:");
    console.log("=" * 40);
    
    productos.forEach((producto, index) => {
        const info = producto.obtenerInfo();
        console.log(`\n${index + 1}. ${info.nombre}`);
        console.log(`   Tipo: ${info.tipo}`);
        console.log(`   Precio: $${info.precio}`);
        console.log(`   Disponible: ${info.disponible ? 'Sí' : 'No'}`);
        console.log(`   Descuento máximo: ${info.descuentoMaximo}%`);
        
        // Cada tipo muestra su información específica
        if (info.stock !== undefined) console.log(`   Stock: ${info.stock}`);
        if (info.descargas !== undefined) console.log(`   Descargas: ${info.descargas}`);
        if (info.pedidosEnCola !== undefined) console.log(`   Pedidos en cola: ${info.pedidosEnCola}`);
    });
}

generarReporteVentas(productosCorrectos);

console.log("\n" + "=".repeat(80));
console.log("VENTAJAS DEL LISKOV SUBSTITUTION PRINCIPLE:");
console.log("• Cualquier subclase puede reemplazar a la clase base sin problemas");
console.log("• El código cliente funciona correctamente con todas las implementaciones");
console.log("• Garantiza consistencia de comportamiento en toda la jerarquía");
console.log("• Facilita el polimorfismo seguro y predecible");
console.log("• Reduce bugs causados por comportamientos inesperados");
console.log("• Mejora la confiabilidad y mantenibilidad del código");
console.log("=".repeat(80));