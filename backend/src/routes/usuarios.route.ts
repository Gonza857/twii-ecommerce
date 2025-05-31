import {Router} from "express";
import UsuarioController from "../controllers/UsuarioController";

export const usuariosRouter = Router();

const usuarioController = new UsuarioController();

// Controladores

usuariosRouter.get('/', usuarioController.getResultadoTest);

