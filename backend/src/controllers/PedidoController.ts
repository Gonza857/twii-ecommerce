import type { Request, Response } from "express"
import type { AuthenticatedRequest } from "../models/main-models"
import type { IPedidoService } from "../models/interfaces/services/pedido.service.interface"
import { safe } from "../utils/safe"

class PedidoController {
  private pedidoService!: IPedidoService

  constructor(pedidoService: IPedidoService) {
    this.pedidoService = pedidoService
  }

  private enviarErrorGenerico = (mensaje?: string | null) => {
    return {
      error: mensaje ?? "¡Ocurrió un error!",
    }
  }

  private enviarExito = (mensaje?: string | null) => {
    return {
      mensaje: mensaje ?? "Proceso realizado correctamente!",
    }
  }

  public crearPedido = async (_req: AuthenticatedRequest, res: Response) => {
    const usuarioId = _req.user
    if (!usuarioId) {
      return res.status(401).json(this.enviarErrorGenerico("No autenticado."))
    }

    const { items } = _req.body
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json(this.enviarErrorGenerico("No hay productos en el carrito para crear un pedido."))
    }

    const [pedido, error] = await safe(this.pedidoService.crearPedido(usuarioId, items))

    if (error) {
      console.error("Error al crear pedido:", error)
      return res.status(500).json(this.enviarErrorGenerico("Error al crear el pedido."))
    }

    res.status(201).json(this.enviarExito("Pedido creado exitosamente."))
  }

  public obtenerPedidosPorUsuario = async (_req: AuthenticatedRequest, res: Response) => {
    const usuarioId = _req.user
    if (!usuarioId) {
      return res.status(401).json(this.enviarErrorGenerico("No autenticado."))
    }

    const [pedidos, error] = await safe(this.pedidoService.obtenerPedidosPorUsuario(usuarioId))

    if (error) {
      console.error("Error al obtener pedidos:", error)
      return res.status(500).json(this.enviarErrorGenerico("Error al obtener los pedidos."))
    }

    res.status(200).json(pedidos)
  }

  public obtenerTodosLosPedidos = async (_req: Request, res: Response) => {
    const [pedidos, error] = await safe(this.pedidoService.obtenerTodosLosPedidos())

    if (error) {
      console.error("Error al obtener todos los pedidos:", error)
      return res.status(500).json(this.enviarErrorGenerico("Error al obtener todos los pedidos."))
    }

    res.status(200).json(pedidos)
  }

  public actualizarEstadoPedido = async (_req: Request, res: Response) => {
    const { id } = _req.params
    const { estado } = _req.body

    if (isNaN(Number(id)) || !estado) {
      return res.status(400).json(this.enviarErrorGenerico("ID de pedido o estado inválido."))
    }

    const [resultado, error] = await safe(this.pedidoService.actualizarEstadoPedido(Number(id), estado))

    if (error) {
      console.error("Error al actualizar estado del pedido:", error)
      return res.status(500).json(this.enviarErrorGenerico("Error al actualizar el estado del pedido."))
    }

    res.status(200).json(this.enviarExito("Estado del pedido actualizado exitosamente."))
  }

  // New method for canceling an order
  public cancelarPedido = async (_req: AuthenticatedRequest, res: Response) => {
    const { id } = _req.params
    const usuarioId = _req.user

    if (!usuarioId) {
      return res.status(401).json(this.enviarErrorGenerico("No autenticado."))
    }
    if (isNaN(Number(id))) {
      return res.status(400).json(this.enviarErrorGenerico("ID de pedido inválido."))
    }

    const [_, error] = await safe(this.pedidoService.cancelarPedido(Number(id)))

    if (error) {
      console.error("Error al cancelar pedido:", error)
      return res.status(500).json(this.enviarErrorGenerico(error.message || "Error al cancelar el pedido."))
    }

    res.status(200).json(this.enviarExito("Pedido cancelado exitosamente."))
  }

  // New method for repeating an order
  public repetirPedido = async (_req: AuthenticatedRequest, res: Response) => {
    const { id } = _req.params // This is the original order ID
    const usuarioId = _req.user

    if (!usuarioId) {
      return res.status(401).json(this.enviarErrorGenerico("No autenticado."))
    }
    if (isNaN(Number(id))) {
      return res.status(400).json(this.enviarErrorGenerico("ID de pedido inválido."))
    }

    const [newPedido, error] = await safe(this.pedidoService.repetirPedido(usuarioId, Number(id)))

    if (error) {
      console.error("Error al repetir pedido:", error)
      return res.status(500).json(this.enviarErrorGenerico(error.message || "Error al repetir el pedido."))
    }

    res.status(201).json(this.enviarExito("Pedido repetido exitosamente."))
  }
}

export default PedidoController

