import {Decimal} from "@prisma/client/runtime/library";
import {z} from "zod";
import {imagenProductoSchema, productoEditarSchema, productoSchema} from "../../schemas/producto.schema";

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    idclasificacion: number;
    clasificacion: { id: number; nombre: string; }
    precio: Decimal;
    imagen: string | null;
}

export interface ProductoDTO {
    nombre: string;
    descripcion: string;
    idclasificacion: number;
    precio: Decimal;
    imagen: string | null | undefined;
}

export interface Clasificacion {
    id: number;
    nombre: string;
}

export type ImagenProductoDTO = z.infer<typeof imagenProductoSchema>;
export type ProductoCrearDTO = z.infer<typeof productoSchema>;
export type ProductoEditarDTO = z.infer<typeof productoEditarSchema>;