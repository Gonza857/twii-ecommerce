import type { Pedido } from "../entities/pedido"

export interface IPedidoService {
  obtenerPedidosPorUsuario(usuarioId: number): Promise<Pedido[]>
  obtenerPedidoPorId(id: number): Promise<Pedido | null>
  crearPedido(
    usuarioId: number,
    productos: Array<{ productoid: number; cantidad: number; precio_unitario: number }>,
  ): Promise<number>
  actualizarEstadoPedido(id: number, estado: string): Promise<void>
}
