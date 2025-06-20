import { Carrito } from './carrito-model';
import { Producto } from './producto';

export interface CarritoProducto {
    id: number;
    cantidad: number;
    carrito: Carrito;
    producto: Producto;
}
