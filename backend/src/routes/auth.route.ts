import {RequestHandler, Router} from "express";
import container from "../app/container";
import {authMiddleware} from "../middlewares/authMiddleware";

export const authRouter = Router()

const authController = container.authController;

authRouter.post("/login", authController.iniciarSesion)
authRouter.post("/register", authController.registrarse)
authRouter.post("/recuperar", authController.recuperarContrasena)
authRouter.post("/cambiar", authController.cambiar);
authRouter.get("/validar", authMiddleware, authController.validar as RequestHandler);