import {Producto} from "../../entities/producto";
import {ProductoDTO} from "../producto-dto";

export interface IProductoRepository {
    obtenerPorId(id: number): Promise<Producto | null>;
    obtenerTodos(): Promise<Producto[]>;
    obtenerProductosFiltrados(filtros: {
        clasificacion?: string;
        precioMin?: number;
        precioMax?: number;
    }): Promise<Producto[]>;
    create(data: ProductoDTO): Promise<number>;
    update(id: number, data: ProductoDTO): Promise<Producto>;
    update2(id: number, data: ProductoDTO): Promise<void>
    delete(id: number): Promise<void>;
}

