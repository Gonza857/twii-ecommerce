import { Producto } from './producto-model';
import {ICarrito, ILogin, IRegister, IUsuario} from "./usuario-model";

export interface IUsuarioRepository {
    obtenerPorEmail(email: string): Promise<ILogin | null>;
    obtenerPorId(id: number): Promise<IUsuario | null>;
    crear (usuario: IRegister): Promise<number | null>;
    actualizarContrasena(id: number, contrasena: string): Promise<void>;
    obtenerTodos(): Promise<IUsuario[]>;
    actualizarEstado(estado: boolean, id: number | undefined): Promise<void>;
}

export interface ICarritoRepository {
    obtenerCarritoPorUsuario(id: number): Promise<ICarrito>;
    agregarProductoAlCarrito(
        id: number,
        productoId: number,
        cantidad: number
    ): Promise<ICarrito>;
    eliminarProductoDelCarrito(
        id: number,
        productoId: number
    ): Promise<ICarrito>;
    vaciarCarrito(id: number): Promise<ICarrito>;
}

export interface IProductoRepository {
    obtenerTodos(): Promise<Producto[]>;
    obtenerProductosFiltrados(filtros: {
        clasificacion?: string;
        precioMin?: number;
        precioMax?: number;
    }): Promise<Producto[]>;
}