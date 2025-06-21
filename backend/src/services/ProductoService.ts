import { IProductoService } from '../models/services-interfaces';
import { Producto } from '../models/producto-model';
import { IProductoRepository } from '../models/repositories-interfaces';
import { ProductoDTO } from '../models/interfaces/producto-dto';

export class ProductoService implements IProductoService{

  private productoRepository!: IProductoRepository;
  
      constructor(productoRepository: IProductoRepository) {
  
          this.productoRepository = productoRepository;
      }
  
      
  async obtenerTodos(): Promise<Producto[]> {
    return await this.productoRepository.obtenerTodos();
  }

  async obtenerProductosFiltrados(filtros: {
        clasificacion?: string;
        precioMin?: number;
        precioMax?: number;
    }): Promise<Producto[]> {
    return await this.productoRepository.obtenerProductosFiltrados(filtros);
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