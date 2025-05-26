# Frontend

Proyecto demo e-commerce Full-Stack 
- Angular

## Iniciar servidor para Frontend

Para iniciar servidor local:

```bash
ng serve
```

Una vez el servidor este corriendo, abrí tu navegador y navega a `http://localhost:4200/`

## Partes del proyecto

### Admin

Gestión de productos
- Agregar
- Eliminar
- Actualizar
- Listar

### Cliente

- Ver productos y filtrar
- Agregar productos al carrito
- Realizar pedido
- Ver pedidos ?

## Entidades

- Usuario
  - Rol
    - Cliente
    - Admin
  - Email | UNIQUE
  - Contraseña
  - Nombre
  - Apellido
  - Dirección

- Producto
  - Nombre
  - Descripcion
  - Clasificación
  - Precio
  
- Pedido
  - ID usuario
  - Productos
    - Cantidad de unidades por producto
  
## Vistas principales

### Usuario

- Login
- Register
- Ver productos
- Carrito
- Resumen pedido
- Ver pedidos

### Admin
- Listar productos (Filtros ?)
- Editar
- Agregar

## Estructura de carpetas

- /src
  - /pages
    - /carrito
    - / 
    - /resumen-pedido
    - /pedido/:id
    - /login
    - /register
    - /admin
    - /admin/producto/editar/:id
    - /admin/producto/agregar
  - /shared -> componentes compartidos
  - /services -> servicios
  - /models -> tipos e interfaces TS
    - `product-model.ts`
