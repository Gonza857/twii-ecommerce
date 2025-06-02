INSERT INTO rol (id, nombre) VALUES
(1, 'Administrador'),
(2, 'Cliente'),

-- Categoría: Bebidas
INSERT INTO producto (nombre, descripcion, clasificacion, precio) VALUES
('Coca-Cola 1.5L', 'Bebida gaseosa clásica', 'Bebidas', 850.00),
('Agua mineral 2L', 'Agua sin gas', 'Bebidas', 500.00),
('Jugo de naranja 1L', 'Jugo natural sin azúcar', 'Bebidas', 650.00);

-- Categoría: Limpieza
INSERT INTO producto (nombre, descripcion, clasificacion, precio) VALUES
('Lavandina 1L', 'Desinfectante multiuso', 'Limpieza', 450.00),
('Detergente 500ml', 'Para lavar vajilla', 'Limpieza', 390.00),
('Jabón en polvo 800g', 'Para lavar ropa', 'Limpieza', 980.00);

-- Categoría: Almacén
INSERT INTO producto (nombre, descripcion, clasificacion, precio) VALUES
('Harina 000 1kg', 'Harina de trigo para todo uso', 'Almacén', 320.00),
('Yerba mate 1kg', 'Yerba tradicional sin palo', 'Almacén', 890.00),
('Arroz largo fino 1kg', 'Arroz blanco para guarniciones', 'Almacén', 410.00),
('Fideos spaghetti 500g', 'Pasta seca de trigo', 'Almacén', 370.00);

-- Usuario normal
INSERT INTO usuario (direccion, apellido, nombre, email, contrasena, rolId) VALUES
('Calle Falsa 123', 'Pérez', 'Juan', 'juan.perez@email.com', '1234segura', 1);

-- Usuario de prueba/test
INSERT INTO usuario (direccion, apellido, nombre, email, contrasena, rolId) VALUES
('Testing 456', 'Test', 'Usuario', 'test@test.com', 'test', 2);

