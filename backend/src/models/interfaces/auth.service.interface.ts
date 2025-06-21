import {IResultadoAccion} from "../main-models";
import {Usuario, UsuarioLogin, UsuarioLoginDTO, UsuarioRegisterDTO} from "../usuario-model";

export interface IAuthService {
    iniciarSesion(usuario: UsuarioLogin | null, inputContrasena: string): Promise<void>
    recuperarContrasena(usuario: UsuarioLogin | null): Promise<IResultadoAccion>
    cambiarContrasena(usuario: UsuarioLogin | null, contrasenaNueva: string): Promise<string>
    registrarse(usuarioNuevo: UsuarioRegisterDTO, usuarioExistente: UsuarioLogin | null): Promise<UsuarioRegisterDTO>
    enviarCorreoConfirmacion(correo: string, token: string): Promise<string>
}
