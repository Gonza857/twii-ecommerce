export interface CarritoRest {
  productos: CarritoProductoRest[]
  total: number
}

export interface CarritoProductoRest {
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
