import {IResultadoAccion} from "./main-models";
import {ILogin, IRegister, IUsuario} from "./usuario-model";

export interface IAuthService {
    iniciarSesion(usuario: any): Promise<IResultadoAccion>;

    registrarse(usuarioNuevo: IRegister, usuarioExistente: ILogin | null): Promise<IResultadoAccion>,

    recuperarContrasena(email: string): Promise<IResultadoAccion>
}

export interface IUsuarioService {
    obtenerUsuarioPorId(id: string): Promise<IUsuario | null>

}
