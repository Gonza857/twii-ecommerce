import {Request, Response} from "express";
import {IChangePassword, ILogin, IRecover, IRegister,} from "../models/usuario-model";
import {changePasswordSchema, loginSchema, recoverSchema, registerSchema} from "../schemas/app.schemas";
import {
    CorreoExistenteException,
    CuentaYaVerificadaException,
    DatosIncorrectoException
} from "../exceptions/UsuarioExceptions";
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

    private enviarErrorGenerico = (mensaje?: string | null) => {
        return {
            error: mensaje ?? "¡Ocurrió un error!"
        }
    }

    private enviarErrorConDatos = (mensaje?: string | null, data?: any) => {
        return {
            error: this.enviarErrorGenerico(mensaje).error,
            data: data,
        }
    }

    private enviarExito = (mensaje?: string | null) => {
        return {
            mensaje: mensaje ?? "Proceso realizado correctamente!",
        }
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
                res.status(401).json(this.enviarErrorGenerico("Email o contraseña incorrectos."));
            } else {
                res.status(401).json(this.enviarErrorGenerico())
            }
            return;
        }

        try {
            await this.usuarioService.verificarCuentaValidada(usuarioDB?.id);
        } catch (e) {
            res.status(403).json(
                this.enviarErrorConDatos("Cuenta no verificada. Revisa tu correo electrónico.", usuarioDB?.id)
            )
            return;
        }

        const token = generarToken({id: usuarioDB?.id})
        res.cookie("access-token", token, generateCookie());
        res.status(200).json("Iniciaste sesión correctamente. Redirigiendo...")
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
        if (!usuario.validado) return res.status(403).json(this.enviarErrorGenerico())
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
            res.status(200).json(this.enviarExito(resultadoCambio.mensaje))
        } catch (e) {
            res.status(500).json(this.enviarErrorGenerico());
        }
    }

    public reenviarConfirmacion = async (_req: Request, res: Response) => {
        const {id} = _req.params

        const usuarioBuscado = await this.usuarioService.obtenerUsuarioPorId(id)

        if (!usuarioBuscado) {
            res.status(404).json(this.enviarErrorGenerico());
            return;
        }

        if (usuarioBuscado.validado) {
            res.status(409).json(this.enviarExito("El usuario ya tiene la cuenta verificada"));
            return;
        }

        const token = generarToken({id: usuarioBuscado.id})

        console.log("token de reenvio", token)

        try {
            const mensaje = await this.authService.enviarCorreoConfirmacion(usuarioBuscado.email, token)
            res.status(200).json(this.enviarExito(mensaje));
        } catch (e) {
            res.status(500).json(this.enviarErrorGenerico(" Error al intentar reenviar el correo"));
        }
    }

    public confirmarCuenta = async (_req: Request, res: Response) => {
        const {token} = _req.params
        if (!token) {
            res.status(400).send(this.enviarErrorGenerico());
            return;
        }

        console.log("token", token)

        let data: any;
        try {
            data = verificarToken(token);
        } catch (e) {
            res.status(401).json(this.enviarErrorGenerico());
            return;
        }

        console.log("Data del token", data)

        try {
            const mensaje = await this.usuarioService.cambiarEstadoCuenta(data.id)
            res.status(200).json(this.enviarExito(mensaje))
        } catch (e) {
            console.log(e)
            if (e instanceof CuentaYaVerificadaException) {
                res.status(202).send();
            } else {
                res.status(500).json(this.enviarErrorGenerico())
            }
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
            const usuarioConPassHash: IRegister = await this.authService.registrarse(datos, usuarioExistente);

            const idUsuarioCreado = await this.usuarioService.guardar(usuarioConPassHash);

            const token = generarToken({id: idUsuarioCreado});

            await this.authService.enviarCorreoConfirmacion(datos.email, token)

            res.status(200).json(this.enviarExito())
        } catch (e) {
            if (e instanceof CorreoExistenteException) {
                res.status(409).json({mensaje: e.message});
            } else {
                res.status(400).json(this.enviarErrorGenerico());
            }
        }
    }

}

export default AuthController;