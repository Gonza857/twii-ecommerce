import type { IPedidoService } from "../models/interfaces/services/pedido.service.interface"
import type { IPedidoRepository } from "../models/interfaces/repositories/pedido.repository.interface"
import type { Pedido } from "../models/entities/pedido"
import type { CarritoItemDTO } from "../models/DTO/carrito-item.dto"
import { Decimal } from "@prisma/client/runtime/library"
import type { ICarritoRepository } from "../models/repositories-interfaces"
import type { IProductoRepository } from "../models/interfaces/repositories/producto.repository.interface" // Import ProductoRepository

class PedidoService implements IPedidoService {
  private readonly pedidoRepository!: IPedidoRepository
  private readonly carritoRepository!: ICarritoRepository
  private readonly productoRepository!: IProductoRepository // Injected

  constructor(
    pedidoRepository: IPedidoRepository,
    carritoRepository: ICarritoRepository,
    productoRepository: IProductoRepository, // Added to constructor
  ) {
    this.pedidoRepository = pedidoRepository
    this.carritoRepository = carritoRepository
    this.productoRepository = productoRepository
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

  async cancelarPedido(orderId: number): Promise<void> {
    const pedido = await this.pedidoRepository.findById(orderId)
    if (!pedido) {
      throw new Error("Pedido no encontrado.")
    }
    if (pedido.estado !== "pendiente") {
      throw new Error("Solo se pueden cancelar pedidos en estado 'pendiente'.")
    }
    await this.pedidoRepository.updateStatus(orderId, "cancelado")
  }

  async repetirPedido(usuarioId: number, originalOrderId: number): Promise<Pedido> {
    const originalPedido = await this.pedidoRepository.findById(originalOrderId)
    if (!originalPedido || !originalPedido.pedido_productos || originalPedido.pedido_productos.length === 0) {
      throw new Error("El pedido original no se encontró o no contiene productos.")
    }

    const newItems: CarritoItemDTO[] = []
    let newTotal = new Decimal(0)

    for (const item of originalPedido.pedido_productos) {
      const currentProduct = await this.productoRepository.obtenerPorId(item.productoid)
      if (!currentProduct) {
        // Optionally, skip this product or throw an error if a product is no longer available
        console.warn(`Producto con ID ${item.productoid} no encontrado para repetir pedido.`)
        continue
      }

      const itemPrice = new Decimal(currentProduct.precio)
      newItems.push({
        productoid: currentProduct.id,
        cantidad: item.cantidad,
        producto: {
          precio: itemPrice.toString(), // Use current price
        },
      })
      newTotal = newTotal.plus(itemPrice.times(item.cantidad))
    }

    if (newItems.length === 0) {
      throw new Error("No se pudieron agregar productos válidos para repetir el pedido.")
    }

    return this.pedidoRepository.create(usuarioId, newTotal, newItems)
  }
}

export default PedidoService
