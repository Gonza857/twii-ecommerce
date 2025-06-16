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

    /**
     * Obtiene el carrito de un usuario por su ID o crea uno si no existe.
     * @param id - ID del usuario.
     * @return El carrito del usuario.
     */
    async obtenerCarritoPorUsuario(id: number): Promise<ICarrito> {
        let carrito = await this.prisma.carrito.findFirst({
            where: { usuarioid: id },
            include: {
                productos: {
                    include: {
                        producto: true
                    }
                }
            }
        });

        if (!carrito) {
            // Si no se encuentra un carrito, se crea uno nuevo para el usuario
            carrito = await this.prisma.carrito.create({
                data: {
                    usuarioid: id,
                    productos: {
                        create: []
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

        return carrito;
    }

    /**
     * Agrega un producto al carrito del usuario.
     * @param id - ID del usuario.
     * @param productoId - ID del producto a agregar.
     * @param cantidad - Cantidad del producto a agregar.
     * @return El carrito actualizado o null si no se encuentra.
     */
    async agregarProductoAlCarrito(
        id: number,
        productoId: number,
        cantidad: number
    ): Promise<ICarrito> {
        const carrito = await this.obtenerCarritoPorUsuario(id);

        const productoEnCarrito = await this.prisma.carrito_producto.findFirst({
            where: { carritoid: carrito.id, productoid: productoId }
        });

        if (productoEnCarrito) {
            // El producto ya existe en el carrito, se actualiza la cantidad
            await this.prisma.carrito_producto.update({
                where: { id: productoEnCarrito.id },
                data: {
                    cantidad
                }
            });
        } else {
            // El producto no existe en el carrito, se crea una nueva entrada
            await this.prisma.carrito_producto.create({
                data: {
                    productoid: productoId,
                    carritoid: carrito.id,
                    cantidad
                }
            });
        }

        return carrito;
    }

    /**
     * Elimina un producto del carrito del usuario.
     * @param id - ID del usuario.
     * @param productoId - ID del producto a eliminar.
     * @return El carrito actualizado o null si no se encuentra.
     */
    async eliminarProductoDelCarrito(
        id: number,
        productoId: number
    ): Promise<ICarrito> {
        const carrito = await this.obtenerCarritoPorUsuario(id);

        const productoEnCarrito = await this.prisma.carrito_producto.findFirst({
            where: { carritoid: carrito.id, productoid: productoId }
        });

        if (!productoEnCarrito)
            throw new Error('Producto no encontrado en el carrito');

        return await this.prisma.carrito.update({
            where: { id },
            data: {
                productos: {
                    delete: {
                        id: productoId
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

    /**
     * Vacía el carrito del usuario.
     * @param id - ID del usuario.
     * @return El carrito actualizado.
     */
    async vaciarCarrito(id: number): Promise<ICarrito> {
        const carrito = await this.obtenerCarritoPorUsuario(id);

        return await this.prisma.carrito.update({
            where: { id: carrito.id },
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
