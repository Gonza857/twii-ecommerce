import Decimal from "decimal.js";
import { Clasificacion } from "../producto.service";

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
  clasificacion: Clasificacion;
  // @ts-ignore
  precio: Decimal;
}

export interface ProductoFormulario extends ProductoBase, ImagenProductoFormulario {
  cambioImagen: boolean;
}

export interface Producto extends ProductoBase, ImagenProducto, IdProducto {

}

export interface EstadisticasProductos {
  productosTotales: number,
}



