import { ProductoRest} from '../interfaces/producto.interface.rest';
import {Producto, ProductoFormulario} from '../interfaces/producto.interface';
import Decimal from 'decimal.js';
import {FormGroup} from '@angular/forms';

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

  static mapProductoFormularioToRest (form: FormGroup): ProductoFormulario {
    return {
      nombre: form.get("nombre")?.value,
      descripcion: form.get("descripcion")?.value,
      clasificacion: form.get("clasificacion")?.value,
      precio: form.get("precio")?.value,
      imagen: form.get("imagen")?.value,
      cambioImagen: form.get("cambioImagen")?.value,
    }
  }

  static mapProductoArrayRestToProductoArray (productos: ProductoRest[]): Producto[] {
    return productos.map(p => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: new Decimal(p.precio.toString()),
      clasificacion: p.clasificacion,
      imagen: p.imagen,
      // ... otros campos que tengas
    }));
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
