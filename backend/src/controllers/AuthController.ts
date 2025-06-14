import {Request, Response} from "express";
import {IChangePassword, ILogin, IRecover, IRegister,} from "../models/usuario-model";
import {changePasswordSchema, loginSchema, recoverSchema, registerSchema} from "../schemas/app.schemas";
import {CorreoExistenteException, DatosIncorrectoException} from "../exceptions/UsuarioExceptions";
import {validate} from "../utils/zod-validator";
import {IAuthService, IUsuarioService} from "../models/services-interfaces";
import {generarToken, verificarToken} from "../utils/jwt";
import {generateCookie} from "../utils/cookies";
import {AuthenticatedRequest} from "../models/main-models";
import {JwtPayload} from "jsonwebtoken";



class AuthController {
    private usuarioService!: IUsuarioService;
    private authService!: IAuthService;

    constructor(usuarioService: IUsuarioService, authService: IAuthService) {
        this.usuarioService = usuarioService;
        this.authService = authService;
    }

    private enviarErrorGenerico = (mensaje?: string | null): string => {
        return mensaje ?? "¡Ocurrió un error!"
    }

    public iniciarSesion = async (_req: Request, res: Response) => {
        let datos: ILogin;
        try {
            datos = validate(loginSchema, _req.body);
        } catch (e) {
            res.status(400).json(this.enviarErrorGenerico());
            return;
        }

        const usuarioDB = await this.usuarioService.obtenerUsuarioPorCorreo(datos.email)

        try {
            await this.authService.iniciarSesion(usuarioDB, datos.contrasena);
        } catch (e) {
            if (e instanceof DatosIncorrectoException) {
                res.status(401).send("Email o contraseña incorrectos.");
            } else {
                res.status(401).send(this.enviarErrorGenerico())
            }
            return;
        }

        try {
            await this.usuarioService.verificarCuentaValidada(usuarioDB?.id);
        } catch (e) {
            res.status(403).send("Cuenta no verificada. Revisa tu correo electrónico.")
            return;
        }

        const token = generarToken({id: usuarioDB?.id})
        res.cookie("access-token", token, generateCookie());
        res.status(200).send()
    }

    public recuperarContrasena = async (_req: Request, res: Response) => {
        let datos: IRecover;
        try {
            datos = validate(recoverSchema, _req.body);
        } catch (e) {
            res.status(400).send(this.enviarErrorGenerico());
            return;
        }

        const usuarioBuscado = await this.usuarioService.obtenerUsuarioPorCorreo(datos.email)

        try {
            await this.authService.recuperarContrasena(usuarioBuscado);
            res.status(200).send("Correo de recuperación enviado correctamente.")
        } catch (e) {
            if (e instanceof CorreoExistenteException) {
                res.status(409).json({mensaje: e.message});
            } else {
                res.status(400).send(this.enviarErrorGenerico())
            }
        }
    }

    public validar = async (_req: AuthenticatedRequest, res: Response) => {
        const usuario = await this.usuarioService.obtenerUsuarioPorId(_req.user);
        if (!usuario) return res.status(404).send(this.enviarErrorGenerico());
        res.status(200).json(usuario)
    }

    public cambiar = async (_req: Request, res: Response) => {
        let datos: IChangePassword
        try {
            datos = validate(changePasswordSchema, _req.body);
        } catch (e) {
            res.status(400).json(this.enviarErrorGenerico());
            return;
        }

        let valorToken!: any;
        try {
            valorToken = verificarToken(datos.token);
        } catch (e) {
            res.status(400).json(this.enviarErrorGenerico());
            return;
        }

        const usuarioBuscado = await this.usuarioService.obtenerUsuarioPorId(valorToken.id)

        try {
            let resultadoCambio = await this.authService.cambiarContrasena(usuarioBuscado, datos.contrasena);
            resultadoCambio = await this.usuarioService.actualizarContrasena(valorToken.id, resultadoCambio.data)
            res.status(200).send(resultadoCambio.mensaje)
        } catch (e) {
            res.status(400).json(this.enviarErrorGenerico());
        }
    }

    public confirmarCuenta = async (_req: Request, res: Response) => {
        const {token} = _req.params
        if (!token) {
             res.status(401).send(this.enviarErrorGenerico());
            return;
        }

        const data: any = verificarToken(token);

        try {
            await this.usuarioService.cambiarEstadoCuenta(data.email)
            res.status(200).send("Cuenta confirmada correctamente")
        } catch (e) {
            res.status(400).send(this.enviarErrorGenerico())
        }
    }

    public registrarse = async (_req: Request, res: Response) => {
        let datos: IRegister;
        try {
            datos = validate(registerSchema, _req.body);
        } catch (e) {
            res.status(400).json(this.enviarErrorGenerico());
            return;
        }

        const usuarioExistente = await this.usuarioService.obtenerUsuarioPorCorreo(datos.email)

        try {
            const {data: usuarioValidado} = await this.authService.registrarse(datos, usuarioExistente);
            const resultado = await this.usuarioService.guardar(usuarioValidado)
            const token = generarToken({id: resultado.data})
            await this.authService.enviarCorreoConfirmacion(datos.email, token)
            res.status(200).json(resultado)
        } catch (e) {
            console.log(e)
            if (e instanceof CorreoExistenteException) {
                res.status(409).json({mensaje: e.message});
            } else {
                res.status(400).json(this.enviarErrorGenerico());
            }
        }
    }

}

export default AuthController;