import { usuario } from './../../node_modules/.prisma/client/index.d';
import { PrismaClient } from '@prisma/client';
import {
    ICarritoRepository,
    IUsuarioRepository
} from '../models/repositories-interfaces';
import { ICarrito, IUsuario } from '../models/usuario-model';
import { Carrito } from '../models/carrito-model';

class CarritoRepository implements ICarritoRepository {
    private readonly prisma!: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async obtenerCarritoPorUsuario(id: number): Promise<ICarrito | null> {
        return this.prisma.carrito.findFirst({
            where: { usuarioid: id },
            include: {
                productos: {
                    include: {
                        producto: true
                    }
                }
            }
        });
    }

    /*agregarProductoAlCarrito(
        id: number,
        productoId: number,
        cantidad: number
    ): Promise<ICarrito | null> {
        const producto = this.prisma.producto.findUnique({
            where: { id: productoId }
        });

        return this.prisma.carrito.update({
            where: { id },
            data: {
                productos: {
                    create: {
                        productoid,
                        cantidad
                    }
                }
            },
            include: {
                productos: {
                    include: {
                        producto: true
                    }
                }
            }
        });
    }

    eliminarProductoDelCarrito(
        id: number,
        productoId: number
    ): Promise<ICarrito | null> {
        return this.prisma.carrito.update({
            where: { id },
            data: {
                productos: {
                    delete: {
                        productoId
                    }
                }
            },
            include: {
                productos: {
                    include: {
                        producto: true
                    }
                }
            }
        });
    }*/

    vaciarCarrito(id: number): Promise<ICarrito | null> {
        return this.prisma.carrito.update({
            where: { id },
            data: {
                productos: {
                    deleteMany: {}
                }
            },
            include: {
                productos: {
                    include: {
                        producto: true
                    }
                }
            }
        });
    }
}

export default CarritoRepository;
