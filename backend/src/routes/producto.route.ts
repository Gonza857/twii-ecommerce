import {RequestHandler, Router} from 'express';
import container from "../app/container";
import ProductoController from '../controllers/ProductoController';

export const productosRouter = Router();

const productoController = container.productoController;

productosRouter.get('/', (req, res) => productoController.getProductos(req, res));

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

