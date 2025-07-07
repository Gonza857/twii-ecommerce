import {Clasificacion, Producto, ProductoDTO} from "../../entities/producto";

export interface IProductoRepository {
    obtenerPorId(id: number): Promise<Producto | null>;
    obtenerTodos(): Promise<Producto[]>;
    obtenerProductosFiltrados(filtros: {
        clasificacion?: number;
        precioMin?: number;
        precioMax?: number;
        nombre?: string;
    }): Promise<Producto[]>;
    //obtenerClasificaciones(): Promise<Clasificacion[]>;
    create(data: ProductoDTO): Promise<number>;
    update(id: number, data: ProductoDTO): Promise<void>;
    delete(id: number): Promise<void>;
    obtenerTotalProductos(): Promise<number>

}

