import type { PrismaClient } from "@prisma/client"
import type { IPedidoRepository } from "../models/interfaces/pedido.repository.interface"
import type { Pedido } from "../models/entities/pedido"

class PedidoRepository implements IPedidoRepository {
  private readonly prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async obtenerPorUsuario(usuarioId: number): Promise<Pedido[]> {
    // Temporalmente usando 'any' hasta que Prisma se regenere
    const prismaAny = this.prisma as any

    return await prismaAny.pedido.findMany({
      where: { usuarioid: usuarioId },
      include: {
        productos: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: { fecha: "desc" },
    })
  }

  async obtenerPorId(id: number): Promise<Pedido | null> {
    const prismaAny = this.prisma as any

    return await prismaAny.pedido.findUnique({
      where: { id },
      include: {
        productos: {
          include: {
            producto: true,
          },
        },
      },
    })
  }

  async crear(pedido: Omit<Pedido, "id" | "fecha">): Promise<number> {
    const prismaAny = this.prisma as any

    const nuevoPedido = await prismaAny.pedido.create({
      data: {
        usuarioid: pedido.usuarioid,
        estado: pedido.estado,
        total: pedido.total,
        productos: {
          create: pedido.productos.map((p) => ({
            cantidad: p.cantidad,
            precio_unitario: p.precio_unitario,
            productoid: p.productoid,
          })),
        },
      },
    })
    return nuevoPedido.id
  }

  async actualizarEstado(id: number, estado: string): Promise<void> {
    const prismaAny = this.prisma as any

    await prismaAny.pedido.update({
      where: { id },
      data: { estado },
    })
  }
}

export default PedidoRepository
