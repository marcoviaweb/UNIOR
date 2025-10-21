// ========================================
// DEFINICIÓN DE LA CLASE PRODUCTO CON MÓDULOS ES6
// ========================================

// MÓDULOS ES6: Usando 'export' para hacer la clase disponible para importación
// Esto permite modularidad y reutilización del código en otros archivos
// NOTA: Requiere <script type="module"> en el HTML para funcionar
export class Producto {
    
    // CONSTRUCTOR: Método especial que se ejecuta al crear una nueva instancia
    // Recibe los parámetros necesarios para inicializar un producto
    constructor(id, nombre, precio, stock) {
        // PROPIEDADES DE LA INSTANCIA:
        // Cada propiedad se asigna usando 'this' que hace referencia a la instancia actual
        this.id = id;           // Identificador único del producto
        this.nombre = nombre;   // Nombre descriptivo del producto
        this.precio = precio;   // Precio unitario del producto
        this.stock = stock;     // Cantidad disponible en inventario
    }

    // MÉTODO PARA CALCULAR IMPUESTO:
    // Usando función flecha (=>) para mantener el contexto de 'this'
    // Las funciones flecha no tienen su propio 'this', heredan el de la clase
    // Esto es útil cuando se pasa este método como callback o argumento
    calcularImpuesto = (tasa) => {
        // Multiplica el precio del producto por la tasa de impuesto
        // Ejemplo: si precio = 100 y tasa = 0.21, retorna 21
        return this.precio * tasa;
    };
}