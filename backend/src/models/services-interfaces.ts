import {Producto} from "./entities/producto";

export interface IMailerService {
    enviarCorreo(to: string, subject: string, html: string): any;
}

export interface ICarritoService {
    obtenerCarritoPorUsuario(id: number): Promise<any>;
    agregarProductoAlCarrito(
        id: number,
        productoId: number,
        cantidad: number
    ): Promise<any>;
    eliminarProductoDelCarrito(id: number, productoId: number): Promise<any>;
    vaciarCarrito(id: number): Promise<any>;
}

export interface IProductoService {
    obtenerPorId(id: number): Promise<Producto | null>;
    obtenerTodos(): Promise<Producto[]>;
    obtenerProductosFiltrados(filtros: {
        clasificacion?: string;
        precioMin?: number;
        precioMax?: number;
    }): Promise<Producto[]>;
}
