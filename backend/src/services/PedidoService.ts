import type { IPedidoService } from "../models/interfaces/services/pedido.service.interface"
import type { IPedidoRepository } from "../models/interfaces/repositories/pedido.repository.interface"
import type { Pedido } from "../models/entities/pedido"
import type { CarritoItemDTO } from "../models/DTO/carrito-item.dto" 
import { Decimal } from "@prisma/client/runtime/library"
import type { ICarritoRepository } from "../models/repositories-interfaces"

class PedidoService implements IPedidoService {
  private readonly pedidoRepository!: IPedidoRepository
  private readonly carritoRepository!: ICarritoRepository

  constructor(pedidoRepository: IPedidoRepository, carritoRepository: ICarritoRepository) {
    this.pedidoRepository = pedidoRepository
    this.carritoRepository = carritoRepository
  }

  async crearPedido(usuarioId: number, itemsCarrito: CarritoItemDTO[]): Promise<Pedido> {
    if (!itemsCarrito || itemsCarrito.length === 0) {
      throw new Error("No hay productos en el carrito para crear un pedido.")
    }

   
    const total = itemsCarrito.reduce((acc, item) => {
      return acc.plus(new Decimal(item.producto.precio).times(item.cantidad))
    }, new Decimal(0))

    const newPedido = await this.pedidoRepository.create(usuarioId, total, itemsCarrito)

    await this.carritoRepository.vaciarCarrito(usuarioId)

    return newPedido
  }

  async obtenerPedidosPorUsuario(usuarioId: number): Promise<Pedido[]> {
    return this.pedidoRepository.findByUserId(usuarioId)
  }

  async obtenerTodosLosPedidos(): Promise<Pedido[]> {
    return this.pedidoRepository.findAll()
  }

  async actualizarEstadoPedido(orderId: number, status: string): Promise<void> {
    const validStatuses = ["pendiente", "completado", "cancelado"]
    if (!validStatuses.includes(status)) {
      throw new Error(`Estado inválido: ${status}. Los estados permitidos son: ${validStatuses.join(", ")}`)
    }
    await this.pedidoRepository.updateStatus(orderId, status)
  }
}

export default PedidoService
