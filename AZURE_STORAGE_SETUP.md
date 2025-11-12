# 🚀 Guía de Configuración - Azure Storage para JD Impressions

## ✅ Estado Actual

Ya tienes configurado:
- ✅ Cuenta de Azure Storage: `jdimpressions2025storage`
- ✅ Contenedor: `product-images`
- ✅ Variables de entorno en Azure App Service
- ✅ Código del backend completamente implementado

## 📝 Pasos para Completar la Configuración

### 1. Instalar Dependencias del Backend

Abre PowerShell y ejecuta:

```powershell
cd c:\Users\eyner\CascadeProjects\proyectoFinalJDImpresion\backend
npm install
```

Esto instalará todas las dependencias necesarias incluyendo:
- `@azure/storage-blob` - SDK de Azure Storage
- `multer` - Para manejo de archivos
- `express`, `cors`, `helmet` - Framework web y seguridad
- TypeScript y tipos necesarios

### 2. Configurar Variables de Entorno Locales

Tu archivo `.env` en el backend ya debe estar configurado con las variables de Azure según las imágenes que mostraste. Verifica que contenga:

```env
# Azure Storage
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=jdimpressions2025storage;AccountKey=YOUR_AZURE_KEY_HERE;EndpointSuffix=core.windows.net"
AZURE_STORAGE_CONTAINER_NAME="product-images"

# Otras variables necesarias
JWT_SECRET="tu_secreto_jwt"
JWT_REFRESH_SECRET="tu_secreto_refresh"
APP_PORT="4000"
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
DATABASE_URL="tu_database_url"
```

**⚠️ IMPORTANTE:** Usa tu clave de Azure (key1 o key2) que tienes configurada en Azure Portal → Storage Account → Access Keys.

### 3. Verificar Permisos del Contenedor en Azure

En Azure Portal, asegúrate de que el contenedor `product-images` tenga:

1. **Nivel de acceso público:** `Blob (anonymous read access for blobs only)`
   - Esto permite que las URLs de las imágenes sean accesibles públicamente
   
2. Para configurarlo:
   - Ve a Azure Portal → Storage Account → Containers
   - Selecciona `product-images`
   - Click en "Change access level"
   - Selecciona "Blob"

### 4. Probar el Backend Localmente

```powershell
# Modo desarrollo (con hot-reload)
npm run dev

# O compilar y ejecutar
npm run build
npm start
```

Deberías ver:
```
🚀 Server is running on port 4000
📦 Environment: development
☁️  Azure Storage Container: product-images
🔐 CORS Origin: http://localhost:5173
```

### 5. Probar la Subida de Imágenes

El endpoint está protegido con autenticación JWT. Para probar:

1. Asegúrate de tener un token JWT válido (inicia sesión desde el frontend)
2. El frontend ya está configurado para usar el endpoint correcto: `/manager/uploads`
3. Ve al editor de productos y prueba subir una imagen

### 6. Configurar CORS (Si es necesario)

Si tu frontend está en un dominio diferente, configura CORS en Azure Storage:

En Azure Portal:
1. Ve a tu Storage Account
2. Settings → Resource sharing (CORS)
3. Blob service → Add:
   - **Allowed origins:** `*` (o tu dominio específico)
   - **Allowed methods:** `GET, POST, PUT, DELETE, OPTIONS`
   - **Allowed headers:** `*`
   - **Exposed headers:** `*`
   - **Max age:** `3600`

## 🧪 Prueba de Integración

### Desde el Frontend

1. Inicia sesión como administrador
2. Ve a "Productos" → "Nuevo Producto" o edita uno existente
3. En la pestaña "Imágenes":
   - Sube una imagen principal
   - Sube imágenes para la galería
4. Verifica que las imágenes se muestren correctamente
5. Las URLs deberían ser del formato:
   ```
   https://jdimpressions2025storage.blob.core.windows.net/product-images/1234567890-abc123.jpg
   ```

### Verificar en Azure Portal

1. Ve a Azure Portal → Storage Account → Containers → product-images
2. Deberías ver los archivos subidos
3. Click en un archivo para ver sus propiedades y URL

## 📁 Estructura de Archivos Creados

```
backend/
├── src/
│   ├── config/
│   │   └── index.ts              # Configuración centralizada
│   ├── lib/
│   │   └── azureStorage.ts       # Funciones de Azure Storage
│   ├── middleware/
│   │   ├── auth.ts               # Autenticación JWT
│   │   └── upload.ts             # Configuración de Multer
│   ├── modules/
│   │   └── uploads/
│   │       ├── controller.ts     # Lógica de subida
│   │       └── router.ts         # Rutas de uploads
│   ├── app.ts                    # Configuración de Express
│   └── server.ts                 # Punto de entrada
├── .env                          # Variables de entorno (ya configurado)
├── .env.example                  # Plantilla de variables
├── package.json                  # Dependencias
├── tsconfig.json                 # Configuración TypeScript
└── README.md                     # Documentación
```

## 🔍 Detalles Técnicos

### Cómo Funciona la Integración

1. **Cliente (Frontend):**
   - Selecciona una imagen
   - Envía POST a `/manager/uploads` con FormData
   - Incluye token JWT en el header

2. **Backend:**
   - Valida autenticación (middleware `authMiddleware`)
   - Valida permisos (middleware `requireManager`)
   - Procesa archivo con Multer (middleware `upload`)
   - Genera nombre único para el archivo
   - Sube a Azure Blob Storage usando SDK
   - Retorna URL pública del archivo

3. **Azure Storage:**
   - Almacena el archivo en el contenedor
   - Genera URL pública accesible

### Flujo de Subida

```
[Frontend] → [Express] → [Auth MW] → [Multer MW] → [Controller]
                                                         ↓
                                                    [Azure SDK]
                                                         ↓
                                                   [Azure Storage]
                                                         ↓
                                                    [URL Pública]
```

## 🐛 Solución de Problemas

### Error: "AZURE_STORAGE_CONNECTION_STRING is not defined"
**Solución:** Verifica que el archivo `.env` existe en `backend/` y contiene la variable.

### Error: "Failed to upload file"
**Soluciones:**
1. Verifica la cadena de conexión
2. Confirma que el contenedor existe
3. Revisa los permisos del storage account

### Las imágenes no se muestran (403 Forbidden)
**Solución:** Cambia el nivel de acceso del contenedor a "Blob (anonymous read access)"

### Error de CORS
**Solución:** Configura CORS en Azure Storage (ver paso 6)

### Frontend no puede subir archivos
**Soluciones:**
1. Verifica que el backend esté corriendo
2. Confirma que el token JWT es válido
3. Revisa la consola del navegador para errores

## 📊 Monitoreo

Para monitorear el uso:
1. Azure Portal → Storage Account → Monitoring
2. Verifica:
   - Número de requests
   - Datos transferidos
   - Errores

## 💰 Consideraciones de Costo

- Azure Storage es económico pero revisa los precios
- Almacenamiento: ~$0.02 por GB/mes
- Transacciones: Primeros miles gratis
- Considera implementar cleanup de imágenes no usadas

## 🔐 Seguridad

### Recomendaciones Implementadas
✅ Autenticación JWT obligatoria
✅ Validación de tipo de archivo (solo imágenes)
✅ Límite de tamaño (10MB)
✅ Nombres de archivo únicos (previene colisiones)
✅ HTTPS obligatorio en producción

### Próximas Mejoras
- [ ] Implementar cleanup de imágenes huérfanas
- [ ] Agregar compresión de imágenes
- [ ] Implementar rate limiting específico para uploads
- [ ] Agregar watermarks automáticos

## 📞 Contacto

Si tienes problemas, revisa:
1. Los logs del backend (`console.log` en desarrollo)
2. La consola del navegador (errores de red)
3. Los logs de Azure Storage (Monitoring en Azure Portal)

---

**¡Listo!** Tu backend ahora está completamente configurado para almacenar imágenes en Azure Blob Storage. 🎉
