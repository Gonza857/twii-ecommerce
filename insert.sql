INSERT INTO rol (id, nombre) VALUES
(1, 'Administrador'),
(2, 'Cliente'),

INSERT INTO clasificacion (nombre) VALUES ('Bebidas'),('Limpieza'),('Almacen'), ('Suplementos')

INSERT INTO producto (nombre, descripcion, "idClasificacion", precio, imagen) VALUES
('Coca-Cola 1.5L', 'Bebida gaseosa clásica', 1, 850.00, 'http://localhost:3000/uploads/productos/producto-1.jpg'),
('Jugo de naranja 1L', 'Jugo natural sin azúcar', 1, 640.49, 'http://localhost:3000/uploads/productos/producto-3.jpg'),
('Fideos spaghetti 500g', 'Pasta seca de trigo', 3, 370.00, 'http://localhost:3000/uploads/productos/producto-10.jpg'),
('Arroz largo fino 1kg', 'Arroz blanco para guarniciones', 3, 410.00, 'http://localhost:3000/uploads/productos/producto-9.jpg'),
('Agua mineral 2L', 'Agua sin gas', 1, 500.00, 'http://localhost:3000/uploads/productos/producto-2.jpg'),
('Ena Whey Protein True Made Vainilla x 930 g', 'Proporciona un gran apoyo en la nutrición de quienes quieren aumentar la masa muscular y mejorar la recuperación. Gran apoyo en la nutrición del deportista. Proteína instantánea de máxima calidad. Nueva formula mejorada. Ideal para cuando estás buscando aumentar músculo, reponer nutrientes después de una sesión de ejercicios y mejorar tu performance. Aporta los nueve aminoácidos esenciales para una mejor definición muscular.', 4, 52900.00, 'http://localhost:3000/uploads/productos/producto-19.webp'),
('Yerba mate 1kg', 'Yerba tradicional sin palo', 3, 890.00, 'http://localhost:3000/uploads/productos/producto-8.webp'),
('Harina 000 1kg', 'Harina de trigo para todo uso', 3, 320.00, 'http://localhost:3000/uploads/productos/producto-7.webp'),
('Jabón en polvo 800g', 'Para lavar ropa', 2, 980.00, 'http://localhost:3000/uploads/productos/producto-6.webp'),
('Detergente 500ml', 'Para lavar vajilla', 2, 390.00, 'http://localhost:3000/uploads/productos/producto-5.png'),
('Lavandina 1L', 'Desinfectante multiuso', 2, 450.00, 'http://localhost:3000/uploads/productos/producto-4.webp');

-- Usuario normal
INSERT INTO usuario (direccion, apellido, nombre, email, contrasena, validado, rolId) VALUES
('Calle Falsa 123', 'Pérez', 'Juan', 'juan.perez@email.com',
'$2b$10$HtdF6.2f2pkukKfY9yD6JOrFHyAv8sLxVGeGjsCtvihx3dTnU0EE2', 1, 2);

-- Usuario de admin
INSERT INTO usuario (direccion, apellido, nombre, email, contrasena, validado, rolId) VALUES
('Testing 456', 'Test', 'Usuario', 'test@test.com',
'$2b$10$yoi8KM3EYae26EkSAH2DWeCSMk6Ar1VLTuYbvyR6pMXV8pB5UTz.G', 1, 1);
