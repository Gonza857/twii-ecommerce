import {Decimal} from "@prisma/client/runtime/library";


export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    clasificacion: string;
    precio: Decimal;
    imagen: string | null;
}