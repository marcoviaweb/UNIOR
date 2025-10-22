/**
 * Función que recibe un nombre como parámetro y retorna un saludo personalizado
 * @param nombre - Parámetro de tipo string que representa el nombre a saludar
 * @returns string - Retorna una cadena de texto con el saludo formateado
 */
function saludar(nombre) {
    // Retorna un template literal con el nombre interpolado en el mensaje de saludo
    return "Hola, ".concat(nombre, " Bienvenido a TypeScript");
}
// Declaración de una constante de tipo string que almacena el resultado de la función saludar
var mensaje = saludar("Estudiante");
// Imprime en consola el mensaje de saludo almacenado en la constante
console.log(mensaje);
/**
 * Función con parámetros opcionales que permite saludar con nombre y apellido
 * @param nombre - Parámetro obligatorio de tipo string para el nombre
 * @param apellido - Parámetro opcional (indicado con ?) de tipo string para el apellido
 * @returns string - Retorna un saludo personalizado según los parámetros recibidos
 */
function saludarCompleto(nombre, apellido // El signo ? indica que este parámetro es opcional
) {
    // Condicional que verifica si el parámetro apellido fue proporcionado
    if (apellido) {
        // Si apellido existe, retorna saludo con nombre y apellido
        return "Hola, ".concat(nombre, " ").concat(apellido, "!");
    }
    // Si no hay apellido, retorna saludo solo con el nombre
    return "Hola, ".concat(nombre, "!");
}
// Llamada a la función con solo el parámetro obligatorio (nombre)
console.log(saludarCompleto("Juan"));
// Llamada a la función con ambos parámetros (nombre y apellido)
console.log(saludarCompleto("Maria", "Aguilar"));
