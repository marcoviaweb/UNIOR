/*
=====================================
PRINCIPIO SOLID: I - Interface Segregation Principle (ISP)
=====================================

DEFINICIÓN: Los clientes no deberían ser forzados a depender de interfaces 
que no utilizan. Es mejor tener muchas interfaces específicas que una 
interfaz general.

En otras palabras: Divide las interfaces grandes en otras más pequeñas 
y específicas para que los clientes solo dependan de los métodos que realmente necesitan.

CONTEXTO: Sistema de E-commerce - Gestión de Usuarios y Roles
*/

console.log("=== PRINCIPIO SOLID: I - Interface Segregation Principle ===\n");

// EJEMPLO INCORRECTO - Violación del ISP
console.log("EJEMPLO INCORRECTO - Violación del ISP");
console.log("------------------------------------------------");

/**
 * INTERFAZ MONOLÍTICA - Viola ISP
 * Esta interfaz es demasiado grande y fuerza a todas las clases a implementar
 * métodos que no necesitan o no pueden usar
 */
class IUsuarioMonoliticoIncorrecto {
    // Métodos básicos de usuario
    login(email, password) { throw new Error("Debe implementar login"); }
    logout() { throw new Error("Debe implementar logout"); }
    actualizarPerfil(datos) { throw new Error("Debe implementar actualizarPerfil"); }
    
    // Métodos de compra - No todos los usuarios compran
    agregarAlCarrito(producto) { throw new Error("Debe implementar agregarAlCarrito"); }
    procesarPago(metodoPago) { throw new Error("Debe implementar procesarPago"); }
    verHistorialCompras() { throw new Error("Debe implementar verHistorialCompras"); }
    
    // Métodos de venta - Solo los vendedores venden
    publicarProducto(producto) { throw new Error("Debe implementar publicarProducto"); }
    gestionarInventario() { throw new Error("Debe implementar gestionarInventario"); }
    verVentas() { throw new Error("Debe implementar verVentas"); }
    
    // Métodos de administración - Solo los administradores administran
    gestionarUsuarios() { throw new Error("Debe implementar gestionarUsuarios"); }
    verReportes() { throw new Error("Debe implementar verReportes"); }
    configurarSistema() { throw new Error("Debe implementar configurarSistema"); }
    
    // Métodos de moderación - Solo los moderadores moderan
    moderarComentarios() { throw new Error("Debe implementar moderarComentarios"); }
    banearUsuario(usuario) { throw new Error("Debe implementar banearUsuario"); }
    
    // Métodos de soporte - Solo el personal de soporte usa estos
    crearTicket(problema) { throw new Error("Debe implementar crearTicket"); }
    resolverTicket(ticketId) { throw new Error("Debe implementar resolverTicket"); }
}

/**
 * CLIENTE REGULAR - Forzado a implementar métodos que no usa
 * Esta clase viola ISP porque debe implementar métodos de administración, venta, etc.
 */
class ClienteRegularIncorrecto extends IUsuarioMonoliticoIncorrecto {
    constructor(nombre, email) {
        super();
        this.nombre = nombre;
        this.email = email;
        this.carrito = [];
        this.historialCompras = [];
    }

    /**
     * Métodos que SÍ necesita implementar
     */
    login(email, password) {
        console.log(`Cliente ${this.nombre} logueado con email: ${email}`);
        return true;
    }

    logout() {
        console.log(`Cliente ${this.nombre} cerró sesión`);
        return true;
    }

    actualizarPerfil(datos) {
        console.log(`Perfil de ${this.nombre} actualizado`);
        return true;
    }

    agregarAlCarrito(producto) {
        this.carrito.push(producto);
        console.log(`${producto} agregado al carrito`);
        return true;
    }

    procesarPago(metodoPago) {
        console.log(`Procesando pago con ${metodoPago}`);
        this.historialCompras.push(...this.carrito);
        this.carrito = [];
        return true;
    }

    verHistorialCompras() {
        console.log(`Historial de compras: ${this.historialCompras.join(', ')}`);
        return this.historialCompras;
    }

    /**
     * VIOLACIÓN ISP: Forzado a implementar métodos que NO usa ni necesita
     */
    publicarProducto(producto) {
        throw new Error("Los clientes regulares no pueden publicar productos");
    }

    gestionarInventario() {
        throw new Error("Los clientes regulares no gestionan inventario");
    }

    verVentas() {
        throw new Error("Los clientes regulares no tienen ventas");
    }

    gestionarUsuarios() {
        throw new Error("Los clientes regulares no administran usuarios");
    }

    verReportes() {
        throw new Error("Los clientes regulares no ven reportes administrativos");
    }

    configurarSistema() {
        throw new Error("Los clientes regulares no configuran el sistema");
    }

    moderarComentarios() {
        throw new Error("Los clientes regulares no moderan contenido");
    }

    banearUsuario(usuario) {
        throw new Error("Los clientes regulares no pueden banear usuarios");
    }

    crearTicket(problema) {
        throw new Error("Los clientes regulares no crean tickets de soporte");
    }

    resolverTicket(ticketId) {
        throw new Error("Los clientes regulares no resuelven tickets");
    }
}

/**
 * VENDEDOR - También forzado a implementar métodos irrelevantes
 */
class VendedorIncorrecto extends IUsuarioMonoliticoIncorrecto {
    constructor(nombre, email, tienda) {
        super();
        this.nombre = nombre;
        this.email = email;
        this.tienda = tienda;
        this.productos = [];
        this.ventas = [];
    }

    // Métodos básicos que SÍ necesita
    login(email, password) {
        console.log(`Vendedor ${this.nombre} logueado`);
        return true;
    }

    logout() {
        console.log(`Vendedor ${this.nombre} cerró sesión`);
        return true;
    }

    actualizarPerfil(datos) {
        console.log(`Perfil de vendedor ${this.nombre} actualizado`);
        return true;
    }

    // Métodos de venta que SÍ necesita
    publicarProducto(producto) {
        this.productos.push(producto);
        console.log(`Producto ${producto} publicado en tienda ${this.tienda}`);
        return true;
    }

    gestionarInventario() {
        console.log(`Gestionando inventario de ${this.productos.length} productos`);
        return this.productos;
    }

    verVentas() {
        console.log(`Ventas totales: ${this.ventas.length}`);
        return this.ventas;
    }

    /**
     * VIOLACIÓN ISP: Métodos de compra que un vendedor típicamente no usa
     */
    agregarAlCarrito(producto) {
        throw new Error("Los vendedores no usan carrito de compras");
    }

    procesarPago(metodoPago) {
        throw new Error("Los vendedores no procesan sus propios pagos");
    }

    verHistorialCompras() {
        throw new Error("Los vendedores no tienen historial de compras típicamente");
    }

    /**
     * VIOLACIÓN ISP: Métodos administrativos que no debería tener acceso
     */
    gestionarUsuarios() {
        throw new Error("Los vendedores no administran usuarios del sistema");
    }

    verReportes() {
        throw new Error("Los vendedores no ven reportes globales del sistema");
    }

    configurarSistema() {
        throw new Error("Los vendedores no configuran el sistema");
    }

    moderarComentarios() {
        throw new Error("Los vendedores no moderan comentarios globalmente");
    }

    banearUsuario(usuario) {
        throw new Error("Los vendedores no pueden banear usuarios");
    }

    crearTicket(problema) {
        throw new Error("Los vendedores no crean tickets internos");
    }

    resolverTicket(ticketId) {
        throw new Error("Los vendedores no resuelven tickets de soporte");
    }
}

// Demostración del problema con ISP violado
console.log("Demostrando violaciones del ISP:");

try {
    const cliente = new ClienteRegularIncorrecto("Juan Pérez", "juan@email.com");
    
    // Operaciones que SÍ debería poder hacer
    cliente.login("juan@email.com", "123456");
    cliente.agregarAlCarrito("Laptop Gaming");
    cliente.procesarPago("Tarjeta de Crédito");
    
    console.log("\nIntentando operaciones que NO debería poder hacer:");
    
    // Estas operaciones fallan porque el cliente está forzado a implementarlas
    cliente.gestionarUsuarios();
    
} catch (error) {
    console.log(`Error esperado: ${error.message}`);
}

try {
    const vendedor = new VendedorIncorrecto("María López", "maria@tienda.com", "TechStore");
    
    // Operaciones que SÍ debería poder hacer
    vendedor.login("maria@tienda.com", "password");
    vendedor.publicarProducto("Monitor 4K");
    
    console.log("\nIntentando operaciones de compra que NO debería usar:");
    
    // Vendedor forzado a implementar métodos de compra que no usa
    vendedor.agregarAlCarrito("Producto");
    
} catch (error) {
    console.log(`Error esperado: ${error.message}`);
}

console.log("\n" + "=".repeat(80) + "\n");

// EJEMPLO CORRECTO - Cumpliendo con ISP
console.log("EJEMPLO CORRECTO - Cumpliendo con ISP");
console.log("------------------------------------------------");

/**
 * INTERFACES SEGREGADAS - Cada una con responsabilidad específica
 */

// Interfaz básica que todos los usuarios necesitan
class IAutenticacion {
    /**
     * Inicia sesión del usuario
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña
     * @returns {boolean} true si el login fue exitoso
     */
    login(email, password) {
        throw new Error("Debe implementar login");
    }

    /**
     * Cierra la sesión del usuario
     * @returns {boolean} true si el logout fue exitoso
     */
    logout() {
        throw new Error("Debe implementar logout");
    }

    /**
     * Actualiza el perfil del usuario
     * @param {object} datos - Nuevos datos del perfil
     * @returns {boolean} true si la actualización fue exitosa
     */
    actualizarPerfil(datos) {
        throw new Error("Debe implementar actualizarPerfil");
    }
}

// Interfaz específica para funcionalidades de compra
class IComprador {
    /**
     * Agrega un producto al carrito de compras
     * @param {string} producto - Producto a agregar
     * @returns {boolean} true si se agregó exitosamente
     */
    agregarAlCarrito(producto) {
        throw new Error("Debe implementar agregarAlCarrito");
    }

    /**
     * Procesa el pago de los productos en el carrito
     * @param {string} metodoPago - Método de pago a utilizar
     * @returns {boolean} true si el pago fue exitoso
     */
    procesarPago(metodoPago) {
        throw new Error("Debe implementar procesarPago");
    }

    /**
     * Muestra el historial de compras del usuario
     * @returns {array} Lista de compras realizadas
     */
    verHistorialCompras() {
        throw new Error("Debe implementar verHistorialCompras");
    }
}

// Interfaz específica para funcionalidades de venta
class IVendedor {
    /**
     * Publica un producto en la tienda
     * @param {string} producto - Producto a publicar
     * @returns {boolean} true si se publicó exitosamente
     */
    publicarProducto(producto) {
        throw new Error("Debe implementar publicarProducto");
    }

    /**
     * Gestiona el inventario de productos
     * @returns {array} Lista de productos en inventario
     */
    gestionarInventario() {
        throw new Error("Debe implementar gestionarInventario");
    }

    /**
     * Muestra las ventas realizadas
     * @returns {array} Lista de ventas
     */
    verVentas() {
        throw new Error("Debe implementar verVentas");
    }
}

// Interfaz específica para administración del sistema
class IAdministrador {
    /**
     * Gestiona los usuarios del sistema
     * @returns {boolean} true si la gestión fue exitosa
     */
    gestionarUsuarios() {
        throw new Error("Debe implementar gestionarUsuarios");
    }

    /**
     * Visualiza reportes del sistema
     * @returns {object} Reportes del sistema
     */
    verReportes() {
        throw new Error("Debe implementar verReportes");
    }

    /**
     * Configura parámetros del sistema
     * @param {object} configuracion - Nueva configuración
     * @returns {boolean} true si la configuración fue exitosa
     */
    configurarSistema(configuracion) {
        throw new Error("Debe implementar configurarSistema");
    }
}

// Interfaz específica para moderación de contenido
class IModerador {
    /**
     * Modera comentarios y contenido
     * @returns {boolean} true si la moderación fue exitosa
     */
    moderarComentarios() {
        throw new Error("Debe implementar moderarComentarios");
    }

    /**
     * Banea a un usuario del sistema
     * @param {string} usuario - Usuario a banear
     * @returns {boolean} true si el baneo fue exitoso
     */
    banearUsuario(usuario) {
        throw new Error("Debe implementar banearUsuario");
    }
}

// Interfaz específica para soporte técnico
class ISoporte {
    /**
     * Crea un ticket de soporte
     * @param {string} problema - Descripción del problema
     * @returns {string} ID del ticket creado
     */
    crearTicket(problema) {
        throw new Error("Debe implementar crearTicket");
    }

    /**
     * Resuelve un ticket de soporte
     * @param {string} ticketId - ID del ticket a resolver
     * @returns {boolean} true si el ticket fue resuelto
     */
    resolverTicket(ticketId) {
        throw new Error("Debe implementar resolverTicket");
    }
}

/**
 * CLIENTE REGULAR - Solo implementa las interfaces que necesita
 * Cumple con ISP: Solo depende de IAutenticacion e IComprador
 */
class ClienteRegular extends IAutenticacion {
    /**
     * Constructor del cliente regular
     * @param {string} nombre - Nombre del cliente
     * @param {string} email - Email del cliente
     */
    constructor(nombre, email) {
        super();
        this.nombre = nombre;
        this.email = email;
        this.carrito = [];
        this.historialCompras = [];
        
        // Composición: El cliente TIENE funcionalidad de compra
        this.funcionesCompra = new FuncionesCompra(this);
    }

    /**
     * Implementa solo métodos de autenticación que necesita
     */
    login(email, password) {
        console.log(`Cliente ${this.nombre} logueado con email: ${email}`);
        return true;
    }

    logout() {
        console.log(`Cliente ${this.nombre} cerró sesión`);
        return true;
    }

    actualizarPerfil(datos) {
        console.log(`Perfil de ${this.nombre} actualizado con: ${JSON.stringify(datos)}`);
        return true;
    }

    /**
     * Delega funciones de compra a la clase especializada
     */
    agregarAlCarrito(producto) {
        return this.funcionesCompra.agregarAlCarrito(producto);
    }

    procesarPago(metodoPago) {
        return this.funcionesCompra.procesarPago(metodoPago);
    }

    verHistorialCompras() {
        return this.funcionesCompra.verHistorialCompras();
    }
}

/**
 * CLASE ESPECIALIZADA para funciones de compra
 * Implementa solo IComprador
 */
class FuncionesCompra extends IComprador {
    /**
     * Constructor de las funciones de compra
     * @param {object} usuario - Usuario propietario del carrito
     */
    constructor(usuario) {
        super();
        this.usuario = usuario;
    }

    agregarAlCarrito(producto) {
        this.usuario.carrito.push(producto);
        console.log(`${producto} agregado al carrito de ${this.usuario.nombre}`);
        return true;
    }

    procesarPago(metodoPago) {
        console.log(`${this.usuario.nombre} procesando pago con ${metodoPago}`);
        this.usuario.historialCompras.push(...this.usuario.carrito);
        this.usuario.carrito = [];
        return true;
    }

    verHistorialCompras() {
        console.log(`Historial de ${this.usuario.nombre}: ${this.usuario.historialCompras.join(', ')}`);
        return this.usuario.historialCompras;
    }
}

/**
 * VENDEDOR - Solo implementa las interfaces que necesita
 * Cumple con ISP: Solo depende de IAutenticacion e IVendedor
 */
class Vendedor extends IAutenticacion {
    /**
     * Constructor del vendedor
     * @param {string} nombre - Nombre del vendedor
     * @param {string} email - Email del vendedor
     * @param {string} tienda - Nombre de la tienda
     */
    constructor(nombre, email, tienda) {
        super();
        this.nombre = nombre;
        this.email = email;
        this.tienda = tienda;
        
        // Composición: El vendedor TIENE funcionalidad de venta
        this.funcionesVenta = new FuncionesVenta(this);
    }

    /**
     * Implementa solo métodos de autenticación
     */
    login(email, password) {
        console.log(`Vendedor ${this.nombre} de ${this.tienda} logueado`);
        return true;
    }

    logout() {
        console.log(`Vendedor ${this.nombre} cerró sesión`);
        return true;
    }

    actualizarPerfil(datos) {
        console.log(`Perfil de vendedor ${this.nombre} actualizado`);
        return true;
    }

    /**
     * Delega funciones de venta a la clase especializada
     */
    publicarProducto(producto) {
        return this.funcionesVenta.publicarProducto(producto);
    }

    gestionarInventario() {
        return this.funcionesVenta.gestionarInventario();
    }

    verVentas() {
        return this.funcionesVenta.verVentas();
    }
}

/**
 * CLASE ESPECIALIZADA para funciones de venta
 * Implementa solo IVendedor
 */
class FuncionesVenta extends IVendedor {
    /**
     * Constructor de las funciones de venta
     * @param {object} vendedor - Vendedor propietario
     */
    constructor(vendedor) {
        super();
        this.vendedor = vendedor;
        this.productos = [];
        this.ventas = [];
    }

    publicarProducto(producto) {
        this.productos.push(producto);
        console.log(`${producto} publicado en ${this.vendedor.tienda} por ${this.vendedor.nombre}`);
        return true;
    }

    gestionarInventario() {
        console.log(`${this.vendedor.nombre} gestionando ${this.productos.length} productos`);
        return this.productos;
    }

    verVentas() {
        console.log(`${this.vendedor.nombre} - Ventas totales: ${this.ventas.length}`);
        return this.ventas;
    }
}

/**
 * ADMINISTRADOR - Implementa múltiples interfaces según necesidad
 * Cumple con ISP: Solo las interfaces que realmente necesita
 */
class Administrador extends IAutenticacion {
    /**
     * Constructor del administrador
     * @param {string} nombre - Nombre del administrador
     * @param {string} email - Email del administrador
     */
    constructor(nombre, email) {
        super();
        this.nombre = nombre;
        this.email = email;
        
        // Composición: El administrador TIENE funcionalidades administrativas
        this.funcionesAdmin = new FuncionesAdministrativas(this);
        this.funcionesMod = new FuncionesModerador(this);
    }

    /**
     * Implementa autenticación
     */
    login(email, password) {
        console.log(`Administrador ${this.nombre} logueado con privilegios elevados`);
        return true;
    }

    logout() {
        console.log(`Administrador ${this.nombre} cerró sesión`);
        return true;
    }

    actualizarPerfil(datos) {
        console.log(`Perfil de administrador ${this.nombre} actualizado`);
        return true;
    }

    /**
     * Delega funciones administrativas
     */
    gestionarUsuarios() {
        return this.funcionesAdmin.gestionarUsuarios();
    }

    verReportes() {
        return this.funcionesAdmin.verReportes();
    }

    configurarSistema(configuracion) {
        return this.funcionesAdmin.configurarSistema(configuracion);
    }

    /**
     * Delega funciones de moderación
     */
    moderarComentarios() {
        return this.funcionesMod.moderarComentarios();
    }

    banearUsuario(usuario) {
        return this.funcionesMod.banearUsuario(usuario);
    }
}

/**
 * CLASE ESPECIALIZADA para funciones administrativas
 */
class FuncionesAdministrativas extends IAdministrador {
    constructor(administrador) {
        super();
        this.administrador = administrador;
    }

    gestionarUsuarios() {
        console.log(`${this.administrador.nombre} gestionando usuarios del sistema`);
        return true;
    }

    verReportes() {
        console.log(`${this.administrador.nombre} visualizando reportes del sistema`);
        return { ventas: 1000, usuarios: 500, productos: 200 };
    }

    configurarSistema(configuracion) {
        console.log(`${this.administrador.nombre} configurando: ${JSON.stringify(configuracion)}`);
        return true;
    }
}

/**
 * CLASE ESPECIALIZADA para funciones de moderación
 */
class FuncionesModerador extends IModerador {
    constructor(moderador) {
        super();
        this.moderador = moderador;
    }

    moderarComentarios() {
        console.log(`${this.moderador.nombre} moderando comentarios`);
        return true;
    }

    banearUsuario(usuario) {
        console.log(`${this.moderador.nombre} baneando al usuario: ${usuario}`);
        return true;
    }
}

/**
 * ESPECIALISTA EN SOPORTE - Solo implementa lo que necesita
 */
class EspecialistaSoporte extends IAutenticacion {
    constructor(nombre, email, equipo) {
        super();
        this.nombre = nombre;
        this.email = email;
        this.equipo = equipo;
        
        // Composición: Tiene funcionalidades de soporte
        this.funcionesSoporte = new FuncionesSoporte(this);
    }

    login(email, password) {
        console.log(`Especialista ${this.nombre} del equipo ${this.equipo} logueado`);
        return true;
    }

    logout() {
        console.log(`Especialista ${this.nombre} cerró sesión`);
        return true;
    }

    actualizarPerfil(datos) {
        console.log(`Perfil de especialista ${this.nombre} actualizado`);
        return true;
    }

    crearTicket(problema) {
        return this.funcionesSoporte.crearTicket(problema);
    }

    resolverTicket(ticketId) {
        return this.funcionesSoporte.resolverTicket(ticketId);
    }
}

/**
 * CLASE ESPECIALIZADA para funciones de soporte
 */
class FuncionesSoporte extends ISoporte {
    constructor(especialista) {
        super();
        this.especialista = especialista;
        this.tickets = [];
    }

    crearTicket(problema) {
        const ticketId = `TICKET-${Date.now()}`;
        this.tickets.push({ id: ticketId, problema, estado: 'abierto' });
        console.log(`${this.especialista.nombre} creó ticket ${ticketId}: ${problema}`);
        return ticketId;
    }

    resolverTicket(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (ticket) {
            ticket.estado = 'resuelto';
            console.log(`${this.especialista.nombre} resolvió ticket ${ticketId}`);
            return true;
        }
        return false;
    }
}

// Demostración del diseño correcto que respeta ISP
console.log("Demostrando ISP correctamente implementado:");

console.log("\nCLIENTE REGULAR:");
const cliente = new ClienteRegular("Ana García", "ana@email.com");
cliente.login("ana@email.com", "123456");
cliente.actualizarPerfil({ telefono: "555-0123" });
cliente.agregarAlCarrito("Smartphone");
cliente.agregarAlCarrito("Auriculares");
cliente.procesarPago("PayPal");
cliente.verHistorialCompras();
cliente.logout();

console.log("\nVENDEDOR:");
const vendedor = new Vendedor("Carlos Ruiz", "carlos@tech.com", "TechWorld");
vendedor.login("carlos@tech.com", "password");
vendedor.publicarProducto("Laptop Ultra");
vendedor.publicarProducto("Mouse Gamer");
vendedor.gestionarInventario();
vendedor.verVentas();
vendedor.logout();

console.log("\nADMINISTRADOR:");
const admin = new Administrador("María Admin", "admin@sistema.com");
admin.login("admin@sistema.com", "adminpass");
admin.gestionarUsuarios();
admin.verReportes();
admin.configurarSistema({ mantenimiento: false, nuevasRegistros: true });
admin.moderarComentarios();
admin.banearUsuario("usuario_spam");
admin.logout();

console.log("\nESPECIALISTA EN SOPORTE:");
const soporte = new EspecialistaSoporte("Luis Soporte", "luis@soporte.com", "Nivel 2");
soporte.login("luis@soporte.com", "supportpass");
const ticketId = soporte.crearTicket("Usuario no puede acceder a su cuenta");
soporte.resolverTicket(ticketId);
soporte.logout();

console.log("\n" + "=".repeat(80));
console.log("VENTAJAS DEL INTERFACE SEGREGATION PRINCIPLE:");
console.log("• Cada clase implementa solo los métodos que realmente necesita");
console.log("• Interfaces pequeñas y específicas en lugar de monolíticas");
console.log("• Mayor flexibilidad para agregar nuevos tipos de usuarios");
console.log("• Reduce el acoplamiento entre diferentes funcionalidades");
console.log("• Facilita el testing al poder mockear interfaces específicas");
console.log("• Código más limpio y fácil de mantener");
console.log("• Principio de responsabilidad única aplicado a interfaces");
console.log("=".repeat(80));