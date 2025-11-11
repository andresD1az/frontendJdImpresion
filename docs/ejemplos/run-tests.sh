#!/bin/bash

# Script para ejecutar todas las pruebas automatizadas localmente
# Proyecto: JD Impresión
# Autor: Equipo de Desarrollo

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

echo "=========================================="
echo "  JD IMPRESIÓN - SUITE DE PRUEBAS"
echo "=========================================="

# 1. Pruebas JUnit
print_info "Ejecutando pruebas JUnit..."
cd backend
if mvn clean test; then
    print_success "Pruebas JUnit completadas"
else
    print_error "Fallos en JUnit"
    exit 1
fi
cd ..

# 2. Cobertura
print_info "Generando reporte de cobertura..."
cd backend
mvn jacoco:report
print_success "Reporte: backend/target/site/jacoco/index.html"
cd ..

# 3. Pruebas Postman
print_info "Ejecutando pruebas Postman..."
if newman run postman/collection.json --environment postman/environment.json; then
    print_success "Pruebas Postman completadas"
else
    print_error "Fallos en Postman"
    exit 1
fi

print_success "Todas las pruebas completadas exitosamente"
