import {Request, Response} from "express";
import {
    Usuario, UsuarioCambiarDTO,
    UsuarioLogin,
    UsuarioLoginDTO, UsuarioRecoverDTO, UsuarioRegisterDTO,
} from "../models/usuario-model";
import {changePasswordSchema, loginSchema, recoverSchema, registerSchema} from "../schemas/app.schemas";
import {
    CorreoExistenteException,
    CuentaYaVerificadaException,
    DatosIncorrectoException
} from "../exceptions/UsuarioExceptions";
import {validate} from "../utils/zod-validator";
import {generarToken, verificarToken} from "../utils/jwt";
import {generateCookie} from "../utils/cookies";
import {AuthenticatedRequest} from "../models/main-models";
import {safe, safeSync} from "../utils/safe";
import {IUsuarioService} from "../models/interfaces/services/usuario.service.interface";
import {IAuthService} from "../models/interfaces/services/auth.service.interface";

type BaseJwtPayload = {
    iat?: number;
    exp?: number;
};

type RecoverPasswordPayload = BaseJwtPayload & {
    id: string;
    email: string;
};

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
        const [usuarioLoginDTO, errorUsuarioLoginDTO] = safeSync<UsuarioLoginDTO>(
            () => validate(loginSchema, _req.body)
        );
        if (errorUsuarioLoginDTO) return res.status(400).send(this.enviarErrorGenerico());

        const usuario: UsuarioLogin | null = await this.usuarioService.obtenerUsuarioParaLoginPorCorreo(usuarioLoginDTO!.email)

        const [resultadoIniciarSesion, errorIniciarSesion] = await safe(
            this.authService.iniciarSesion(usuario, usuarioLoginDTO!.contrasena)
        );
        if (errorIniciarSesion) {
            if (errorIniciarSesion instanceof DatosIncorrectoException)
                return res.status(401).json(this.enviarErrorGenerico("Email o contraseña incorrectos."));
            return res.status(401).send(this.enviarErrorGenerico())
        }

        const [resultado, error] = await safe(
            this.usuarioService.verificarCuentaValidada(usuario!.id)
        );
        if (error) return res.status(403).json(
            this.enviarErrorConDatos("Cuenta no verificada. Revisa tu correo electrónico.", usuario!.id)
        )

        const token = generarToken({id: usuario!.id})
        res.cookie("access-token", token, generateCookie());
        res.status(200).json("Iniciaste sesión correctamente. Redirigiendo...")
    }

    public recuperarContrasena = async (_req: Request, res: Response) => {
        const [usuarioRecoverDTO, errorUsuarioRecoverDTO] = safeSync<UsuarioRecoverDTO>(
            () => validate(recoverSchema, _req.body)
        );
        if (errorUsuarioRecoverDTO) return res.status(400).send(this.enviarErrorGenerico());

        const usuarioBuscado: UsuarioLogin | null =
            await this.usuarioService.obtenerUsuarioParaLoginPorCorreo(usuarioRecoverDTO!.email)

        const [resultado, error] = await safe(
            this.authService.recuperarContrasena(usuarioBuscado)
        )
        if (error) {
            if (error instanceof CorreoExistenteException) return res.status(409).json({mensaje: error.message});
            return res.status(400).send(this.enviarErrorGenerico())
        }

        res.status(200).send("Si tu cuenta existe, te hemos enviado un correo de confirmación.")
    }

    public validar = async (_req: AuthenticatedRequest, res: Response) => {
        const usuario = await this.usuarioService.obtenerUsuarioPorId(_req.user);
        if (!usuario) return res.status(404).send(this.enviarErrorGenerico());
        if (!usuario.validado) return res.status(403).json(this.enviarErrorGenerico())
        res.status(200).json(usuario)
    }

    public cambiar = async (_req: Request, res: Response) => {
        // Validar body
        const [usuarioCambiarDTO, errorUsuarioCambiarDTO] = safeSync<UsuarioCambiarDTO>(
            () => validate(changePasswordSchema, _req.body)
        );
        if (errorUsuarioCambiarDTO) return res.status(400).send(this.enviarErrorGenerico());

        // Verificar token que llega del body
        const [tokenGenerado, errorTokenGenerado] = safeSync(
            () => verificarToken<RecoverPasswordPayload>(usuarioCambiarDTO!.token)
        );
        if (errorTokenGenerado) return res.status(400).send(this.enviarErrorGenerico());


        // Buscar usuario por id del token
        const usuarioBuscado: UsuarioLogin | null = await this.usuarioService.obtenerUsuarioParaLoginPorCorreo(tokenGenerado!.email)

        // Cambiar contraseña al usuario buscado
        const [contrasenaNueva, errorContrasenaNueva] = await safe<string>(
            this.authService.cambiarContrasena(usuarioBuscado, usuarioCambiarDTO!.contrasena)
        );
        if (errorContrasenaNueva) return res.status(500).send(this.enviarErrorGenerico());

        // Persistir
        const [resultado, error] = await safe(
            this.usuarioService.actualizarContrasena(tokenGenerado!.id, contrasenaNueva!)
        );
        if (error) return res.status(500).send(this.enviarErrorGenerico());

        res.status(201).json(this.enviarExito(resultado?.mensaje))
    }

    public reenviarConfirmacion = async (_req: Request, res: Response) => {
        const {id} = _req.params

        // Obtener usuario
        const usuarioBuscado: Usuario | null = await this.usuarioService.obtenerUsuarioPorId(id)
        if (!usuarioBuscado) return res.status(404).json(this.enviarErrorGenerico());

        // Validar si esta validado
        if (usuarioBuscado.validado) return res.status(409).json(this.enviarExito("El usuario ya tiene la cuenta verificada"));

        // Generación de token
        const token = generarToken({id: usuarioBuscado.id})

        // Respuesta
        const [mensaje, errorMensaje] = await safe<string>(
            this.authService.enviarCorreoConfirmacion(usuarioBuscado.email, token)
        );
        if (errorMensaje) return res.status(500).json(this.enviarErrorGenerico("Error al intentar reenviar el correo"));

        res.status(200).json(this.enviarExito(mensaje));
    }

    public confirmarCuenta = async (_req: Request, res: Response) => {
        const {token} = _req.params
        if (!token) return res.status(400).send(this.enviarErrorGenerico());

        // Verificar token que llega de los params
        const [tokenGenerado, errorTokenGenerado] = safeSync(
            () => verificarToken<RecoverPasswordPayload>(token)
        );
        if (errorTokenGenerado) return res.status(401).json(this.enviarErrorGenerico());

        // Mensaje de respuesta
        const [mensaje, errorMensaje] = await safe<string>(
            this.usuarioService.cambiarEstadoCuenta(tokenGenerado!.id)
        );
        if (errorMensaje) {
            if (errorMensaje instanceof CuentaYaVerificadaException) return res.status(202).send();
            return res.status(500).json(this.enviarErrorGenerico())
        }

        res.status(200).json(this.enviarExito(mensaje))
    }

    public registrarse = async (_req: Request, res: Response) => {
        // Validar body
        const [usuarioRegisterDTO, errorUsuarioRegisterDTO] = safeSync<UsuarioRegisterDTO>(
            () => validate(registerSchema, _req.body)
        );
        if (errorUsuarioRegisterDTO) return res.status(400).send(this.enviarErrorGenerico());

        const usuarioExistente: UsuarioLogin | null =
            await this.usuarioService.obtenerUsuarioParaLoginPorCorreo(usuarioRegisterDTO!.email)

        const [usuarioConPassHash, errorRegistrar] = await safe<UsuarioRegisterDTO>(
                this.authService.registrarse(usuarioRegisterDTO!, usuarioExistente)
        );
        if (errorRegistrar) return res.status(409).send(this.enviarErrorGenerico(errorRegistrar.message));

        // Crear usuario y obtener id
        const [idUsuarioCreado, errorIdUsuarioCreado] = await safe<number | null>(
            this.usuarioService.guardar(usuarioConPassHash!)
        );
        if (errorIdUsuarioCreado) return res.status(500).json(this.enviarErrorGenerico())

        const token = generarToken({id: idUsuarioCreado});

        // Enviar correo confirmación
        const [resultado, error] = await safe(
            this.authService.enviarCorreoConfirmacion(usuarioConPassHash!.email, token)
        );
        if (error) {
            if (error instanceof CorreoExistenteException) return res.status(409).json({mensaje: error.message})
            return res.status(400).json(this.enviarErrorGenerico());
        }

        res.status(200).json(this.enviarExito())
    }

    public cerrarSesion = async (_req: Request, res: Response) => {
        res
            .clearCookie('access-token')
            .status(200).send();

    }

}

export default AuthController;