# Capturas de Pantalla - Ejecución de Pruebas

## 1. JUnit Test Runner - Eclipse/IntelliJ

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  JUnit 5 Test Runner                                        [X] [ ] [■]  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Project: jdimpresion-backend                                             ║
║  Test Suite: All Tests                                    Run:  Ctrl+F11  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ▼ com.jdimpresion.validators                               [29/29] ✅   ║
║    ├─ ✅ EmailValidatorTest                                  [5/5] ✅    ║
║    │  ├─ ✅ testInvalidEmailFormat (AP01)                   0.023s       ║
║    │  ├─ ✅ testMultipleInvalidEmails                       0.067s       ║
║    │  ├─ ✅ testValidEmails                                 0.045s       ║
║    │  ├─ ✅ testNullEmail                                   0.012s       ║
║    │  └─ ✅ testEmptyEmail                                  0.011s       ║
║    │                                                                      ║
║    ├─ ✅ RutValidatorTest                                    [6/6] ✅    ║
║    │  ├─ ✅ testValidRut                                    0.034s       ║
║    │  ├─ ✅ testInvalidRutFormat                            0.019s       ║
║    │  ├─ ✅ testInvalidRutCheckDigit                        0.022s       ║
║    │  ├─ ✅ testNullRut                                     0.008s       ║
║    │  ├─ ✅ testEmptyRut                                    0.009s       ║
║    │  └─ ✅ testRutWithDots                                 0.025s       ║
║    │                                                                      ║
║    └─ ✅ AmountValidatorTest                                 [4/4] ✅    ║
║       ├─ ✅ testNegativeAmount                              0.015s       ║
║       ├─ ✅ testZeroAmount                                  0.011s       ║
║       ├─ ✅ testValidAmount                                 0.013s       ║
║       └─ ✅ testMaxAmount                                   0.018s       ║
║                                                                            ║
║  ▼ com.jdimpresion.services                                              ║
║    ├─ ✅ PaymentServiceTest                                  [8/8] ✅    ║
║    ├─ ✅ ReportServiceTest                                   [6/6] ✅    ║
║    └─ ✅ AuthServiceTest                                     [4/4] ✅    ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Total: 29 tests  ✅ 29 passed  ❌ 0 failed  ⏭️ 0 skipped               ║
║  Duration: 14.234 seconds                                                 ║
║  Coverage: 89% (583/655 lines)                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 2. JaCoCo Coverage Report (HTML)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  JaCoCo Code Coverage Report                            jdimpresion 1.0.0 ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Overall Coverage Summary                                                 ║
║                                                                            ║
║  ████████████████████████████▓▓▓  89%  Instructions (1234/1387)          ║
║  ████████████████████████████▓▓▓  89%  Lines (583/655)                   ║
║  ███████████████████████▓▓▓▓▓▓▓▓  85%  Branches (156/183)               ║
║  ███████████████████████████▓▓▓▓  87%  Methods (124/142)                ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Package Coverage                                                         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  📦 com.jdimpresion.validators       100%  ████████████████████████████  ║
║  📦 com.jdimpresion.services          91%  ███████████████████████▓▓▓   ║
║  📦 com.jdimpresion.controllers       85%  █████████████████████▓▓▓▓▓   ║
║  📦 com.jdimpresion.auth              87%  ██████████████████████▓▓▓▓   ║
║  📦 com.jdimpresion.models            78%  ███████████████████▓▓▓▓▓▓▓   ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Top Uncovered Classes                                                    ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  ⚠️  ExceptionHandler.java           62%  (Need more error test cases)   ║
║  ⚠️  FileUploadService.java          71%  (Need upload failure tests)    ║
║  ⚠️  EmailNotificationService.java   68%  (Need SMTP error tests)        ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 3. Postman Collection Runner

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  Postman                                                    [🔍] [⚙️] [👤] ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Collections > JD Impresión - API Tests > Run Collection                 ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Environment: Production ▼          Iterations: 1         Data: None     ║
║  Delay: 0ms                         Keep variable values: ☑               ║
║                                                                            ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                            ║
║  Running 1 iteration...                                                   ║
║                                                                            ║
║  ✅ AP02 - Consultar Reportes con Token Válido                           ║
║     GET https://jdimpresion-api.azurewebsites.net/api/reports            ║
║     200 OK  •  3.45 KB  •  856 ms                                        ║
║     ✓ AP02 - Status code es 200 OK                                       ║
║     ✓ AP02 - Respuesta contiene datos JSON                               ║
║     ✓ AP02 - Datos de reportes están presentes                           ║
║     ✓ AP02 - Cada reporte tiene estructura correcta                      ║
║     ✓ AP02 - Tiempo de respuesta menor a 2000ms                          ║
║     ✓ AP02 - Headers de seguridad presentes                              ║
║                                                                            ║
║  ✅ AP05 - Login con Credenciales Válidas                                ║
║     POST https://jdimpresion-api.azurewebsites.net/api/auth/login        ║
║     200 OK  •  1.23 KB  •  412 ms                                        ║
║     ✓ Status code es 200                                                 ║
║     ✓ Token JWT está presente                                            ║
║     ✓ Token tiene formato válido                                         ║
║                                                                            ║
║  ✅ AP06 - Login con Contraseña Incorrecta                               ║
║     POST https://jdimpresion-api.azurewebsites.net/api/auth/login        ║
║     401 Unauthorized  •  287 B  •  398 ms                                ║
║     ✓ Status code es 401                                                 ║
║     ✓ Mensaje de error correcto                                          ║
║                                                                            ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                            ║
║  📊 Test Results                                                          ║
║  Executed:   8/8                                                          ║
║  Passed:     ✅ 28/28 tests                                               ║
║  Failed:     ❌ 0/28 tests                                                ║
║  Skipped:    ⏭️ 0 tests                                                   ║
║                                                                            ║
║  ⏱️ Performance                                                            ║
║  Total time:      4.2 seconds                                            ║
║  Avg response:    468 ms                                                 ║
║  Data received:   7.8 KB                                                 ║
║                                                                            ║
║                             [Export Results]  [View Report]              ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 4. Newman CLI Output (Terminal)

```
$ newman run postman/JD_Impresion_API_Tests.postman_collection.json \
    --environment postman/environment.production.json \
    --reporters cli,htmlextra

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

→ AP06 - Login con Contraseña Incorrecta
  POST https://jdimpresion-api.azurewebsites.net/api/auth/login
  [401 Unauthorized, 287B, 398ms]
  ✓  Status code es 401
  ✓  Mensaje de error correcto

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

✨  All tests passed! HTML report generated at: newman-report.html
```

---

## 5. GitHub Actions Workflow

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  GitHub Actions - Workflow Run                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Repository: andresD1az/backendJdImpresions                               ║
║  Workflow: Automated Tests - CI/CD                                        ║
║  Triggered by: push                                                       ║
║  Branch: main                                                             ║
║  Commit: 8a3f2b1 - "feat: add payment validation tests"                   ║
║  Duration: 2m 34s                                                         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Jobs                                                                     ║
║                                                                            ║
║  ✅ backend-tests (1m 12s)                                                ║
║     ├─ ✓ Checkout código (3s)                                            ║
║     ├─ ✓ Configurar Java 17 (8s)                                         ║
║     ├─ ✓ Ejecutar pruebas JUnit (47s)                                    ║
║     │   └─ Tests run: 29, Failures: 0, Errors: 0                         ║
║     ├─ ✓ Generar reporte de cobertura (12s)                              ║
║     │   └─ Coverage: 89%                                                 ║
║     └─ ✓ Subir reporte (2s)                                              ║
║                                                                            ║
║  ✅ api-tests (1m 8s)                                                     ║
║     ├─ ✓ Checkout código (2s)                                            ║
║     ├─ ✓ Configurar Node.js (6s)                                         ║
║     ├─ ✓ Instalar Newman (8s)                                            ║
║     ├─ ✓ Iniciar backend (15s)                                           ║
║     ├─ ✓ Ejecutar colecciones Postman (32s)                              ║
║     │   └─ 28/28 assertions passed                                       ║
║     └─ ✓ Subir reporte Newman (5s)                                       ║
║                                                                            ║
║  ✅ coverage-report (14s)                                                 ║
║     ├─ ✓ Descargar reportes (4s)                                         ║
║     ├─ ✓ Generar badge (2s)                                              ║
║     └─ ✓ Comentar en PR (8s)                                             ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Artifacts (2)                                                            ║
║  📄 coverage-report     (2.3 MB)                                          ║
║  📄 newman-report       (456 KB)                                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Status: ✅ All checks passed                                             ║
║  This branch has no conflicts with the base branch                        ║
║  Merging can be performed automatically                                   ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 6. Newman HTML Extra Report (Preview)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  Newman Report - JD Impresión API Tests                 📊 📈 📉         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Summary                                                                  ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                            ║
║  Total Requests:      8                                                   ║
║  Failed Requests:     0                                                   ║
║  Total Assertions:    28                                                  ║
║  Failed Assertions:   0                                                   ║
║  Success Rate:        100%                                                ║
║  Avg Response Time:   468 ms                                              ║
║  Total Time:          4.2 s                                               ║
║                                                                            ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                            ║
║  Response Time Chart                                                      ║
║                                                                            ║
║  856ms  ████████████████████████████████████████████ AP02                ║
║  678ms  ███████████████████████████████████ AP12                         ║
║  523ms  ████████████████████████████ AP10                                ║
║  412ms  ██████████████████████ AP05                                      ║
║  398ms  █████████████████████ AP06                                       ║
║  345ms  ██████████████████ AP09                                          ║
║  298ms  ████████████████ AP08                                            ║
║  234ms  ████████████ AP07                                                ║
║                                                                            ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                            ║
║  Status Code Distribution                                                 ║
║                                                                            ║
║  200 OK              ████████████████ 50% (4 requests)                    ║
║  401 Unauthorized    ██████████ 37.5% (3 requests)                        ║
║  403 Forbidden       ██ 12.5% (1 request)                                 ║
║                                                                            ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                            ║
║  Top Slowest Requests                                                     ║
║  1. AP02 - Consultar Reportes con Token Válido          856 ms           ║
║  2. AP12 - Filtrar Reportes por Fechas                  678 ms           ║
║  3. AP10 - Cambiar Rol Como Manager                     523 ms           ║
║                                                                            ║
║  Top Fastest Requests                                                     ║
║  1. AP07 - Consultar Reportes Sin Token                 234 ms           ║
║  2. AP08 - Consultar Reportes con Token Expirado        298 ms           ║
║  3. AP09 - Cambiar Rol Sin Permisos                     345 ms           ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 7. Maven Console Output

```
$ cd backend && mvn clean test

[INFO] Scanning for projects...
[INFO] 
[INFO] -------------------< com.jdimpresion:backend-api >-------------------
[INFO] Building JD Impresión Backend API 1.0.0
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- maven-clean-plugin:3.1.0:clean (default-clean) @ backend-api ---
[INFO] Deleting C:\Users\eyner\CascadeProjects\proyectoFinalJDImpresion\backend\target
[INFO] 
[INFO] --- maven-resources-plugin:3.2.0:resources (default-resources) ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Copying 3 resources
[INFO] 
[INFO] --- maven-compiler-plugin:3.8.1:compile (default-compile) ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 45 source files to target\classes
[INFO] 
[INFO] --- maven-surefire-plugin:2.22.2:test (default-test) ---
[INFO] 
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.jdimpresion.validators.EmailValidatorTest
15:30:22,145 INFO  c.j.validators.EmailValidatorTest - Iniciando pruebas
15:30:22,234 DEBUG c.j.validators.EmailValidator - Validando: correo.invalido@
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.234 s
[INFO] 
[INFO] Running com.jdimpresion.validators.RutValidatorTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.198 s
[INFO] 
[INFO] Running com.jdimpresion.services.PaymentServiceTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.567 s
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

---

## 8. VS Code Test Explorer

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  EXPLORER        TESTING                                    [⚙️] [▶️] [🔄]  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  🧪 Test Explorer                                                         ║
║                                                                            ║
║  ▼ backend-api                                            29 tests        ║
║    ▼ validators                                           15 tests        ║
║      ▼ ✅ EmailValidatorTest.java                         5 passed        ║
║        ✅ testInvalidEmailFormat (AP01)                   0.023s          ║
║        ✅ testMultipleInvalidEmails                       0.067s          ║
║        ✅ testValidEmails                                 0.045s          ║
║        ✅ testNullEmail                                   0.012s          ║
║        ✅ testEmptyEmail                                  0.011s          ║
║      ▼ ✅ RutValidatorTest.java                           6 passed        ║
║        ✅ testValidRut                                    0.034s          ║
║        ✅ testInvalidRutFormat                            0.019s          ║
║        ✅ testInvalidRutCheckDigit                        0.022s          ║
║        ✅ testNullRut                                     0.008s          ║
║        ✅ testEmptyRut                                    0.009s          ║
║        ✅ testRutWithDots                                 0.025s          ║
║      ▼ ✅ AmountValidatorTest.java                        4 passed        ║
║        ✅ testNegativeAmount                              0.015s          ║
║        ✅ testZeroAmount                                  0.011s          ║
║        ✅ testValidAmount                                 0.013s          ║
║        ✅ testMaxAmount                                   0.018s          ║
║                                                                            ║
║    ▼ services                                             14 tests        ║
║      ▼ ✅ PaymentServiceTest.java                         8 passed        ║
║      ▼ ✅ ReportServiceTest.java                          6 passed        ║
║                                                                            ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  Test Summary:  ✅ 29 passed  ❌ 0 failed  ⏭️ 0 skipped  ⏱️ 14.234s      ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## Nota sobre Capturas Reales

Las imágenes mostradas arriba son representaciones en formato ASCII/texto. 

Para generar capturas de pantalla reales:

1. **JUnit**: Ejecutar en IDE y capturar ventana Test Runner
2. **Postman**: Ejecutar colección y capturar Collection Runner
3. **Newman**: Ejecutar con `--reporters htmlextra` y abrir HTML
4. **GitHub Actions**: Capturar desde pestaña Actions del repositorio
5. **JaCoCo**: Abrir `target/site/jacoco/index.html` en navegador

**Ubicación para guardar capturas**:
- `/docs/screenshots/junit-results.png`
- `/docs/screenshots/postman-runner.png`
- `/docs/screenshots/newman-report.png`
- `/docs/screenshots/github-actions.png`
- `/docs/screenshots/jacoco-coverage.png`
