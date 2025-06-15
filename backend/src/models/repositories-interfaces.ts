import { Carrito } from './carrito-model';
import { ICarrito, ILogin, IRegister, IUsuario } from './usuario-model';

export interface IUsuarioRepository {
    obtenerPorEmail(email: string): Promise<ILogin | null>;
    obtenerPorId(id: number): Promise<IUsuario | null>;
    crear(usuario: IRegister): Promise<void>;
    actualizarContrasena(id: number, contrasena: string): Promise<void>;
    obtenerTodos(): Promise<IUsuario[]>;
    actualizarEstado(estado: boolean, id: number): Promise<void>;
}

export interface ICarritoRepository {
    obtenerCarritoPorUsuario(id: number): Promise<ICarrito | null>;
    agregarProductoAlCarrito(
        id: number,
        productoId: number,
        cantidad: number
    ): Promise<ICarrito | null>;
    eliminarProductoDelCarrito(
        id: number,
        productoId: number
    ): Promise<ICarrito | null>;
    vaciarCarrito(id: number): Promise<ICarrito | null>;
}
