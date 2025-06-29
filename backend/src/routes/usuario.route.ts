import {RequestHandler, Router} from "express";
import container from "../app/container";
import UsuarioController from "../controllers/UsuarioController";
import {authMiddleware} from "../middlewares/authMiddleware";
import {roleMiddleware} from "../middlewares/roleMiddleware";

export const usuariosRouter = Router();

const usuarioController: UsuarioController = container.usuarioController;



usuariosRouter.get("/", authMiddleware ,usuarioController.obtenerTodos as RequestHandler);
// usuariosRouter.delete("/:id", usuarioController.eliminarUsuario);

usuariosRouter.get(
    "/estadisticas",
    authMiddleware,
    roleMiddleware,
    usuarioController.obtenerEstadisticas as RequestHandler);

/**
 * @openapi
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 direccion:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 contrasena:
 *                   type: string
 *                 rol:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *       404:
 *         description: Usuario no encontrado
 */
usuariosRouter.get("/:id", usuarioController.obtenerUsuarioPorId);



