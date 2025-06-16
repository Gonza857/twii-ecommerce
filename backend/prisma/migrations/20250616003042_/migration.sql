-- CreateTable
CREATE TABLE "producto" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "clasificacion" VARCHAR(50) NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "imagen" VARCHAR(255),

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol" (
    "id" INTEGER NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "direccion" VARCHAR(255),
    "apellido" VARCHAR(100) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "rolid" INTEGER NOT NULL,
    "validado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrito" (
    "id" SERIAL NOT NULL,
    "usuarioid" INTEGER NOT NULL,

    CONSTRAINT "carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrito_producto" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "carritoid" INTEGER NOT NULL,
    "productoid" INTEGER NOT NULL,

    CONSTRAINT "carrito_producto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rol_nombre_key" ON "rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "fk_rol_usuario" FOREIGN KEY ("rolid") REFERENCES "rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carrito_producto" ADD CONSTRAINT "fk_carrito_carrito_producto" FOREIGN KEY ("carritoid") REFERENCES "carrito"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carrito_producto" ADD CONSTRAINT "fk_producto_carrito_producto" FOREIGN KEY ("productoid") REFERENCES "producto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
