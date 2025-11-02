# Principios SOLID en JavaScript - Ejemplos de E-commerce

## ¿Qué es SOLID?

SOLID es un acrónimo que representa cinco principios fundamentales de diseño de software orientado a objetos, creados por Robert C. Martin (Uncle Bob). Estos principios buscan hacer que el código sea más **mantenible**, **flexible**, **escalable** y **testeable**.

Los cinco principios son:

- **S** - Single Responsibility Principle (SRP)
- **O** - Open/Closed Principle (OCP)
- **L** - Liskov Substitution Principle (LSP)
- **I** - Interface Segregation Principle (ISP)
- **D** - Dependency Inversion Principle (DIP)

## ¿Por qué son importantes?

Los principios SOLID ayudan a:

✅ **Reducir el acoplamiento** entre componentes  
✅ **Aumentar la cohesión** dentro de cada módulo  
✅ **Facilitar el mantenimiento** y la extensión del código  
✅ **Mejorar la testabilidad** del software  
✅ **Prevenir el código espagueti** y la deuda técnica  
✅ **Hacer el código más legible** y comprensible  

---

## S - Single Responsibility Principle (SRP)

**Archivo:** `01-S.js`

### Definición
Una clase debe tener una sola razón para cambiar. Cada clase debe tener una única responsabilidad y esa responsabilidad debe estar completamente encapsulada por la clase.

### Ejemplo del Contexto: Sistema de E-commerce

#### ❌ Ejemplo Incorrecto
```javascript
class ProductoIncorrecto {
    // 1. Gestión de datos del producto
    actualizarPrecio(nuevoPrecio) { ... }
    
    // 2. Cálculo de descuentos (lógica de negocio)
    calcularDescuento() { ... }
    
    // 3. Validación de datos
    validarDatos() { ... }
    
    // 4. Envío de emails (comunicación)
    enviarNotificacionCambio() { ... }
    
    // 5. Generación de reportes
    generarReporte() { ... }
}
```

**Problemas:**
- Una clase con 5 responsabilidades diferentes
- Difícil de mantener y modificar
- Cambios en una funcionalidad pueden afectar otras
- Viola el principio de cohesión

#### ✅ Ejemplo Correcto
```javascript
// Cada clase tiene una única responsabilidad
class Producto { /* Solo gestiona datos del producto */ }
class CalculadorDescuentos { /* Solo calcula descuentos */ }
class ValidadorProducto { /* Solo valida datos */ }
class NotificadorEmail { /* Solo envía notificaciones */ }
class GeneradorReportes { /* Solo genera reportes */ }
```

**Ventajas:**
- Fácil mantenimiento y modificación
- Código más legible y organizado
- Facilita las pruebas unitarias
- Permite reutilización de código

---

## O - Open/Closed Principle (OCP)

**Archivo:** `02-O.js`

### Definición
Las clases deben estar abiertas para extensión, pero cerradas para modificación. Deberías poder extender el comportamiento de una clase sin modificar su código existente.

### Ejemplo del Contexto: Métodos de Pago

#### ❌ Ejemplo Incorrecto
```javascript
class ProcesadorPagosIncorrecto {
    procesarPago(tipoPago, monto, datos) {
        switch (tipoPago) {
            case 'tarjeta_credito':
                return this.procesarTarjetaCredito(monto, datos);
            case 'paypal':
                return this.procesarPayPal(monto, datos);
            // ❌ Cada nuevo método requiere modificar esta clase
            case 'bitcoin':
                return this.procesarBitcoin(monto, datos);
        }
    }
}
```

**Problemas:**
- Cada nuevo método de pago requiere modificar la clase existente
- Riesgo de introducir bugs en funcionalidad existente
- Dificulta el trabajo en paralelo

#### ✅ Ejemplo Correcto
```javascript
// Clase base abstracta
class MetodoPago {
    procesar(monto, datos) { /* Método abstracto */ }
    calcularComision(monto) { /* Método abstracto */ }
}

// Implementaciones específicas
class TarjetaCredito extends MetodoPago { /* ... */ }
class PayPal extends MetodoPago { /* ... */ }
class Bitcoin extends MetodoPago { /* ... */ }

// Procesador que nunca necesita modificarse
class ProcesadorPagos {
    registrarMetodoPago(nombre, metodoPago) { /* ... */ }
    procesarPago(nombreMetodo, monto, datos) { /* ... */ }
}
```

**Ventajas:**
- Agregar nuevos métodos sin modificar código existente
- Reduce riesgo de bugs
- Permite desarrollo paralelo
- Código más robusto y estable

---

## L - Liskov Substitution Principle (LSP)

**Archivo:** `03-L.js`

### Definición
Los objetos de una clase derivada deben poder reemplazar a los objetos de la clase base sin alterar el funcionamiento correcto del programa.

### Ejemplo del Contexto: Tipos de Productos

#### ❌ Ejemplo Incorrecto
```javascript
class ProductoIncorrecto {
    calcularPrecioConDescuento(porcentajeDescuento) { /* 0-100% */ }
}

class ProductoDigitalIncorrecto extends ProductoIncorrecto {
    calcularPrecioConDescuento(porcentajeDescuento) {
        // ❌ Cambia el comportamiento: máximo 90%
        if (porcentajeDescuento > 90) {
            throw new Error("Máximo 90% para productos digitales");
        }
    }
}

class ProductoPersonalizadoIncorrecto extends ProductoIncorrecto {
    calcularPrecioConDescuento(porcentajeDescuento) {
        // ❌ Rompe completamente el contrato
        throw new Error("No admiten descuentos");
    }
}
```

**Problemas:**
- Las subclases no pueden sustituir a la clase base
- Comportamientos inesperados
- El código cliente falla con ciertas subclases

#### ✅ Ejemplo Correcto
```javascript
class Producto {
    calcularPrecioConDescuento(porcentajeDescuento) {
        const descuentoMaximo = this.obtenerDescuentoMaximo();
        const descuentoAplicable = Math.min(porcentajeDescuento, descuentoMaximo);
        // ✅ Comportamiento consistente y predecible
    }
    
    obtenerDescuentoMaximo() { return 100; } // Método que pueden sobrescribir
}

class ProductoFisico extends Producto { /* Respeta el contrato */ }
class ProductoDigital extends Producto { 
    obtenerDescuentoMaximo() { return 90; } // ✅ Restricción sin romper contrato
}
class ProductoPersonalizado extends Producto {
    obtenerDescuentoMaximo() { return 20; } // ✅ Restricción sin romper contrato
}
```

**Ventajas:**
- Sustituibilidad completa y segura
- Comportamiento consistente
- Polimorfismo confiable
- Facilita testing y mantenimiento

---

## I - Interface Segregation Principle (ISP)

**Archivo:** `04-I.js`

### Definición
Los clientes no deberían ser forzados a depender de interfaces que no utilizan. Es mejor tener muchas interfaces específicas que una interfaz general.

### Ejemplo del Contexto: Gestión de Usuarios y Roles

#### ❌ Ejemplo Incorrecto
```javascript
class IUsuarioMonoliticoIncorrecto {
    // Métodos básicos
    login() { }
    logout() { }
    
    // Métodos de compra - ❌ No todos los usuarios compran
    agregarAlCarrito() { }
    procesarPago() { }
    
    // Métodos de venta - ❌ Solo vendedores
    publicarProducto() { }
    gestionarInventario() { }
    
    // Métodos de administración - ❌ Solo administradores
    gestionarUsuarios() { }
    verReportes() { }
}

class ClienteRegularIncorrecto extends IUsuarioMonoliticoIncorrecto {
    // ❌ Forzado a implementar métodos que no usa
    publicarProducto() { throw new Error("No puede publicar"); }
    gestionarUsuarios() { throw new Error("No puede administrar"); }
}
```

**Problemas:**
- Clases forzadas a implementar métodos irrelevantes
- Interfaces demasiado grandes
- Viola el principio de responsabilidad única

#### ✅ Ejemplo Correcto
```javascript
// Interfaces segregadas y específicas
class IAutenticacion {
    login() { }
    logout() { }
    actualizarPerfil() { }
}

class IComprador {
    agregarAlCarrito() { }
    procesarPago() { }
    verHistorialCompras() { }
}

class IVendedor {
    publicarProducto() { }
    gestionarInventario() { }
    verVentas() { }
}

// Cada clase implementa solo lo que necesita
class ClienteRegular extends IAutenticacion {
    constructor() {
        this.funcionesCompra = new FuncionesCompra(this); // Composición
    }
}

class Vendedor extends IAutenticacion {
    constructor() {
        this.funcionesVenta = new FuncionesVenta(this); // Composición
    }
}
```

**Ventajas:**
- Interfaces pequeñas y específicas
- Clases implementan solo lo necesario
- Facilita testing con mocks específicos
- Mayor flexibilidad y mantenibilidad

---

## D - Dependency Inversion Principle (DIP)

**Archivo:** `05-D.js`

### Definición
Los módulos de alto nivel no deberían depender de módulos de bajo nivel. Ambos deberían depender de abstracciones. Las abstracciones no deberían depender de detalles; los detalles deberían depender de abstracciones.

### Ejemplo del Contexto: Gestión de Pagos, Notificaciones y Persistencia

#### ❌ Ejemplo Incorrecto
```javascript
class ServicioPedidosIncorrecto {
    constructor() {
        // ❌ Dependencias directas de implementaciones concretas
        this.baseDatos = new MySQLDatabase();           // Acoplado a MySQL
        this.emailService = new SMTPEmailService();     // Acoplado a SMTP
        this.procesadorPago = new PayPalProcessor();    // Acoplado a PayPal
    }
    
    procesarPedido(pedido) {
        // ❌ Código de alto nivel depende de detalles específicos
        this.baseDatos.guardar('pedidos', pedido);      // SQL específico
        this.procesadorPago.procesarPago(monto, datos); // PayPal específico
        this.emailService.enviarEmail(email, mensaje);  // SMTP específico
    }
}
```

**Problemas:**
- Alto acoplamiento con implementaciones específicas
- Imposible cambiar proveedores sin modificar código
- Testing difícil (dependencias reales hardcodeadas)
- Viola principio Open/Closed

#### ✅ Ejemplo Correcto
```javascript
// Abstracciones (Interfaces)
class IRepositorio {
    async conectar() { }
    async guardar(entidad, datos) { }
    async buscarPorId(entidad, id) { }
}

class IServicioNotificacion {
    async enviarNotificacion(destinatario, asunto, mensaje) { }
}

class IProcesadorPago {
    async procesarPago(monto, moneda, datos) { }
}

// Múltiples implementaciones concretas
class RepositorioMySQL extends IRepositorio { /* ... */ }
class RepositorioPostgreSQL extends IRepositorio { /* ... */ }
class RepositorioMongoDB extends IRepositorio { /* ... */ }

class ServicioEmailSMTP extends IServicioNotificacion { /* ... */ }
class ServicioEmailSendGrid extends IServicioNotificacion { /* ... */ }
class ServicioSMS extends IServicioNotificacion { /* ... */ }

class ProcesadorPayPal extends IProcesadorPago { /* ... */ }
class ProcesadorStripe extends IProcesadorPago { /* ... */ }

// Módulo de alto nivel que depende de abstracciones
class ServicioPedidos {
    constructor(repositorio, servicioNotificacion, procesadorPago) {
        // ✅ Inyección de dependencias - recibe abstracciones
        this.repositorio = repositorio;
        this.servicioNotificacion = servicioNotificacion;
        this.procesadorPago = procesadorPago;
    }
    
    async procesarPedido(pedido) {
        // ✅ Usa abstracciones - funciona con cualquier implementación
        await this.repositorio.guardar('pedidos', pedido);
        await this.procesadorPago.procesarPago(pedido.total, 'USD');
        await this.servicioNotificacion.enviarNotificacion(email, asunto, mensaje);
    }
}

// Factory para diferentes configuraciones
const servicio1 = new ServicioPedidos(
    new RepositorioMySQL(),
    new ServicioEmailSMTP(), 
    new ProcesadorPayPal()
);

const servicio2 = new ServicioPedidos(
    new RepositorioPostgreSQL(),
    new ServicioEmailSendGrid(),
    new ProcesadorStripe()
);
```

**Ventajas:**
- Módulos de alto nivel independientes de implementaciones
- Fácil intercambio de proveedores sin modificar código
- Testing simplificado con mocks e inyección
- Configuración flexible para diferentes ambientes
- Mayor mantenibilidad y escalabilidad

---

## Cómo Ejecutar los Ejemplos

### Prerrequisitos
- Node.js instalado en tu sistema
- Acceso a terminal/línea de comandos

### Ejecutar cada ejemplo

```bash
# Principio S - Single Responsibility
node 01-S.js

# Principio O - Open/Closed
node 02-O.js

# Principio L - Liskov Substitution
node 03-L.js

# Principio I - Interface Segregation
node 04-I.js

# Principio D - Dependency Inversion
node 05-D.js
```

### Estructura de cada archivo

Cada archivo contiene:

1. **Explicación del principio** con definición clara
2. **Ejemplo incorrecto** que viola el principio con problemas explicados
3. **Ejemplo correcto** que cumple el principio con ventajas demostradas
4. **Demostraciones prácticas** con código ejecutable
5. **Comentarios educativos** detallados en cada método

---

## Conclusiones

Los principios SOLID son fundamentales para escribir código de calidad. Cada principio aborda un aspecto específico del diseño de software:

- **SRP**: Una responsabilidad por clase
- **OCP**: Extensible sin modificación
- **LSP**: Subtipos sustituibles
- **ISP**: Interfaces específicas
- **DIP**: Depender de abstracciones

Aplicar estos principios resulta en:

✅ **Código más mantenible** y fácil de entender  
✅ **Mayor flexibilidad** para cambios futuros  
✅ **Testing más simple** y efectivo  
✅ **Menor acoplamiento** entre componentes  
✅ **Mayor reutilización** de código  
✅ **Desarrollo más ágil** y colaborativo  

---

## Recursos Adicionales

- [Clean Code - Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350884)
- [SOLID Principles - Wikipedia](https://en.wikipedia.org/wiki/SOLID)
- [Uncle Bob's Blog](https://blog.cleancoder.com/)

---

**Autor:** Ejemplos educativos para enseñanza de principios SOLID  
**Contexto:** Sistema de E-commerce  
**Lenguaje:** JavaScript (ES6+)  
**Fecha:** Noviembre 2025