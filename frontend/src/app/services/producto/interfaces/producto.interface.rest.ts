export interface ProductoRest {
  id: number;
  nombre: string;
  descripcion: string;
  clasificacion: string;
  precio: string;
  imagen: string | null;
}

export interface ProductoActualizarRest {
  nombre: string;
  descripcion: string;
  clasificacion: string;
  precio: string;
  imagen: string | null;
  cambioImagen: boolean;
}

