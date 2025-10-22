/**
 * Saludo Simple en TypeScript
 * Ejemplo básico mostrando tipado de parámetros y valor de retorno
 */
/**
 * Función que crea un saludo personalizado
 * @param nombre - Nombre de la persona (string obligatorio)
 * @param lenguaje - Lenguaje de programación (string opcional)
 * @returns string - Mensaje de saludo formateado
 */
function crearSaludo(nombre, lenguaje) {
    if (lenguaje) {
        // Si se proporciona lenguaje, incluirlo en el saludo
        return "\u00A1Hola ".concat(nombre, "! Bienvenido al mundo de ").concat(lenguaje);
    }
    // Saludo simple si no hay lenguaje especificado
    return "\u00A1Hola ".concat(nombre, "!");
}
// Declaración de variables con tipado explícito
var miNombre = "Diplomante";
var miLenguaje = "TypeScript";
// Mostrar saludos usando la función
console.log("=== Saludos en TypeScript ===");
console.log(crearSaludo(miNombre));
console.log(crearSaludo(miNombre, miLenguaje));
console.log(crearSaludo("Programador", "JavaScript"));
