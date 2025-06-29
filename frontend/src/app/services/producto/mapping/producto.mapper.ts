import {EstadisticasProductosRest, ProductoRest} from '../interfaces/producto.interface.rest';
import {EstadisticasProductos, Producto, ProductoFormulario} from '../interfaces/producto.interface';
import Decimal from 'decimal.js';
import {FormGroup} from '@angular/forms';

class ProductoMapper {
  static mapToEstadisticasProducto (epr: EstadisticasProductosRest): EstadisticasProductos {
    return {
      productosTotales: epr.productosTotales
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
      imagen: productoRest.imagen,
      precio: new Decimal(productoRest.precio),
      nombre: productoRest.nombre,
      id: productoRest.id
    }
  }

}

export default ProductoMapper;
