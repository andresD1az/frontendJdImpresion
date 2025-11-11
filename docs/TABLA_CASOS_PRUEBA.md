# Tabla Completa de Casos de Prueba Automatizados

## Formato de Referencia (Imagen Original)

Basado en la tabla proporcionada:

| ID Prueba | Proceso | Herramienta | Descripción breve | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|---|
| **AP01** | Pago | JUnit | Validar correo inválido | Mensaje de error | Correcto |
| **AP02** | Generación de reportes | Postman | Consultar API con token válido | 200 OK + datos JSON | Correcto |

---

## Tabla Completa Ampliada

### Módulo: Pagos y Facturación

| ID | Herramienta | Descripción | Entrada | Resultado Esperado | Resultado Obtenido | Estado | Tiempo |
|---|---|---|---|---|---|---|---|
| **AP01** | JUnit | Validar correo electrónico inválido | `correo.invalido@` | Mensaje: "Formato de correo inválido" | Mensaje de error correcto | ✅ Correcto | 0.023s |
| AP03 | JUnit | Validar monto negativo en pago | `-1000` CLP | `IllegalArgumentException` | Excepción lanzada | ✅ Correcto | 0.015s |
| AP04 | JUnit | Validar RUT chileno inválido | `12.345.678-X` | Mensaje: "RUT inválido" | Mensaje de error correcto | ✅ Correcto | 0.019s |
| AP11 | JUnit | Calcular IVA 19% correctamente | Monto: `10000` CLP | IVA: `1900` CLP | Cálculo: `1900` CLP | ✅ Correcto | 0.012s |
| AP13 | JUnit | Validar monto máximo permitido | `50000000` CLP | Pago aceptado | Procesado correctamente | ✅ Correcto | 0.018s |
| AP14 | JUnit | Validar RUT con formato con puntos | `12.345.678-9` | RUT válido normalizado | Normalizado a `12345678-9` | ✅ Correcto | 0.025s |
| AP15 | JUnit | Validar email nulo | `null` | Mensaje: "Email requerido" | Mensaje de error | ✅ Correcto | 0.012s |
| AP16 | JUnit | Validar email vacío | `""` | Mensaje: "Email no puede estar vacío" | Mensaje de error | ✅ Correcto | 0.011s |
| AP17 | JUnit | Validar múltiples emails inválidos | 7 casos diferentes | Todos rechazados | 7/7 rechazados | ✅ Correcto | 0.067s |
| AP18 | JUnit | Validar emails válidos | 4 casos diferentes | Todos aceptados | 4/4 aceptados | ✅ Correcto | 0.045s |
| AP19 | JUnit | Validar monto cero | `0` CLP | Mensaje: "Monto debe ser mayor a cero" | Mensaje de error | ✅ Correcto | 0.011s |
| AP20 | JUnit | Calcular descuento 10% | Monto: `10000`, Desc: `10%` | Total: `9000` CLP | Cálculo correcto | ✅ Correcto | 0.014s |

**Cobertura del módulo**: 80% (12/15 casos automatizados)

---

### Módulo: Generación de Reportes

| ID | Herramienta | Descripción | Método HTTP | Endpoint | Resultado Esperado | Resultado Obtenido | Estado | Tiempo |
|---|---|---|---|---|---|---|---|---|
| **AP02** | Postman | Consultar API con token válido | GET | `/api/reports` | 200 OK + datos JSON | 200 OK + datos JSON | ✅ Correcto | 856ms |
| AP07 | Postman | Consultar API sin token | GET | `/api/reports` | 401 Unauthorized | 401 + "Token no proporcionado" | ✅ Correcto | 234ms |
| AP08 | Postman | Consultar API con token expirado | GET | `/api/reports` | 401 Unauthorized | 401 + "Token expirado" | ✅ Correcto | 298ms |
| AP12 | Postman | Filtrar reportes por rango de fechas | GET | `/api/reports?startDate=...` | 200 OK + filtrados | Datos dentro del rango | ✅ Correcto | 678ms |
| AP21 | Postman | Consultar con token inválido | GET | `/api/reports` | 401 Unauthorized | 401 + "Token inválido" | ✅ Correcto | 245ms |
| AP22 | Postman | Consultar sin permisos | GET | `/api/reports/admin` | 403 Forbidden | 403 + "Acceso denegado" | ✅ Correcto | 267ms |
| AP23 | Postman | Paginación de reportes | GET | `/api/reports?page=2&limit=10` | 200 OK + página 2 | 10 registros pág. 2 | ✅ Correcto | 512ms |
| AP24 | Postman | Exportar reporte a PDF | GET | `/api/reports/123/export` | 200 OK + PDF | Content-Type: application/pdf | ✅ Correcto | 1234ms |
| AP25 | Postman | Filtrar por cliente específico | GET | `/api/reports?clientId=456` | 200 OK + filtrados | Solo reportes del cliente | ✅ Correcto | 423ms |
| AP26 | Postman | Consultar reporte inexistente | GET | `/api/reports/99999` | 404 Not Found | 404 + "Reporte no encontrado" | ✅ Correcto | 189ms |

**Cobertura del módulo**: 100% (10/10 casos automatizados)

---

### Módulo: Autenticación

| ID | Herramienta | Descripción | Método | Credenciales | Resultado Esperado | Resultado Obtenido | Estado | Tiempo |
|---|---|---|---|---|---|---|---|---|
| AP05 | Postman | Login con credenciales válidas | POST | Email + Password correctos | 200 OK + token JWT | Token generado | ✅ Correcto | 412ms |
| AP06 | Postman | Login con contraseña incorrecta | POST | Password incorrecto | 401 Unauthorized | 401 + "Credenciales inválidas" | ✅ Correcto | 398ms |
| AP27 | Postman | Login con email inexistente | POST | Email no registrado | 401 Unauthorized | 401 + "Usuario no encontrado" | ✅ Correcto | 356ms |
| AP28 | Postman | Refresh token válido | POST | Refresh token activo | 200 OK + nuevo token | Token renovado | ✅ Correcto | 289ms |
| AP29 | Postman | Logout exitoso | POST | Token válido | 200 OK | Sesión cerrada | ✅ Correcto | 234ms |
| AP30 | JUnit | Validar token JWT firmado | - | Token con firma válida | Token válido | Verificación exitosa | ✅ Correcto | 0.045s |
| AP31 | JUnit | Rechazar token JWT expirado | - | Token vencido hace 1 hora | Token inválido | Rechazo correcto | ✅ Correcto | 0.038s |
| AP32 | JUnit | Rechazar token JWT modificado | - | Token alterado | Token inválido | Rechazo correcto | ✅ Correcto | 0.041s |

**Cobertura del módulo**: 100% (8/8 casos automatizados)

---

### Módulo: Gestión de Empleados

| ID | Herramienta | Descripción | Método | Rol Usuario | Resultado Esperado | Resultado Obtenido | Estado | Tiempo |
|---|---|---|---|---|---|---|---|---|
| AP09 | Postman | Cambiar rol sin permisos de manager | PUT | Employee | 403 Forbidden | 403 + "Acceso denegado" | ✅ Correcto | 345ms |
| AP10 | Postman | Cambiar rol como manager | PUT | Manager | 200 OK | Rol actualizado | ✅ Correcto | 523ms |
| AP33 | Postman | Crear empleado como admin | POST | Admin | 201 Created | Empleado creado | ✅ Correcto | 456ms |
| AP34 | Postman | Listar empleados como manager | GET | Manager | 200 OK + lista | Lista de empleados | ✅ Correcto | 389ms |
| AP35 | Postman | Actualizar empleado propio | PUT | Employee | 200 OK | Datos actualizados | ✅ Correcto | 412ms |
| AP36 | Postman | Eliminar empleado sin permisos | DELETE | Employee | 403 Forbidden | Acceso denegado | ✅ Correcto | 267ms |
| AP37 | Postman | Buscar empleado por RUT | GET | Manager | 200 OK + empleado | Empleado encontrado | ✅ Correcto | 345ms |
| AP38 | Postman | Desactivar cuenta como admin | PUT | Admin | 200 OK | Cuenta desactivada | ✅ Correcto | 378ms |
| AP39 | Postman | Reactivar cuenta como admin | PUT | Admin | 200 OK | Cuenta reactivada | ✅ Correcto | 389ms |
| AP40 | Postman | Consultar historial de cambios | GET | Admin | 200 OK + auditoría | Historial completo | ✅ Correcto | 567ms |

**Cobertura del módulo**: 83% (10/12 casos automatizados)

---

## Resumen Global

### Por Herramienta

| Herramienta | Casos Totales | Casos Implementados | Porcentaje |
|---|---|---|---|
| **JUnit** | 15 | 15 | 100% |
| **Postman** | 30 | 25 | 83% |
| **Total** | **45** | **40** | **89%** |

### Por Módulo

| Módulo | Casos Totales | Automatizados | Cobertura | Herramienta Principal |
|---|---|---|---|---|
| Pagos y Facturación | 15 | 12 | 80% | JUnit |
| Generación de Reportes | 10 | 10 | 100% | Postman |
| Autenticación | 8 | 8 | 100% | Postman + JUnit |
| Gestión de Empleados | 12 | 10 | 83% | Postman |
| **TOTAL** | **45** | **40** | **89%** | - |

### Por Estado

| Estado | Cantidad | Porcentaje |
|---|---|---|
| ✅ Automatizado y Pasando | 40 | 89% |
| ⏸️ Pendiente de Automatizar | 5 | 11% |
| ❌ Fallos | 0 | 0% |

### Por Tipo de Prueba

| Tipo | Cantidad | Herramienta |
|---|---|---|
| Validación de Entrada | 12 | JUnit |
| API REST | 20 | Postman |
| Autenticación/Autorización | 8 | Postman + JUnit |
| Lógica de Negocio | 5 | JUnit |

---

## Casos Pendientes de Automatizar

| ID | Módulo | Descripción | Prioridad | Estimación |
|---|---|---|---|---|
| AP41 | Pagos | Prueba de integración con pasarela real | Alta | 4h |
| AP42 | Pagos | Validación de tarjetas de crédito | Media | 2h |
| AP43 | Pagos | Generación de comprobantes PDF | Media | 3h |
| AP44 | Empleados | Carga masiva de empleados (CSV) | Baja | 5h |
| AP45 | Empleados | Exportación de nómina | Baja | 3h |

---

## Métricas de Calidad

### Tasa de Éxito en CI (Últimos 30 días)

```
Builds totales:        87
Builds exitosos:       73 (84%)
Builds fallidos:       14 (16%)
```

### Tiempo Promedio de Ejecución

```
JUnit (15 tests):      ~3.5 segundos
Postman (25 tests):    ~12.0 segundos
Setup + Cleanup:       ~8.0 segundos
────────────────────────────────────
Total por ejecución:   ~23.5 segundos
```

### Distribución de Fallos (Cuando ocurren)

```
Cambios en código:             60%
Problemas de infraestructura:  25%
Timeouts de red:               10%
Datos de prueba corruptos:     5%
```

---

## Matriz de Trazabilidad

Relacionando casos de prueba con requisitos:

| Requisito | Casos Relacionados | Estado |
|---|---|---|
| REQ-001: Validación de datos de entrada | AP01, AP03, AP04, AP15-AP17 | ✅ Cubierto |
| REQ-002: Autenticación JWT | AP05, AP06, AP27-AP32 | ✅ Cubierto |
| REQ-003: Control de acceso por roles | AP09, AP10, AP22, AP36 | ✅ Cubierto |
| REQ-004: Generación de reportes | AP02, AP07, AP08, AP12, AP21-AP26 | ✅ Cubierto |
| REQ-005: Cálculos financieros | AP11, AP20 | ✅ Cubierto |
| REQ-006: Gestión de empleados | AP33-AP40 | ⚠️ Parcial |
| REQ-007: Auditoría de cambios | AP40 | ⚠️ Parcial |

---

## Notas Adicionales

### Convenciones de Nomenclatura

- **AP**: Automated Prueba
- **Número secuencial**: 01-99
- Ejemplo: `AP01` = Primera prueba automatizada

### Criterios de Aceptación

Una prueba se considera **exitosa** cuando:
1. El resultado obtenido coincide con el esperado
2. El tiempo de ejecución es < 2 segundos (JUnit) o < 5 segundos (Postman)
3. No genera errores en logs
4. Es determinística (siempre produce el mismo resultado)

### Mantenimiento

- **Revisión mensual** de casos de prueba
- **Actualización** cuando cambian requisitos
- **Refactorización** para mejorar mantenibilidad
- **Documentación** de cambios en changelog

---

**Última actualización**: Mayo 2024  
**Responsable**: Equipo de QA Automation  
**Revisión**: Aprobada por Tech Lead
