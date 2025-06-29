import {PedidoProducto} from './pedido.interface';

export interface PedidoRest {
  id: number
  usuarioid: number
  fecha: Date | null
  estado: string
  total: number
  pedido_productos: PedidoProductoRest[]
  usuario?: {
    id: number
    nombre: string
    apellido: string
    email: string
  }
}

export interface PedidoProductoRest {
  id: number
  cantidad: number
  preciounitario: string
  pedidoid: number
  productoid: number
  producto?: {
    id: number
    nombre: string
    imagen: string | null
  }
}

