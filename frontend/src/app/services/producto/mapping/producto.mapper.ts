import {ProductoRest} from '../interfaces/producto.interface.rest';
import {Producto} from '../interfaces/producto.interface';
import Decimal from 'decimal.js';

class ProductoMapper {
  static mapToProductoRest(producto: Producto): ProductoRest {
    return {
      clasificacion: producto.clasificacion,
      descripcion: producto.descripcion,
      imagen: producto.descripcion,
      precio: producto.precio.toString(),
      nombre: producto.nombre,
      id: producto.id
    }
  }

  static mapToProducto(productoRest: ProductoRest): Producto {
    return {
      clasificacion: productoRest.clasificacion,
      descripcion: productoRest.descripcion,
      imagen: productoRest.descripcion,
      precio: new Decimal(productoRest.precio),
      nombre: productoRest.nombre,
      id: productoRest.id
    }
  }

}

export default ProductoMapper;
