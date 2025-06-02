import {Router} from "express";
import container from "../app/container";
import UsuarioController from "../controllers/UsuarioController";

export const usuariosRouter = Router();

const usuarioController: UsuarioController = container.usuarioController

usuariosRouter.get('/', usuarioController.getResultadoTest);
usuariosRouter.post('/register', usuarioController.registrarse);
usuariosRouter.post("/login", usuarioController.iniciarSesion);
usuariosRouter.get("/:id", usuarioController.obtenerUsuarioPorId);
// usuariosRouter.delete("/:id", usuarioController.eliminarUsuario);

