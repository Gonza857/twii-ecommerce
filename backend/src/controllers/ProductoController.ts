import { Request, Response } from 'express';
import { prisma } from "../app/prisma";
import { IProductoService } from '../models/services-interfaces';

class ProductoController {
    private productoService!: IProductoService;

    constructor(productoService: IProductoService) {
        this.productoService = productoService;
    }

    async getProductos(req: Request, res: Response): Promise<void> {
        try {
            const filtros = {
                clasificacion: req.query.clasificacion as string,
                precioMin: req.query.precioMin ? parseFloat(req.query.precioMin as string) : undefined,
                precioMax: req.query.precioMax ? parseFloat(req.query.precioMax as string) : undefined
            };

            let productos;
            if (filtros) {
                productos = await this.productoService.obtenerProductosFiltrados(filtros);
            } else {
                productos = await this.productoService.obtenerTodos();
            }

            res.status(200).json(productos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener productos', error });
        }
    }
}

export default ProductoController;