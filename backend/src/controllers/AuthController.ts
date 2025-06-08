import UsuarioService from "../services/UsuarioService";
import AuthService from "../services/AuthService";
import {Request, Response} from "express";
import {IChangePassword, ILogin, IRecover, IRegister,} from "../models/usuario-model";
import {changePasswordSchema, loginSchema, recoverSchema, registerSchema} from "../schemas/app.schemas";
import {CorreoExistenteException, DatosIncorrectoException} from "../exceptions/UsuarioExceptions";
import {validate} from "../utils/zod-validator";
import {IAuthService, IUsuarioService} from "../models/services-interfaces";
import {generarToken, verificarToken} from "../utils/jwt";
import {generateCookie} from "../utils/cookies";
import {JwtPayload} from "jsonwebtoken";

class AuthController {
    private usuarioService!: IUsuarioService;
    private authService!: IAuthService;

    constructor(usuarioService: IUsuarioService, authService: IAuthService) {
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

        // const tokenExistente = verificarToken(_req.cookies["access-token"]);

        const usuarioDB = await this.usuarioService.obtenerUsuarioPorCorreo(datos.email)

        if (!usuarioDB) {
            res.status(401).send({mensaje: "Datos incorrectos."})
            return;
        }

        try {
            const resultado = await this.authService.iniciarSesion(datos);
            const token = generarToken({id: resultado.data})
            res.cookie("access-token", token, generateCookie())
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
        let datos: IRecover;
        try {
            datos = validate(recoverSchema, _req.body);
        } catch (e) {
            res.status(400).send();
            return;
        }

        const usuarioBuscado = await this.usuarioService.obtenerUsuarioPorCorreo(datos.email)

        try {
            const resultado = await this.authService.recuperarContrasena(usuarioBuscado);
            res.status(200).json(resultado)
        } catch (e) {
            console.log(e);
            if (e instanceof CorreoExistenteException) {
                res.status(409).json({mensaje: e.message});
            } else {
                res.status(500).send({mensaje: "Ocurrió un error al procesar tu solicitud."})
            }
        }
    }

    public cambiar = async (_req: Request, res: Response) => {
        let datos: IChangePassword
        try {
            datos = validate(changePasswordSchema, _req.body);
        } catch (e) {
            res.status(400).send();
            return;
        }

        let valorToken!: any;
        try {
            valorToken = verificarToken(datos.token);
        } catch (e) {
            res.status(400).send();
            return;
        }

        const usuarioBuscado = await this.usuarioService.obtenerUsuarioPorId(valorToken.id)

        try {
            let resultadoCambio = await this.authService.cambiarContrasena(usuarioBuscado, datos.contrasena);
            resultadoCambio = await this.usuarioService.actualizarContrasena(valorToken.id, resultadoCambio.data)
            res.status(200).json(resultadoCambio);
        } catch (e) {
            res.status(400).send();
            return;
        }
    }

    public registrarse = async (_req: Request, res: Response) => {
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