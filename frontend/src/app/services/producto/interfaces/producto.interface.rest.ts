import { Clasificacion } from "../producto.service";

export interface ProductoRest {
  id: number;
  nombre: string;
  descripcion: string;
  clasificacion: Clasificacion;
  precio: string;
  imagen: string | null;
}

export interface ProductoActualizarRest {
  nombre: string;
  descripcion: string;
  clasificacion: Clasificacion;
  precio: string;
  imagen: string | null;
  cambioImagen: boolean;
}

export interface EstadisticasProductosRest {
  productosTotales: number,
}
