import { Carrito } from './carrito-model';
import {Producto} from "./entities/producto";

export interface CarritoProducto {
    id: number;
    cantidad: number;
    carrito: Carrito;
    producto: Producto;
}
