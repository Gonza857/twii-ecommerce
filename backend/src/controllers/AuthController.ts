import UsuarioService from "../services/UsuarioService";
import AuthService from "../services/AuthService";
import {Request, Response} from "express";
import {ILogin, IRecover, IRegister,} from "../models/usuario-model";
import {loginSchema, recoverSchema, registerSchema} from "../schemas/app.schemas";
import {CorreoExistenteException, DatosIncorrectoException} from "../exceptions/UsuarioExceptions";
import {validate} from "../utils/zod-validator";
import {IAuthService} from "../models/services-interfaces";

class AuthController {
    private usuarioService!: UsuarioService;
    private authService!: IAuthService;

    constructor(usuarioService: UsuarioService, authService: IAuthService) {
        this.usuarioService = usuarioService;
        this.authService = authService;
    }

    public iniciarSesion = async (_req: Request, res: Response) => {
        let datos: ILogin;
        try {
            datos = validate(loginSchema, _req.body);
        } catch (e) {
            res.status(400).send();
            return;
        }

        const usuarioDB = await this.usuarioService.obtenerUsuarioPorCorreo(datos.email)

        if (!usuarioDB) {
            res.status(401).send({mensaje: "Datos incorrectos."})
            return;
        }

        try {
            const resultado = await this.authService.iniciarSesion(datos);
            res.status(200).json(resultado)
        } catch (e) {
            console.log(e)
            if (e instanceof DatosIncorrectoException) {
                res.status(401).send({mensaje: e.message});
            } else {
                res.status(401).send({mensaje: "Datos incorrectos."})
            }

        }
    }

    public recuperarContrasena = async (_req: Request, res: Response) => {
        console.log("Recuperando contraseña...")
        console.log("Body", _req.body);
        let datos: IRecover;
        try {
            datos = validate(recoverSchema, _req.body);
        } catch (e) {
            console.log(e)
            res.status(400).send();
            return;
        }

        const usuarioBuscado = await this.usuarioService.obtenerUsuarioPorCorreo(datos.email)
        console.log(usuarioBuscado)

        try {
            await this.authService.recuperarContrasena(datos.email);
            res.status(200).json(usuarioBuscado?.id)
        } catch (e) {
            console.log(e);
            if (e instanceof CorreoExistenteException) {
                res.status(409).json({mensaje: e.message});
            } else {
                res.status(500).send({mensaje: "Ocurrió un error al procesar tu solicitud."})
            }
        }
    }

    public cambiar = async (_req: Request, res: Response): Promise<void> => {
        console.log("body", _req.body);
        res.status(200).json({
            exito: true,
            mensaje: "Contraseña cambiada correctamente",
        });
    }

    public registrarse = async (_req: Request, res: Response) => {
        console.log("Registrando")
        let datos: IRegister;
        try {
            datos = validate(registerSchema, _req.body);
        } catch (e) {
            res.status(400).send();
            return;
        }

        const usuarioExistente = await this.usuarioService.obtenerUsuarioPorCorreo(datos.email)

        try {
            const resultado = await this.authService.registrarse(datos, usuarioExistente);
            res.status(200).json(resultado)
        } catch (e) {
            console.log(e)
            if (e instanceof CorreoExistenteException) {
                res.status(409).json({mensaje: e.message});
            } else {
                res.status(500).send({mensaje: "Ocurrió un error al procesar tu solicitud."})
            }
        }
    }

}

export default AuthController;