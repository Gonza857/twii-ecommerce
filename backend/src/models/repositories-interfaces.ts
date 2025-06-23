import { ProductoDTO } from './interfaces/producto-dto';
import { Producto } from './producto-model';
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

export interface IProductoRepository {
    obtenerTodos(): Promise<Producto[]>;
    obtenerProductosFiltrados(filtros: {
        clasificacion?: string;
        precioMin?: number;
        precioMax?: number;
    }): Promise<Producto[]>;
    getById(id: number): Promise<Producto | null>;
    create(data: ProductoDTO): Promise<Producto>;
    update(id: number, data: ProductoDTO): Promise<Producto>;
    delete(id: number): Promise<void>;
}
