import { type RequestHandler, Router } from "express"
import container from "../app/container"
import { authMiddleware } from "../middlewares/authMiddleware"

export const pedidoRouter = Router()

const pedidoController = container.pedidoController

/**
 * @openapi
 * /api/pedido/usuario/{id}:
 *   get:
 *     summary: Obtener pedidos de un usuario
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario
 *       500:
 *         description: Error interno del servidor
 */
pedidoRouter.get("/usuario/:id", authMiddleware, pedidoController.obtenerPedidosPorUsuario as RequestHandler)

/**
 * @openapi
 * /api/pedido/{id}:
 *   get:
 *     summary: Obtener un pedido por ID
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pedido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error interno del servidor
 */
pedidoRouter.get("/:id", authMiddleware, pedidoController.obtenerPedidoPorId as RequestHandler)

/**
 * @openapi
 * /api/pedido:
 *   post:
 *     summary: Crear un nuevo pedido
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productoid:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *                     precio_unitario:
 *                       type: number
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
pedidoRouter.post("/", authMiddleware, pedidoController.crearPedido as RequestHandler)

/**
 * @openapi
 * /api/pedido/{id}/estado:
 *   put:
 *     summary: Actualizar estado de un pedido
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pedido
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
pedidoRouter.put("/:id/estado", authMiddleware, pedidoController.actualizarEstadoPedido as RequestHandler)
