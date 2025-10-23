function crearSaludo(nombre: string, lenguaje?: string): string {
  if (lenguaje) {
    // Si se proporciona lenguaje, incluirlo en el saludo
    return `¡Hola ${nombre}! Bienvenido al mundo de ${lenguaje}`;
  }
  // Saludo simple si no hay lenguaje especificado
  return `¡Hola ${nombre}!`;
}

// Declaración de variables con tipado explícito
const miNombre: string = "Estudiante";
const miLenguaje: string = "TypeScript";

// Mostrar saludos usando la función
console.log("=== Saludos en TypeScript ===");
console.log(crearSaludo(miNombre));
console.log(crearSaludo(miNombre, miLenguaje));
console.log(crearSaludo("Juan", "Java"));