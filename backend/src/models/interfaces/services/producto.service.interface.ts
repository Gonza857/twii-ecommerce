import {Clasificacion, ImagenProductoDTO, Producto, ProductoCrearDTO, ProductoDTO, ProductoEditarDTO} from "../../entities/producto";
import {ArchivoDTO} from "../../DTO/archivo.dto";

export interface IProductoService {
    obtenerPorId(id: number): Promise<Producto | null>;
    obtenerTodos(): Promise<Producto[]>;
    obtenerProductosFiltrados(filtros: {
        clasificacion?: number;
        precioMin?: number;
        precioMax?: number;
        nombre?: string;
    }): Promise<Producto[]>;
    obtenerClasificaciones(): Promise<Clasificacion[]>;
    obtenerProductoPorId(id: number): Promise<Producto | null>;
    crearProducto(data: ProductoCrearDTO, imagen: ArchivoDTO): Promise<void>;
    actualizarProducto(id: number, data: ProductoEditarDTO, archivo: ArchivoDTO | null): Promise<Producto>;
    eliminarProducto(id: number): Promise<void>;
    guardarImagenProducto(url: string, idProducto: number): Promise<void>;
    saberSiProductoTieneImagen(id: number): Promise<boolean>;
}