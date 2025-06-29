import {RequestHandler, Router} from 'express';
import container from "../app/container";
import {upload} from "../app/server";
import {authMiddleware} from "../middlewares/authMiddleware";
import {roleMiddleware} from "../middlewares/roleMiddleware";

export const productosRouter = Router();

const productoController = container.productoController;

productosRouter.get('/', (req, res) => productoController.getProductos(req, res));

productosRouter.get('/clasificaciones', (req, res) => productoController.getClasificaciones(req, res));

/**
 * @openapi
 * /api/producto/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags:
 *       - Producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico del producto
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *                 clasificacion:
 *                   type: string
 *                 precio:
 *                   type: string
 *                 imagen:
 *                   type: string
 *                   nullable: true
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
productosRouter.get("/:id", productoController.obtenerPorId as RequestHandler)

productosRouter.post(
    '/', upload.single("imagen"),
    authMiddleware,
    roleMiddleware,
    productoController.crearProducto as RequestHandler);

productosRouter.put(
    '/:id', upload.single("imagen"),
    authMiddleware,
    roleMiddleware,
    productoController.modificarProducto as RequestHandler);
productosRouter.delete('/:id', (req, res) => productoController.eliminarProducto(req, res));
