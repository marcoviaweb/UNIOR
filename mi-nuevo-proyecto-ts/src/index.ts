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
function crearSaludo(nombre: string, lenguaje?: string): string {
  if (lenguaje) {
    // Si se proporciona lenguaje, incluirlo en el saludo
    return `¡Hola ${nombre}! Bienvenido al mundo de ${lenguaje}`;
  }
  // Saludo simple si no hay lenguaje especificado
  return `¡Hola ${nombre}!`;
}

// Declaración de variables con tipado explícito
const miNombre: string = "Diplomante";
const miLenguaje: string = "TypeScript";

// Mostrar saludos usando la función
console.log("=== Saludos en TypeScript ===");
console.log(crearSaludo(miNombre));
console.log(crearSaludo(miNombre, miLenguaje));
console.log(crearSaludo("Programador", "JavaScript"));