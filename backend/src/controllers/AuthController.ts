import UsuarioService from "../services/UsuarioService";
import AuthService from "../services/AuthService";
import {Request, Response} from "express";
import {ILogin, IRegister,} from "../models/usuario-model";
import {loginSchema, registerSchema} from "../schemas/app.schemas";
import {CorreoExistenteException, DatosIncorrectoException} from "../exceptions/UsuarioExceptions";
import {validate} from "../utils/zod-validator";

class AuthController {
    private usuarioService!: UsuarioService;
    private authService!: AuthService;

    constructor(usuarioService: UsuarioService, authService: AuthService) {
        this.usuarioService = usuarioService;
        this.authService = authService;
    }

    public iniciarSesion = async (_req: Request, res: Response): Promise<void> => {
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

    public recuperarContrasena = async (_req: Request, res: Response): Promise<void> => {

    }

    public registrarse = async (_req: Request, res: Response): Promise<void> => {
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