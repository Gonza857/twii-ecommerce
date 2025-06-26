import {Producto, ProductoCrearDTO, ProductoDTO, ProductoEditarDTO} from "../models/entities/producto";
import {IProductoService} from "../models/interfaces/services/producto.service.interface";
import {IProductoRepository} from "../models/interfaces/repositories/producto.repository.interface";
import {Decimal} from "@prisma/client/runtime/library";

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
        nombre?: string;
    }): Promise<Producto[]> {
        return await this.productoRepository.obtenerProductosFiltrados(filtros);
    }

    public async obtenerPorId(id: number): Promise<Producto | null> {
        return await this.productoRepository.obtenerPorId(id);
    }

    obtenerProductoPorId(id: number): Promise<Producto | null> {
        return this.productoRepository.obtenerPorId(id);
    }

    async crearProducto(data: ProductoCrearDTO): Promise<number> {
        const productoNuevo: ProductoDTO= {
            imagen: null,
            clasificacion: data.clasificacion,
            precio: new Decimal(data.precio.toString()),
            nombre: data.nombre,
            descripcion: data.descripcion,
        }
        console.log("SERVICIO PRODUCTO: este producto creo", productoNuevo)
        return await this.productoRepository.create(productoNuevo);
    }

    actualizarProducto(id: number, data: ProductoEditarDTO): Promise<Producto> {
        const productoActualizado: ProductoDTO= {
            imagen: data.imagen,
            clasificacion: data.clasificacion,
            precio: new Decimal(data.precio.toString()),
            nombre: data.nombre,
            descripcion: data.descripcion,
        }
        return this.productoRepository.update(id, productoActualizado);
    }

    eliminarProducto(id: number): Promise<void> {
        return this.productoRepository.delete(id);
    }

    async guardarImagenProducto(url: string, idProducto: number): Promise<void> {
        const producto: Producto | null = await this.productoRepository.obtenerPorId(idProducto);
        if (!producto) return;
        producto.imagen = url;
        const { id, ...dataSinId } = producto;
        await this.productoRepository.update2(idProducto, dataSinId);
    }

    public async saberSiProductoTieneImagen(id: number): Promise<boolean> {
        const producto: Producto | null = await this.productoRepository.obtenerPorId(id);
        if (!producto) return false;
        return producto.imagen != null
    }
}

export default ProductoService;