# 🎯 Patrón de Diseño Composite - Ejemplo Educativo

## 📚 ¿Qué es el Patrón Composite?

El **patrón Composite** permite componer objetos en estructuras de árbol para representar jerarquías parte-todo. Este patrón permite a los clientes tratar objetos individuales y composiciones de objetos de manera uniforme.

## 🏗️ Estructura del Patrón

```
Component (Abstracta)
├── Leaf (Hoja)
└── Composite (Compuesto)
    ├── children: Component[]
    └── métodos para gestionar hijos
```

### Componentes:

- **Component**: Interfaz común que define operaciones para objetos simples y compuestos
- **Leaf**: Representa objetos finales que no pueden tener hijos (ej: archivos)
- **Composite**: Representa objetos complejos que pueden contener otros componentes (ej: carpetas)

## 🌟 Caso de Uso: Sistema de Archivos

Este ejemplo simula un sistema de archivos donde:
- **Archivos** = Leaf (no pueden contener otros elementos)
- **Carpetas** = Composite (pueden contener archivos y otras carpetas)

## 🚀 Instrucciones de Ejecución

### Opción 1: Compilar y Ejecutar

```bash
# 1. Navegar al directorio
cd composite

# 2. Compilar TypeScript
npx tsc

# 3. Ejecutar el código compilado
node dist/index.js
```

### Opción 2: Ejecutar Directamente con ts-node

```bash
# Si tienes ts-node instalado globalmente
npm install -g ts-node
ts-node index.ts

# O usando npx
npx ts-node index.ts
```

### Opción 3: En VS Code

1. Abrir el archivo `index.ts`
2. Presionar `Ctrl+Shift+P` (o `Cmd+Shift+P` en Mac)
3. Buscar "Tasks: Run Task"
4. Seleccionar "tsc: build" para compilar
5. Ejecutar en terminal: `node dist/index.js`

## 📋 Salida Esperada

El programa demostrará:

1. **Caso 1**: Trabajo con componente simple (archivo)
2. **Caso 2**: Estructura compleja (sistema de carpetas anidadas)
3. **Caso 3**: Gestión dinámica del árbol
4. **Caso 4**: Comportamiento al intentar agregar a una hoja
5. **Resumen**: Explicación del patrón y casos de uso

## ✨ Conceptos Clave Demostrados

### 🔄 Transparencia
El cliente trata hojas y composites de la misma manera, sin necesidad de conocer el tipo específico.

### 🌳 Recursión
Las operaciones se propagan automáticamente por todo el árbol de componentes.

### 🔧 Flexibilidad
Es fácil agregar nuevos tipos de componentes sin modificar el código existente.

### 📊 Jerarquía
Representación natural de estructuras anidadas como árboles.

## 🎯 Ventajas del Patrón

- ✅ **Uniformidad**: Misma interfaz para objetos simples y complejos
- ✅ **Extensibilidad**: Fácil agregar nuevos tipos de componentes
- ✅ **Flexibilidad**: Estructura dinámica del árbol
- ✅ **Simplicidad**: El cliente no necesita distinguir entre tipos

## ⚠️ Consideraciones

- ❌ Puede hacer el diseño demasiado general
- ❌ Algunos métodos pueden no aplicar a todas las hojas
- ❌ Control de tipos más complejo en tiempo de compilación

## 🌍 Casos de Uso Reales

1. **Sistemas de Archivos**: Carpetas y archivos
2. **Interfaces Gráficas**: Contenedores y widgets
3. **Documentos**: Secciones, párrafos, texto
4. **Menús**: Menús principales y submenús
5. **Organizaciones**: Departamentos y empleados
6. **Geometría**: Formas complejas compuestas de formas simples

## 📝 Estructura de Archivos

```
composite/
├── index.ts        # Implementación del patrón
├── tsconfig.json   # Configuración de TypeScript
├── dist/           # Archivos compilados
│   └── index.js
└── README.md       # Esta documentación
```

## 🔧 Dependencias

- **TypeScript**: Para la compilación
- **Node.js**: Para la ejecución

```bash
# Instalar TypeScript globalmente (opcional)
npm install -g typescript

# O usar npx para comandos puntuales
npx tsc --version
```

## 📖 Para Estudiantes

Este ejemplo está diseñado para enseñar:

1. **Conceptos fundamentales** del patrón Composite
2. **Implementación práctica** en TypeScript
3. **Casos de uso reales** y aplicaciones
4. **Buenas prácticas** de programación orientada a objetos
5. **Gestión de jerarquías** de manera elegante

¡Experimenta modificando el código para crear tus propias estructuras de árbol!