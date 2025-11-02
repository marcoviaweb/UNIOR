/**
 * PATRÓN COMPOSITE - EJEMPLO EDUCATIVO
 * 
 * El patrón Composite permite componer objetos en estructuras de árbol para representar
 * jerarquías parte-todo. Este patrón permite a los clientes tratar objetos individuales
 * y composiciones de objetos de manera uniforme.
 * 
 * CASO DE USO: Sistema de archivos donde tenemos archivos (hojas) y carpetas (composites)
 */

/**
 * La clase base Component declara operaciones comunes tanto para objetos simples
 * como complejos de una composición. Esta clase actúa como la interfaz común
 * para todos los elementos del árbol.
 */
abstract class Component {
    protected parent!: Component | null;

    /**
     * Establece el componente padre en la estructura de árbol.
     * Esto es útil para navegar hacia arriba en la jerarquía.
     * 
     * @param parent - El componente padre o null si es la raíz
     */
    public setParent(parent: Component | null): void {
        this.parent = parent;
    }

    /**
     * Obtiene el componente padre actual.
     * 
     * @returns El componente padre o null si es la raíz del árbol
     */
    public getParent(): Component | null {
        return this.parent;
    }

    /**
     * Operaciones de gestión de hijos definidas en la clase base.
     * Ventaja: El código cliente no necesita conocer las clases concretas.
     * Desventaja: Estos métodos estarán vacíos para los componentes hoja.
     */
    public add(component: Component): void { 
        // Implementación vacía por defecto - solo los Composite la sobrescriben
    }

    public remove(component: Component): void { 
        // Implementación vacía por defecto - solo los Composite la sobrescriben
    }

    /**
     * Método que permite al código cliente determinar si un componente
     * puede tener hijos (es un composite) o no (es una hoja).
     * 
     * @returns true si es un composite, false si es una hoja
     */
    public isComposite(): boolean {
        return false; // Por defecto, los componentes son hojas
    }

    /**
     * Operación principal que debe ser implementada por todas las clases concretas.
     * Esta operación se ejecutará de forma recursiva en todo el árbol.
     */
    public abstract operation(): string;
}

/**
 * La clase Leaf (Hoja) representa los objetos finales de una composición.
 * Una hoja no puede tener hijos - es el elemento más básico del árbol.
 * 
 * ANALOGÍA: Un archivo en un sistema de archivos - no puede contener otros archivos.
 * 
 * Las hojas suelen realizar el trabajo real, mientras que los Composite
 * simplemente delegan el trabajo a sus sub-componentes.
 */
class Leaf extends Component {
    private name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    /**
     * Implementación específica de la operación para una hoja.
     * En este caso, simplemente retorna el nombre del archivo.
     * 
     * @returns El nombre del archivo (hoja)
     */
    public operation(): string {
        return `Archivo: ${this.name}`;
    }
}

/**
 * La clase Composite (Compuesto) representa componentes complejos que pueden tener hijos.
 * Puede contener tanto hojas como otros composites, formando una estructura de árbol.
 * 
 * ANALOGÍA: Una carpeta en un sistema de archivos - puede contener archivos y otras carpetas.
 * 
 * Los objetos Composite delegan el trabajo real a sus hijos y luego
 * "suman" o procesan el resultado de todos ellos.
 */
class Composite extends Component {
    protected children: Component[] = [];
    private name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    /**
     * Un objeto composite puede agregar o remover otros componentes
     * (tanto simples como complejos) de su lista de hijos.
     * 
     * @param component - El componente a agregar como hijo
     */
    public add(component: Component): void {
        this.children.push(component);
        component.setParent(this);
        console.log(`➕ Agregado '${component.operation()}' a la carpeta '${this.name}'`);
    }

    /**
     * Remueve un componente de la lista de hijos.
     * 
     * @param component - El componente a remover
     */
    public remove(component: Component): void {
        const componentIndex = this.children.indexOf(component);
        if (componentIndex !== -1) {
            this.children.splice(componentIndex, 1);
            component.setParent(null);
            console.log(`➖ Removido componente de la carpeta '${this.name}'`);
        }
    }

    /**
     * Indica que este componente es un composite (puede tener hijos).
     * 
     * @returns true porque es un composite
     */
    public isComposite(): boolean {
        return true;
    }

    /**
     * El Composite ejecuta su lógica principal de una manera particular.
     * Recorre recursivamente todos sus hijos, recolectando y procesando sus resultados.
     * 
     * Dado que los hijos del composite pasan estas llamadas a sus propios hijos,
     * y así sucesivamente, todo el árbol de objetos es recorrido como resultado.
     * 
     * @returns Una representación string del contenido de la carpeta
     */
    public operation(): string {
        const results = [];
        
        // Procesar cada hijo recursivamente
        for (const child of this.children) {
            results.push(child.operation());
        }

        // Si no hay hijos, es una carpeta vacía
        if (results.length === 0) {
            return `📁 Carpeta: ${this.name} (vacía)`;
        }

        // Construir la representación de la carpeta con su contenido
        return `📁 Carpeta: ${this.name} [${results.join(', ')}]`;
    }

    /**
     * Método auxiliar para obtener el nombre de la carpeta.
     * 
     * @returns El nombre de la carpeta
     */
    public getName(): string {
        return this.name;
    }
}

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
function mostrarEstructura(component: Component): void {
    console.log(`📋 RESULTADO: ${component.operation()}`);
}

/**
 * Función que demuestra la gestión dinámica del árbol.
 * Muestra cómo el código cliente puede trabajar con cualquier componente
 * sin depender de sus clases concretas.
 * 
 * @param component1 - Primer componente
 * @param component2 - Segundo componente a agregar al primero (si es posible)
 */
function gestionarArbol(component1: Component, component2: Component): void {
    console.log('\n🔧 Gestión dinámica del árbol:');
    
    if (component1.isComposite()) {
        console.log('   → El primer componente puede tener hijos, agregando el segundo...');
        component1.add(component2);
    } else {
        console.log('   → El primer componente es una hoja, no puede tener hijos');
    }
    
    console.log(`📋 RESULTADO FINAL: ${component1.operation()}`);
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
const archivoSimple = new Leaf('documento.txt');
console.log('Cliente: Tengo un archivo simple:');
mostrarEstructura(archivoSimple);

console.log('\n' + '='.repeat(60) + '\n');

/**
 * CASO 2: Trabajando con una estructura compleja (carpetas y archivos)
 */
console.log('📁 CASO 2: Estructura compleja (sistema de carpetas)');

// Crear la estructura de carpetas
const sistemaArchivos = new Composite('Sistema');
const carpetaDocumentos = new Composite('Documentos');
const carpetaImagenes = new Composite('Imágenes');
const carpetaProyectos = new Composite('Proyectos');

// Agregar archivos a las carpetas
carpetaDocumentos.add(new Leaf('manual.pdf'));
carpetaDocumentos.add(new Leaf('notas.txt'));

carpetaImagenes.add(new Leaf('foto1.jpg'));
carpetaImagenes.add(new Leaf('logo.png'));

carpetaProyectos.add(new Leaf('proyecto.zip'));

// Crear estructura anidada
const subcarpetaTS = new Composite('TypeScript');
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
const otroArchivo = new Leaf('backup.txt');
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