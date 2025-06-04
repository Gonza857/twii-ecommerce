import {Router} from "express";
import container from "../app/container";
import UsuarioController from "../controllers/UsuarioController";

export const usuariosRouter = Router();

const usuarioController: UsuarioController = container.usuarioController

usuariosRouter.get('/', usuarioController.getResultadoTest);
usuariosRouter.get("/:id", usuarioController.obtenerUsuarioPorId);
// usuariosRouter.delete("/:id", usuarioController.eliminarUsuario);

