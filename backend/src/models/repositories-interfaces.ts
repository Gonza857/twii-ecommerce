import {ICarrito} from "./usuario-model";

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

