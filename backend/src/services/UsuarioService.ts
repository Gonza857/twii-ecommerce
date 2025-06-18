import {ILogin, IRegister, IUsuario} from "../models/usuario-model";
import {
    CuentaYaVerificadaException,
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

    public async guardar(usuario: IRegister): Promise<number | null> {
        return await this.usuarioRepository.crear(usuario);
    }

    public async obtenerUsuarioPorCorreo (email: string): Promise<ILogin | null> {
        if (email.length < 1) throw new DatosIncorrectoException("E-mail incorrecto.");
        return await this.usuarioRepository.obtenerPorEmail(email);
    }

    async actualizarContrasena(id: string, contrasena: string): Promise<IResultadoAccion> {
        await this.usuarioRepository.actualizarContrasena(Number(id), contrasena);
        return {
            exito: true,
            mensaje: "Contraseña actualizada correctamente.",
        }
    }

    async cambiarEstadoCuenta (id: string) {
        const usuario = await this.usuarioRepository.obtenerPorId(Number(id));
        if (usuario?.validado) {
            throw new CuentaYaVerificadaException("El usuario ya está validado")
        }
        if (!usuario) throw new DatosIncorrectoException("Ocurrió un error");
        await this.usuarioRepository.actualizarEstado(true, usuario?.id)
        return "Cuenta confirmada correctamente";
    }

    async obtenerTodos(): Promise<IUsuario[]> {
        return await this.usuarioRepository.obtenerTodos()
    }

    async verificarCuentaValidada(id: number | undefined): Promise<void> {
        if (!id) throw new Error("error amigo")
        const usuario = await this.usuarioRepository.obtenerPorId(id)
        if (!usuario?.validado) throw new Error("error amigo: no validado")
    }

}

export default UsuarioService;