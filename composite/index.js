/**
 * PATRÓN COMPOSITE - EJEMPLO EDUCATIVO
 *
 * El patrón Composite permite componer objetos en estructuras de árbol para representar
 * jerarquías parte-todo. Este patrón permite a los clientes tratar objetos individuales
 * y composiciones de objetos de manera uniforme.
 *
 * CASO DE USO: Sistema de archivos donde tenemos archivos (hojas) y carpetas (composites)
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
 * La clase base Component declara operaciones comunes tanto para objetos simples
 * como complejos de una composición. Esta clase actúa como la interfaz común
 * para todos los elementos del árbol.
 */
var Component = /** @class */ (function () {
    function Component() {
    }
    /**
     * Establece el componente padre en la estructura de árbol.
     * Esto es útil para navegar hacia arriba en la jerarquía.
     *
     * @param parent - El componente padre o null si es la raíz
     */
    Component.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    /**
     * Obtiene el componente padre actual.
     *
     * @returns El componente padre o null si es la raíz del árbol
     */
    Component.prototype.getParent = function () {
        return this.parent;
    };
    /**
     * Operaciones de gestión de hijos definidas en la clase base.
     * Ventaja: El código cliente no necesita conocer las clases concretas.
     * Desventaja: Estos métodos estarán vacíos para los componentes hoja.
     */
    Component.prototype.add = function (component) {
        // Implementación vacía por defecto - solo los Composite la sobrescriben
    };
    Component.prototype.remove = function (component) {
        // Implementación vacía por defecto - solo los Composite la sobrescriben
    };
    /**
     * Método que permite al código cliente determinar si un componente
     * puede tener hijos (es un composite) o no (es una hoja).
     *
     * @returns true si es un composite, false si es una hoja
     */
    Component.prototype.isComposite = function () {
        return false; // Por defecto, los componentes son hojas
    };
    return Component;
}());
/**
 * La clase Leaf (Hoja) representa los objetos finales de una composición.
 * Una hoja no puede tener hijos - es el elemento más básico del árbol.
 *
 * ANALOGÍA: Un archivo en un sistema de archivos - no puede contener otros archivos.
 *
 * Las hojas suelen realizar el trabajo real, mientras que los Composite
 * simplemente delegan el trabajo a sus sub-componentes.
 */
var Leaf = /** @class */ (function (_super) {
    __extends(Leaf, _super);
    function Leaf(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        return _this;
    }
    /**
     * Implementación específica de la operación para una hoja.
     * En este caso, simplemente retorna el nombre del archivo.
     *
     * @returns El nombre del archivo (hoja)
     */
    Leaf.prototype.operation = function () {
        return "Archivo: ".concat(this.name);
    };
    return Leaf;
}(Component));
/**
 * La clase Composite (Compuesto) representa componentes complejos que pueden tener hijos.
 * Puede contener tanto hojas como otros composites, formando una estructura de árbol.
 *
 * ANALOGÍA: Una carpeta en un sistema de archivos - puede contener archivos y otras carpetas.
 *
 * Los objetos Composite delegan el trabajo real a sus hijos y luego
 * "suman" o procesan el resultado de todos ellos.
 */
var Composite = /** @class */ (function (_super) {
    __extends(Composite, _super);
    function Composite(name) {
        var _this = _super.call(this) || this;
        _this.children = [];
        _this.name = name;
        return _this;
    }
    /**
     * Un objeto composite puede agregar o remover otros componentes
     * (tanto simples como complejos) de su lista de hijos.
     *
     * @param component - El componente a agregar como hijo
     */
    Composite.prototype.add = function (component) {
        this.children.push(component);
        component.setParent(this);
        console.log("\u2795 Agregado '".concat(component.operation(), "' a la carpeta '").concat(this.name, "'"));
    };
    /**
     * Remueve un componente de la lista de hijos.
     *
     * @param component - El componente a remover
     */
    Composite.prototype.remove = function (component) {
        var componentIndex = this.children.indexOf(component);
        if (componentIndex !== -1) {
            this.children.splice(componentIndex, 1);
            component.setParent(null);
            console.log("\u2796 Removido componente de la carpeta '".concat(this.name, "'"));
        }
    };
    /**
     * Indica que este componente es un composite (puede tener hijos).
     *
     * @returns true porque es un composite
     */
    Composite.prototype.isComposite = function () {
        return true;
    };
    /**
     * El Composite ejecuta su lógica principal de una manera particular.
     * Recorre recursivamente todos sus hijos, recolectando y procesando sus resultados.
     *
     * Dado que los hijos del composite pasan estas llamadas a sus propios hijos,
     * y así sucesivamente, todo el árbol de objetos es recorrido como resultado.
     *
     * @returns Una representación string del contenido de la carpeta
     */
    Composite.prototype.operation = function () {
        var results = [];
        // Procesar cada hijo recursivamente
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            results.push(child.operation());
        }
        // Si no hay hijos, es una carpeta vacía
        if (results.length === 0) {
            return "\uD83D\uDCC1 Carpeta: ".concat(this.name, " (vac\u00EDa)");
        }
        // Construir la representación de la carpeta con su contenido
        return "\uD83D\uDCC1 Carpeta: ".concat(this.name, " [").concat(results.join(', '), "]");
    };
    /**
     * Método auxiliar para obtener el nombre de la carpeta.
     *
     * @returns El nombre de la carpeta
     */
    Composite.prototype.getName = function () {
        return this.name;
    };
    return Composite;
}(Component));
// ============================================================================
// FUNCIONES CLIENTE - DEMOSTRACIÓN DEL PATRÓN COMPOSITE
// ============================================================================
/**
 * El código cliente trabaja con todos los componentes a través de la interfaz base.
 * Esto es lo poderoso del patrón: no necesita saber si está trabajando con una
 * hoja simple o con un composite complejo.
 *
 * @param component - Cualquier componente (hoja o composite)
 */
function mostrarEstructura(component) {
    console.log("\uD83D\uDCCB RESULTADO: ".concat(component.operation()));
}
/**
 * Función que demuestra la gestión dinámica del árbol.
 * Muestra cómo el código cliente puede trabajar con cualquier componente
 * sin depender de sus clases concretas.
 *
 * @param component1 - Primer componente
 * @param component2 - Segundo componente a agregar al primero (si es posible)
 */
function gestionarArbol(component1, component2) {
    console.log('\n🔧 Gestión dinámica del árbol:');
    if (component1.isComposite()) {
        console.log('   → El primer componente puede tener hijos, agregando el segundo...');
        component1.add(component2);
    }
    else {
        console.log('   → El primer componente es una hoja, no puede tener hijos');
    }
    console.log("\uD83D\uDCCB RESULTADO FINAL: ".concat(component1.operation()));
}
// ============================================================================
// DEMOSTRACIÓN PRÁCTICA DEL PATRÓN
// ============================================================================
console.log('🎯 DEMOSTRACIÓN DEL PATRÓN COMPOSITE');
console.log('💡 Simulando un sistema de archivos con carpetas y archivos\n');
/**
 * CASO 1: Trabajando con un componente simple (archivo)
 */
console.log('📄 CASO 1: Componente simple (archivo)');
var archivoSimple = new Leaf('documento.txt');
console.log('Cliente: Tengo un archivo simple:');
mostrarEstructura(archivoSimple);
console.log('\n' + '='.repeat(60) + '\n');
/**
 * CASO 2: Trabajando con una estructura compleja (carpetas y archivos)
 */
console.log('📁 CASO 2: Estructura compleja (sistema de carpetas)');
// Crear la estructura de carpetas
var sistemaArchivos = new Composite('Sistema');
var carpetaDocumentos = new Composite('Documentos');
var carpetaImagenes = new Composite('Imágenes');
var carpetaProyectos = new Composite('Proyectos');
// Agregar archivos a las carpetas
carpetaDocumentos.add(new Leaf('manual.pdf'));
carpetaDocumentos.add(new Leaf('notas.txt'));
carpetaImagenes.add(new Leaf('foto1.jpg'));
carpetaImagenes.add(new Leaf('logo.png'));
carpetaProyectos.add(new Leaf('proyecto.zip'));
// Crear estructura anidada
var subcarpetaTS = new Composite('TypeScript');
subcarpetaTS.add(new Leaf('index.ts'));
subcarpetaTS.add(new Leaf('types.d.ts'));
carpetaProyectos.add(subcarpetaTS);
// Agregar todo al sistema principal
sistemaArchivos.add(carpetaDocumentos);
sistemaArchivos.add(carpetaImagenes);
sistemaArchivos.add(carpetaProyectos);
console.log('\nCliente: Ahora tengo un sistema de archivos completo:');
mostrarEstructura(sistemaArchivos);
console.log('\n' + '='.repeat(60) + '\n');
/**
 * CASO 3: Gestión dinámica - El poder del patrón Composite
 */
console.log('⚡ CASO 3: Gestión dinámica del árbol');
console.log('Gracias a que las operaciones de gestión están en la clase base,');
console.log('el cliente puede trabajar con cualquier componente sin conocer su tipo concreto.');
gestionarArbol(sistemaArchivos, archivoSimple);
console.log('\n' + '='.repeat(60) + '\n');
/**
 * CASO 4: Intentando agregar a una hoja (para mostrar el comportamiento)
 */
console.log('🚫 CASO 4: Intentando agregar a una hoja');
var otroArchivo = new Leaf('backup.txt');
gestionarArbol(archivoSimple, otroArchivo);
// ============================================================================
// RESUMEN DEL PATRÓN COMPOSITE
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log('📚 RESUMEN DEL PATRÓN COMPOSITE');
console.log('='.repeat(60));
console.log('\n🎯 PROPÓSITO:');
console.log('   Permite componer objetos en estructuras de árbol para representar');
console.log('   jerarquías parte-todo. Trata objetos individuales y composiciones');
console.log('   de manera uniforme.');
console.log('\n🏗️ ESTRUCTURA:');
console.log('   • Component: Interfaz común para objetos simples y compuestos');
console.log('   • Leaf: Representa objetos finales (sin hijos)');
console.log('   • Composite: Representa objetos complejos (con hijos)');
console.log('\n✅ VENTAJAS:');
console.log('   • Facilita agregar nuevos tipos de componentes');
console.log('   • El cliente no distingue entre objetos simples y compuestos');
console.log('   • Estructura recursiva natural para jerarquías');
console.log('\n⚠️ DESVENTAJAS:');
console.log('   • Puede hacer el diseño demasiado general');
console.log('   • Algunos métodos pueden no tener sentido en las hojas');
console.log('\n🌍 CASOS DE USO REALES:');
console.log('   • Sistemas de archivos (carpetas y archivos)');
console.log('   • Interfaces gráficas (contenedores y widgets)');
console.log('   • Estructuras organizacionales (departamentos y empleados)');
console.log('   • Menús de aplicaciones (menús y elementos)');
console.log('   • Documentos (secciones, párrafos, texto)');
console.log('\n' + '='.repeat(60));
/*
============================================================================
INSTRUCCIONES DE EJECUCIÓN
============================================================================

Para ejecutar este ejemplo del patrón Composite:

1. COMPILAR EL ARCHIVO TYPESCRIPT:
   Abra una terminal en la carpeta del proyecto y ejecute:
   
   npx tsc index.ts
   
   Esto generará un archivo index.js

2. EJECUTAR EL CÓDIGO JAVASCRIPT:
   En la misma terminal, ejecute:
   
   node index.js

3. ALTERNATIVA - EJECUTAR DIRECTAMENTE CON TS-NODE:
   Si tiene ts-node instalado globalmente:
   
   npm install -g ts-node
   ts-node index.ts

4. ALTERNATIVA - USAR NPX:
   npx ts-node index.ts

============================================================================
SALIDA ESPERADA:
============================================================================

El programa mostrará:
- Creación de archivos y carpetas
- Estructura jerárquica del sistema de archivos
- Operaciones de agregar/quitar componentes
- Gestión dinámica del árbol
- Demostración de la uniformidad en el tratamiento de objetos

============================================================================
CONCEPTOS CLAVE DEMOSTRADOS:
============================================================================

1. TRANSPARENCIA: El cliente trata hojas y composites igual
2. RECURSIÓN: Las operaciones se propagan por todo el árbol
3. FLEXIBILIDAD: Fácil agregar nuevos tipos de componentes
4. JERARQUÍA: Representación natural de estructuras anidadas

============================================================================
*/ 
