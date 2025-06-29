import {
    Usuario,
    UsuarioLogin,
    UsuarioRegisterDTO
} from "../models/usuario-model";
import {
    CuentaYaVerificadaException,
    DatosIncorrectoException,
} from "../exceptions/UsuarioExceptions";
import {IResultadoAccion} from "../models/main-models";
import {IUsuarioService} from "../models/interfaces/services/usuario.service.interface";
import {IUsuarioRepository} from "../models/interfaces/repositories/usuario.repository.interface";
import {EstadisticasUsuarioDTO} from "../models/DTO/estadisticas.usuario.dto";

class UsuarioService implements IUsuarioService {

    private usuarioRepository!: IUsuarioRepository;

    constructor(usuarioRepository: IUsuarioRepository) {

        this.usuarioRepository = usuarioRepository;
    }

    public async obtenerUsuarioPorId(id: string): Promise<Usuario | null> {
        debugger;
        console.log(`piden por id ${id}`)
        // Lógica para buscar usuario en la BD
        const idBuscado = Number(id);
        if (isNaN(idBuscado)) throw new DatosIncorrectoException("No se pudo encontrar un usuario");
        return await this.usuarioRepository.obtenerPorId(idBuscado);
    }

    public async guardar(usuario: UsuarioRegisterDTO): Promise<number | null> {
        return await this.usuarioRepository.crear(usuario);
    }

    public async obtenerUsuarioParaLoginPorCorreo(email: string): Promise<UsuarioLogin | null> {
        if (email.length < 1) throw new DatosIncorrectoException("E-mail incorrecto.");
        return await this.usuarioRepository.obtenerPorEmailParaLogin(email);
    }


    async actualizarContrasena(id: string, contrasena: string): Promise<IResultadoAccion> {
        await this.usuarioRepository.actualizarContrasena(Number(id), contrasena);
        return {
            exito: true,
            mensaje: "Contraseña actualizada correctamente.",
        }
    }

    async cambiarEstadoCuenta(id: string) {
        const usuario = await this.usuarioRepository.obtenerPorId(Number(id));
        if (usuario?.validado) {
            throw new CuentaYaVerificadaException("El usuario ya está validado")
        }
        if (!usuario) throw new DatosIncorrectoException("Ocurrió un error");
        await this.usuarioRepository.actualizarEstado(true, usuario?.id)
        return "Cuenta confirmada correctamente";
    }

    async obtenerTodos(): Promise<Usuario[]> {
        return await this.usuarioRepository.obtenerTodos()
    }

    async verificarCuentaValidada(id: number): Promise<void> {
        if (!id) throw new Error("error amigo")
        const usuario = await this.usuarioRepository.obtenerPorId(id)
        if (!usuario?.validado) throw new Error("error amigo: no validado")
    }

    public async obtenerEstadisticas(): Promise<EstadisticasUsuarioDTO> {
        return {
            usuariosTotales: await this.usuarioRepository.obtenerTotal(),
            usuariosValidados: await this.usuarioRepository.obtenerValidados(),
            usuariosSinValidar: await this.usuarioRepository.obtenerSinValidar(),
        }

    }

}

export default UsuarioService;