import type { Decimal } from "@prisma/client/runtime/library"
import type { CarritoItemDTO } from "../DTO/carrito-item.dto"

export interface Pedido {
  id: number
  usuarioid: number
  fecha: Date
  estado: string
  total: Decimal
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
  precioUnitario: Decimal
  pedidoid: number
  productoid: number
  producto?: {
    id: number
    nombre: string
    imagen: string | null
  }
}

export interface PedidoCrearDTO {
  usuarioId: number
  items: CarritoItemDTO[]
}

export interface PedidoActualizarEstadoDTO {
  estado: string
}
