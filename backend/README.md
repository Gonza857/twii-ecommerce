# Backend

Proyecto demo e-commerce Full-Stack
- Node JS con Express
- Prisma
- PostgreSQL


---

## ✅ Endpoints de autenticación

### POST /auth/login

**Descripción:** Inicia sesión con email y contraseña.

**Autenticación:** ❌ No requerida

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "123456"
}
```

---

### POST /auth/login

**Descripción:** Inicia sesión con email y contraseña.

**Autenticación:** ❌ No requerida

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "contrasena": "123456"
}
```

--- 

### POST /auth/register

**Descripción:** Registrarse.

**Autenticación:** ❌ No requerida

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "123456",
  "nombre": "Gonzalo",
  "apellido": "Ramos",
  "direccion": "Casa 123",
}
```

--- 

### POST /auth/recuperar

**Descripción:** Enviar correo electrónico para recuperar cuenta.

**Autenticación:** ❌ No requerida

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
}
```

--- 

### POST /auth/cambiar

**Descripción:** Cambiar contraseña.

**Autenticación:** ❌ No requerida

**Body:**
```json
{
  "token": "string jwt",
  "password": "nueva contrasena"
}
```


## Iniciar servidor para Backend

Para iniciar servidor local:

```bash
npm run dev
```

Una vez el servidor este corriendo, se escucharán las peticiones a `http://localhost:3000/`


## Transpilar .TS a .JS

En la carpeta /dist se encuentra todo el código transpilado a JS.
Ejecutar el siguiente comando para pasar todo a JS. 
```bash
npx tsc
```

## Prisma

Hacer pull de la BD
```bash
npx prisma db pull       
```

Generar archivo
```bash
npx prisma generate      
```