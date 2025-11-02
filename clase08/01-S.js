/*
=====================================
PRINCIPIO SOLID: S - Single Responsibility Principle (SRP)
=====================================

DEFINICIÓN: Una clase debe tener una sola razón para cambiar.
Cada clase debe tener una única responsabilidad y esa responsabilidad 
debe estar completamente encapsulada por la clase.

CONTEXTO: Sistema de E-commerce
*/

console.log("=== PRINCIPIO SOLID: S - Single Responsibility Principle ===\n");

// EJEMPLO INCORRECTO - Violación del SRP
console.log("EJEMPLO INCORRECTO - Violación del SRP");
console.log("--------------------------------------");

// Esta clase viola el SRP porque tiene múltiples responsabilidades:
// 1. Gestionar datos del producto
// 2. Calcular descuentos
// 3. Validar datos
// 4. Enviar emails
// 5. Generar reportes
class ProductoIncorrecto {
    constructor(nombre, precio, categoria, email) {
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.email = email;
        this.fechaCreacion = new Date();
    }

    // Responsabilidad 1: Gestión de datos del producto
    actualizarPrecio(nuevoPrecio) {
        this.precio = nuevoPrecio;
        console.log(`Precio actualizado a: $${nuevoPrecio}`);
    }

    // Responsabilidad 2: Cálculo de descuentos (lógica de negocio)
    calcularDescuento() {
        if (this.categoria === 'electronica') {
            return this.precio * 0.1; // 10% descuento
        } else if (this.categoria === 'ropa') {
            return this.precio * 0.15; // 15% descuento
        }
        return 0;
    }

    // Responsabilidad 3: Validación de datos
    validarDatos() {
        if (!this.nombre || this.nombre.length < 3) {
            throw new Error("Nombre del producto debe tener al menos 3 caracteres");
        }
        if (this.precio <= 0) {
            throw new Error("El precio debe ser mayor a 0");
        }
        return true;
    }

    // Responsabilidad 4: Envío de emails (comunicación)
    enviarNotificacionCambio() {
        console.log(`Enviando email a ${this.email}: Producto ${this.nombre} actualizado`);
        // Lógica de envío de email...
    }

    // Responsabilidad 5: Generación de reportes
    generarReporte() {
        const descuento = this.calcularDescuento();
        const precioFinal = this.precio - descuento;
        
        return `
=== REPORTE DE PRODUCTO ===
Nombre: ${this.nombre}
Precio original: $${this.precio}
Descuento: $${descuento}
Precio final: $${precioFinal}
Categoría: ${this.categoria}
Fecha creación: ${this.fechaCreacion.toLocaleDateString()}
===========================
        `;
    }
}

// Uso del ejemplo incorrecto
try {
    const producto1 = new ProductoIncorrecto("Laptop Gaming", 1500, "electronica", "cliente@email.com");
    producto1.validarDatos();
    console.log(producto1.generarReporte());
    
    producto1.actualizarPrecio(1200);
    producto1.enviarNotificacionCambio();
    
} catch (error) {
    console.error("Error:", error.message);
}

console.log("\n" + "=".repeat(80) + "\n");




// EJEMPLO CORRECTO - Aplicando SRP
console.log("EJEMPLO CORRECTO - Aplicando SRP");
console.log("--------------------------------");

// Cada clase tiene una única responsabilidad

// 1. Clase para gestionar datos del producto
class Producto {
    constructor(nombre, precio, categoria) {
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.fechaCreacion = new Date();
    }

    actualizarPrecio(nuevoPrecio) {
        this.precio = nuevoPrecio;
        console.log(`Precio actualizado a: $${nuevoPrecio}`);
    }

    obtenerInformacion() {
        return {
            nombre: this.nombre,
            precio: this.precio,
            categoria: this.categoria,
            fechaCreacion: this.fechaCreacion
        };
    }
}

// 2. Clase especializada en cálculos de descuentos
class CalculadorDescuentos {
    static calcularDescuentoPorCategoria(producto) {
        const descuentos = {
            'electronica': 0.10,    // 10%
            'ropa': 0.15,          // 15%
            'hogar': 0.08,         // 8%
            'libros': 0.05         // 5%
        };

        const porcentajeDescuento = descuentos[producto.categoria] || 0;
        return producto.precio * porcentajeDescuento;
    }

    static calcularPrecioFinal(producto) {
        const descuento = this.calcularDescuentoPorCategoria(producto);
        return producto.precio - descuento;
    }
}

// 3. Clase especializada en validaciones
class ValidadorProducto {
    static validar(producto) {
        const errores = [];

        if (!producto.nombre || producto.nombre.length < 3) {
            errores.push("Nombre del producto debe tener al menos 3 caracteres");
        }

        if (producto.precio <= 0) {
            errores.push("El precio debe ser mayor a 0");
        }

        if (!producto.categoria) {
            errores.push("La categoría es obligatoria");
        }

        if (errores.length > 0) {
            throw new Error(`Errores de validación: ${errores.join(', ')}`);
        }

        return true;
    }
}

// 4. Clase especializada en notificaciones
class NotificadorEmail {
    constructor(emailDestino) {
        this.emailDestino = emailDestino;
    }

    enviarNotificacionActualizacion(producto) {
        console.log(`Enviando email a ${this.emailDestino}`);
        console.log(`Asunto: Producto actualizado - ${producto.nombre}`);
        console.log(`Mensaje: El producto ${producto.nombre} ha sido actualizado.`);
        // Aquí iría la lógica real de envío de email
    }

    enviarNotificacionDescuento(producto, descuento) {
        console.log(`Enviando email promocional a ${this.emailDestino}`);
        console.log(`¡Oferta especial! ${producto.nombre} con ${descuento}% de descuento`);
    }
}

// 5. Clase especializada en generación de reportes
class GeneradorReportes {
    static generarReporteProducto(producto) {
        const descuento = CalculadorDescuentos.calcularDescuentoPorCategoria(producto);
        const precioFinal = CalculadorDescuentos.calcularPrecioFinal(producto);
        
        return `
=== REPORTE DE PRODUCTO ===
Nombre: ${producto.nombre}
Precio original: $${producto.precio}
Descuento: $${descuento.toFixed(2)}
Precio final: $${precioFinal.toFixed(2)}
Categoría: ${producto.categoria}
Fecha creación: ${producto.fechaCreacion.toLocaleDateString()}
===========================`;
    }

    static generarReporteVentas(productos) {
        let totalVentas = 0;
        let totalDescuentos = 0;

        productos.forEach(producto => {
            const descuento = CalculadorDescuentos.calcularDescuentoPorCategoria(producto);
            totalVentas += CalculadorDescuentos.calcularPrecioFinal(producto);
            totalDescuentos += descuento;
        });

        return `
=== REPORTE DE VENTAS ===
Productos procesados: ${productos.length}
Total en ventas: $${totalVentas.toFixed(2)}
Total en descuentos: $${totalDescuentos.toFixed(2)}
========================`;
    }
}

// Uso del ejemplo correcto
console.log("Creando y validando productos...\n");

try {
    // Crear productos
    const laptop = new Producto("Laptop Gaming", 1500, "electronica");
    const camisa = new Producto("Camisa Polo", 80, "ropa");
    const libro = new Producto("JavaScript Avanzado", 45, "libros");

    // Validar productos
    [laptop, camisa, libro].forEach(producto => {
        ValidadorProducto.validar(producto);
        console.log(`Producto ${producto.nombre} validado correctamente`);
    });

    console.log("\n" + "-".repeat(50) + "\n");

    // Generar reportes individuales
    console.log("REPORTES INDIVIDUALES:");
    console.log(GeneradorReportes.generarReporteProducto(laptop));
    console.log(GeneradorReportes.generarReporteProducto(camisa));

    // Actualizar precio y notificar
    console.log("ACTUALIZANDO PRECIOS:");
    const notificador = new NotificadorEmail("cliente@email.com");
    
    laptop.actualizarPrecio(1200);
    notificador.enviarNotificacionActualizacion(laptop);

    console.log("\n" + "-".repeat(50) + "\n");

    // Reporte consolidado
    console.log("REPORTE CONSOLIDADO:");
    console.log(GeneradorReportes.generarReporteVentas([laptop, camisa, libro]));

} catch (error) {
    console.error("Error:", error.message);
}

console.log("\n" + "=".repeat(80));
console.log("VENTAJAS DEL SRP:");
console.log("• Cada clase tiene una responsabilidad específica");
console.log("• Fácil mantenimiento y modificación");
console.log("• Código más legible y organizado");
console.log("• Facilita las pruebas unitarias");
console.log("• Reduce el acoplamiento entre componentes");
console.log("• Permite reutilización de código");
console.log("=".repeat(80));