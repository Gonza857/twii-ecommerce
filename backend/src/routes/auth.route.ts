import {RequestHandler, Router} from "express";
import container from "../app/container";
import {authMiddleware} from "../middlewares/authMiddleware";

export const authRouter = Router()

const authController = container.authController;

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Auth
 *     description: Permite a un usuario iniciar sesión con email y contraseña. Solo se permite el acceso si la cuenta está validada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - contrasena
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@correo.com
 *               contrasena:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *       400:
 *          description: ¡Ocurrió un error!
 *       401:
 *         description: Email o contraseña incorrectos.
 *       403:
 *         description: "Cuenta no verificada. Revisa tu correo electrónico."
 */

authRouter.post("/login", authController.iniciarSesion)

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - email
 *               - contraseña
 *               - direccion
 *             properties:
 *               nombre:
 *                  type: string
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               direccion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: ¡Ocurrió un error!
 *       409:
 *          description: Correo inexistente
 */
authRouter.post("/register", authController.registrarse)

/**
 * @openapi
 * /api/auth/recuperar:
 *   post:
 *     summary: Enviar correo de recuperación
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Correo de recuperación enviado correctamente.
 *       400:
 *         description: ¡Ocurrió un error!
 *       409:
 *          description: Correo inexistente
 */
authRouter.post("/recuperar", authController.recuperarContrasena)

/**
 * @openapi
 * /api/auth/cambiar:
 *   post:
 *     summary: Cambiar contraseña
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contrasena
 *               - token
 *             properties:
 *               email:
 *                 type: string
 *               token:
 *                  type: string
 *     responses:
 *       201:
 *         description: "Contraseña actualizada correctamente."
 *       400:
 *         description: ¡Ocurrió un error!
 *       409:
 *          description: Correo inexistente
 */
authRouter.post("/cambiar", authController.cambiar);

authRouter.post("/confirmar", authController.confirmarCuenta);

/**
 * @openapi
 * /api/auth/confirmar/{token}:
 *   get:
 *     summary: Confirma la cuenta del usuario usando un token
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: Token de confirmación enviado por correo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cuenta confirmada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cuenta confirmada exitosamente
 *       202:
 *          description: La cuenta ya estaba confirmada
 *       400:
 *         description: Token faltante o inválido en la URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Token requerido
 *       401:
 *         description: Token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Token inválido o expirado
 *       500:
 *         description: No se pudo cambiar el estado de la cuenta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No se pudo confirmar la cuenta. Intente más tarde
 */
authRouter.get("/confirmar-cuenta/:token", authController.confirmarCuenta);

/**
 * @openapi
 * /api/auth/reenviar-confirmacion/{id}:
 *   get:
 *     summary: Reenviar correo de verificación de cuenta
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Correo de confirmación reenviado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Correo enviado correctamente
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usuario no encontrado
 *       409:
 *         description: El usuario ya tiene la cuenta verificada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: El usuario ya tiene la cuenta verificada
 *       500:
 *         description: Error al intentar reenviar el correo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al intentar reenviar el correo
 */
authRouter.get("/reenviar-confirmacion/:id", authController.reenviarConfirmacion);

/**
 * @openapi
 * /api/auth/validar:
 *   get:
 *     summary: Obtener usuario según sesión
 *     tags:
 *       - Auth
 *     description: Retorna el usuario autenticado según el token guardado en la cookie.
 *     parameters:
 *       - in: cookie
 *         name: token
 *         required: true
 *         description: Token JWT de sesión
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario autenticado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 email:
 *                   type: string
 *                 rol:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *       401:
 *         description: No autorizado (token inválido o ausente)
 */
authRouter.get("/validar", authMiddleware, authController.validar as RequestHandler);