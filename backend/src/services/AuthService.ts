import {ILogin, IRegister} from "../models/usuario-model";
import {CorreoExistenteException, DatosIncorrectoException} from "../exceptions/UsuarioExceptions";
import {IResultadoAccion} from "../models/main-models";
import bcrypt from "bcrypt";
import {IAuthService} from "../models/services-interfaces";
import {IUsuarioRepository} from "../models/repositories-interfaces";

class AuthService implements IAuthService {
    private readonly usuarioRepository!: IUsuarioRepository;

    constructor(usuarioRepository: IUsuarioRepository) {
        this.usuarioRepository = usuarioRepository;
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
        }
    }

    public async registrarse(usuario: IRegister, encontrado: ILogin): Promise<IResultadoAccion> {
        if (encontrado != null) throw new CorreoExistenteException("El correo ya existe.");

        usuario.contrasena = await this.cifrarContrasena(usuario.contrasena);

        try {
            await this.usuarioRepository.crear(usuario);
            console.log("Creado!")
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

    recuperarContrasena = async (email: string): Promise<IResultadoAccion> => {
        const usuarioBuscado = await this.usuarioRepository.obtenerPorEmail(email);

        if (!usuarioBuscado) throw new DatosIncorrectoException("Datos incorrectos.")

        return {
            exito: true,
            mensaje: "Recuperar OK",
            data: usuarioBuscado.email
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


}

export default AuthService