@echo off
echo 🎯 ABRIENDO VISUALIZACIÓN DEL PATRÓN COMPOSITE
echo.
echo 📊 Este comando abrirá el diagrama interactivo en tu navegador predeterminado
echo.

REM Intentar abrir el archivo HTML en el navegador predeterminado
if exist "elemento-1-envío-premium.html" (
    echo ✅ Archivo encontrado: elemento-1-envío-premium.html
    echo 🌐 Abriendo en el navegador...
    start "" "elemento-1-envío-premium.html"
    echo.
    echo 💡 El diagrama debería abrirse automáticamente en tu navegador.
    echo 📋 Si no se abre, haz doble clic en el archivo: elemento-1-envío-premium.html
) else (
    echo ❌ Error: No se encontró el archivo elemento-1-envío-premium.html
    echo 🔧 Ejecuta primero: node dist/sistema-con-diagramas.js
    echo.
)

echo.
echo 📚 Otros archivos disponibles:
if exist "*.html" (
    dir /b *.html
) else (
    echo    No hay archivos HTML generados
)

echo.
echo 🔍 Para generar nuevos diagramas, ejecuta:
echo    node dist/sistema-con-diagramas.js
echo.
pause