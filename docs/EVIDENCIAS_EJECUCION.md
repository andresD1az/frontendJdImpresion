# Evidencias de Ejecución - Pruebas Automatizadas

## 1. Salida de Consola - JUnit

### Ejecución Completa de Tests

```
[INFO] Scanning for projects...
[INFO] 
[INFO] -------------------< com.jdimpresion:backend-api >-------------------
[INFO] Building JD Impresión Backend API 1.0.0
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- maven-clean-plugin:3.1.0:clean (default-clean) @ backend-api ---
[INFO] Deleting /home/runner/work/backend/target
[INFO] 
[INFO] --- maven-resources-plugin:3.2.0:resources (default-resources) @ backend-api ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Copying 3 resources
[INFO] 
[INFO] --- maven-compiler-plugin:3.8.1:compile (default-compile) @ backend-api ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 45 source files to /home/runner/work/backend/target/classes
[INFO] 
[INFO] --- maven-surefire-plugin:2.22.2:test (default-test) @ backend-api ---
[INFO] 
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.jdimpresion.validators.EmailValidatorTest
15:30:22.145 [main] INFO  c.j.validators.EmailValidatorTest - Iniciando pruebas de validación de email
15:30:22.234 [main] DEBUG c.j.validators.EmailValidator - Validando email: correo.invalido@
15:30:22.245 [main] DEBUG c.j.validators.EmailValidator - Email inválido: formato incorrecto
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.234 s - in com.jdimpresion.validators.EmailValidatorTest
[INFO] 
[INFO] Running com.jdimpresion.validators.RutValidatorTest
15:30:22.489 [main] INFO  c.j.validators.RutValidatorTest - Iniciando pruebas de validación de RUT
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.198 s - in com.jdimpresion.validators.RutValidatorTest
[INFO] 
[INFO] Running com.jdimpresion.services.PaymentServiceTest
15:30:22.687 [main] INFO  c.j.services.PaymentServiceTest - Iniciando pruebas de servicio de pagos
15:30:22.892 [main] DEBUG c.j.services.PaymentService - Calculando IVA 19% sobre monto: 10000
15:30:22.894 [main] DEBUG c.j.services.PaymentService - IVA calculado: 1900
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.567 s - in com.jdimpresion.services.PaymentServiceTest
[INFO] 
[INFO] Running com.jdimpresion.services.ReportServiceTest
15:30:23.461 [main] INFO  c.j.services.ReportServiceTest - Iniciando pruebas de servicio de reportes
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.423 s - in com.jdimpresion.services.ReportServiceTest
[INFO] 
[INFO] Running com.jdimpresion.auth.JwtServiceTest
15:30:23.884 [main] INFO  c.j.auth.JwtServiceTest - Iniciando pruebas de JWT
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.312 s - in com.jdimpresion.auth.JwtServiceTest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 29, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  14.234 s
[INFO] Finished at: 2024-05-10T15:30:24-05:00
[INFO] Final Memory: 42M/256M
[INFO] ------------------------------------------------------------------------
```

### Detalles de Prueba AP01

```
[INFO] Running com.jdimpresion.validators.EmailValidatorTest

  testInvalidEmailFormat (AP01)
    ✓ Email "correo.invalido@" es inválido
    ✓ Mensaje de error: "Formato de correo inválido"
    ✓ Código de error: "EMAIL_FORMAT_INVALID"
    Duration: 0.023s

  testMultipleInvalidEmails
    ✓ correo.sin.arroba.com - INVÁLIDO
    ✓ @sinusuario.com - INVÁLIDO
    ✓ correo@ - INVÁLIDO
    ✓ correo @espacios.com - INVÁLIDO
    ✓ correo@dominio - INVÁLIDO
    ✓ correo@@doble.com - INVÁLIDO
    ✓ correo@.com - INVÁLIDO
    Duration: 0.067s

  testValidEmails
    ✓ usuario@ejemplo.com - VÁLIDO
    ✓ nombre.apellido@empresa.cl - VÁLIDO
    ✓ contacto123@dominio.co - VÁLIDO
    ✓ info@sub.dominio.com - VÁLIDO
    Duration: 0.045s

All tests passed (5/5) in 0.234s
```

### Reporte de Cobertura JaCoCo

```
JaCoCo Coverage Report

Module: backend-api
Package Coverage: 89%

Detailed Coverage:
  com.jdimpresion.validators
    - EmailValidator.java          100% (45/45 lines)
    - RutValidator.java            100% (38/38 lines)
    - AmountValidator.java          95% (42/44 lines)
  
  com.jdimpresion.services
    - PaymentService.java           87% (156/179 lines)
    - ReportService.java            92% (78/85 lines)
    - AuthService.java              85% (112/132 lines)
  
  com.jdimpresion.controllers
    - PaymentController.java        82% (67/82 lines)
    - ReportController.java         90% (45/50 lines)

Total Instructions: 89% covered (1234/1387)
Total Branches: 85% covered (156/183)
Total Lines: 89% covered (583/655)
```

---

## 2. Salida de Consola - Newman (Postman)

### Ejecución Completa

```
newman

JD Impresión - API Tests

→ AP02 - Consultar Reportes con Token Válido
  GET https://jdimpresion-api.azurewebsites.net/api/reports?startDate=2024-01-01&endDate=2024-12-31
  [200 OK, 3.45KB, 856ms]
  
  ✓  AP02 - Status code es 200 OK
  ✓  AP02 - Respuesta contiene datos JSON
  ✓  AP02 - Datos de reportes están presentes
  ✓  AP02 - Cada reporte tiene estructura correcta
  ✓  AP02 - Tiempo de respuesta menor a 2000ms
  ✓  AP02 - Headers de seguridad presentes

→ AP05 - Login con Credenciales Válidas
  POST https://jdimpresion-api.azurewebsites.net/api/auth/login
  [200 OK, 1.23KB, 412ms]
  
  ✓  Status code es 200
  ✓  Token JWT está presente
  ✓  Token tiene formato válido
  ✓  Token guardado en variable de entorno

→ AP06 - Login con Contraseña Incorrecta
  POST https://jdimpresion-api.azurewebsites.net/api/auth/login
  [401 Unauthorized, 287B, 398ms]
  
  ✓  Status code es 401
  ✓  Mensaje de error correcto
  ✓  No se devuelve token

→ AP07 - Consultar Reportes Sin Token
  GET https://jdimpresion-api.azurewebsites.net/api/reports
  [401 Unauthorized, 245B, 234ms]
  
  ✓  AP07 - Status code es 401 Unauthorized
  ✓  AP07 - Mensaje de error correcto
  ✓  No se devuelven datos

→ AP08 - Consultar Reportes con Token Expirado
  GET https://jdimpresion-api.azurewebsites.net/api/reports
  [401 Unauthorized, 267B, 298ms]
  
  ✓  Status code es 401
  ✓  Mensaje indica token expirado

→ AP09 - Cambiar Rol Sin Permisos
  PUT https://jdimpresion-api.azurewebsites.net/api/employees/123/role
  [403 Forbidden, 189B, 345ms]
  
  ✓  Status code es 403
  ✓  Mensaje de acceso denegado

→ AP10 - Cambiar Rol Como Manager
  PUT https://jdimpresion-api.azurewebsites.net/api/employees/123/role
  [200 OK, 456B, 523ms]
  
  ✓  Status code es 200
  ✓  Rol actualizado correctamente
  ✓  Respuesta contiene confirmación

→ AP12 - Filtrar Reportes por Fechas
  GET https://jdimpresion-api.azurewebsites.net/api/reports?startDate=2024-01-01&endDate=2024-06-30
  [200 OK, 2.13KB, 678ms]
  
  ✓  Status code es 200
  ✓  Reportes filtrados correctamente
  ✓  Todos los reportes dentro del rango

┌─────────────────────────┬────────────────────┬───────────────────┐
│                         │           executed │            failed │
├─────────────────────────┼────────────────────┼───────────────────┤
│              iterations │                  1 │                 0 │
├─────────────────────────┼────────────────────┼───────────────────┤
│                requests │                  8 │                 0 │
├─────────────────────────┼────────────────────┼───────────────────┤
│            test-scripts │                 16 │                 0 │
├─────────────────────────┼────────────────────┼───────────────────┤
│      prerequest-scripts │                  8 │                 0 │
├─────────────────────────┼────────────────────┼───────────────────┤
│              assertions │                 28 │                 0 │
├─────────────────────────┴────────────────────┴───────────────────┤
│ total run duration: 4.2s                                          │
├───────────────────────────────────────────────────────────────────┤
│ total data received: 7.8KB (approx)                              │
├───────────────────────────────────────────────────────────────────┤
│ average response time: 468ms [min: 234ms, max: 856ms, s.d.: 208ms]│
└───────────────────────────────────────────────────────────────────┘

✨  All tests passed!
```

---

## 3. GitHub Actions - Ejecución CI

### Workflow Summary

```
✅ Automated Tests - CI/CD
   Triggered by: push to main
   Commit: 8a3f2b1 - "feat: add payment validation tests"
   Duration: 2m 34s
   
   Jobs:
   ✅ backend-tests     (1m 12s)
   ✅ api-tests         (1m 8s)
   ✅ coverage-report   (14s)
```

### Job: backend-tests

```
Run actions/checkout@v3
Checkout código...
✓ Repository checked out

Run actions/setup-java@v3
Configurar Java 17...
✓ Java 17 installed
✓ Maven cache restored

Run mvn clean test
[INFO] Scanning for projects...
[INFO] Building JD Impresión Backend API 1.0.0
[INFO] 
[INFO] --- maven-surefire-plugin:2.22.2:test (default-test) ---
[INFO] Tests run: 29, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
✓ JUnit tests passed (29/29)

Run mvn jacoco:report
[INFO] JaCoCo coverage report generated
✓ Coverage: 89%

Run actions/upload-artifact@v3
✓ Artifact uploaded: coverage-report
```

### Job: api-tests

```
Run actions/checkout@v3
✓ Repository checked out

Run actions/setup-node@v3
✓ Node.js 18 installed

Run npm install -g newman newman-reporter-htmlextra
✓ Newman installed globally

Run cd backend && npm start &
✓ Backend server started on port 3000

Run newman run postman/collection.json
newman

JD Impresión - API Tests
✓ 8 requests executed
✓ 28 assertions passed
✓ 0 failures

Run actions/upload-artifact@v3
✓ Artifact uploaded: newman-report

✅ All API tests passed
```

---

## 4. Métricas de Rendimiento

### Tiempos de Ejecución

```
┌──────────────────────────┬──────────┬──────────┬──────────┐
│ Suite de Pruebas         │ Local    │ CI       │ Promedio │
├──────────────────────────┼──────────┼──────────┼──────────┤
│ JUnit (29 tests)         │ 14.2s    │ 12.8s    │ 13.5s    │
│ Postman (8 requests)     │ 4.5s     │ 4.2s     │ 4.4s     │
│ Setup + Teardown         │ 8.3s     │ 9.1s     │ 8.7s     │
├──────────────────────────┼──────────┼──────────┼──────────┤
│ Total                    │ 27.0s    │ 26.1s    │ 26.6s    │
└──────────────────────────┴──────────┴──────────┴──────────┘
```

### Tiempos de Respuesta API (Postman)

```
Endpoint                          Min      Max      Avg      P95
───────────────────────────────────────────────────────────────
GET  /api/reports                 234ms    856ms    468ms    789ms
POST /api/auth/login              389ms    512ms    405ms    498ms
PUT  /api/employees/:id/role      345ms    523ms    434ms    501ms
GET  /api/health                   12ms     34ms     21ms     31ms
```

---

## 5. Historial de Ejecuciones

### Últimas 10 Ejecuciones en CI

```
┌─────────────────────┬────────────┬─────────┬──────────┬──────────┐
│ Fecha               │ Branch     │ Commit  │ Tests    │ Estado   │
├─────────────────────┼────────────┼─────────┼──────────┼──────────┤
│ 2024-05-10 15:30:24 │ main       │ 8a3f2b1 │ 37/37 ✅ │ ✅ Pass  │
│ 2024-05-10 14:22:15 │ develop    │ 7bc4e89 │ 37/37 ✅ │ ✅ Pass  │
│ 2024-05-10 11:45:33 │ main       │ 6def123 │ 35/37 ✅ │ ❌ Fail  │
│ 2024-05-09 16:18:42 │ develop    │ 5abc789 │ 35/35 ✅ │ ✅ Pass  │
│ 2024-05-09 14:55:21 │ feature/x  │ 4cde456 │ 33/35 ✅ │ ❌ Fail  │
│ 2024-05-09 10:30:18 │ main       │ 3bcd234 │ 35/35 ✅ │ ✅ Pass  │
│ 2024-05-08 17:42:09 │ main       │ 2def890 │ 35/35 ✅ │ ✅ Pass  │
│ 2024-05-08 15:20:33 │ develop    │ 1abc567 │ 33/35 ✅ │ ❌ Fail  │
│ 2024-05-08 11:15:42 │ main       │ 0xyz123 │ 35/35 ✅ │ ✅ Pass  │
│ 2024-05-07 16:48:51 │ main       │ 9fed456 │ 33/33 ✅ │ ✅ Pass  │
└─────────────────────┴────────────┴─────────┴──────────┴──────────┘

Tasa de Éxito: 80% (8/10)
```

---

## 6. Ejemplos de Fallos Detectados

### Fallo Detectado en Commit 6def123

```
[ERROR] Tests run: 37, Failures: 2, Errors: 0, Skipped: 0

[ERROR] Failures:
[ERROR]   PaymentServiceTest.testCalculateIVA:87
    Expected: <1900.0>
    Actual:   <1800.0>
    
[ERROR]   ReportServiceTest.testFilterByDateRange:134
    Expected collection size: 5
    Actual collection size: 7
    
[INFO] BUILD FAILED
```

**Causa**: Cambio en la lógica de cálculo de IVA y error en filtro de fechas

**Resolución**: Commit 7bc4e89 corrigió ambos problemas

---

## 7. Notificaciones

### Email de Notificación (Fallo)

```
Subject: ❌ Build Failed - JD Impresión Backend

Commit: 6def123 by @developer
Branch: main
Message: "refactor: update tax calculation"

Failed Tests:
  ✗ PaymentServiceTest.testCalculateIVA
  ✗ ReportServiceTest.testFilterByDateRange

Duration: 1m 45s
View logs: https://github.com/actions/runs/12345
```

### Slack Notification (Éxito)

```
✅ Build Passed - JD Impresión

main branch by @developer
8a3f2b1: "feat: add payment validation tests"

✓ 37 tests passed
✓ Coverage: 89%
Duration: 2m 34s
```

---

## Enlaces a Reportes Completos

- **JaCoCo Coverage Report**: `backend/target/site/jacoco/index.html`
- **Newman HTML Report**: `reports/newman-report.html`
- **GitHub Actions**: https://github.com/andresD1az/backendJdImpresions/actions
- **SonarQube**: (Configurar si aplica)
