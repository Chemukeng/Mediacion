#!/bin/bash
# Script para subir cambios del monorepo a GitHub automáticamente

# Detener la ejecución en caso de cualquier error
set -e

echo "🏗️  Compilando y exportando el prototipo del simulador..."
cd web-landing
npm run build-prototype
cd ..

echo "🔄 Copiando prototipo para previsualización local..."
rm -rf web-landing/landing/prototipo
cp -R web-landing/prototipo web-landing/landing/prototipo

echo "🔄 Detectando cambios y preparando subida a GitHub..."
git add .

# Create commit with current timestamp
FECHA=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Actualizacion automatica monorepo: $FECHA"

# Push to the main branch on GitHub
git push origin main

echo "✅ ¡Todos los cambios han sido subidos a GitHub con éxito!"
