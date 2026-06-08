#!/bin/bash
# Script para subir cambios a GitHub automáticamente

echo "🏗️  Compilando y exportando el prototipo..."
npm run build-prototype

echo "🔄 Copiando prototipo para previsualización local..."
rm -rf landing/prototipo
cp -R prototipo landing/prototipo

echo "🔄 Detectando cambios y preparando subida a GitHub..."

# Stage all changes
git add .

# Create commit with current timestamp
FECHA=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Actualizacion automatica: $FECHA"

# Push to the main branch on GitHub
git push origin main

echo "✅ ¡Todos los cambios han sido subidos a GitHub con éxito!"
