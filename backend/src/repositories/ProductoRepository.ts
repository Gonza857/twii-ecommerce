import { PrismaClient } from '@prisma/client';
import { undefined } from "zod";
import { Producto, ProductoDTO } from "../models/entities/producto";
import { IProductoRepository } from "../models/interfaces/repositories/producto.repository.interface";

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
        nombre?: string;
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

        if (filtros.nombre) {
            where.nombre = {
                contains: filtros.nombre,
                mode: 'insensitive'
            };
        }

        return this.prisma.producto.findMany({ where });
    }

    public async obtenerPorId(id: number): Promise<Producto | null> {
        return this.prisma.producto.findUnique({ where: { id } });

    }

    async create(data: ProductoDTO): Promise<number> {
        const productoCreado = await this.prisma.producto.create({ data });
        return productoCreado.id;
    }

    async update(id: number, data: ProductoDTO) {
        console.log("modificando prisma, id: " + id + data)
        return this.prisma.producto.update({ where: { id }, data, });
    }

    async update2(id: number, data: ProductoDTO) {
        console.log(`modificando prisma, id ${id}: `, data)
        await this.prisma.producto.update({ where: { id }, data, });
    }

    public async obtenerTotalProductos(): Promise<number> {
        return this.prisma.producto.count()
    }

    async delete(id: number) {
        await this.prisma.producto.delete({ where: { id } });
    }

    async save(data: Producto) {

    }
}
