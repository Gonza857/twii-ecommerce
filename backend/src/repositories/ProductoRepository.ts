import { PrismaClient } from '@prisma/client';
import {IProductoRepository} from "../models/interfaces/producto.repository.interface";
import {Producto} from "../models/entities/producto";

export class ProductoRepository implements IProductoRepository {
    private readonly prisma!: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async obtenerTodos(): Promise<Producto[]> {
        return this.prisma.producto.findMany();
    }

    public async obtenerProductosFiltrados(filtros: {
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

    public async obtenerPorId(id: number): Promise<Producto | null> {
        return this.prisma.producto.findUnique({where: {id}});

    }
}
