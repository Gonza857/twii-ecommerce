import Decimal from "decimal.js";

export interface ImagenProductoFormulario {
  imagen: File | null;
}

export interface IdProducto {
  id: number;
}

export interface ImagenProducto {
  imagen: string | null;
}

export interface ProductoBase {
  nombre: string;
  descripcion: string;
  clasificacion: string;
  // @ts-ignore
  precio: Decimal;
}

export interface ProductoFormulario extends ProductoBase, ImagenProductoFormulario {
  cambioImagen: boolean;
}

export interface Producto extends ProductoBase, ImagenProducto, IdProducto {

}


