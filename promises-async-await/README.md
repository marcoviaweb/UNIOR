# 🔄 Promises y Async/Await - Sistema de Transacciones

## 📋 Descripción del Ejercicio

Este ejercicio demuestra el uso de **Promises** y **async/await** en JavaScript a través de la simulación de un sistema de transacciones de e-commerce. Aprenderás a manejar operaciones asíncronas de forma elegante y profesional.

## 🎯 Objetivos de Aprendizaje

- ✅ **Entender Promises:** Estados, resolve, reject
- ✅ **Dominar async/await:** Sintaxis moderna y legible
- ✅ **Manejar errores:** Try/catch en operaciones asíncronas
- ✅ **Simular APIs:** Operaciones que toman tiempo
- ✅ **Flujo secuencial:** Operaciones en orden específico

## 📁 Archivos del Ejercicio

```
📦 promises-async-await/
├── 📄 transaccion.js    # Ejercicio para ejecutar en Node.js/Consola
├── 📄 index.html        # Interfaz web interactiva (NUEVO)
└── 📄 README.md         # Esta documentación
```

## 🚀 Cómo Ejecutar

### **Opción 1: Interfaz Web (Recomendado) 🌐**
```bash
# Abrir index.html en cualquier navegador moderno
# Doble clic en el archivo o arrastrar al navegador
```
**Características de la interfaz web:**
- ✅ **Visualización en tiempo real** del proceso
- ✅ **Controles interactivos** para configurar transacciones
- ✅ **Indicadores visuales** de estado (pendiente, éxito, error)
- ✅ **Log en tiempo real** con timestamps
- ✅ **Diseño responsive** y moderno

### **Opción 2: Node.js (Terminal)**
```bash
# Desde la carpeta promises-async-await
node transaccion.js
```

### **Opción 3: Consola del Navegador**
```html
<!-- Crear un archivo HTML básico -->
<script src="transaccion.js"></script>
<!-- Ver resultados en Console (F12) -->
```

### **Opción 4: VS Code**
- Usar extensión "Code Runner"
- Presionar `Ctrl+F5` para ejecutar

## 🔍 Qué Observar en la Ejecución

### **📊 En la Interfaz Web (index.html):**
- **🎯 Pasos visuales:** Cada etapa se muestra con indicadores de estado
- **⏱️ Tiempos reales:** Observa las latencias simuladas (500ms stock, 800ms pago)
- **🎨 Estados visuales:** 
  - 🟡 Amarillo = Procesando (con animación)
  - 🟢 Verde = Completado exitosamente
  - 🔴 Rojo = Error o falla
- **📝 Log en tiempo real:** Registro completo con timestamps
- **🎮 Controles interactivos:** Prueba diferentes productos y métodos de pago

### **📊 En la Consola (transaccion.js):**
```
==================================================
🚀 INICIANDO PRUEBAS DE TRANSACCIONES
==================================================

💳 PRUEBA 1: Transacción exitosa
------------------------------
1. Iniciando proceso de transacción...
2. Stock verificado: Stock validado para producto 10.
3. Pago completado: Pago Tarjeta procesado con éxito.
✅ RESULTADO FINAL: Transacción Finalizada con Éxito.
------------------------------

❌ PRUEBA 2: Transacción fallida (sin stock)
------------------------------
1. Iniciando proceso de transacción...
ERROR CRÍTICO: Producto 99 no tiene stock.
❌ RESULTADO FINAL: Transacción Fallida.
==================================================
📚 EJERCICIO COMPLETADO
==================================================
```

## 🛠️ Conceptos Técnicos Demostrados

### **1. Promises (Promesas)**
```javascript
new Promise((resolve, reject) => {
    // Operación asíncrona
    if (exito) {
        resolve(resultado);  // ✅ Éxito
    } else {
        reject(error);       // ❌ Error
    }
});
```

**Estados de una Promise:**
- 🟡 **Pending:** Operación en progreso
- 🟢 **Resolved:** Operación exitosa
- 🔴 **Rejected:** Operación fallida

### **2. Async/Await**
```javascript
async function miFuncion() {
    try {
        const resultado = await operacionAsincrona();
        // Código que espera a que termine
    } catch (error) {
        // Manejo de errores
    }
}
```

**Ventajas:**
- ✅ Código más legible (parece síncrono)
- ✅ Fácil manejo de errores
- ✅ Evita "callback hell"
- ✅ Flujo secuencial claro

### **3. Try/Catch Asíncrono**
```javascript
try {
    await operacion1();
    await operacion2();
} catch (error) {
    // Captura errores de cualquier await
}
```

## 🔧 Flujo del Ejercicio

### **Paso 1: Validación de Stock**
- Simula consulta a base de datos
- Tarda 500ms en responder
- Producto 99 = sin stock (error)
- Otros productos = stock OK

### **Paso 2: Procesamiento de Pago**
- Solo si el stock está OK
- Simula llamada a API de pagos
- Tarda 800ms en procesar
- Siempre exitoso en este ejercicio

### **Paso 3: Finalización**
- Retorna resultado final
- Maneja cualquier error en el proceso

## 🧪 Experimentos Sugeridos

### **1. Modificar Tiempos**
```javascript
// Cambiar setTimeout para ver diferencias de velocidad
setTimeout(() => resolve(resultado), 2000); // 2 segundos
```

### **2. Agregar Más Validaciones**
```javascript
// Validar método de pago
if (metodoPago !== "Tarjeta" && metodoPago !== "Paypal") {
    reject("Método de pago no válido");
}
```

### **3. Simular Más Errores**
```javascript
// Error aleatorio en el pago
if (Math.random() < 0.3) { // 30% de probabilidad de error
    reject("Error en el servidor de pagos");
}
```

### **4. Agregar Más Pasos**
```javascript
// Envío de confirmación por email
const email = await enviarConfirmacion(clienteEmail);
console.log("4. Email enviado:", email);
```

## 📚 Casos de Uso Reales

Este patrón se usa en:

- 🛒 **E-commerce:** Procesar compras
- 🌐 **APIs REST:** Consumir servicios web
- 🗄️ **Bases de datos:** Consultas asíncronas
- 📁 **Sistema de archivos:** Leer/escribir archivos
- 🔐 **Autenticación:** Login con servicios externos

## 🎓 Próximos Pasos

Después de dominar este ejercicio:

1. **fetch() API:** Consumir APIs reales
2. **Promise.all():** Operaciones en paralelo
3. **Promise.race():** Primera operación que termine
4. **Error handling:** Estrategias avanzadas de manejo de errores
5. **Async iterators:** Para manejo de streams de datos

---

**🎯 Ejercicio de Programación Asíncrona - UNIOR**  
*Fundamentos esenciales para el desarrollo web moderno*