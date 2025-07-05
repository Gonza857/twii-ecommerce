import type { PrismaClient } from "@prisma/client"
import type { IPedidoRepository } from "../models/interfaces/repositories/pedido.repository.interface"
import type { Pedido } from "../models/entities/pedido"
import type { CarritoItemDTO } from "../models/DTO/carrito-item.dto"
import { Decimal } from "@prisma/client/runtime/library"

class PedidoRepository implements IPedidoRepository {
  private readonly prisma!: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async create(usuarioId: number, total: Decimal, items: CarritoItemDTO[]): Promise<Pedido> {
    return this.prisma.pedido.create({
      data: {
        usuarioid: usuarioId,
        total: total,
        estado: "pendiente",
        pedido_productos: {
          create: items.map((item) => ({
            productoid: item.productoid,
            cantidad: item.cantidad,
            preciounitario: new Decimal(item.producto.precio),
          })),
        },
      },
      include: {
        pedido_productos: {
          include: {
            producto: true,
          },
        },
      },
    })
  }

  async findByUserId(userId: number): Promise<Pedido[]> {
    return this.prisma.pedido.findMany({
      where: { usuarioid: userId },
      include: {
        pedido_productos: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    })
  }

  async findAll(): Promise<Pedido[]> {
    return this.prisma.pedido.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        pedido_productos: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    })
  }

  async updateStatus(orderId: number, status: string): Promise<void> {
    await this.prisma.pedido.update({
      where: { id: orderId },
      data: { estado: status },
    })
  }

  // New method to find a single order by ID
  async findById(orderId: number): Promise<Pedido | null> {
    return this.prisma.pedido.findUnique({
      where: { id: orderId },
      include: {
        pedido_productos: {
          include: {
            producto: true,
          },
        },
      },
    })
  }
}

export default PedidoRepository
