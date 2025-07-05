import {
    Clasificacion,
    Producto,
    ProductoCrearDTO,
    ProductoDTO,
    ProductoEditarDTO
} from "../models/entities/producto";
import {IProductoService} from "../models/interfaces/services/producto.service.interface";
import {IProductoRepository} from "../models/interfaces/repositories/producto.repository.interface";
import {IImagenService} from "../models/interfaces/services/imagen.service.interface";
import {ArchivoDTO} from "../models/DTO/archivo.dto";
import {Decimal} from "@prisma/client/runtime/library";
import {EstadisticasProductoDTO} from "../models/DTO/estadisticas.producto.dto";

class ProductoService implements IProductoService {

    private readonly productoRepository!: IProductoRepository;
    private readonly imagenService!: IImagenService

    constructor(productoRepository: IProductoRepository, imagenService: IImagenService) {
        this.productoRepository = productoRepository;
        this.imagenService = imagenService;
    }

    public async obtenerTodos(): Promise<Producto[]> {
        return await this.productoRepository.obtenerTodos();
    }

    public async obtenerProductosFiltrados(filtros: {
        clasificacion?: number;
        precioMin?: number;
        precioMax?: number;
        nombre?: string;
    }): Promise<Producto[]> {
        return await this.productoRepository.obtenerProductosFiltrados(filtros);
    }

    public async obtenerClasificaciones(): Promise<Clasificacion[]> {
        return await this.productoRepository.obtenerClasificaciones();
    }

    public async obtenerPorId(id: number): Promise<Producto | null> {
        return await this.productoRepository.obtenerPorId(id);
    }

    obtenerProductoPorId(id: number): Promise<Producto | null> {
        return this.productoRepository.obtenerPorId(id);
    }

    async crearProducto(data: ProductoCrearDTO, imagen: ArchivoDTO): Promise<void> {
        const productoNuevo: ProductoDTO = {
            imagen: null,
            idclasificacion: data.clasificacion,
            precio: new Decimal(data.precio.toString()),
            nombre: data.nombre,
            descripcion: data.descripcion,
        }
        const idProductoCreado = await this.productoRepository.create(productoNuevo);

        if (imagen) {
            const urlImagen = await this.imagenService.guardarImagen(idProductoCreado, imagen)
            if (!urlImagen) return;
            await this.guardarImagenProducto(urlImagen, idProductoCreado)
        }
    }

    private async establecerImagenNueva(
        archivo: ArchivoDTO | null,
        id: number,
        data: ProductoEditarDTO
    ): Promise<void> {
        if (archivo) {
            data.imagen = await this.imagenService.guardarImagen(id, archivo);
        }
    }

    private async eliminarAnteriorAndEstablecerImagenNueva(
        archivo: ArchivoDTO | null,
        id: number,
        data: ProductoEditarDTO
    ): Promise<void> {
        if (data.cambioImagen) {
            // Tenia y la cambio
            if (archivo) {
                await this.imagenService.eliminarImagen(id);
                data.imagen = await this.imagenService.guardarImagen(id, archivo)
            }
        } else {
            // Tenia y no la cambió
        }
    }

    public async actualizarProducto(
        id: number, data: ProductoEditarDTO,
        archivo: ArchivoDTO | null = null
    ): Promise<void> {
        const productoDB = await this.productoRepository.obtenerPorId(id)
        if (!productoDB) throw new Error("Producto inexistente")

        const tieneImagenEstablecida: boolean = await this.saberSiProductoTieneImagen(id);

        // Si corresponde
        if (tieneImagenEstablecida) await this.eliminarAnteriorAndEstablecerImagenNueva(archivo, id, data)
        await this.establecerImagenNueva(archivo, id, data)

        const productoActualizado: ProductoDTO = {
            imagen: data.imagen,
            idclasificacion: data.clasificacion,
            precio: new Decimal(data.precio.toString()),
            nombre: data.nombre,
            descripcion: data.descripcion,
        }

        await this.productoRepository.update(id, productoActualizado);
    }

    eliminarProducto(id: number): Promise<void> {
        return this.productoRepository.delete(id);
    }

    async guardarImagenProducto(url: string, idProducto: number): Promise<void> {
        const producto: Producto | null = await this.productoRepository.obtenerPorId(idProducto);
        if (!producto) return;
        producto.imagen = url;
        const productoDTO: ProductoDTO = {
            imagen: producto.imagen,
            idclasificacion: producto.idclasificacion,
            descripcion: producto.descripcion,
            nombre: producto.nombre,
            precio: producto.precio
        }
        await this.productoRepository.update(idProducto, productoDTO);
    }

    public async saberSiProductoTieneImagen(id: number): Promise<boolean> {
        const producto: Producto | null = await this.productoRepository.obtenerPorId(id);
        if (!producto) return false;
        return producto.imagen != null
    }

    public async obtenerEstadisticas(): Promise<EstadisticasProductoDTO> {
        return {
            productosTotales: await this.productoRepository.obtenerTotalProductos()
        }
    }
}

export default ProductoService;