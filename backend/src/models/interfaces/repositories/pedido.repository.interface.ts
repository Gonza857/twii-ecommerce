import type { Pedido } from "../../entities/pedido"
import type { CarritoItemDTO } from "../../DTO/carrito-item.dto"
import type { Decimal } from "@prisma/client/runtime/library"

export interface IPedidoRepository {
  create(usuarioId: number, total: Decimal, items: CarritoItemDTO[]): Promise<Pedido>
  findByUserId(userId: number): Promise<Pedido[]>
  findAll(): Promise<Pedido[]>
  updateStatus(orderId: number, status: string): Promise<void>
  findById(orderId: number): Promise<Pedido | null> 
}
