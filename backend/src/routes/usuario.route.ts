import {RequestHandler, Router} from "express";
import container from "../app/container";
import UsuarioController from "../controllers/UsuarioController";
import {authMiddleware} from "../middlewares/authMiddleware";

export const usuariosRouter = Router();

const usuarioController: UsuarioController = container.usuarioController;

usuariosRouter.get("/:id", usuarioController.obtenerUsuarioPorId);
usuariosRouter.get("/", authMiddleware ,usuarioController.obtenerTodos as RequestHandler);
// usuariosRouter.delete("/:id", usuarioController.eliminarUsuario);

