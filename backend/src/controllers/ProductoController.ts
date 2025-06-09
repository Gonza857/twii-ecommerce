import {Request, Response} from 'express';
import {prisma} from "../app/prisma";
import { IProductoService } from '../models/services-interfaces';

class ProductoController {
    private productoService!: IProductoService;
    
        constructor(productoService: IProductoService) {
            this.productoService = productoService;
        }

    public async getProductos (_req: Request, res: Response) {
        try {
            const productos = await this.productoService.obtenerTodos();
            res.status(200).json(productos)
        } catch (e) {
            res.status(500).json({message: "Error", error: e})
        }
    }
}

export default ProductoController;