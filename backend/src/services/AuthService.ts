import {ILogin, IRegister, IUsuario} from "../models/usuario-model";
import {CorreoExistenteException, DatosIncorrectoException} from "../exceptions/UsuarioExceptions";
import {IResultadoAccion} from "../models/main-models";
import bcrypt from "bcrypt";
import {IAuthService, IMailerService} from "../models/services-interfaces";
import {IUsuarioRepository} from "../models/repositories-interfaces";
import {generarToken} from "../utils/jwt";
import usuarioRepository from "../repositories/UsuarioRepository";
import mailerService from "./MailerService";
import {undefined} from "zod";

class AuthService implements IAuthService {
    private readonly usuarioRepository!: IUsuarioRepository;
    private readonly mailerService!: IMailerService;

    constructor(usuarioRepository: IUsuarioRepository, mailerService: IMailerService) {
        this.usuarioRepository = usuarioRepository;
        this.mailerService = mailerService;
    }

    public async iniciarSesion(usuario: any): Promise<IResultadoAccion> {
        const usuarioEncontrado: ILogin | null = await this.usuarioRepository.obtenerPorEmail(usuario.email)

        if (!usuarioEncontrado)
            throw new DatosIncorrectoException("Datos incorrectos.")

        if (!await this.verificarContrasena(usuario.contrasena, usuarioEncontrado.contrasena))
            throw new DatosIncorrectoException("Datos incorrectos.")

        return {
            exito: true,
            mensaje: "Se inició sesión correctamente.",
            data: usuarioEncontrado.id
        }
    }

    public async registrarse(usuario: IRegister, encontrado: ILogin): Promise<IResultadoAccion> {
        if (encontrado != null) throw new CorreoExistenteException("El correo ya existe.");

        usuario.contrasena = await this.cifrarContrasena(usuario.contrasena);

        try {
            await this.usuarioRepository.crear(usuario);
            return {
                exito: true,
                mensaje: "Te registraste correctamente.",
            }
        } catch (error) {
            console.error(error);
            return {
                exito: false,
                mensaje: "Error al registrarse",
            }
        }
    }

    recuperarContrasena = async (usuario: ILogin | null): Promise<IResultadoAccion> => {
        if (!usuario) throw new DatosIncorrectoException("Datos incorrectos.")

        const token = generarToken({id: usuario.id})

        await this.mailerService.enviarCorreo(usuario.email, "Recuperación", getResetPasswordHTML(token))

        return {
            exito: true,
            mensaje: "Se ha enviado un correo de recuperación. Revisa tu bandeja de entrada.",
        }

    }

    private cifrarContrasena = async (plainPassword: string): Promise<string> => {
        const saltRounds = 10;
        return await bcrypt.hash(plainPassword, saltRounds);
    };

    private verificarContrasena = async (
        plainPassword: string,
        hashedPassword: string
    ): Promise<boolean> => {
        return await bcrypt.compare(plainPassword, hashedPassword);
    };

    public async cambiarContrasena(usuario: IUsuario | null, contrasenaNueva: string): Promise<IResultadoAccion> {
        if (!usuario) throw new DatosIncorrectoException("Datos incorrectos.")
        contrasenaNueva = await this.cifrarContrasena(contrasenaNueva)
        return {
            exito: true,
            mensaje: "Contraseña actualizada correctamente.",
            data: contrasenaNueva,
        }

    }

}

export default AuthService

const getResetPasswordHTML = (token: string) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recupera tu contraseña</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .logo {
            width: 100px;
            margin-bottom: 20px;
        }
        h1 {
            color: #333;
        }
        p {
            color: #555;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            padding: 12px 20px;
            background-color: #28a745;
            color: #ffffff !important;
            text-decoration: none;
            font-size: 18px;
            border-radius: 5px;
            margin-top: 20px;
            transition: all .3s;
        }
        .button:hover {
            background-color: #218838;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://via.placeholder.com/100" alt="Logo" class="logo">
        <h1>¿Olvidaste tu contraseña?</h1>
        <p>No te preocupes, puedes restablecerla haciendo clic en el botón de abajo:</p>
        <a href="http://localhost:4200/cambiar-contrasena/${token}" class="button">Restablecer contraseña</a>
        <p class="footer">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
    </div>
</body>
</html>
`
}