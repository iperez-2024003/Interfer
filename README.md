# Interfer API

API REST construida con **Node.js, Express y MongoDB** para la gestión de empresas participantes en la feria Interfer. Incluye un sistema de autenticación, gestión de empresas y generación de reportes en Excel.

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
- **Node.js** (v18 o superior recomendado)
- **pnpm** (Gestor de paquetes, puedes instalarlo con `npm install -g pnpm`)
- **MongoDB** (En ejecución localmente o una URI válida de MongoDB Atlas)

---

## 🛠️ Instalación y Configuración

1. **Clona el repositorio** o asegúrate de estar en el directorio raíz del proyecto (`c:\Interfer`).
2. **Instala las dependencias** ejecutando:
   ```bash
   pnpm install
   ```
3. **Configura las variables de entorno:**
   - Si no tienes un archivo `.env`, crea uno en la raíz basándote en un `.env.example` (si existe) o usando esta configuración básica (asegurándote de no exponer credenciales reales):
     ```env
     NODE_ENV=development
     PORT=3005
     URI_MONGO=mongodb://localhost:27017/Interfer
     JWT_SECRET=MyVerySecretKeyForJWTTokenAuthenticationWith256Bits!
     ```
   *(Asegúrate de que tu MongoDB local esté corriendo).*

---

## 🏃‍♂️ Ejecutar el Servidor

Para levantar el servidor en modo desarrollo (con auto-recarga gracias a `nodemon`), ejecuta:

```bash
pnpm run dev
```

Deberías ver un mensaje indicando:
> `✅ MongoDB connected successfully`
> `Interfer API Server running on port 3005`

---

## ⚡ Uso y Pruebas con Postman

El proyecto viene con una **Colección de Postman** lista para usar y probar todos los endpoints sin tener que configurarlos manualmente. 

### 1. Importar la Colección a Postman
- Abre **Postman**.
- Ve a **File -> Import** (o presiona `Ctrl + O`).
- Selecciona el archivo llamado `Interfer_API_Postman_Collection.json` que se encuentra en la raíz del proyecto.
- Haz clic en **Import**.

### 2. Flujo de Trabajo en Postman
Una vez importada la colección (**"Interfer API (Proyecto Postman)"**), sigue este orden:

1. **Auth -> Login Admin**
   - Ejecuta esta petición (`POST /auth/login`).
   - El cuerpo de la petición ya tiene las credenciales del administrador por defecto (`admin@interfer.com` / `Admin123!`).
   - *Magia de Postman:* Al ejecutar el login exitoso, Postman capturará el Token (JWT) automáticamente y lo guardará en una variable llamada `token`. ¡No tienes que copiar y pegar nada!

2. **Endpoints de Empresas**
   - Ahora puedes ir a la carpeta **Empresas** y ejecutar las peticiones como **Registrar Empresa**, **Ver Listado...** o **Actualizar**.
   - Todas estas peticiones ya usarán automáticamente el token generado en el paso 1.

3. **Reportes**
   - Ve a la carpeta **Reportes** y ejecutar **Generar Excel**.
   - Esto probará el endpoint que genera y descarga un archivo `.xlsx` con un reporte de las empresas.
   - Importante darle en Send and Download para que se descargue el archivo. 
   - Abrirlo en Excel para verificar los datos exactos
---

## 📚 Estructura de Endpoints Principales

Todos los endpoints usan el prefijo base `/api/v1`

- **Autenticación:**
  - `POST /auth/login` - Iniciar sesión como administrador.
- **Empresas (Req. Token):**
  - `POST /company` - Registrar nueva empresa.
  - `GET /company` - Ver listado (Soporta query params de filtrado y ordenamiento).
  - `PUT /company/:id` - Actualizar información de la empresa.
- **Reportes (Req. Token):**
  - `GET /reports/excel` - Generar reporte en formato Excel.