import { PrismaClient } from '@prisma/client';
import { IProductoService } from '../models/services-interfaces';
import { Producto } from '../models/producto-model';

export class ProductoRepository implements IProductoService {
    private readonly prisma!: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async obtenerTodos(): Promise<Producto[]> {
        return await this.prisma.producto.findMany();
    }
}
