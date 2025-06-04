import {Router} from "express";
import container from "../app/container";

const authRouter: Router = Router()

const authController = container.authController;

authRouter.post("/login", authController.iniciarSesion)
authRouter.post("/register", authController.registrarse)
authRouter.post("/recuperar", authController.recuperarContrasena)