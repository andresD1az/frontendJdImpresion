# 🎯 Instrucciones Finales - Configuración Azure Storage

## ✅ Lo que YA está Hecho

He creado completamente el backend con integración de Azure Storage:

### Archivos Creados

```
backend/
├── src/                              # Código fuente TypeScript
│   ├── config/index.ts              # Configuración
│   ├── lib/azureStorage.ts          # Integración Azure Storage ⭐
│   ├── middleware/
│   │   ├── auth.ts                  # Autenticación JWT
│   │   └── upload.ts                # Multer para archivos
│   ├── modules/uploads/
│   │   ├── controller.ts            # Lógica de subida ⭐
│   │   └── router.ts                # Rutas /manager/uploads ⭐
│   ├── app.ts                       # Aplicación Express
│   └── server.ts                    # Servidor principal
├── package.json                      # Dependencias
├── tsconfig.json                     # Config TypeScript
├── .env.example                      # Plantilla variables
├── .gitignore                        # Archivos a ignorar
├── README.md                         # Documentación técnica
├── QUICKSTART.md                     # Inicio rápido
├── RESUMEN_IMPLEMENTACION.md         # Resumen completo
└── INSTALL.ps1                       # Script instalación
```

### Características Implementadas

✅ **Azure Blob Storage**
  - Conexión con tu cuenta `jdimpressions2025storage`
  - Subida de archivos al contenedor `product-images`
  - Generación automática de URLs públicas
  - Nombres únicos para evitar colisiones

✅ **Seguridad**
  - Autenticación JWT obligatoria
  - Solo admin/manager pueden subir
  - Validación de archivos (solo imágenes)
  - Límite de 10MB por archivo

✅ **API Endpoints**
  - `POST /manager/uploads` - Subir imagen individual
  - `POST /manager/uploads/multiple` - Subir múltiples
  - `GET /health` - Health check

✅ **Frontend**
  - Ya estaba configurado correctamente
  - Usa el endpoint correcto: `/manager/uploads`
  - Envía token JWT
  - Maneja respuestas

---

## 🚀 LO QUE TIENES QUE HACER AHORA

### 📍 Paso 1: Instalar Dependencias (OBLIGATORIO)

Abre PowerShell en la raíz del proyecto y ejecuta:

```powershell
cd c:\Users\eyner\CascadeProjects\proyectoFinalJDImpresion\backend
npm install
```

Esto instalará:
- `@azure/storage-blob` - SDK de Azure Storage
- `multer` - Para manejo de archivos
- Express, TypeScript y todas las demás dependencias

**Tiempo estimado:** 2-3 minutos

---

### 📍 Paso 2: Verificar tu archivo .env

Tu archivo `.env` en `/backend` debe tener estas variables:

```env
# Azure Storage (REQUERIDO)
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=jdimpressions2025storage;AccountKey=YOUR_AZURE_KEY_HERE;EndpointSuffix=core.windows.net"
AZURE_STORAGE_CONTAINER_NAME="product-images"

# JWT (REQUERIDO)
JWT_SECRET="tu_secreto_aqui"
JWT_REFRESH_SECRET="tu_secreto_refresh_aqui"

# App
APP_PORT="4000"
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"

# Database
DATABASE_URL="tu_connection_string_aqui"
```

**Notas:**
- Reemplaza `YOUR_AZURE_KEY_HERE` con tu clave de Azure Portal
- Usa **key1** o **key2** (ambas funcionan)
- Las claves las encuentras en Azure Portal → Storage Account → Access Keys

---

### 📍 Paso 3: Configurar Acceso Público en Azure (CRÍTICO)

Ve a **Azure Portal**:

1. **Navega a tu Storage Account:**
   - Portal.azure.com
   - Busca "jdimpressions2025storage"

2. **Ve a Containers:**
   - En el menú izquierdo: Data storage → Containers
   - Click en `product-images`

3. **Configura Acceso Público:**
   - Click en "Change access level" (arriba)
   - Selecciona: **"Blob (anonymous read access for blobs only)"**
   - Click "OK"

**¿Por qué es importante?**
Sin acceso público, las URLs de las imágenes no funcionarán y verás error 403.

**Captura de pantalla:**
```
┌────────────────────────────────────┐
│ Change access level                │
├────────────────────────────────────┤
│ ○ Private (no anonymous access)    │
│ ● Blob (read access for blobs...)  │ ← Selecciona esto
│ ○ Container (read access for...)   │
└────────────────────────────────────┘
```

---

### 📍 Paso 4: Iniciar el Backend

En PowerShell, dentro de `/backend`:

```powershell
npm run dev
```

**Deberías ver:**
```
🚀 Server is running on port 4000
📦 Environment: development
☁️  Azure Storage Container: product-images
🔐 CORS Origin: http://localhost:5173
```

**Si ves este mensaje, ¡todo está funcionando!** ✅

---

### 📍 Paso 5: Probar la Subida de Imágenes

1. **Inicia tu frontend** (en otra terminal):
   ```powershell
   npm run dev
   ```

2. **Abre la aplicación** en tu navegador

3. **Inicia sesión** como administrador

4. **Ve a Productos:**
   - Click en "Productos" en el menú
   - Click en "Nuevo Producto" o edita uno existente

5. **Ve a la pestaña "Imágenes":**
   - Sube una imagen principal
   - Observa que se sube y se muestra

6. **Verifica la URL:**
   - Abre las DevTools del navegador (F12)
   - Ve a la consola/red
   - La URL debería ser algo como:
     ```
     https://jdimpressions2025storage.blob.core.windows.net/product-images/1731234567-abc123.jpg
     ```

---

### 📍 Paso 6: Verificar en Azure Portal (Opcional)

Para confirmar que las imágenes están en Azure:

1. Ve a Azure Portal
2. Storage Account → Containers → `product-images`
3. Deberías ver los archivos subidos con nombres únicos
4. Click en cualquier archivo para ver su URL

---

## ⚠️ Solución de Problemas

### Problema: `Cannot find module '@azure/storage-blob'`

**Solución:**
```powershell
cd backend
npm install
```

---

### Problema: `AZURE_STORAGE_CONNECTION_STRING is not defined`

**Solución:**
1. Verifica que el archivo `.env` existe en `/backend`
2. Verifica que contiene la línea `AZURE_STORAGE_CONNECTION_STRING="..."`
3. Reinicia el servidor

---

### Problema: Las imágenes no se muestran (Error 403)

**Solución:**
Configura el acceso público del contenedor:
1. Azure Portal → Storage Account → Containers
2. Click en `product-images`
3. "Change access level" → "Blob"

---

### Problema: `Failed to upload file`

**Posibles causas:**
1. **Conexión a Azure incorrecta:**
   - Verifica la cadena de conexión en `.env`
   - Usa la completa que incluye `DefaultEndpointsProtocol=https;...`

2. **Contenedor no existe:**
   - Ve a Azure Portal y verifica que `product-images` existe

3. **Token JWT inválido:**
   - Cierra sesión y vuelve a iniciar sesión
   - Verifica que el token no haya expirado

---

### Problema: CORS error

**Solución:**
Configura CORS en Azure Storage:
1. Azure Portal → Storage Account → Settings → CORS
2. Blob service → Add:
   - Allowed origins: `*`
   - Allowed methods: `GET, POST, PUT, DELETE, OPTIONS`
   - Allowed headers: `*`
   - Exposed headers: `*`
   - Max age: `3600`

---

## 📊 Arquitectura Final

```
┌─────────────────┐
│   React App     │  Usuario sube imagen
│   (Frontend)    │
└────────┬────────┘
         │ HTTP POST /manager/uploads
         │ FormData + JWT Token
         ↓
┌─────────────────┐
│   Express API   │  Valida JWT & permisos
│   (Backend)     │  Procesa con Multer
└────────┬────────┘
         │ Buffer de imagen
         ↓
┌─────────────────┐
│  Azure SDK      │  uploadToAzure()
│  (@azure/...)   │  Genera nombre único
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Azure Storage  │  Almacena imagen
│  Blob Storage   │  Retorna URL pública
└────────┬────────┘
         │
         ↓ URL pública
┌─────────────────┐
│   Frontend      │  Muestra la imagen
│   Guarda URL    │  en la base de datos
└─────────────────┘
```

---

## 📝 Checklist Final

Antes de probar, asegúrate:

- [ ] `npm install` ejecutado en `/backend` ✅
- [ ] Archivo `.env` configurado con credenciales Azure ✅
- [ ] Contenedor `product-images` existe en Azure ✅
- [ ] Acceso público configurado como "Blob" ✅
- [ ] Backend corriendo (`npm run dev`) ✅
- [ ] Frontend corriendo ✅
- [ ] Usuario admin/manager creado ✅

---

## 🎯 Comandos de Inicio Rápido

```powershell
# Terminal 1 - Backend
cd c:\Users\eyner\CascadeProjects\proyectoFinalJDImpresion\backend
npm install      # Solo la primera vez
npm run dev

# Terminal 2 - Frontend
cd c:\Users\eyner\CascadeProjects\proyectoFinalJDImpresion
npm run dev
```

---

## 📚 Documentación Adicional

- **`backend/README.md`** - Documentación técnica completa
- **`backend/QUICKSTART.md`** - Guía de inicio rápido
- **`backend/RESUMEN_IMPLEMENTACION.md`** - Resumen detallado
- **`AZURE_STORAGE_SETUP.md`** - Guía de Azure Storage

---

## 🎉 Resultado Final

Cuando todo funcione:

✅ Las imágenes se suben a Azure Storage
✅ Se generan URLs públicas como:
   `https://jdimpressions2025storage.blob.core.windows.net/product-images/...`
✅ El frontend muestra las imágenes correctamente
✅ Los productos guardan las URLs en la BD
✅ Las imágenes son accesibles desde cualquier lugar

---

## 🚀 ¿Listo?

**Ejecuta ahora:**

```powershell
cd backend
npm install
npm run dev
```

**¡Y prueba subir una imagen!** 🎨📸

---

## 💬 Si necesitas ayuda:

1. Revisa los logs del backend (terminal donde corre `npm run dev`)
2. Abre DevTools del navegador (F12) y ve a Console/Network
3. Verifica los logs de Azure en Azure Portal → Monitoring
4. Revisa la sección de **Solución de Problemas** arriba

---

**¡Todo está listo! Solo falta que ejecutes los comandos.** 🚀✨
