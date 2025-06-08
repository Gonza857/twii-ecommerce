import {IResultadoAccion} from "./main-models";
import {ILogin, IRegister, IUsuario} from "./usuario-model";

export interface IAuthService {
    iniciarSesion(usuario: any): Promise<IResultadoAccion>;
    registrarse(usuarioNuevo: IRegister, usuarioExistente: ILogin | null): Promise<IResultadoAccion>,
    recuperarContrasena(usuario: ILogin | null): Promise<IResultadoAccion>
    cambiarContrasena(usuario: IUsuario | null, contrasenaNueva: string): Promise<IResultadoAccion>
}

export interface IUsuarioService {
    obtenerUsuarioPorId(id: string): Promise<IUsuario | null>
    obtenerUsuarioPorCorreo (email: string): Promise<ILogin | null>
    actualizarContrasena(id: string, contrasena: string): Promise<IResultadoAccion>
}

export interface IMailerService {
    enviarCorreo(to: string, subject: string, html: string): any
}
