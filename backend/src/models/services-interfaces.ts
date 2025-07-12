import { ICarrito } from "./usuario-model";

export interface IMailerService {
    enviarCorreo(to: string, subject: string, html: string): any;
}

export interface ICarritoService {
    obtenerCarritoPorUsuario(id: number): Promise<ICarrito>;
    agregarProductoAlCarrito(
        id: number,
        productoId: number,
        cantidad: number
    ): Promise<ICarrito>;
    eliminarProductoDelCarrito(id: number, productoId: number): Promise<ICarrito>;
    vaciarCarrito(id: number): Promise<ICarrito>;
}


