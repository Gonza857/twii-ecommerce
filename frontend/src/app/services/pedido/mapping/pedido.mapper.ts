import type { PedidoRest, PedidoProductoRest } from "../interfaces/pedido.interface.rest"
import type { Pedido, PedidoProducto } from "../interfaces/pedido.interface"
import Decimal from "decimal.js"

class PedidoMapper {
  static mapToPedido(pedidoRest: PedidoRest): Pedido {
    return {
      id: pedidoRest.id,
      usuarioid: pedidoRest.usuarioid,
      fecha: new Date(pedidoRest.fecha),
      estado: pedidoRest.estado,
      total: new Decimal(pedidoRest.total),
      productos: pedidoRest.productos.map(this.mapToPedidoProducto),
    }
  }

  static mapToPedidoProducto(pedidoProductoRest: PedidoProductoRest): PedidoProducto {
    return {
      id: pedidoProductoRest.id,
      cantidad: pedidoProductoRest.cantidad,
      precio_unitario: new Decimal(pedidoProductoRest.precio_unitario),
      pedidoid: pedidoProductoRest.pedidoid,
      productoid: pedidoProductoRest.productoid,
      producto: {
        id: pedidoProductoRest.producto.id,
        nombre: pedidoProductoRest.producto.nombre,
        descripcion: pedidoProductoRest.producto.descripcion,
        clasificacion: pedidoProductoRest.producto.clasificacion,
        precio: new Decimal(pedidoProductoRest.producto.precio),
        imagen: pedidoProductoRest.producto.imagen,
      },
    }
  }

  static mapToPedidoRest(pedido: Pedido): PedidoRest {
    return {
      id: pedido.id,
      usuarioid: pedido.usuarioid,
      fecha: pedido.fecha.toISOString(),
      estado: pedido.estado,
      total: pedido.total.toString(),
      productos: pedido.productos.map(this.mapToPedidoProductoRest),
    }
  }

  static mapToPedidoProductoRest(pedidoProducto: PedidoProducto): PedidoProductoRest {
    return {
      id: pedidoProducto.id,
      cantidad: pedidoProducto.cantidad,
      precio_unitario: pedidoProducto.precio_unitario.toString(),
      pedidoid: pedidoProducto.pedidoid,
      productoid: pedidoProducto.productoid,
      producto: {
        id: pedidoProducto.producto.id,
        nombre: pedidoProducto.producto.nombre,
        descripcion: pedidoProducto.producto.descripcion,
        clasificacion: pedidoProducto.producto.clasificacion,
        precio: pedidoProducto.producto.precio.toString(),
        imagen: pedidoProducto.producto.imagen,
      },
    }
  }
}

export default PedidoMapper
