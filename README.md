# Interfer API

API REST para autenticación y gestión de empresas participantes en Interfer. Centraliza el alta, consulta y actualización de registros, protege los endpoints con JWT y permite exportar reportes en Excel.

## Objetivo

Resolver la administración operativa de empresas de forma segura, trazable y simple de consumir desde Postman o cualquier cliente HTTP.

## Características principales

- Autenticación basada en JWT.
- CRUD de empresas con filtros y ordenamiento.
- Exportación de reportes `.xlsx`.
- Validación de entrada y manejo centralizado de errores.
- Rate limiting y cabeceras de seguridad con `helmet` y `cors`.
- Colección de Postman incluida para pruebas rápidas.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Tokens
- ExcelJS
- Helmet
- CORS
- Morgan
- Express Validator

## Instalación y ejecución

1. Instala dependencias:
   ```bash
   pnpm install
   ```

2. Crea un archivo `.env` en la raíz:
   ```env
   NODE_ENV=development
   PORT=3005
   URI_MONGO=mongodb://127.0.0.1:27017/Interfer
   JWT_SECRET=your-super-secret-key
   ```

3. Ejecuta el proyecto:
   ```bash
   pnpm run dev
   ```

4. Para producción:
   ```bash
   pnpm start
   ```

## Estructura general del proyecto

```text
.
├── configs/              # Configuración de app, base de datos y seguridad
├── helpers/              # Utilidades reutilizables de negocio e infraestructura
├── middlewares/          # Validaciones, seguridad y manejo de errores
├── src/
│   ├── auth/             # Login y modelos de autenticación
│   ├── company/          # Rutas, controladores y modelo de empresas
│   └── reports/          # Generación de reportes Excel
├── utils/                # Funciones auxiliares de cifrado y sesión
└── Interfer_API_Postman_Collection.json
```

## Buenas prácticas implementadas

- Separación por capas y responsabilidades.
- Validación explícita de datos de entrada.
- Protección de rutas con middleware de autenticación.
- Respuestas consistentes para errores comunes.
- Configuración externalizada mediante variables de entorno.
- Generación de archivos con una ruta controlada y nombres únicos.

## Futuras mejoras

- Añadir pruebas automatizadas de integración y contrato.
- Documentar la API con OpenAPI/Swagger.
- Incorporar paginación y búsqueda avanzada en listados.
- Agregar auditoría de cambios y logs estructurados.
- Consolidar módulos heredados o no utilizados para reducir deuda técnica.

## Conclusión

Interfer API es una base sólida para una solución real de administración de empresas, con foco en seguridad, claridad y facilidad de mantenimiento.
