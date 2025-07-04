CREATE TABLE usuario (
	id INT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	direccion VARCHAR(255),
	apellido VARCHAR(100) NOT NULL,
	nombre VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	contrasena VARCHAR(255) NOT NULL,
	rolId INT NOT NULL,
	CONSTRAINT fk_rol_usuario FOREIGN KEY (rolId) REFERENCES Rol(id)
);

ALTER TABLE usuario
ADD COLUMN validado BOOLEAN DEFAULT false;

CREATE TABLE rol (
	id INT NOT NULL PRIMARY KEY,
	nombre VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE pedido (
    id SERIAL PRIMARY KEY,
    usuarioid INTEGER NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    total DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_pedido_usuario FOREIGN KEY (usuarioid) REFERENCES usuario(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla pedido_producto (tabla intermedia)
CREATE TABLE pedido_producto (
    id SERIAL PRIMARY KEY,
    cantidad INTEGER NOT NULL,
    precioUnitario DECIMAL(10,2) NOT NULL,
    pedidoid INTEGER NOT NULL,
    productoid INTEGER NOT NULL,
    CONSTRAINT fk_pedido_pedido_producto FOREIGN KEY (pedidoid) REFERENCES pedido(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT fk_producto_pedido_producto FOREIGN KEY (productoid) REFERENCES producto(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);


CREATE TABLE clasificacion (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre VARCHAR(255) UNIQUE NOT NULL
);
ALTER TABLE producto
DROP COLUMN clasificacion;