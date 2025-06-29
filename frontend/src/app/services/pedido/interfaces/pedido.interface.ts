import Decimal from "decimal.js";

export interface Pedido {
  id: number
  usuarioid: number
  fecha: Date | null
  estado: string
  total: number
  pedido_productos: PedidoProducto[]
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
  //@ts-ignore
  precioUnitario: Decimal
  pedidoid: number
  productoid: number
  producto?: {
    id: number
    nombre: string
    imagen: string | null
  }
}
