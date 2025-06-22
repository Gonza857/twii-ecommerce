import type { Pedido } from "../entities/pedido"

export interface IPedidoRepository {
  obtenerPorUsuario(usuarioId: number): Promise<Pedido[]>
  obtenerPorId(id: number): Promise<Pedido | null>
  crear(pedido: Omit<Pedido, "id" | "fecha">): Promise<number>
  actualizarEstado(id: number, estado: string): Promise<void>
}
