"use strict";
/**
 * PATRÓN COMPOSITE - SISTEMA DE PEDIDOS
 *
 * Problema: Calcular el precio total de un pedido que puede contener:
 * - Productos individuales
 * - Cajas que contienen productos
 * - Cajas que contienen otras cajas (anidamiento)
 *
 * Solución: Usar el patrón Composite donde tanto Productos como Cajas
 * implementan la misma interfaz para calcular precios.
 */
/**
 * Interfaz común para todos los elementos que pueden ser incluidos en un pedido.
 * Define la operación principal: calcular el precio total.
 */
class ElementoPedido {
    constructor(nombre) {
        this.nombre = nombre;
    }
    /**
     * Método auxiliar para generar indentación en las descripciones.
     */
    generarIndentacion(nivel) {
        return '  '.repeat(nivel);
    }
    /**
     * Obtiene el nombre del elemento.
     */
    obtenerNombre() {
        return this.nombre;
    }
}
/**
 * LEAF: Representa un producto individual (elemento terminal).
 * No puede contener otros elementos, solo tiene su propio precio.
 */
class Producto extends ElementoPedido {
    constructor(nombre, precio, categoria = 'General') {
        super(nombre);
        this.precio = precio;
        this.categoria = categoria;
    }
    /**
     * Para un producto individual, el precio es simplemente su valor base.
     */
    calcularPrecio() {
        return this.precio;
    }
    /**
     * Descripción de un producto individual.
     */
    obtenerDescripcion(nivel = 0) {
        const indentacion = this.generarIndentacion(nivel);
        return `${indentacion}📦 Producto: ${this.nombre} (${this.categoria}) - $${this.precio.toFixed(2)}`;
    }
    /**
     * Obtiene la categoría del producto.
     */
    obtenerCategoria() {
        return this.categoria;
    }
    /**
     * Obtiene el precio base del producto.
     */
    obtenerPrecioBase() {
        return this.precio;
    }
}
/**
 * COMPOSITE: Representa una caja que puede contener productos y otras cajas.
 * Su precio incluye su costo base más el precio de todo su contenido.
 */
class Caja extends ElementoPedido {
    constructor(nombre, costoCaja, tipoEmpaque = 'Estándar', capacidadMaxima = 10) {
        super(nombre);
        this.contenido = [];
        this.costoCaja = costoCaja;
        this.tipoEmpaque = tipoEmpaque;
        this.capacidadMaxima = capacidadMaxima;
    }
    /**
     * Agrega un elemento (producto o caja) al contenido de esta caja.
     */
    agregar(elemento) {
        if (this.contenido.length >= this.capacidadMaxima) {
            console.log(`⚠️  La caja '${this.nombre}' ha alcanzado su capacidad máxima (${this.capacidadMaxima} elementos)`);
            return;
        }
        this.contenido.push(elemento);
        console.log(`✅ Agregado '${elemento.obtenerNombre()}' a la caja '${this.nombre}'`);
    }
    /**
     * Remueve un elemento del contenido de la caja.
     */
    remover(elemento) {
        const indice = this.contenido.indexOf(elemento);
        if (indice !== -1) {
            this.contenido.splice(indice, 1);
            console.log(`➖ Removido '${elemento.obtenerNombre()}' de la caja '${this.nombre}'`);
        }
        else {
            console.log(`❌ No se encontró '${elemento.obtenerNombre()}' en la caja '${this.nombre}'`);
        }
    }
    /**
     * Calcula el precio total de la caja:
     * Costo de la caja + suma de precios de todo el contenido (recursivo)
     */
    calcularPrecio() {
        let precioTotal = this.costoCaja;
        // Sumar recursivamente el precio de cada elemento contenido
        for (const elemento of this.contenido) {
            precioTotal += elemento.calcularPrecio();
        }
        return precioTotal;
    }
    /**
     * Genera una descripción detallada y jerárquica del contenido de la caja.
     */
    obtenerDescripcion(nivel = 0) {
        const indentacion = this.generarIndentacion(nivel);
        let descripcion = `${indentacion}📦 Caja: ${this.nombre} (${this.tipoEmpaque}) - Costo base: $${this.costoCaja.toFixed(2)}`;
        if (this.contenido.length === 0) {
            descripcion += ` (vacía)`;
        }
        else {
            descripcion += ` (${this.contenido.length}/${this.capacidadMaxima} elementos):`;
            // Agregar descripción de cada elemento contenido con mayor indentación
            for (const elemento of this.contenido) {
                descripcion += '\n' + elemento.obtenerDescripcion(nivel + 1);
            }
        }
        return descripcion;
    }
    /**
     * Obtiene el número de elementos en la caja.
     */
    obtenerCantidadElementos() {
        return this.contenido.length;
    }
    /**
     * Obtiene el tipo de empaque de la caja.
     */
    obtenerTipoEmpaque() {
        return this.tipoEmpaque;
    }
    /**
     * Verifica si la caja está llena.
     */
    estaLlena() {
        return this.contenido.length >= this.capacidadMaxima;
    }
    /**
     * Obtiene una lista de todos los productos contenidos (recursivamente).
     */
    obtenerTodosLosProductos() {
        const productos = [];
        for (const elemento of this.contenido) {
            if (elemento instanceof Producto) {
                productos.push(elemento);
            }
            else if (elemento instanceof Caja) {
                productos.push(...elemento.obtenerTodosLosProductos());
            }
        }
        return productos;
    }
}
/**
 * Clase para gestionar un pedido completo.
 * Actúa como cliente del patrón Composite.
 */
class GestorPedidos {
    constructor(numeroPedido) {
        this.elementos = [];
        this.numeroPedido = numeroPedido;
        this.fechaPedido = new Date();
    }
    /**
     * Agrega un elemento al pedido.
     */
    agregarElemento(elemento) {
        this.elementos.push(elemento);
        console.log(`🛒 Agregado al pedido: ${elemento.obtenerNombre()}`);
    }
    /**
     * Calcula el precio total del pedido.
     * Gracias al patrón Composite, no importa si son productos o cajas.
     */
    calcularPrecioTotal() {
        let total = 0;
        for (const elemento of this.elementos) {
            total += elemento.calcularPrecio();
        }
        return total;
    }
    /**
     * Genera un resumen completo del pedido.
     */
    generarResumenPedido() {
        let resumen = `\n${'='.repeat(60)}\n`;
        resumen += `📋 RESUMEN DEL PEDIDO #${this.numeroPedido}\n`;
        resumen += `📅 Fecha: ${this.fechaPedido.toLocaleDateString()}\n`;
        resumen += `${'='.repeat(60)}\n\n`;
        if (this.elementos.length === 0) {
            resumen += `❌ El pedido está vacío\n`;
        }
        else {
            resumen += `📦 CONTENIDO DEL PEDIDO:\n\n`;
            for (let i = 0; i < this.elementos.length; i++) {
                resumen += `${i + 1}. ${this.elementos[i].obtenerDescripcion(0)}\n\n`;
            }
        }
        const total = this.calcularPrecioTotal();
        resumen += `${'='.repeat(60)}\n`;
        resumen += `💰 PRECIO TOTAL: $${total.toFixed(2)}\n`;
        resumen += `${'='.repeat(60)}\n`;
        return resumen;
    }
    /**
     * Obtiene estadísticas del pedido.
     */
    obtenerEstadisticas() {
        let totalProductos = 0;
        let totalCajas = 0;
        for (const elemento of this.elementos) {
            if (elemento instanceof Producto) {
                totalProductos++;
            }
            else if (elemento instanceof Caja) {
                totalCajas++;
                totalProductos += elemento.obtenerTodosLosProductos().length;
            }
        }
        const precioTotal = this.calcularPrecioTotal();
        const totalElementos = this.elementos.length;
        return {
            totalElementos,
            totalProductos,
            totalCajas,
            precioPromedio: totalElementos > 0 ? precioTotal / totalElementos : 0
        };
    }
}
// ============================================================================
// DEMOSTRACIÓN DEL SISTEMA DE PEDIDOS
// ============================================================================
console.log('🎯 SISTEMA DE PEDIDOS CON PATRÓN COMPOSITE');
console.log('💡 Resolviendo el problema de cálculo de precios en estructuras anidadas\n');
// Crear productos individuales
const laptop = new Producto('Laptop Gaming', 1200.00, 'Electrónicos');
const mouse = new Producto('Mouse Inalámbrico', 25.99, 'Periféricos');
const teclado = new Producto('Teclado Mecánico', 89.99, 'Periféricos');
const monitor = new Producto('Monitor 24"', 299.99, 'Electrónicos');
const libro = new Producto('Libro de Programación', 45.00, 'Libros');
const cable = new Producto('Cable USB-C', 19.99, 'Accesorios');
console.log('📦 PRODUCTOS CREADOS:');
console.log(laptop.obtenerDescripcion());
console.log(mouse.obtenerDescripcion());
console.log(teclado.obtenerDescripcion());
console.log(monitor.obtenerDescripcion());
console.log(libro.obtenerDescripcion());
console.log(cable.obtenerDescripcion());
console.log('\n' + '='.repeat(60) + '\n');
// Crear cajas y organizar productos
console.log('📦 CREANDO ESTRUCTURA DE CAJAS:');
// Caja pequeña para periféricos
const cajaPerifericos = new Caja('Caja Periféricos', 5.00, 'Acolchada', 5);
cajaPerifericos.agregar(mouse);
cajaPerifericos.agregar(teclado);
cajaPerifericos.agregar(cable);
// Caja mediana para electrónicos
const cajaElectronicos = new Caja('Caja Electrónicos', 15.00, 'Antiestática', 3);
cajaElectronicos.agregar(laptop);
cajaElectronicos.agregar(monitor);
// Caja grande que contiene otras cajas y productos sueltos
const cajaEnvioCompleto = new Caja('Caja Envío Completo', 10.00, 'Reforzada', 8);
cajaEnvioCompleto.agregar(cajaPerifericos);
cajaEnvioCompleto.agregar(cajaElectronicos);
cajaEnvioCompleto.agregar(libro); // Producto suelto en la caja principal
console.log('\n' + '='.repeat(60) + '\n');
// Crear pedido y agregar elementos
console.log('🛒 CREANDO PEDIDO:');
const gestor = new GestorPedidos('PED-2025-001');
// Agregar tanto productos individuales como cajas complejas
gestor.agregarElemento(cajaEnvioCompleto); // Caja compleja con anidamiento
gestor.agregarElemento(new Producto('Garantía Extendida', 99.99, 'Servicios')); // Producto individual
console.log('\n' + '='.repeat(60) + '\n');
// Mostrar la estructura completa del pedido
console.log('📋 ESTRUCTURA DETALLADA DEL PEDIDO:');
console.log(cajaEnvioCompleto.obtenerDescripcion());
console.log('\n' + '='.repeat(60) + '\n');
// Demostrar el cálculo de precios
console.log('💰 CÁLCULO DE PRECIOS (El poder del patrón Composite):');
console.log(`   Precio caja periféricos: $${cajaPerifericos.calcularPrecio().toFixed(2)}`);
console.log(`   Precio caja electrónicos: $${cajaElectronicos.calcularPrecio().toFixed(2)}`);
console.log(`   Precio caja envío completo: $${cajaEnvioCompleto.calcularPrecio().toFixed(2)}`);
// Generar resumen completo del pedido
console.log(gestor.generarResumenPedido());
// Mostrar estadísticas
const stats = gestor.obtenerEstadisticas();
console.log('📊 ESTADÍSTICAS DEL PEDIDO:');
console.log(`   • Total de elementos principales: ${stats.totalElementos}`);
console.log(`   • Total de productos individuales: ${stats.totalProductos}`);
console.log(`   • Total de cajas: ${stats.totalCajas}`);
console.log(`   • Precio promedio por elemento: $${stats.precioPromedio.toFixed(2)}`);
console.log('\n' + '='.repeat(60));
console.log('✨ BENEFICIOS DEL PATRÓN COMPOSITE DEMOSTRADOS:');
console.log('   1. 🎯 Uniformidad: Productos y cajas se tratan igual');
console.log('   2. 🔄 Recursión: Cálculo automático en estructuras anidadas');
console.log('   3. 🧩 Flexibilidad: Fácil agregar nuevos tipos de elementos');
console.log('   4. 🌳 Jerarquía: Representación natural de estructuras complejas');
console.log('   5. 💡 Simplicidad: El cliente no distingue entre tipos');
console.log('='.repeat(60));
/*
============================================================================
EXPLICACIÓN DE LA SOLUCIÓN
============================================================================

PROBLEMA ORIGINAL:
- Calcular el precio total de un pedido
- El pedido puede contener productos y cajas
- Las cajas pueden contener productos y otras cajas (anidamiento)
- Estructura de árbol compleja y variable

SOLUCIÓN CON COMPOSITE:

1. ELEMENTO BASE (Component):
   - ElementoPedido: Define la interfaz común
   - Operación principal: calcularPrecio()

2. HOJA (Leaf):
   - Producto: Elemento terminal con precio fijo
   - calcularPrecio() retorna su precio base

3. COMPUESTO (Composite):
   - Caja: Puede contener productos y otras cajas
   - calcularPrecio() = costo de la caja + suma de contenido

4. BENEFICIOS:
   ✅ El cálculo es automático y recursivo
   ✅ Agregar nuevos tipos es trivial
   ✅ El código cliente es simple y uniforme
   ✅ Manejo natural de estructuras anidadas

CASOS DE USO SIMILARES:
- Facturas con elementos y grupos de elementos
- Estructuras organizacionales con empleados y departamentos
- Menús con elementos y submenús
- Documentos con secciones y subsecciones

============================================================================
*/ 
