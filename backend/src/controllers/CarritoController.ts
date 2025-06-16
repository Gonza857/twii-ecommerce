import { Request, Response } from 'express';
import { IUsuario } from '../models/usuario-model';
import {
    ICarritoService,
    IUsuarioService
} from '../models/services-interfaces';
import { AuthenticatedRequest } from '../models/main-models';
import { ca } from 'zod/v4/locales';

export class CarritoController {
    private carritoService!: ICarritoService;

    constructor(carritoService: ICarritoService) {
        this.carritoService = carritoService;
    }

    public obtenerCarritoPorUsuario = async (
        _req: AuthenticatedRequest,
        res: Response
    ) => {
        const { id } = _req.params;

        try {
            const carritoEncontrado =
                await this.carritoService.obtenerCarritoPorUsuario(Number(id));

            res.status(200).json(carritoEncontrado);
        } catch (e) {
            res.status(500).json({ message: 'Error', error: e });
        }
    };

    public agregarProductoAlCarrito = async (
        _req: AuthenticatedRequest,
        res: Response
    ) => {
        const { id } = _req.params;
        const { productoId, cantidad } = _req.body;

        try {
            const carritoActualizado =
                await this.carritoService.agregarProductoAlCarrito(
                    Number(id),
                    productoId,
                    cantidad
                );

            res.status(200).json(carritoActualizado);
        } catch (e) {
            res.status(500).json({ message: 'Error', error: e });
        }
    };

    public eliminarProductoDelCarrito = async (
        _req: AuthenticatedRequest,
        res: Response
    ) => {
        const { id } = _req.params;
        const { productoId } = _req.body;

        try {
            const carritoActualizado =
                await this.carritoService.eliminarProductoDelCarrito(
                    Number(id),
                    productoId
                );

            res.status(200).json(carritoActualizado);
        } catch (e) {
            res.status(500).json({ message: 'Error', error: e });
        }
    };

    public vaciarCarrito = async (
        _req: AuthenticatedRequest,
        res: Response
    ) => {
        const { id } = _req.params;

        try {
            const carritoVacio = await this.carritoService.vaciarCarrito(
                Number(id)
            );

            res.status(200).json(carritoVacio);
        } catch (e) {
            res.status(500).json({ message: 'Error', error: e });
        }
    };
}

export default CarritoController;
