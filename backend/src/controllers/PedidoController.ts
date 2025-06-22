import type { Request, Response } from "express"
import type { IPedidoService } from "../models/interfaces/pedido.service.interface"
import type { AuthenticatedRequest } from "../models/main-models"
import { safe } from "../utils/safe"

class PedidoController {
  private readonly pedidoService!: IPedidoService

  constructor(pedidoService: IPedidoService) {
    this.pedidoService = pedidoService
  }

  public obtenerPedidosPorUsuario = async (_req: AuthenticatedRequest, res: Response) => {
    const { id } = _req.params

    const [pedidos, error] = await safe(this.pedidoService.obtenerPedidosPorUsuario(Number(id)))

    if (error) {
      return res.status(500).json({ mensaje: "Error al obtener pedidos", error })
    }

    res.status(200).json(pedidos)
  }

  public obtenerPedidoPorId = async (_req: Request, res: Response) => {
    const { id } = _req.params

    if (isNaN(Number(id))) {
      return res.status(400).json({ mensaje: "ID inválido" })
    }

    const [pedido, error] = await safe(this.pedidoService.obtenerPedidoPorId(Number(id)))

    if (error) {
      return res.status(500).json({ mensaje: "Error al obtener pedido", error })
    }

    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" })
    }

    res.status(200).json(pedido)
  }

  public crearPedido = async (_req: AuthenticatedRequest, res: Response) => {
    const { usuarioId, productos } = _req.body

    if (!usuarioId || !productos || !Array.isArray(productos)) {
      return res.status(400).json({ mensaje: "Datos inválidos" })
    }

    const [pedidoId, error] = await safe(this.pedidoService.crearPedido(usuarioId, productos))

    if (error) {
      return res.status(500).json({ mensaje: "Error al crear pedido", error })
    }

    res.status(201).json({ id: pedidoId, mensaje: "Pedido creado exitosamente" })
  }

  public actualizarEstadoPedido = async (_req: Request, res: Response) => {
    const { id } = _req.params
    const { estado } = _req.body

    if (isNaN(Number(id)) || !estado) {
      return res.status(400).json({ mensaje: "Datos inválidos" })
    }

    const [, error] = await safe(this.pedidoService.actualizarEstadoPedido(Number(id), estado))

    if (error) {
      return res.status(500).json({ mensaje: "Error al actualizar estado", error })
    }

    res.status(200).json({ mensaje: "Estado actualizado exitosamente" })
  }
}

export default PedidoController
