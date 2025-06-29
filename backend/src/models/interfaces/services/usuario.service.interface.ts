
import {EstadisticasUsuarioDTO} from "../../DTO/estadisticas.usuario.dto";
import {IResultadoAccion} from "../../main-models";
import {Usuario, UsuarioLogin, UsuarioRegisterDTO} from "../../usuario-model";

export interface IUsuarioService {
    obtenerUsuarioParaLoginPorCorreo (email: string): Promise<UsuarioLogin | null>
    verificarCuentaValidada(id: number): Promise<void>
    obtenerUsuarioPorId(id: string): Promise<Usuario | null>
    actualizarContrasena(id: string, contrasena: string): Promise<IResultadoAccion>
    guardar(usuario: UsuarioRegisterDTO): Promise<number | null>
    obtenerTodos(): Promise<Usuario[]>
    cambiarEstadoCuenta(email: string): Promise<string>
    obtenerEstadisticas(): Promise<EstadisticasUsuarioDTO>
}