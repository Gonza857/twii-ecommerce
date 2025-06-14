# Backend

Proyecto demo e-commerce Full-Stack
- Node JS con Express
- Prisma
- PostgreSQL
- 

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
