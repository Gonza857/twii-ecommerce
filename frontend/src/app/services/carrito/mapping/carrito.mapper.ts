import {CarritoRest, CarritoProductoRest} from '../interfaces/carrito.interface.rest';
import {Carrito, CarritoProducto} from '../interfaces/carrito.interface';

class CarritoMapper {

    static mapToCarrito (carritoRest: CarritoRest): Carrito {
      return {
        productos: carritoRest.productos,
        total: carritoRest.total
      }
    }

    static mapToCarritoProducto (carritoProductoRest: CarritoProductoRest): CarritoProducto {
      return {
        id: carritoProductoRest.id,
        cantidad: carritoProductoRest.cantidad,
        carritoid: carritoProductoRest.carritoid,
        producto: carritoProductoRest.producto,
        productoid: carritoProductoRest.productoid
      }
    }
}

export default CarritoMapper
