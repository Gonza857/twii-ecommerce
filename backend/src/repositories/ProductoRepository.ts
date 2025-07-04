import {Prisma, PrismaClient} from '@prisma/client';
import {IProductoRepository} from "../models/interfaces/repositories/producto.repository.interface";
import {Clasificacion, Producto, ProductoDTO} from "../models/entities/producto";

export class ProductoRepository implements IProductoRepository {
    private readonly prisma!: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async obtenerTodos(): Promise<Producto[]> {
        return this.prisma.producto.findMany({
            include: {
                clasificacion: true
            }
        })
    }

    public async obtenerProductosFiltrados(filtros: {
        clasificacion?: number;
        precioMin?: number;
        precioMax?: number;
        nombre?: string;
    }): Promise<Producto[]> {
        const where: Prisma.productoWhereInput = {};
        if (filtros.clasificacion !== undefined && filtros.clasificacion !== null) {
            where.idclasificacion = filtros.clasificacion;
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

        return this.prisma.producto.findMany({
            where,
            include: {
                clasificacion: true // para devolver también el nombre de la clasificación
            }
        });
    }

    public async obtenerPorId(id: number): Promise<Producto | null> {
        return this.prisma.producto.findUnique({
            where: {id},
            include: {
                clasificacion: true
            }
        });
    }

    public async obtenerClasificaciones(): Promise<Clasificacion[]> {
        return this.prisma.clasificacion.findMany({
            orderBy: {nombre: 'asc'}
        });
    }

    async create(data: ProductoDTO): Promise<number> {
        const productoCreado = await this.prisma.producto.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                imagen: data.imagen,
                clasificacion: {
                    connect: { id: data.idclasificacion }
                }
            }
        });
        return productoCreado.id;
    }

    async update(id: number, data: ProductoDTO) {
        await this.prisma.producto.update({where: {id}, data,});
    }


    public async obtenerTotalProductos(): Promise<number> {
        return this.prisma.producto.count()
    }

    async delete(id: number) {
        await this.prisma.producto.delete({where: {id}});
    }

    async save(data: Producto) {

    }
}
