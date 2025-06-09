import { IProductoService } from '../models/services-interfaces';
import { Producto } from '../models/producto-model';
import { IProductoRepository } from '../models/repositories-interfaces';

export class ProductoService implements IProductoService{

  private productoRepository!: IProductoRepository;
  
      constructor(productoRepository: IProductoRepository) {
  
          this.productoRepository = productoRepository;
      }
      
  async obtenerTodos(): Promise<Producto[]> {
    return await this.productoRepository.obtenerTodos();
  }
  
}

export default ProductoService;