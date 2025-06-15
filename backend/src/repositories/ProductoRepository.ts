import { PrismaClient } from '@prisma/client';
import { IProductoService } from '../models/services-interfaces';
import { Producto } from '../models/producto-model';
import { IProductoRepository } from '../models/repositories-interfaces';
import {undefined} from "zod";

export class ProductoRepository implements IProductoRepository {
    private readonly prisma!: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async obtenerTodos(): Promise<Producto[]> {
        return this.prisma.producto.findMany();
    }

    async obtenerProductosFiltrados(filtros: {
        clasificacion?: string;
        precioMin?: number;
        precioMax?: number;
    }): Promise<Producto[]> {
        const where: any = {};

        if (filtros.clasificacion) {
            where.clasificacion = {
                equals: filtros.clasificacion,
                mode: 'insensitive'
            };
        }

        // @ts-ignore
        if (filtros.precioMin !== undefined || filtros.precioMax !== undefined) {
            where.precio = {};

            // @ts-ignore
            if (filtros.precioMin !== undefined) {
                where.precio.gte = filtros.precioMin;
            }

            // @ts-ignore
            if (filtros.precioMax !== undefined) {
                where.precio.lte = filtros.precioMax;
            }
        }

        return this.prisma.producto.findMany({where});
    }
}
