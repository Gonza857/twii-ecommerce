import Decimal from 'decimal.js';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  clasificacion: string;
  precio: Decimal;
  imagen: string | null;
}
