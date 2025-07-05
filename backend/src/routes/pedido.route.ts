import { type RequestHandler, Router } from "express"
import container from "../app/container"
import { authMiddleware } from "../middlewares/authMiddleware"
import { roleMiddleware } from "../middlewares/roleMiddleware"

export const pedidoRouter = Router()

const pedidoController = container.pedidoController

/**
 * @openapi
 * /api/pedidos:
 *   post:
 *     summary: Crea un nuevo pedido a partir del carrito del usuario
 *     tags:
 *       - Pedidos
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productoid:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *                     producto:
 *                       type: object
 *                       properties:
 *                         precio:
 *                           type: string
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente.
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autenticado.
 *       500:
 *         description: Error al crear el pedido.
 */
pedidoRouter.post("/", authMiddleware, pedidoController.crearPedido as RequestHandler)

/**
 * @openapi
 * /api/pedidos/usuario:
 *   get:
 *     summary: Obtiene todos los pedidos del usuario autenticado
 *     tags:
 *       - Pedidos
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario.
 *       401:
 *         description: No autenticado.
 *       500:
 *         description: Error al obtener los pedidos.
 */
pedidoRouter.get("/usuario", authMiddleware, pedidoController.obtenerPedidosPorUsuario as RequestHandler)

/**
 * @openapi
 * /api/pedidos/admin:
 *   get:
 *     summary: Obtiene todos los pedidos (solo para administradores)
 *     tags:
 *       - Pedidos
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los pedidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       500:
 *         description: Error al obtener los pedidos.
 */
pedidoRouter.get("/admin", authMiddleware, roleMiddleware, pedidoController.obtenerTodosLosPedidos as RequestHandler)

/**
 * @openapi
 * /api/pedidos/{id}/estado:
 *   put:
 *     summary: Actualiza el estado de un pedido (solo para administradores)
 *     tags:
 *       - Pedidos
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pedido a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, completado, cancelado]
 *                 example: completado
 *     responses:
 *       200:
 *         description: Estado del pedido actualizado exitosamente.
 *       400:
 *         description: ID de pedido o estado inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       500:
 *         description: Error al actualizar el estado del pedido.
 */
pedidoRouter.put(
  "/:id/estado",
  authMiddleware,
  roleMiddleware,
  pedidoController.actualizarEstadoPedido as RequestHandler,
)

/**
 * @openapi
 * /api/pedidos/{id}/cancelar:
 *   put:
 *     summary: Cancela un pedido si está en estado "pendiente"
 *     tags:
 *       - Pedidos
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pedido a cancelar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido cancelado exitosamente.
 *       400:
 *         description: ID de pedido inválido.
 *       401:
 *         description: No autenticado.
 *       500:
 *         description: Error al cancelar el pedido (ej. no está pendiente).
 */
pedidoRouter.put("/:id/cancelar", authMiddleware, pedidoController.cancelarPedido as RequestHandler)

/**
 * @openapi
 * /api/pedidos/{id}/repetir:
 *   post:
 *     summary: Crea un nuevo pedido repitiendo uno existente
 *     tags:
 *       - Pedidos
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pedido original a repetir.
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Pedido repetido exitosamente.
 *       400:
 *         description: ID de pedido inválido.
 *       401:
 *         description: No autenticado.
 *       500:
 *         description: Error al repetir el pedido.
 */
pedidoRouter.post("/:id/repetir", authMiddleware, pedidoController.repetirPedido as RequestHandler)
