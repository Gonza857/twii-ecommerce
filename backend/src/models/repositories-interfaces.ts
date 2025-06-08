import {ILogin, IRegister, IUsuario} from "./usuario-model";

export interface IUsuarioRepository {
    obtenerPorEmail(email: string): Promise<ILogin | null>;
    obtenerPorId(id: number): Promise<IUsuario | null>;
    crear (usuario: IRegister): Promise<void>;
}