import type { Pedido } from "../../entities/pedido"
import type { CarritoItemDTO } from "../../DTO/carrito-item.dto" 

export interface IPedidoService {
  crearPedido(usuarioId: number, itemsCarrito: CarritoItemDTO[]): Promise<Pedido>
  obtenerPedidosPorUsuario(usuarioId: number): Promise<Pedido[]>
  obtenerTodosLosPedidos(): Promise<Pedido[]>
  actualizarEstadoPedido(orderId: number, status: string): Promise<void>
}
