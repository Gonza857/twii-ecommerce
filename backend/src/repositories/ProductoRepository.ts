import { PrismaClient } from '@prisma/client';
import { IProductoService } from '../models/services-interfaces';
import { Producto } from '../models/producto-model';
import { IProductoRepository } from '../models/repositories-interfaces';

export class ProductoRepository implements IProductoRepository {
    private readonly prisma!: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async obtenerTodos(): Promise<Producto[]> {
        return await this.prisma.producto.findMany();
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

        if (filtros.precioMin !== undefined || filtros.precioMax !== undefined) {
            where.precio = {};

            if (filtros.precioMin !== undefined) {
                where.precio.gte = filtros.precioMin;
            }

            if (filtros.precioMax !== undefined) {
                where.precio.lte = filtros.precioMax;
            }
        }

        return await this.prisma.producto.findMany({ where });
    }
}
