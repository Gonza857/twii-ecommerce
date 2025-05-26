# Backend

Proyecto demo e-commerce Full-Stack
- Node JS con Express
- Prisma
- PostgreSQL

## Iniciar servidor para Frontend

Para iniciar servidor local:

```bash
npm run dev
```

Una vez el servidor este corriendo, se escucharán las peticiones a `http://localhost:3000/`

## Partes del proyecto

### Config

Configuración de variables de entorno.

### Controllers

Controladores

### Models

Logíca del negocio

### Routes

Rutas de la aplicación
- `app.routes.ts` es el principal
- `productos.route.ts` es una ruta específica (subruta)
- `usuarios.route.ts` _sin desarrollar aún

### Server

Archivo de configuración del servidor Express
- Middlewares 
  - espress.json() | Parsear cuerpo de solicitudes a JSON
  - express.urlencoded({ extended: true }) | Parsear cuerpo de solicitudes HTTP
  - cors() | Permitir peticiones se dominios cruzados
  - this.routes() | Enrutado actual de la aplicación

### Types

Tipos e interfaces del backend

### Index.ts

Punto de entrada

### Prisma.ts

Configuración de Prisma (ORM)

## Generalidades

El backend usa el entorno de ejecución de Node JS. Usa como framework Express para el servidor.

Con nodemon hacemos que el server se reinicie cuando hacemos cambios.

Por su configuración transpila automaticamente el TS.

En la carpeta /dist se encuentra todo el código transpilado a JS.
Ejecutar el siguiente comando para pasar todo a JS. 
```bash
npx tsc
```