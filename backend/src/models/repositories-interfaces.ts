import { Producto } from './producto-model';
import {ILogin, IRegister, IUsuario} from "./usuario-model";

export interface IUsuarioRepository {
    obtenerPorEmail(email: string): Promise<ILogin | null>;
    obtenerPorId(id: number): Promise<IUsuario | null>;
    crear (usuario: IRegister): Promise<void>;
    actualizarContrasena(id: number, contrasena: string): Promise<void>;
    obtenerTodos(): Promise<IUsuario[]>
    actualizarEstado(estado: boolean, id: number | undefined): Promise<void>
}

export interface IProductoRepository{
    obtenerTodos(): Promise<Producto[]>
    obtenerProductosFiltrados(filtros: {
        clasificacion?: string;
        precioMin?: number;
        precioMax?: number;
    }): Promise<Producto[]>
}