import type { IPedidoService } from "../models/interfaces/pedido.service.interface"
import type { IPedidoRepository } from "../models/interfaces/pedido.repository.interface"
import type { Pedido } from "../models/entities/pedido"
import { Decimal } from "@prisma/client/runtime/library"

class PedidoService implements IPedidoService {
  private readonly pedidoRepository!: IPedidoRepository

  constructor(pedidoRepository: IPedidoRepository) {
    this.pedidoRepository = pedidoRepository
  }

  async obtenerPedidosPorUsuario(usuarioId: number): Promise<Pedido[]> {
    return await this.pedidoRepository.obtenerPorUsuario(usuarioId)
  }

  async obtenerPedidoPorId(id: number): Promise<Pedido | null> {
    return await this.pedidoRepository.obtenerPorId(id)
  }

  async crearPedido(
    usuarioId: number,
    productos: Array<{ productoid: number; cantidad: number; precio_unitario: number }>,
  ): Promise<number> {
    const total = productos.reduce((sum, p) => sum + p.cantidad * p.precio_unitario, 0)

    const pedido = {
      usuarioid: usuarioId,
      estado: "pendiente",
      total: new Decimal(total), // Convertir a Decimal
      productos: productos.map((p) => ({
        cantidad: p.cantidad,
        precio_unitario: new Decimal(p.precio_unitario), // Convertir a Decimal
        productoid: p.productoid,
        pedidoid: 0, // Se asignará automáticamente
        id: 0, // Se asignará automáticamente
        producto: {} as any, // No necesario para creación
      })),
    }

    return await this.pedidoRepository.crear(pedido)
  }

  async actualizarEstadoPedido(id: number, estado: string): Promise<void> {
    await this.pedidoRepository.actualizarEstado(id, estado)
  }
}

export default PedidoService

