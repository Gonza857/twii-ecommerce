import {Producto, ProductoCrearDTO, ProductoDTO, ProductoEditarDTO} from "../../entities/producto";

export interface IProductoService {
    obtenerPorId(id: number): Promise<Producto | null>;
    obtenerTodos(): Promise<Producto[]>;
    obtenerProductosFiltrados(filtros: {
        clasificacion?: string;
        precioMin?: number;
        precioMax?: number;
    }): Promise<Producto[]>;
    obtenerProductoPorId(id: number): Promise<Producto | null>;
    crearProducto(data: ProductoCrearDTO): Promise<number>;
    actualizarProducto(id: number, data: ProductoEditarDTO): Promise<Producto>;
    eliminarProducto(id: number): Promise<void>;
    guardarImagenProducto(url: string, idProducto: number): Promise<void>;
    saberSiProductoTieneImagen(id: number): Promise<boolean>;
}