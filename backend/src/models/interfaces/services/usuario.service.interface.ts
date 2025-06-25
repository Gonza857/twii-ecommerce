import {Usuario, UsuarioLogin, UsuarioLoginDTO, UsuarioRecoverDTO, UsuarioRegisterDTO} from "../usuario-model";
import {IResultadoAccion} from "../main-models";

export interface IUsuarioService {
    obtenerUsuarioParaLoginPorCorreo (email: string): Promise<UsuarioLogin | null>
    verificarCuentaValidada(id: number): Promise<void>
    obtenerUsuarioPorId(id: string): Promise<Usuario | null>
    actualizarContrasena(id: string, contrasena: string): Promise<IResultadoAccion>
    guardar(usuario: UsuarioRegisterDTO): Promise<number | null>
    obtenerTodos(): Promise<Usuario[]>
    cambiarEstadoCuenta(email: string): Promise<string>
}