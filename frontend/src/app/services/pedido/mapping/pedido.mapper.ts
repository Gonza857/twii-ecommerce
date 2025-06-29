import {PedidoProductoRest, PedidoRest} from '../interfaces/pedido.interface.rest';
import {Pedido, PedidoProducto} from '../interfaces/pedido.interface';
import Decimal from "decimal.js"

class PedidoMapper {

    static mapToPedidosArray (pedidosRest: PedidoRest[]): Pedido[] {
      return pedidosRest.map((pedidoRest: PedidoRest) => PedidoMapper.mapToPedido(pedidoRest));
    }

    static mapToPedido (pedidoRest: PedidoRest): Pedido {
      return {
        id: pedidoRest.id,
        estado: pedidoRest.estado,
        total: pedidoRest.total,
        pedido_productos: pedidoRest.pedido_productos.map((p) => (PedidoMapper.mapToPedidoProducto(p))),
        fecha: new Date(pedidoRest?.fecha ?? new Date().toString()),
        usuario: pedidoRest.usuario,
        usuarioid: pedidoRest.usuarioid,

      }
    }

    static mapToPedidoProducto (pedidoProductoRest: PedidoProductoRest): PedidoProducto {
      return {
        id: pedidoProductoRest.id,
        producto: pedidoProductoRest.producto,
        cantidad: pedidoProductoRest.cantidad,
        pedidoid: pedidoProductoRest.pedidoid,
        precioUnitario: new Decimal(pedidoProductoRest?.preciounitario),
        productoid: pedidoProductoRest.productoid
      }
    }
}

export default PedidoMapper
