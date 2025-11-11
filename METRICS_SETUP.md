# Métricas y Telemetría - Configuración Completa

## ✅ Cambios Aplicados

### Backend (Node.js + Application Insights)

#### 1. Archivos Creados/Modificados
- **`backend/src/telemetry.js`** (NUEVO): SDK de Application Insights con funciones helper
- **`backend/src/index.js`**: Inicializa telemetría al arrancar
- **`backend/src/routes/auth.js`**: Eventos personalizados en login, unlock, role_change
- **`backend/package.json`**: Agregada dependencia `applicationinsights@^2.9.5`

#### 2. Endpoint /health Mejorado
- Ahora incluye: `version`, `uptime`, `env`, `db` status
- Retorna HTTP 503 si DB falla (antes siempre 200)
- URL: `https://jdimpresion-api.azurewebsites.net/health`

#### 3. Variables de Entorno Configuradas en Azure
✅ Ya agregadas en Azure App Service:
- `APPINSIGHTS_CONNECTION_STRING`: Connection string de Application Insights
- `APPLICATIONINSIGHTS_ROLE_NAME`: `jdimpresion-api`

#### 4. Telemetría Capturada Automáticamente
- ✅ HTTP requests/responses (duración, status codes)
- ✅ Excepciones no capturadas
- ✅ Dependencias (Postgres queries, HTTP calls)
- ✅ Logs de consola estructurados

#### 5. Eventos Personalizados
- `user_login`: cuando un usuario inicia sesión (userId, role, email)
- `session_unlock`: cuando se desbloquea una sesión (userId, sessionId)
- `employee_role_change`: cuando un manager cambia el rol de un empleado (managerId, employeeId, fromRole, toRole)

---

### Frontend (React + Application Insights Web SDK)

#### 1. Archivos Creados/Modificados
- **`frontend/src/telemetry.js`** (NUEVO): SDK Web de Application Insights + Web Vitals
- **`frontend/src/main.jsx`**: Inicializa telemetría al cargar la app
- **`frontend/src/context/AuthContext.jsx`**: Tracking de login/logout, contexto de usuario autenticado
- **`frontend/src/pages/AdminEmployees.jsx`**: Tracking de cambios de rol
- **`frontend/package.json`**: Agregadas dependencias `@microsoft/applicationinsights-web@^3.0.5` y `web-vitals@^3.5.0`

#### 2. Variables de Entorno Requeridas en AWS Amplify
⚠️ **PENDIENTE - Debes agregar en Amplify:**
- `VITE_APPINSIGHTS_CONNECTION_STRING`: El mismo connection string de Azure Application Insights (o uno separado si prefieres)

#### 3. Telemetría Capturada Automáticamente
- ✅ Page views y navegación SPA (react-router)
- ✅ Excepciones JavaScript no capturadas
- ✅ Errores de promesas rechazadas
- ✅ Llamadas AJAX/Fetch (correlacionadas con backend)
- ✅ Web Vitals (CLS, FID, LCP, FCP, TTFB)

#### 4. Eventos Personalizados
- `user_login_frontend`: login exitoso (role, email)
- `user_login_failed`: login fallido (email, error)
- `user_logout`: cuando el usuario cierra sesión
- `employee_role_change_frontend`: cambio de rol exitoso (employeeId, fromRole, toRole)
- `employee_role_change_failed`: cambio de rol fallido (employeeId, error)

---

## 🚨 Acciones Pendientes

### 1. Liberar Espacio en Disco (URGENTE)
Tu máquina local no tiene espacio para instalar dependencias:
```
npm error nospc ENOSPC: no space left on device
```

**Solución:**
- Limpia archivos temporales, caché de npm, node_modules viejos
- Ejecuta en backend: `npm install` (instalará `applicationinsights`)
- Ejecuta en frontend: `npm install` (instalará `@microsoft/applicationinsights-web` y `web-vitals`)

### 2. Agregar Variable en AWS Amplify
- Ve a AWS Amplify → tu app → Environment variables
- Agrega:
  - **Name**: `VITE_APPINSIGHTS_CONNECTION_STRING`
  - **Value**: `InstrumentationKey=e48e066e-bf06-4234-8c1d-4291aa9a77c7;IngestionEndpoint=https://canadacentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://canadacentral.livediagnostics.monitor.azure.com/;ApplicationId=8a3e55e2-a452-49b1-9b01-8080cb3c6feb`
- Guarda y redeploya el frontend

### 3. Commit y Push de Cambios
Una vez instaladas las dependencias:

**Backend:**
```bash
cd backend
git add .
git commit -m "feat: add Application Insights telemetry and enhanced /health endpoint"
git push origin main
```

**Frontend:**
```bash
cd frontend
git add .
git commit -m "feat: add Application Insights Web SDK and Web Vitals tracking"
git push origin main
```

### 4. Configurar Alertas en Azure (Opcional pero Recomendado)
En Azure Portal → Application Insights → Alertas:

**Alerta 1: Error Rate Alto**
- Métrica: `Failed requests`
- Condición: `> 2%` en los últimos 5 minutos
- Acción: Email/SMS a tu equipo

**Alerta 2: Latencia Alta**
- Métrica: `Server response time` (percentil 95)
- Condición: `> 1 segundo` en los últimos 10 minutos
- Acción: Email/SMS

**Alerta 3: Disponibilidad Caída**
- Crear prueba de disponibilidad (URL ping) a `/health`
- Frecuencia: cada 5 minutos
- Locaciones: 3-5 regiones
- Alerta si falla 2/5 comprobaciones

### 5. Crear Dashboard en Azure
En Application Insights → Workbooks o Dashboards:
- **Panel 1**: Solicitudes totales, tasa de error, p95 latencia
- **Panel 2**: Application Map (visualiza dependencias)
- **Panel 3**: Top 10 operaciones más lentas
- **Panel 4**: Excepciones recientes
- **Panel 5**: Usuarios activos (por rol)

---

## 📊 Cómo Ver las Métricas

### Backend (Azure Application Insights)
1. Azure Portal → busca "Application Insights"
2. Selecciona tu recurso (jdimpresion-api)
3. **Live Metrics**: ver solicitudes en tiempo real
4. **Failures**: ver errores y excepciones
5. **Performance**: ver duración de requests y dependencias
6. **Logs**: consultar con Kusto (KQL):
   ```kql
   customEvents
   | where name in ("user_login", "session_unlock", "employee_role_change")
   | order by timestamp desc
   | take 100
   ```

### Frontend (Azure Application Insights - mismo recurso o separado)
1. Application Insights → Browser (si usas el mismo recurso)
2. **Page Views**: ver navegación de usuarios
3. **Exceptions**: errores JavaScript
4. **Custom Events**: login, logout, role changes
5. **Performance**: Web Vitals (CLS, LCP, FID)

### Prometheus Metrics (Backend)
- URL: `https://jdimpresion-api.azurewebsites.net/metrics`
- Métricas disponibles:
  - `http_requests_total{method, route, status_code}`
  - `http_request_duration_seconds{method, route, status_code}`
  - Métricas de proceso Node.js (CPU, memoria, event loop)

---

## 🎯 Próximos Pasos (CI/CD con Métricas)

Una vez que las dependencias estén instaladas y todo funcione:

### Backend CI Workflow
- Cobertura de tests (Jest) como artifact
- ESLint SARIF upload a GitHub Code Scanning
- Deploy condicional (solo si tests pasan)

### Frontend CI Workflow
- Cobertura de tests (Vitest) como artifact
- Lighthouse CI para métricas de performance
- ESLint SARIF upload

### Badges en README
- Coverage badge (Codecov o shields.io)
- Build status badge (GitHub Actions)
- Deployment status badge (Azure/Amplify)

---

## 📝 Notas Importantes

1. **Connection String Seguro**: El connection string NO es un secreto crítico (no da acceso de escritura a recursos), pero es buena práctica no exponerlo públicamente.

2. **Costos**: Application Insights tiene un tier gratuito generoso (5 GB/mes). Con tu tráfico actual, no deberías excederlo.

3. **Retención**: Los datos se retienen por defecto 90 días. Puedes aumentarlo en configuración.

4. **Sampling**: Si el volumen de telemetría es muy alto, Application Insights hace sampling automático. Puedes ajustarlo en el SDK.

5. **Correlación**: Las solicitudes del frontend al backend se correlacionan automáticamente gracias a `enableCorsCorrelation: true`.

---

## ✅ Checklist Final

- [x] Backend: telemetría configurada en código
- [x] Backend: variables de entorno en Azure
- [x] Frontend: telemetría configurada en código
- [ ] Frontend: variable VITE_APPINSIGHTS_CONNECTION_STRING en Amplify
- [ ] Instalar dependencias (npm install) cuando haya espacio
- [ ] Commit y push de cambios
- [ ] Verificar telemetría en Azure Portal (Live Metrics)
- [ ] Configurar alertas (opcional)
- [ ] Crear dashboard (opcional)
- [ ] Prueba de disponibilidad en /health (opcional)

---

## 🆘 Soporte

Si algo no funciona:
1. Verifica que las variables de entorno estén correctas en Azure y Amplify
2. Revisa los logs de la app en Azure (App Service → Log stream)
3. Verifica que las dependencias se instalaron correctamente
4. Abre Live Metrics en Application Insights y haz una solicitud de prueba

**Estado actual**: Código listo, falta instalar dependencias y configurar variable en Amplify.
