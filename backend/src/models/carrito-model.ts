import { CarritoProducto } from './carrito-producto.model';

export interface Carrito {
    id: number;
    productos: CarritoProducto[];
    total?: number;
}
