import {ILogin, IRegister, IUsuario, IUsuarioLogin} from "../models/usuario-model";
import {PrismaClient} from "@prisma/client";
import {
    CorreoExistenteException,
    DatosIncorrectoException,
} from "../exceptions/UsuarioExceptions";
import {IUsuarioRepository} from "../models/repositories-interfaces";
import {IResultadoAccion} from "../models/main-models";
import {IUsuarioService} from "../models/services-interfaces"

class UsuarioService implements IUsuarioService {
    private usuarioRepository!: IUsuarioRepository;

    constructor(usuarioRepository: IUsuarioRepository) {

        this.usuarioRepository = usuarioRepository;
    }

    public async obtenerUsuarioPorId(id: string): Promise<IUsuario | null> {
        // Lógica para buscar usuario en la BD
        const idBuscado = Number(id);
        // if (typeof id === "NaN") throw new DatosIncorrectoException("El correo no existe.");
        const usuario = await this.usuarioRepository.obtenerPorId(idBuscado);

        if (!usuario) return null;

        return usuario;
    }

    public async guardar(usuario: IRegister): Promise<IResultadoAccion> {
        await this.usuarioRepository.crear(usuario);
        return {
            exito: true,
            mensaje: "Te registraste correctamente.",
        }
    }

    public async obtenerUsuarioPorCorreo (email: string): Promise<ILogin | null> {
        if (email.length < 1) throw new DatosIncorrectoException("E-mail incorrecto.");
        return await this.usuarioRepository.obtenerPorEmail(email);
    }

    async actualizarContrasena(id: string, contrasena: string): Promise<IResultadoAccion> {
        console.log(`cambiando pass al id: ${id} nueva pass ${contrasena}`);
        await this.usuarioRepository.actualizarContrasena(Number(id), contrasena);
        return {
            exito: true,
            mensaje: "Contraseña actualizada correctamente.",
        }
    }

}

export default UsuarioService;