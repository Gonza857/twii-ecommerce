export interface Pedido {
  id: number
  usuarioid: number
  fecha: Date
  estado: string 
  total: number 
  pedido_productos?: PedidoProducto[]
  usuario?: {
    id: number
    nombre: string
    apellido: string
    email: string
  }
}

export interface PedidoProducto {
  id: number
  cantidad: number
  precioUnitario: number 
  pedidoid: number
  productoid: number
  producto?: {
    id: number
    nombre: string
    imagen: string | null
  }
}
