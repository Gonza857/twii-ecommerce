import {Usuario, UsuarioLogin, UsuarioRegisterDTO} from "../usuario-model";

export interface IUsuarioRepository {
    obtenerPorEmailParaLogin(email: string): Promise<UsuarioLogin | null>;
    obtenerPorId(id: number): Promise<Usuario | null>;
    crear (usuario: UsuarioRegisterDTO): Promise<number | null>;
    actualizarContrasena(id: number, contrasena: string): Promise<void>;
    obtenerTodos(): Promise<Usuario[]>;
    actualizarEstado(estado: boolean, id: number | undefined): Promise<void>;
}