// ========================================
// SISTEMA DE CARRITO DE COMPRAS CON MÓDULOS ES6
// ========================================

// PASO 1: IMPORTACIÓN DE MÓDULOS ES6
// Importamos la clase Producto desde su archivo módulo
// La sintaxis de destructuring { Producto } extrae solo esa clase del módulo
// NOTA: Esto funciona cuando se usa <script type="module"> en HTML
import { Producto } from './producto.js';

// PASO 2: DEFINICIÓN DE FUNCIÓN HELPER
// Función flecha que calcula el total de una lista de productos
// Utiliza el método reduce() para sumar todos los precios
const calcularTotalCompra = (productos) => {
    // reduce() recorre el array y acumula un valor
    // (acumulado, p) => acumulado + p.precio:
    //   - 'acumulado': valor que se va sumando (inicia en 0)
    //   - 'p': cada producto del array en la iteración actual
    //   - Retorna la suma del acumulado + precio del producto actual
    return productos.reduce((acumulado, p) => acumulado + p.precio, 0);
};

// PASO 3: CREACIÓN DE INSTANCIAS DE PRODUCTOS
// Creamos objetos Producto usando el constructor
// new Producto(id, nombre, precio, stock)
const laptop = new Producto(1, "Laptop Pro", 1200, 10);
const mouse = new Producto(2, "Mouse Ergonómico", 50, 50);

// PASO 4: SIMULACIÓN DEL CARRITO
// Creamos un array que simula un carrito de compras
// Contiene las instancias de productos que el usuario "agregó"
const miCarrito = [laptop, mouse];

// PASO 5: FUNCIÓN PARA MOSTRAR RESULTADOS EN HTML
// Esta función actualiza el contenido del HTML con los datos del carrito
function mostrarCarritoEnHTML() {
    // Obtenemos referencias a los elementos HTML donde mostraremos la información
    const carritoContainer = document.getElementById('carrito-container');
    const subtotalElement = document.getElementById('subtotal');
    const impuestoElement = document.getElementById('impuesto');
    
    // MOSTRAR PRODUCTOS EN EL CARRITO
    // Limpiamos el contenedor antes de agregar nuevos elementos
    carritoContainer.innerHTML = '<h3>Productos en el carrito:</h3>';
    
    // Recorremos cada producto del carrito y creamos elementos HTML
    miCarrito.forEach((producto, index) => {
        // Creamos un div para cada producto
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto-item';
        
        // Agregamos el contenido HTML del producto
        productoDiv.innerHTML = `
            <div class="producto-info">
                <h4>${producto.nombre}</h4>
                <p><strong>ID:</strong> ${producto.id}</p>
                <p><strong>Precio:</strong> $${producto.precio}</p>
                <p><strong>Stock disponible:</strong> ${producto.stock} unidades</p>
            </div>
        `;
        
        // Agregamos el producto al contenedor
        carritoContainer.appendChild(productoDiv);
    });
    
    // MOSTRAR CÁLCULOS FINANCIEROS
    // Calculamos y mostramos el subtotal
    const subtotal = calcularTotalCompra(miCarrito);
    subtotalElement.textContent = `$${subtotal}`;
    
    // Calculamos y mostramos el impuesto (solo de la laptop como ejemplo)
    const impuesto = laptop.calcularImpuesto(0.21);
    impuestoElement.textContent = `$${impuesto.toFixed(2)}`;
}

// PASO 6: FUNCIÓN PARA AGREGAR PRODUCTOS AL CARRITO
// Esta función permite agregar nuevos productos dinámicamente
function agregarProductoAlCarrito(id, nombre, precio, stock) {
    // Creamos una nueva instancia de Producto
    const nuevoProducto = new Producto(id, nombre, precio, stock);
    
    // Lo agregamos al array del carrito
    miCarrito.push(nuevoProducto);
    
    // Actualizamos la visualización en HTML
    mostrarCarritoEnHTML();
    
    console.log(`Producto "${nombre}" agregado al carrito`);
}

// PASO 7: INICIALIZACIÓN CUANDO SE CARGA LA PÁGINA
// Esta función se ejecuta cuando el DOM está completamente cargado
function inicializarCarrito() {
    console.log('Carrito inicializado');
    console.log(`El subtotal de la compra es: $${calcularTotalCompra(miCarrito)}`);
    console.log(`El impuesto (21%) de la laptop es: $${laptop.calcularImpuesto(0.21)}`);
    
    // Mostramos el carrito en el HTML
    mostrarCarritoEnHTML();
}

// PASO 8: EXPORTACIÓN PARA USO EN OTROS MÓDULOS
// Exponemos las variables y funciones principales para uso externo
// Esto permite que otros módulos accedan a la funcionalidad del carrito
if (typeof window !== 'undefined') {
    // Solo en el navegador, exponemos al objeto global window
    window.miCarrito = miCarrito;
    window.agregarProductoAlCarrito = agregarProductoAlCarrito;
    window.mostrarCarritoEnHTML = mostrarCarritoEnHTML;
    window.calcularTotalCompra = calcularTotalCompra;
    window.laptop = laptop;
    window.mouse = mouse;
}

// PASO 9: EVENT LISTENER PARA CUANDO SE CARGA EL DOM
// Esperamos a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', inicializarCarrito);