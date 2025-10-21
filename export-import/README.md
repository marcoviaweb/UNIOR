# 🛒 Sistema de Carrito de Compras UNIOR

## 📋 Descripción del Proyecto

Este proyecto implementa un sistema de carrito de compras usando **JavaScript ES6 con módulos**, **HTML semántico** y **CSS moderno**. Demuestra conceptos fundamentales de programación como clases, métodos, manipulación del DOM y diseño responsive.

## 📁 Estructura de Archivos (Simplificada)

```
📦 UNIOR/
├── 📄 producto.js    # Definición de la clase Producto (con export)
├── 📄 carrito.js     # Lógica del carrito (con import/export)
├── 📄 index.html     # Interfaz web principal con módulos ES6
├── 🎨 estilos.css    # Hoja de estilos CSS externa
└── 📄 README.md      # Esta documentación
```

## 🚀 Cómo Ejecutar el Proyecto

### ⚠️ **IMPORTANTE: Requiere Servidor HTTP**

Este proyecto usa **módulos ES6** con `import`/`export`, por lo que **NO funciona** abriendo el archivo HTML directamente. Necesitas un servidor HTTP.

### **Opción 1: Live Server en VS Code (Recomendado)**
1. **Instalar extensión "Live Server"** en VS Code
2. **Clic derecho** en `index.html`
3. **Seleccionar "Open with Live Server"**
4. Se abrirá automáticamente en el navegador

### **Opción 2: Servidor con Python**
```bash
# Navegar a la carpeta del proyecto
cd "e:\proyectos\UNIOR"

# Ejecutar servidor HTTP
python -m http.server 8000

# Abrir en navegador: http://localhost:8000/index.html
```

### **Opción 3: Servidor con Node.js**
```bash
# Instalar servidor HTTP global
npm install -g http-server

# Navegar al proyecto
cd "e:\proyectos\UNIOR"

# Ejecutar servidor
http-server -p 8000

# Abrir: http://localhost:8000/index.html
```

### **Opción 4: Otros Servidores**
- **XAMPP/WAMP:** Copiar archivos a `htdocs` o `www`
- **NGINX:** Configurar como sitio estático
- **Apache:** Servir desde directorio web

## ✨ Funcionalidades del Sistema

### 🛒 **Gestión del Carrito:**
- ✅ Visualización de productos con información detallada
- ✅ Cálculo automático de subtotal
- ✅ Cálculo de impuestos (21% sobre productos específicos)
- ✅ Agregar productos dinámicamente con botones
- ✅ Interfaz responsive (se adapta a móviles y tablets)

### 🎨 **Diseño Visual:**
- ✅ Paleta de colores cálidos (naranjas, amarillos, rosados)
- ✅ Gradientes y efectos modernos
- ✅ Animaciones suaves y microinteracciones
- ✅ Tipografía legible y jerarquía visual clara

### 💻 **Tecnologías Utilizadas:**
- ✅ **JavaScript ES6:** Clases, módulos, funciones flecha
- ✅ **HTML5:** Semántico y accesible
- ✅ **CSS3:** Grid, Flexbox, animaciones, responsive design

## 🛠️ Características Técnicas Implementadas

### **JavaScript Moderno:**
- **📦 Módulos ES6:** `import`/`export` para organización
- **🏗️ Clases ES6:** Definición y uso de la clase `Producto`
- **🔧 Métodos de Instancia:** `calcularImpuesto()` con función flecha
- **� Array Methods:** `reduce()`, `forEach()` para cálculos
- **🌐 DOM Manipulation:** Creación dinámica de elementos
- **📅 Event Listeners:** `DOMContentLoaded` y eventos de botones
- **📝 Template Literals:** Interpolación de cadenas modernas

### **CSS Avanzado:**
- **🎨 CSS Grid y Flexbox:** Layout responsive
- **🌈 Gradientes:** Efectos visuales modernos
- **✨ Animaciones:** Transiciones suaves y keyframes
- **📱 Media Queries:** Adaptación a diferentes pantallas
- **🎯 CSS Custom Properties:** Variables CSS (preparado para futuras mejoras)

### **HTML Semántico:**
- **� Etiquetas Semánticas:** Estructura clara y accesible
- **📋 Atributos ARIA:** Preparado para accesibilidad
- **🔗 Scripts de Módulo:** `<script type="module">` correctamente configurado

## 🎯 Objetivos de Aprendizaje Cubiertos

1. **📚 Programación Orientada a Objetos** en JavaScript ES6
2. **📦 Sistema de Módulos** con import/export
3. **🌐 Manipulación avanzada del DOM** para interfaces dinámicas
4. **🎨 CSS moderno** con layout y efectos avanzados
5. **📱 Diseño responsive** con mobile-first approach
6. **🔧 Gestión de eventos** y interactividad del usuario
7. **📖 Documentación** y buenas prácticas de código

## 🔧 Personalización y Extensión

### **Agregar Nuevos Productos:**
```javascript
// En la consola del navegador o en carrito.js
agregarProductoAlCarrito(6, "Webcam HD", 89, 15);
```

### **Modificar Estilos:**
- Editar `estilos.css` para cambiar colores, fuentes, efectos
- Variables CSS organizadas al inicio del archivo
- Comentarios detallados para cada sección

### **Agregar Funcionalidades:**
- Eliminar productos del carrito
- Modificar cantidades de productos
- Sistema de descuentos y cupones
- Persistencia con localStorage
- Integración con APIs de pago

## � Solución de Problemas Comunes

### **Error: "Cannot use import statement outside a module"**
- **Causa:** Intentar abrir `index.html` directamente
- **Solución:** Usar un servidor HTTP (ver secciones anteriores)

### **Error: "Uncaught SyntaxError: Unexpected token 'export'"**
- **Causa:** Script cargado sin `type="module"`
- **Solución:** Verificar que `index.html` tenga `<script type="module">`

### **La página no carga o muestra errores CORS**
- **Causa:** Protocolo `file://` no soporta módulos ES6
- **Solución:** Usar cualquier servidor HTTP local

## � Recursos para Continuar Aprendiendo

- **[MDN - Módulos JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules)**
- **[JavaScript.info - Modules](https://javascript.info/modules-intro)**
- **[CSS Grid Complete Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)**
- **[Modern JavaScript Features](https://javascript.info/)**

## 🎓 Conclusión

Este proyecto combina lo mejor del **JavaScript moderno** con **diseño web contemporáneo**, proporcionando una base sólida para aplicaciones web escalables y mantenibles. La estructura modular facilita la extensión y el mantenimiento del código.

---

**🎯 Proyecto Educativo UNIOR - JavaScript ES6 y Desarrollo Web Moderno**  
*Desarrollado con ❤️ y las mejores prácticas de la industria*

## 🚀 Cómo Ejecutar el Proyecto

### Opción 1: Versión Simple (Sin Módulos ES6)
1. **Abrir `carrito.html`** directamente en el navegador
   - Hacer doble clic en el archivo
   - O clic derecho → "Abrir con" → Navegador web
   - ✅ Funciona inmediatamente sin configuración

### Opción 2: Versión con Módulos ES6 (Recomendado)
1. **Leer la guía `SERVIDOR.md`** para configurar un servidor HTTP
2. **Abrir `carrito-modulos.html`** a través del servidor
3. **Ventajas:**
   - ✅ Código modular con import/export
   - ✅ Mejor organización y mantenibilidad
   - ✅ Sin contaminación del espacio global
   - ✅ Preparado para proyectos grandes

### Funcionalidades Disponibles (Ambas Versiones):
- ✅ Ver productos en el carrito
- ✅ Calcular subtotal automáticamente  
- ✅ Calcular impuestos
- ✅ Agregar nuevos productos con botones
- ✅ Interfaz responsive (se adapta a móviles)

### Opción 2: Consola del Navegador
1. Abrir `carrito.html` en el navegador
2. Presionar **F12** para abrir Herramientas de Desarrollador
3. Ir a la pestaña **Console**
4. Ver mensajes informativos del sistema

## 🛠️ Características Técnicas

### Conceptos de JavaScript Implementados:
- **📦 Clases ES6:** Definición y uso de la clase `Producto`
- **🔧 Métodos de Instancia:** `calcularImpuesto()`
- **➡️ Funciones Flecha:** Mantenimiento del contexto `this`
- **🔄 Array Methods:** `reduce()`, `forEach()`
- **🌐 DOM Manipulation:** Creación y modificación de elementos HTML
- **📅 Event Listeners:** `DOMContentLoaded`
- **📝 Template Literals:** Interpolación de cadenas
- **📦 Módulos ES6:** `import`/`export` (en versión con módulos)
- **🔒 Scope de Módulos:** Evitar contaminación global

### Características de la Interfaz Web:
- **🎨 CSS Moderno:** Gradientes, sombras, transiciones separadas en archivo externo
- **� Separación de Responsabilidades:** HTML, CSS y JavaScript en archivos independientes
- **�📱 Diseño Responsive:** Adaptable a diferentes tamaños de pantalla
- **⚡ Interactividad:** Botones para agregar productos dinámicamente
- **💰 Cálculos en Tiempo Real:** Actualización automática de totales
- **🌈 Paleta de Colores Cálidos:** Tonos naranjas, amarillos y rosados

## 📊 Funcionalidades del Sistema

### Gestión de Productos:
- **Crear productos** con ID, nombre, precio y stock
- **Calcular impuestos** por producto
- **Agregar productos** al carrito dinámicamente

### Gestión del Carrito:
- **Mostrar productos** con información detallada
- **Calcular subtotal** de todos los productos
- **Calcular impuestos** específicos
- **Interfaz visual** atractiva y funcional

### Cálculos Financieros:
- **Subtotal:** Suma de todos los precios
- **Impuestos:** 21% calculado sobre productos específicos
- **Total:** Visualización clara de costos

## 🎯 Objetivos de Aprendizaje

Este proyecto enseña:
1. **Programación Orientada a Objetos** en JavaScript
2. **Manipulación del DOM** para interfaces dinámicas
3. **Separación de responsabilidades** (HTML, CSS, JS)
4. **Diseño responsive** con CSS
5. **Gestión de eventos** en el navegador
6. **Buenas prácticas** de comentarios y documentación

## 🔧 Personalización

### Agregar Nuevos Productos:
```javascript
// En carrito.js o en la consola del navegador
agregarProductoAlCarrito(5, "Nuevo Producto", 199, 20);
```

### Modificar Estilos:
- Editar el archivo `estilos.css` para cambiar la apariencia
- Cambiar colores, fuentes, espaciado, efectos, etc.
- Separación clara entre estructura (HTML) y presentación (CSS)

### Agregar Funcionalidades:
- Eliminar productos del carrito
- Modificar cantidades
- Aplicar descuentos
- Guardar carrito en localStorage

## 📞 Soporte

Si tienes preguntas sobre el código:
1. **Revisa los comentarios** en cada archivo
2. **Usa la consola del navegador** para debugging
3. **Modifica y experimenta** con el código

---

**🎓 Proyecto Educativo UNIOR - JavaScript y Desarrollo Web**