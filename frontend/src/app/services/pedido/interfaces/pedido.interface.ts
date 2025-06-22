import type Decimal from "decimal.js"

export interface Pedido {
  id: number
  usuarioid: number
  fecha: Date
  estado: string
  total: Decimal
  productos: PedidoProducto[]
}

export interface PedidoProducto {
  id: number
  cantidad: number
  precio_unitario: Decimal
  pedidoid: number
  productoid: number
  producto: {
    id: number
    nombre: string
    descripcion: string
    clasificacion: string
    precio: Decimal
    imagen: string | null
  }
}

export interface CrearPedidoRequest {
  usuarioId: number
  productos: Array<{
    productoid: number
    cantidad: number
    precio_unitario: number
  }>
}
