export interface Carrito {
  productos: CarritoProducto[]
  total: number
}

export interface CarritoProducto {
  id: number
  cantidad: number
  carritoid: number
  productoid: number
  producto: {
    id: number
    nombre: string
    descripcion: string
    clasificacion: number
    precio: number | string
    imagen: string | null
  }
}
