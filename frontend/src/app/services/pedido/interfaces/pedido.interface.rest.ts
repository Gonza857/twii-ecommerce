export interface PedidoRest {
  id: number
  usuarioid: number
  fecha: string
  estado: string
  total: string
  productos: PedidoProductoRest[]
}

export interface PedidoProductoRest {
  id: number
  cantidad: number
  precio_unitario: string
  pedidoid: number
  productoid: number
  producto: {
    id: number
    nombre: string
    descripcion: string
    clasificacion: string
    precio: string
    imagen: string | null
  }
}

export interface CrearPedidoRequestRest {
  usuarioId: number
  productos: Array<{
    productoid: number
    cantidad: number
    precio_unitario: number
  }>
}
