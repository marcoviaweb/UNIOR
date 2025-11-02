"use strict";
/**
 * GENERADOR DE DIAGRAMAS MERMAID PARA EL PATRÓN COMPOSITE
 *
 * Este archivo extiende el sistema de pedidos para generar diagramas visuales
 * de la estructura de árbol usando la sintaxis de Mermaid.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneradorDiagramaMermaid = void 0;
exports.demostrarDiagramas = demostrarDiagramas;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Clase para generar diagramas Mermaid del árbol de productos
 */
class GeneradorDiagramaMermaid {
    constructor() {
        this.contadorNodos = 0;
        this.nodos = new Map();
    }
    /**
     * Genera un diagrama Mermaid para un elemento del pedido
     */
    generarDiagrama(elemento, titulo = 'Estructura del Pedido') {
        this.contadorNodos = 0;
        this.nodos.clear();
        let mermaid = `graph TD\n`;
        mermaid += `    %% ${titulo}\n`;
        mermaid += `    %% Generado automáticamente por el sistema de pedidos\n\n`;
        // Generar nodos y conexiones
        const nodoRaiz = this.procesarElemento(elemento);
        mermaid += this.generarNodos();
        mermaid += this.generarConexiones(elemento, nodoRaiz);
        // Agregar estilos
        mermaid += this.generarEstilos();
        return mermaid;
    }
    /**
     * Procesa un elemento y genera su representación en el árbol
     */
    procesarElemento(elemento) {
        if (this.nodos.has(elemento)) {
            return this.nodos.get(elemento);
        }
        const idNodo = `nodo${this.contadorNodos++}`;
        this.nodos.set(elemento, idNodo);
        // Si es una caja, procesar recursivamente sus hijos
        if (elemento.contenido && Array.isArray(elemento.contenido)) {
            for (const hijo of elemento.contenido) {
                this.procesarElemento(hijo);
            }
        }
        return idNodo;
    }
    /**
     * Genera la definición de todos los nodos
     */
    generarNodos() {
        let nodos = '\n    %% Definición de nodos\n';
        for (const [elemento, idNodo] of this.nodos) {
            const esProducto = !elemento.contenido;
            const nombre = elemento.obtenerNombre ? elemento.obtenerNombre() : elemento.nombre;
            const precio = elemento.calcularPrecio ? `$${elemento.calcularPrecio().toFixed(2)}` : '';
            if (esProducto) {
                // Producto (nodo rectangular)
                nodos += `    ${idNodo}["📦 ${nombre}<br/>${precio}"]:::producto\n`;
            }
            else {
                // Caja (nodo con bordes redondeados)
                const cantidadElementos = elemento.obtenerCantidadElementos ? elemento.obtenerCantidadElementos() : 0;
                nodos += `    ${idNodo}("📁 ${nombre}<br/>${precio}<br/>(${cantidadElementos} elementos)"):::caja\n`;
            }
        }
        return nodos + '\n';
    }
    /**
     * Genera las conexiones entre nodos
     */
    generarConexiones(elemento, idNodoPadre) {
        let conexiones = '    %% Conexiones\n';
        if (elemento.contenido && Array.isArray(elemento.contenido)) {
            for (const hijo of elemento.contenido) {
                const idNodoHijo = this.nodos.get(hijo);
                const esProducto = !hijo.contenido;
                if (esProducto) {
                    conexiones += `    ${idNodoPadre} --> ${idNodoHijo}\n`;
                }
                else {
                    conexiones += `    ${idNodoPadre} --> ${idNodoHijo}\n`;
                    conexiones += this.generarConexiones(hijo, idNodoHijo);
                }
            }
        }
        return conexiones;
    }
    /**
     * Genera los estilos CSS para el diagrama
     */
    generarEstilos() {
        return `
    %% Estilos
    classDef producto fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000
    classDef caja fill:#f3e5f5,stroke:#4a148c,stroke-width:3px,color:#000
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:1px
`;
    }
    /**
     * Genera un diagrama simplificado solo con nombres
     */
    generarDiagramaSimplificado(elemento, titulo = 'Vista Simplificada') {
        this.contadorNodos = 0;
        this.nodos.clear();
        let mermaid = `graph TD\n`;
        mermaid += `    %% ${titulo}\n\n`;
        const nodoRaiz = this.procesarElementoSimplificado(elemento);
        mermaid += this.generarNodosSimplificados();
        mermaid += this.generarConexionesSimplificadas(elemento, nodoRaiz);
        mermaid += this.generarEstilos();
        return mermaid;
    }
    procesarElementoSimplificado(elemento) {
        if (this.nodos.has(elemento)) {
            return this.nodos.get(elemento);
        }
        const idNodo = `nodo${this.contadorNodos++}`;
        this.nodos.set(elemento, idNodo);
        if (elemento.contenido && Array.isArray(elemento.contenido)) {
            for (const hijo of elemento.contenido) {
                this.procesarElementoSimplificado(hijo);
            }
        }
        return idNodo;
    }
    generarNodosSimplificados() {
        let nodos = '    %% Nodos simplificados\n';
        for (const [elemento, idNodo] of this.nodos) {
            const esProducto = !elemento.contenido;
            const nombre = elemento.obtenerNombre ? elemento.obtenerNombre() : elemento.nombre;
            if (esProducto) {
                nodos += `    ${idNodo}["${nombre}"]:::producto\n`;
            }
            else {
                nodos += `    ${idNodo}("${nombre}"):::caja\n`;
            }
        }
        return nodos + '\n';
    }
    generarConexionesSimplificadas(elemento, idNodoPadre) {
        let conexiones = '    %% Conexiones\n';
        if (elemento.contenido && Array.isArray(elemento.contenido)) {
            for (const hijo of elemento.contenido) {
                const idNodoHijo = this.nodos.get(hijo);
                conexiones += `    ${idNodoPadre} --> ${idNodoHijo}\n`;
                if (hijo.contenido) {
                    conexiones += this.generarConexionesSimplificadas(hijo, idNodoHijo);
                }
            }
        }
        return conexiones;
    }
    /**
     * Guarda el diagrama en un archivo .mmd
     */
    guardarDiagrama(mermaid, nombreArchivo) {
        const rutaArchivo = path.join(__dirname, `${nombreArchivo}.mmd`);
        fs.writeFileSync(rutaArchivo, mermaid, 'utf8');
        console.log(`📊 Diagrama guardado en: ${rutaArchivo}`);
    }
    /**
     * Genera un archivo HTML con el diagrama renderizado
     */
    generarHTML(mermaid, nombreArchivo, titulo = 'Diagrama del Pedido') {
        const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .diagram-container {
            text-align: center;
            margin: 20px 0;
        }
        .info {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #2196f3;
        }
        .legend {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        .legend-item {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px 10px;
            border-radius: 5px;
        }
        .legend-producto {
            background: #e1f5fe;
            border: 2px solid #01579b;
        }
        .legend-caja {
            background: #f3e5f5;
            border: 2px solid #4a148c;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 ${titulo}</h1>
        
        <div class="info">
            <strong>📋 Patrón Composite:</strong> Este diagrama muestra la estructura jerárquica del pedido,
            donde tanto productos individuales como cajas se tratan de manera uniforme.
        </div>

        <div class="legend">
            <div class="legend-item legend-producto">
                <span>📦</span>
                <span>Producto (Leaf)</span>
            </div>
            <div class="legend-item legend-caja">
                <span>📁</span>
                <span>Caja (Composite)</span>
            </div>
        </div>

        <div class="diagram-container">
            <div class="mermaid">
${mermaid}
            </div>
        </div>

        <div class="info">
            <strong>💡 Cómo leer el diagrama:</strong>
            <ul>
                <li>Los nodos rectangulares (📦) representan productos individuales</li>
                <li>Los nodos redondeados (📁) representan cajas que pueden contener otros elementos</li>
                <li>Las flechas muestran la relación "contiene"</li>
                <li>El precio se calcula recursivamente: caja + contenido</li>
            </ul>
        </div>
    </div>

    <script>
        mermaid.initialize({ 
            startOnLoad: true,
            theme: 'default',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true
            }
        });
    </script>
</body>
</html>`;
        const rutaArchivo = path.join(__dirname, `${nombreArchivo}.html`);
        fs.writeFileSync(rutaArchivo, html, 'utf8');
        console.log(`🌐 Archivo HTML generado: ${rutaArchivo}`);
    }
}
exports.GeneradorDiagramaMermaid = GeneradorDiagramaMermaid;
// ============================================================================
// EJEMPLO DE USO
// ============================================================================
// Función para demostrar la generación de diagramas
function demostrarDiagramas() {
    console.log('🎨 GENERACIÓN DE DIAGRAMAS MERMAID');
    console.log('📊 Creando representaciones visuales del árbol de productos\n');
    // Crear la misma estructura del ejemplo anterior
    // (Aquí reutilizaríamos las clases del sistema-pedidos.ts)
    const generador = new GeneradorDiagramaMermaid();
    // Ejemplo de estructura simple para demostración
    const estructuraEjemplo = {
        obtenerNombre: () => 'Pedido Principal',
        calcularPrecio: () => 1500.00,
        contenido: [
            {
                obtenerNombre: () => 'Caja Electrónicos',
                calcularPrecio: () => 1200.00,
                contenido: [
                    {
                        obtenerNombre: () => 'Laptop',
                        calcularPrecio: () => 1000.00
                    },
                    {
                        obtenerNombre: () => 'Mouse',
                        calcularPrecio: () => 50.00
                    }
                ]
            },
            {
                obtenerNombre: () => 'Libro',
                calcularPrecio: () => 30.00
            }
        ]
    };
    // Generar diagrama completo
    const diagramaCompleto = generador.generarDiagrama(estructuraEjemplo, 'Sistema de Pedidos - Vista Completa');
    // Generar diagrama simplificado
    const diagramaSimplificado = generador.generarDiagramaSimplificado(estructuraEjemplo, 'Sistema de Pedidos - Vista Simplificada');
    // Guardar archivos
    generador.guardarDiagrama(diagramaCompleto, 'diagrama-pedido-completo');
    generador.guardarDiagrama(diagramaSimplificado, 'diagrama-pedido-simple');
    // Generar archivos HTML
    generador.generarHTML(diagramaCompleto, 'pedido-completo', 'Pedido - Vista Completa');
    generador.generarHTML(diagramaSimplificado, 'pedido-simple', 'Pedido - Vista Simplificada');
    console.log('\n📁 Archivos generados:');
    console.log('   • diagrama-pedido-completo.mmd');
    console.log('   • diagrama-pedido-simple.mmd');
    console.log('   • pedido-completo.html');
    console.log('   • pedido-simple.html');
    console.log('\n🌐 Para ver los diagramas:');
    console.log('   1. Abrir los archivos .html en un navegador');
    console.log('   2. O usar los archivos .mmd en herramientas como:');
    console.log('      - Mermaid Live Editor (mermaid.live)');
    console.log('      - VS Code con extensión Mermaid Preview');
    console.log('      - GitHub (soporte nativo de Mermaid)');
}
/*
============================================================================
TIPOS DE DIAGRAMAS GENERADOS
============================================================================

1. DIAGRAMA COMPLETO:
   - Muestra nombres, precios y cantidad de elementos
   - Ideal para análisis detallado
   - Incluye toda la información del pedido

2. DIAGRAMA SIMPLIFICADO:
   - Solo muestra nombres de elementos
   - Ideal para visión general de la estructura
   - Más limpio y fácil de leer

3. FORMATO HTML:
   - Renderizado automático con Mermaid.js
   - Incluye leyenda y explicaciones
   - Listo para presentaciones

4. FORMATO .MMD:
   - Código fuente de Mermaid
   - Editable y personalizable
   - Compatible con herramientas estándar

============================================================================
*/ 
