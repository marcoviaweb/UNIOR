/**
 * SISTEMA DE PEDIDOS CON GENERACIÓN DE DIAGRAMAS MERMAID
 * 
 * Esta versión integra el sistema de pedidos original con la capacidad
 * de generar diagramas Mermaid para visualizar la estructura del árbol.
 */

import * as fs from 'fs';

/**
 * Interfaz común para todos los elementos que pueden ser incluidos en un pedido.
 */
abstract class ElementoPedido {
    protected nombre: string;
    
    constructor(nombre: string) {
        this.nombre = nombre;
    }

    abstract calcularPrecio(): number;
    abstract obtenerDescripcion(nivel: number): string;

    protected generarIndentacion(nivel: number): string {
        return '  '.repeat(nivel);
    }

    public obtenerNombre(): string {
        return this.nombre;
    }

    /**
     * Nuevo método para generar diagramas Mermaid
     */
    abstract generarNodoMermaid(generador: GeneradorMermaid): string;
}

/**
 * LEAF: Representa un producto individual
 */
class Producto extends ElementoPedido {
    private precio: number;
    private categoria: string;

    constructor(nombre: string, precio: number, categoria: string = 'General') {
        super(nombre);
        this.precio = precio;
        this.categoria = categoria;
    }

    public calcularPrecio(): number {
        return this.precio;
    }

    public obtenerDescripcion(nivel: number = 0): string {
        const indentacion = this.generarIndentacion(nivel);
        return `${indentacion}📦 Producto: ${this.nombre} (${this.categoria}) - $${this.precio.toFixed(2)}`;
    }

    public obtenerCategoria(): string {
        return this.categoria;
    }

    public obtenerPrecioBase(): number {
        return this.precio;
    }

    /**
     * Genera el nodo Mermaid para este producto
     */
    public generarNodoMermaid(generador: GeneradorMermaid): string {
        const idNodo = generador.obtenerIdNodo(this);
        const precio = `$${this.precio.toFixed(2)}`;
        return `    ${idNodo}["📦 ${this.nombre}<br/>${precio}"]:::producto`;
    }
}

/**
 * COMPOSITE: Representa una caja que puede contener productos y otras cajas
 */
class Caja extends ElementoPedido {
    private contenido: ElementoPedido[] = [];
    private costoCaja: number;
    private tipoEmpaque: string;
    private capacidadMaxima: number;

    constructor(nombre: string, costoCaja: number, tipoEmpaque: string = 'Estándar', capacidadMaxima: number = 10) {
        super(nombre);
        this.costoCaja = costoCaja;
        this.tipoEmpaque = tipoEmpaque;
        this.capacidadMaxima = capacidadMaxima;
    }

    public agregar(elemento: ElementoPedido): void {
        if (this.contenido.length >= this.capacidadMaxima) {
            console.log(`⚠️  La caja '${this.nombre}' ha alcanzado su capacidad máxima (${this.capacidadMaxima} elementos)`);
            return;
        }

        this.contenido.push(elemento);
        console.log(`✅ Agregado '${elemento.obtenerNombre()}' a la caja '${this.nombre}'`);
    }

    public remover(elemento: ElementoPedido): void {
        const indice = this.contenido.indexOf(elemento);
        if (indice !== -1) {
            this.contenido.splice(indice, 1);
            console.log(`➖ Removido '${elemento.obtenerNombre()}' de la caja '${this.nombre}'`);
        }
    }

    public calcularPrecio(): number {
        let precioTotal = this.costoCaja;
        for (const elemento of this.contenido) {
            precioTotal += elemento.calcularPrecio();
        }
        return precioTotal;
    }

    public obtenerDescripcion(nivel: number = 0): string {
        const indentacion = this.generarIndentacion(nivel);
        let descripcion = `${indentacion}📦 Caja: ${this.nombre} (${this.tipoEmpaque}) - Costo base: $${this.costoCaja.toFixed(2)}`;
        
        if (this.contenido.length === 0) {
            descripcion += ` (vacía)`;
        } else {
            descripcion += ` (${this.contenido.length}/${this.capacidadMaxima} elementos):`;
            for (const elemento of this.contenido) {
                descripcion += '\n' + elemento.obtenerDescripcion(nivel + 1);
            }
        }

        return descripcion;
    }

    public obtenerCantidadElementos(): number {
        return this.contenido.length;
    }

    public obtenerContenido(): ElementoPedido[] {
        return [...this.contenido];
    }

    /**
     * Genera el nodo Mermaid para esta caja
     */
    public generarNodoMermaid(generador: GeneradorMermaid): string {
        const idNodo = generador.obtenerIdNodo(this);
        const precio = `$${this.calcularPrecio().toFixed(2)}`;
        const cantidad = this.contenido.length;
        return `    ${idNodo}("📁 ${this.nombre}<br/>${precio}<br/>(${cantidad} elementos)"):::caja`;
    }

    /**
     * Genera las conexiones Mermaid para esta caja y sus hijos
     */
    public generarConexionesMermaid(generador: GeneradorMermaid): string {
        const idNodoPadre = generador.obtenerIdNodo(this);
        let conexiones = '';

        for (const elemento of this.contenido) {
            const idNodoHijo = generador.obtenerIdNodo(elemento);
            conexiones += `    ${idNodoPadre} --> ${idNodoHijo}\n`;
            
            // Si el hijo es una caja, generar sus conexiones recursivamente
            if (elemento instanceof Caja) {
                conexiones += elemento.generarConexionesMermaid(generador);
            }
        }

        return conexiones;
    }
}

/**
 * Generador de diagramas Mermaid
 */
class GeneradorMermaid {
    private contadorNodos: number = 0;
    private mapaElementos: Map<ElementoPedido, string> = new Map();

    /**
     * Obtiene o crea un ID único para un elemento
     */
    public obtenerIdNodo(elemento: ElementoPedido): string {
        if (!this.mapaElementos.has(elemento)) {
            const id = `nodo${this.contadorNodos++}`;
            this.mapaElementos.set(elemento, id);
        }
        return this.mapaElementos.get(elemento)!;
    }

    /**
     * Genera un diagrama Mermaid completo para un elemento
     */
    public generarDiagrama(elemento: ElementoPedido, titulo: string = 'Estructura del Pedido'): string {
        this.contadorNodos = 0;
        this.mapaElementos.clear();

        // Registrar todos los elementos recursivamente
        this.registrarElementos(elemento);

        let mermaid = `graph TD\n`;
        mermaid += `    %% ${titulo}\n`;
        mermaid += `    %% Generado automáticamente - Patrón Composite\n\n`;

        // Generar definiciones de nodos
        mermaid += '    %% Definición de nodos\n';
        for (const [elem] of this.mapaElementos) {
            mermaid += elem.generarNodoMermaid(this) + '\n';
        }

        // Generar conexiones
        mermaid += '\n    %% Conexiones\n';
        mermaid += this.generarConexiones(elemento);

        // Agregar estilos
        mermaid += this.generarEstilos();

        return mermaid;
    }

    /**
     * Registra recursivamente todos los elementos para asignar IDs
     */
    private registrarElementos(elemento: ElementoPedido): void {
        this.obtenerIdNodo(elemento);
        
        if (elemento instanceof Caja) {
            for (const hijo of elemento.obtenerContenido()) {
                this.registrarElementos(hijo);
            }
        }
    }

    /**
     * Genera las conexiones del diagrama
     */
    private generarConexiones(elemento: ElementoPedido): string {
        if (elemento instanceof Caja) {
            return elemento.generarConexionesMermaid(this);
        }
        return '';
    }

    /**
     * Genera los estilos CSS para el diagrama
     */
    private generarEstilos(): string {
        return `
    %% Estilos CSS
    classDef producto fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000
    classDef caja fill:#f3e5f5,stroke:#4a148c,stroke-width:3px,color:#000
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:1px
`;
    }

    /**
     * Guarda el diagrama en un archivo .mmd
     */
    public guardarDiagrama(mermaid: string, nombreArchivo: string): void {
        try {
            fs.writeFileSync(`${nombreArchivo}.mmd`, mermaid, 'utf8');
            console.log(`📊 Diagrama Mermaid guardado: ${nombreArchivo}.mmd`);
        } catch (error) {
            console.error(`❌ Error al guardar diagrama: ${error}`);
        }
    }

    /**
     * Genera un archivo HTML con el diagrama renderizado
     */
    public generarHTML(mermaid: string, nombreArchivo: string, titulo: string = 'Diagrama del Pedido'): void {
        const html = this.generarPlantillaHTML(mermaid, titulo);
        
        try {
            fs.writeFileSync(`${nombreArchivo}.html`, html, 'utf8');
            console.log(`🌐 Archivo HTML generado: ${nombreArchivo}.html`);
        } catch (error) {
            console.error(`❌ Error al generar HTML: ${error}`);
        }
    }

    /**
     * Genera la plantilla HTML completa con descripción del problema
     */
    private generarPlantillaHTML(mermaid: string, titulo: string): string {
        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patrón Composite: Sistema de Pedidos - Visualización Interactiva</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .diagram-container {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .info {
            background: linear-gradient(135deg, #e3f2fd, #bbdefb);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 5px solid #2196f3;
        }
        .problem-section {
            background: linear-gradient(135deg, #fff3e0, #ffcc02);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 5px solid #f57c00;
        }
        .legend {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin: 30px 0;
            flex-wrap: wrap;
        }
        .legend-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .legend-producto {
            background: #e1f5fe;
            border: 3px solid #01579b;
            color: #01579b;
        }
        .legend-caja {
            background: #f3e5f5;
            border: 3px solid #4a148c;
            color: #4a148c;
        }
        .benefits {
            margin-top: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #f1f8e9, #c8e6c9);
            border-radius: 10px;
        }
        .benefits h3 {
            color: #2e7d32;
            margin-bottom: 15px;
        }
        .benefits ul {
            list-style: none;
            padding: 0;
        }
        .benefits li {
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
        }
        .benefits li:before {
            content: "✨";
            position: absolute;
            left: 0;
        }
        .calculation-demo {
            background: linear-gradient(135deg, #fce4ec, #f8bbd9);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 5px solid #e91e63;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Patrón Composite: Sistema de Pedidos</h1>
        
        <div class="info">
            <h3 style="margin-top: 0; color: #1976d2;">🧩 El Problema Resuelto</h3>
            <p><strong>Escenario:</strong> Imagina que tienes dos tipos de objetos: <strong>Productos</strong> y <strong>Cajas</strong>. 
            Una Caja puede contener varios Productos así como cierto número de Cajas más pequeñas. 
            Estas Cajas pequeñas también pueden contener algunos Productos o incluso Cajas más pequeñas, y así sucesivamente.</p>
            
            <p><strong>El Desafío:</strong> Crear un sistema de pedidos que utilice estas clases. Los pedidos pueden contener:</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>✅ Productos sencillos sin envolver</li>
                <li>✅ Cajas llenas de productos</li>
                <li>✅ Cajas que contienen otras cajas (anidamiento infinito)</li>
            </ul>
            
            <p><strong>🎯 La Pregunta Clave:</strong> <em>¿Cómo determinar el precio total de ese pedido?</em></p>
            
            <p><strong>💡 La Solución - Patrón Composite:</strong> Tratar productos individuales y cajas de manera uniforme, 
            permitiendo que el cálculo de precios fluya naturalmente por toda la estructura jerárquica.</p>
        </div>

        <div class="problem-section">
            <strong>📊 En el diagrama siguiente:</strong> Observa cómo cada elemento (producto o caja) contribuye al precio total 
            de manera recursiva, demostrando la elegancia del patrón Composite en acción.
        </div>

        <div class="legend">
            <div class="legend-item legend-producto">
                <span style="font-size: 1.2em;">📦</span>
                <span>Producto (Leaf)</span>
            </div>
            <div class="legend-item legend-caja">
                <span style="font-size: 1.2em;">📁</span>
                <span>Caja (Composite)</span>
            </div>
        </div>

        <div class="diagram-container">
            <div class="mermaid">
${mermaid}
            </div>
        </div>

        <div class="calculation-demo">
            <h3 style="margin-top: 0; color: #c2185b;">🧮 Cálculo Recursivo en Acción</h3>
            <p><strong>Fórmula del Patrón Composite:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px; font-family: monospace;">
                <li><strong>Producto:</strong> precio = valor_base</li>
                <li><strong>Caja:</strong> precio = costo_caja + suma(precios_contenido)</li>
            </ul>
            <p>Esta recursión permite calcular automáticamente el precio total sin importar la complejidad de la estructura.</p>
        </div>

        <div class="benefits">
            <h3>💡 Beneficios del Patrón Composite Visualizados:</h3>
            <ul>
                <li><strong>Uniformidad:</strong> Productos y cajas se representan con la misma interfaz</li>
                <li><strong>Recursión:</strong> El cálculo de precios fluye naturalmente por el árbol</li>
                <li><strong>Flexibilidad:</strong> Fácil agregar nuevos tipos sin romper la estructura</li>
                <li><strong>Transparencia:</strong> El cliente no distingue entre hojas y composites</li>
                <li><strong>Escalabilidad:</strong> Anidamiento ilimitado de cajas dentro de cajas</li>
            </ul>
        </div>

        <div class="info">
            <strong>🔍 Cómo interpretar el diagrama:</strong><br>
            • Las flechas indican relaciones "contiene"<br>
            • Los precios mostrados incluyen el cálculo recursivo completo<br>
            • La estructura del árbol refleja la jerarquía real del pedido<br>
            • Cada nodo puede expandirse o contraerse conceptualmente<br><br>
            
            <strong>🎓 Para estudiantes:</strong> Este es un ejemplo perfecto de cómo los patrones de diseño 
            resuelven problemas complejos de manera elegante y escalable.
        </div>
    </div>

    <script>
        mermaid.initialize({ 
            startOnLoad: true,
            theme: 'default',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
            }
        });
    </script>
</body>
</html>`;
    }
}

/**
 * Clase extendida del gestor de pedidos con capacidades de visualización
 */
class GestorPedidosConDiagramas {
    private elementos: ElementoPedido[] = [];
    private numeroPedido: string;
    private fechaPedido: Date;
    private generador: GeneradorMermaid;

    constructor(numeroPedido: string) {
        this.numeroPedido = numeroPedido;
        this.fechaPedido = new Date();
        this.generador = new GeneradorMermaid();
    }

    public agregarElemento(elemento: ElementoPedido): void {
        this.elementos.push(elemento);
        console.log(`🛒 Agregado al pedido: ${elemento.obtenerNombre()}`);
    }

    public calcularPrecioTotal(): number {
        let total = 0;
        for (const elemento of this.elementos) {
            total += elemento.calcularPrecio();
        }
        return total;
    }

    /**
     * Genera diagramas Mermaid para todos los elementos del pedido
     */
    public generarDiagramasPedido(): void {
        console.log('\n🎨 GENERANDO DIAGRAMAS MERMAID...\n');

        for (let i = 0; i < this.elementos.length; i++) {
            const elemento = this.elementos[i];
            const nombre = elemento.obtenerNombre().replace(/\s+/g, '-').toLowerCase();
            
            // Generar diagrama individual
            const diagrama = this.generador.generarDiagrama(
                elemento, 
                `Elemento ${i + 1}: ${elemento.obtenerNombre()}`
            );

            // Guardar archivos
            this.generador.guardarDiagrama(diagrama, `elemento-${i + 1}-${nombre}`);
            this.generador.generarHTML(
                diagrama, 
                `elemento-${i + 1}-${nombre}`, 
                `Elemento ${i + 1}: ${elemento.obtenerNombre()}`
            );
        }

        // Generar diagrama consolidado si hay múltiples elementos
        if (this.elementos.length > 1) {
            this.generarDiagramaConsolidado();
        }
    }

    /**
     * Genera un diagrama consolidado de todo el pedido
     */
    private generarDiagramaConsolidado(): void {
        // Crear una caja virtual que contenga todos los elementos
        const cajaConsolidada = new Caja(`Pedido ${this.numeroPedido}`, 0, 'Virtual', 20);
        
        for (const elemento of this.elementos) {
            cajaConsolidada.agregar(elemento);
        }

        const diagramaConsolidado = this.generador.generarDiagrama(
            cajaConsolidada,
            `Pedido Completo #${this.numeroPedido}`
        );

        this.generador.guardarDiagrama(diagramaConsolidado, `pedido-completo-${this.numeroPedido}`);
        this.generador.generarHTML(
            diagramaConsolidado,
            `pedido-completo-${this.numeroPedido}`,
            `Pedido Completo #${this.numeroPedido}`
        );
    }
}

// ============================================================================
// DEMOSTRACIÓN COMPLETA CON DIAGRAMAS
// ============================================================================

console.log('🎯 SISTEMA DE PEDIDOS CON VISUALIZACIÓN MERMAID');
console.log('📊 Generando representaciones gráficas del árbol de productos\n');

// Crear productos
const laptop = new Producto('Laptop Gaming', 1200.00, 'Electrónicos');
const mouse = new Producto('Mouse Inalámbrico', 25.99, 'Periféricos');
const teclado = new Producto('Teclado Mecánico', 89.99, 'Periféricos');
const monitor = new Producto('Monitor 24"', 299.99, 'Electrónicos');
const libro = new Producto('Libro TypeScript', 45.00, 'Libros');

// Crear estructura de cajas
const cajaPerifericos = new Caja('Caja Periféricos', 5.00, 'Acolchada');
cajaPerifericos.agregar(mouse);
cajaPerifericos.agregar(teclado);

const cajaElectronicos = new Caja('Caja Electrónicos', 15.00, 'Antiestática');
cajaElectronicos.agregar(laptop);
cajaElectronicos.agregar(monitor);

const cajaEnvioCompleto = new Caja('Envío Premium', 10.00, 'Reforzada');
cajaEnvioCompleto.agregar(cajaPerifericos);
cajaEnvioCompleto.agregar(cajaElectronicos);
cajaEnvioCompleto.agregar(libro);

// Crear pedido con capacidades de diagrama
const gestorConDiagramas = new GestorPedidosConDiagramas('2025-001');
gestorConDiagramas.agregarElemento(cajaEnvioCompleto);

console.log('\n📋 ESTRUCTURA DEL PEDIDO:');
console.log(cajaEnvioCompleto.obtenerDescripcion());

console.log(`\n💰 PRECIO TOTAL: $${gestorConDiagramas.calcularPrecioTotal().toFixed(2)}`);

// Generar todos los diagramas
gestorConDiagramas.generarDiagramasPedido();

console.log('\n✨ ARCHIVOS GENERADOS:');
console.log('📄 Archivos .mmd (código Mermaid):');
console.log('   • elemento-1-envio-premium.mmd');
console.log('   • pedido-completo-2025-001.mmd');
console.log('\n🌐 Archivos .html (visualización):');
console.log('   • elemento-1-envio-premium.html');
console.log('   • pedido-completo-2025-001.html');

console.log('\n🔍 FORMAS DE VER LOS DIAGRAMAS:');
console.log('1. 🌐 Abrir archivos .html en el navegador (recomendado)');
console.log('2. 📋 Copiar contenido .mmd a https://mermaid.live');
console.log('3. 🔧 VS Code con extensión "Mermaid Preview"');
console.log('4. 📝 GitHub (soporte nativo de Mermaid en README)');

console.log('\n' + '='.repeat(60));
console.log('🎉 ¡DIAGRAMAS GENERADOS EXITOSAMENTE!');
console.log('💡 Ahora puedes visualizar gráficamente el patrón Composite');
console.log('='.repeat(60));