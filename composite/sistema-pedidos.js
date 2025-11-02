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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Interfaz común para todos los elementos que pueden ser incluidos en un pedido.
 * Define la operación principal: calcular el precio total.
 */
var ElementoPedido = /** @class */ (function () {
    function ElementoPedido(nombre) {
        this.nombre = nombre;
    }
    /**
     * Método auxiliar para generar indentación en las descripciones.
     */
    ElementoPedido.prototype.generarIndentacion = function (nivel) {
        return '  '.repeat(nivel);
    };
    /**
     * Obtiene el nombre del elemento.
     */
    ElementoPedido.prototype.obtenerNombre = function () {
        return this.nombre;
    };
    return ElementoPedido;
}());
/**
 * LEAF: Representa un producto individual (elemento terminal).
 * No puede contener otros elementos, solo tiene su propio precio.
 */
var Producto = /** @class */ (function (_super) {
    __extends(Producto, _super);
    function Producto(nombre, precio, categoria) {
        if (categoria === void 0) { categoria = 'General'; }
        var _this = _super.call(this, nombre) || this;
        _this.precio = precio;
        _this.categoria = categoria;
        return _this;
    }
    /**
     * Para un producto individual, el precio es simplemente su valor base.
     */
    Producto.prototype.calcularPrecio = function () {
        return this.precio;
    };
    /**
     * Descripción de un producto individual.
     */
    Producto.prototype.obtenerDescripcion = function (nivel) {
        if (nivel === void 0) { nivel = 0; }
        var indentacion = this.generarIndentacion(nivel);
        return "".concat(indentacion, "\uD83D\uDCE6 Producto: ").concat(this.nombre, " (").concat(this.categoria, ") - $").concat(this.precio.toFixed(2));
    };
    /**
     * Obtiene la categoría del producto.
     */
    Producto.prototype.obtenerCategoria = function () {
        return this.categoria;
    };
    /**
     * Obtiene el precio base del producto.
     */
    Producto.prototype.obtenerPrecioBase = function () {
        return this.precio;
    };
    return Producto;
}(ElementoPedido));
/**
 * COMPOSITE: Representa una caja que puede contener productos y otras cajas.
 * Su precio incluye su costo base más el precio de todo su contenido.
 */
var Caja = /** @class */ (function (_super) {
    __extends(Caja, _super);
    function Caja(nombre, costoCaja, tipoEmpaque, capacidadMaxima) {
        if (tipoEmpaque === void 0) { tipoEmpaque = 'Estándar'; }
        if (capacidadMaxima === void 0) { capacidadMaxima = 10; }
        var _this = _super.call(this, nombre) || this;
        _this.contenido = [];
        _this.costoCaja = costoCaja;
        _this.tipoEmpaque = tipoEmpaque;
        _this.capacidadMaxima = capacidadMaxima;
        return _this;
    }
    /**
     * Agrega un elemento (producto o caja) al contenido de esta caja.
     */
    Caja.prototype.agregar = function (elemento) {
        if (this.contenido.length >= this.capacidadMaxima) {
            console.log("\u26A0\uFE0F  La caja '".concat(this.nombre, "' ha alcanzado su capacidad m\u00E1xima (").concat(this.capacidadMaxima, " elementos)"));
            return;
        }
        this.contenido.push(elemento);
        console.log("\u2705 Agregado '".concat(elemento.obtenerNombre(), "' a la caja '").concat(this.nombre, "'"));
    };
    /**
     * Remueve un elemento del contenido de la caja.
     */
    Caja.prototype.remover = function (elemento) {
        var indice = this.contenido.indexOf(elemento);
        if (indice !== -1) {
            this.contenido.splice(indice, 1);
            console.log("\u2796 Removido '".concat(elemento.obtenerNombre(), "' de la caja '").concat(this.nombre, "'"));
        }
        else {
            console.log("\u274C No se encontr\u00F3 '".concat(elemento.obtenerNombre(), "' en la caja '").concat(this.nombre, "'"));
        }
    };
    /**
     * Calcula el precio total de la caja:
     * Costo de la caja + suma de precios de todo el contenido (recursivo)
     */
    Caja.prototype.calcularPrecio = function () {
        var precioTotal = this.costoCaja;
        // Sumar recursivamente el precio de cada elemento contenido
        for (var _i = 0, _a = this.contenido; _i < _a.length; _i++) {
            var elemento = _a[_i];
            precioTotal += elemento.calcularPrecio();
        }
        return precioTotal;
    };
    /**
     * Genera una descripción detallada y jerárquica del contenido de la caja.
     */
    Caja.prototype.obtenerDescripcion = function (nivel) {
        if (nivel === void 0) { nivel = 0; }
        var indentacion = this.generarIndentacion(nivel);
        var descripcion = "".concat(indentacion, "\uD83D\uDCE6 Caja: ").concat(this.nombre, " (").concat(this.tipoEmpaque, ") - Costo base: $").concat(this.costoCaja.toFixed(2));
        if (this.contenido.length === 0) {
            descripcion += " (vac\u00EDa)";
        }
        else {
            descripcion += " (".concat(this.contenido.length, "/").concat(this.capacidadMaxima, " elementos):");
            // Agregar descripción de cada elemento contenido con mayor indentación
            for (var _i = 0, _a = this.contenido; _i < _a.length; _i++) {
                var elemento = _a[_i];
                descripcion += '\n' + elemento.obtenerDescripcion(nivel + 1);
            }
        }
        return descripcion;
    };
    /**
     * Obtiene el número de elementos en la caja.
     */
    Caja.prototype.obtenerCantidadElementos = function () {
        return this.contenido.length;
    };
    /**
     * Obtiene el tipo de empaque de la caja.
     */
    Caja.prototype.obtenerTipoEmpaque = function () {
        return this.tipoEmpaque;
    };
    /**
     * Verifica si la caja está llena.
     */
    Caja.prototype.estaLlena = function () {
        return this.contenido.length >= this.capacidadMaxima;
    };
    /**
     * Obtiene una lista de todos los productos contenidos (recursivamente).
     */
    Caja.prototype.obtenerTodosLosProductos = function () {
        var productos = [];
        for (var _i = 0, _a = this.contenido; _i < _a.length; _i++) {
            var elemento = _a[_i];
            if (elemento instanceof Producto) {
                productos.push(elemento);
            }
            else if (elemento instanceof Caja) {
                productos.push.apply(productos, elemento.obtenerTodosLosProductos());
            }
        }
        return productos;
    };
    return Caja;
}(ElementoPedido));
/**
 * Clase para gestionar un pedido completo.
 * Actúa como cliente del patrón Composite.
 */
var GestorPedidos = /** @class */ (function () {
    function GestorPedidos(numeroPedido) {
        this.elementos = [];
        this.numeroPedido = numeroPedido;
        this.fechaPedido = new Date();
    }
    /**
     * Agrega un elemento al pedido.
     */
    GestorPedidos.prototype.agregarElemento = function (elemento) {
        this.elementos.push(elemento);
        console.log("\uD83D\uDED2 Agregado al pedido: ".concat(elemento.obtenerNombre()));
    };
    /**
     * Calcula el precio total del pedido.
     * Gracias al patrón Composite, no importa si son productos o cajas.
     */
    GestorPedidos.prototype.calcularPrecioTotal = function () {
        var total = 0;
        for (var _i = 0, _a = this.elementos; _i < _a.length; _i++) {
            var elemento = _a[_i];
            total += elemento.calcularPrecio();
        }
        return total;
    };
    /**
     * Genera un resumen completo del pedido.
     */
    GestorPedidos.prototype.generarResumenPedido = function () {
        var resumen = "\n".concat('='.repeat(60), "\n");
        resumen += "\uD83D\uDCCB RESUMEN DEL PEDIDO #".concat(this.numeroPedido, "\n");
        resumen += "\uD83D\uDCC5 Fecha: ".concat(this.fechaPedido.toLocaleDateString(), "\n");
        resumen += "".concat('='.repeat(60), "\n\n");
        if (this.elementos.length === 0) {
            resumen += "\u274C El pedido est\u00E1 vac\u00EDo\n";
        }
        else {
            resumen += "\uD83D\uDCE6 CONTENIDO DEL PEDIDO:\n\n";
            for (var i = 0; i < this.elementos.length; i++) {
                resumen += "".concat(i + 1, ". ").concat(this.elementos[i].obtenerDescripcion(0), "\n\n");
            }
        }
        var total = this.calcularPrecioTotal();
        resumen += "".concat('='.repeat(60), "\n");
        resumen += "\uD83D\uDCB0 PRECIO TOTAL: $".concat(total.toFixed(2), "\n");
        resumen += "".concat('='.repeat(60), "\n");
        return resumen;
    };
    /**
     * Obtiene estadísticas del pedido.
     */
    GestorPedidos.prototype.obtenerEstadisticas = function () {
        var totalProductos = 0;
        var totalCajas = 0;
        for (var _i = 0, _a = this.elementos; _i < _a.length; _i++) {
            var elemento = _a[_i];
            if (elemento instanceof Producto) {
                totalProductos++;
            }
            else if (elemento instanceof Caja) {
                totalCajas++;
                totalProductos += elemento.obtenerTodosLosProductos().length;
            }
        }
        var precioTotal = this.calcularPrecioTotal();
        var totalElementos = this.elementos.length;
        return {
            totalElementos: totalElementos,
            totalProductos: totalProductos,
            totalCajas: totalCajas,
            precioPromedio: totalElementos > 0 ? precioTotal / totalElementos : 0
        };
    };
    return GestorPedidos;
}());
// ============================================================================
// DEMOSTRACIÓN DEL SISTEMA DE PEDIDOS
// ============================================================================
console.log('🎯 SISTEMA DE PEDIDOS CON PATRÓN COMPOSITE');
console.log('💡 Resolviendo el problema de cálculo de precios en estructuras anidadas\n');
// Crear productos individuales
var laptop = new Producto('Laptop Gaming', 1200.00, 'Electrónicos');
var mouse = new Producto('Mouse Inalámbrico', 25.99, 'Periféricos');
var teclado = new Producto('Teclado Mecánico', 89.99, 'Periféricos');
var monitor = new Producto('Monitor 24"', 299.99, 'Electrónicos');
var libro = new Producto('Libro de Programación', 45.00, 'Libros');
var cable = new Producto('Cable USB-C', 19.99, 'Accesorios');
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
var cajaPerifericos = new Caja('Caja Periféricos', 5.00, 'Acolchada', 5);
cajaPerifericos.agregar(mouse);
cajaPerifericos.agregar(teclado);
cajaPerifericos.agregar(cable);
// Caja mediana para electrónicos
var cajaElectronicos = new Caja('Caja Electrónicos', 15.00, 'Antiestática', 3);
cajaElectronicos.agregar(laptop);
cajaElectronicos.agregar(monitor);
// Caja grande que contiene otras cajas y productos sueltos
var cajaEnvioCompleto = new Caja('Caja Envío Completo', 10.00, 'Reforzada', 8);
cajaEnvioCompleto.agregar(cajaPerifericos);
cajaEnvioCompleto.agregar(cajaElectronicos);
cajaEnvioCompleto.agregar(libro); // Producto suelto en la caja principal
console.log('\n' + '='.repeat(60) + '\n');
// Crear pedido y agregar elementos
console.log('🛒 CREANDO PEDIDO:');
var gestor = new GestorPedidos('PED-2025-001');
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
console.log("   Precio caja perif\u00E9ricos: $".concat(cajaPerifericos.calcularPrecio().toFixed(2)));
console.log("   Precio caja electr\u00F3nicos: $".concat(cajaElectronicos.calcularPrecio().toFixed(2)));
console.log("   Precio caja env\u00EDo completo: $".concat(cajaEnvioCompleto.calcularPrecio().toFixed(2)));
// Generar resumen completo del pedido
console.log(gestor.generarResumenPedido());
// Mostrar estadísticas
var stats = gestor.obtenerEstadisticas();
console.log('📊 ESTADÍSTICAS DEL PEDIDO:');
console.log("   \u2022 Total de elementos principales: ".concat(stats.totalElementos));
console.log("   \u2022 Total de productos individuales: ".concat(stats.totalProductos));
console.log("   \u2022 Total de cajas: ".concat(stats.totalCajas));
console.log("   \u2022 Precio promedio por elemento: $".concat(stats.precioPromedio.toFixed(2)));
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
