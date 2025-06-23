import {IProductoService} from "../models/services-interfaces";
import {IProductoRepository} from "../models/interfaces/producto.repository.interface";
import {Producto} from "../models/entities/producto";
import { ProductoDTO } from '../models/interfaces/producto-dto';

class ProductoService implements IProductoService {

    private readonly productoRepository!: IProductoRepository;

    constructor(productoRepository: IProductoRepository) {
        this.productoRepository = productoRepository;
    }

    public async obtenerTodos(): Promise<Producto[]> {
        return await this.productoRepository.obtenerTodos();
    }

    public async obtenerProductosFiltrados(filtros: {
        clasificacion?: string;
        precioMin?: number;
        precioMax?: number;
    }): Promise<Producto[]> {
        return await this.productoRepository.obtenerProductosFiltrados(filtros);
    }

    public async obtenerPorId(id: number): Promise<Producto | null> {
        return await this.productoRepository.obtenerPorId(id);
    }

    obtenerProductoPorId(id: number): Promise<Producto | null> {
        return this.productoRepository.getById(id);
    }

    crearProducto(data: ProductoDTO): Promise<Producto> {
        return this.productoRepository.create(data);
    }

    actualizarProducto(id: number, data: ProductoDTO): Promise<Producto> {
        return this.productoRepository.update(id, data);
    }

    eliminarProducto(id: number): Promise<void> {
        return this.productoRepository.delete(id);
    }
}

export default ProductoService;