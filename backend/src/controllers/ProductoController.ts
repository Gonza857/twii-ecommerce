import {Request, Response} from 'express';
import {prisma} from "../app/prisma";

class ProductoController {
    constructor() {
        console.log("Producto Controller");
    }

    public async getProductos (_req: Request, res: Response) {
        try {
            const productos = await prisma.producto.findMany()
            res.status(200).json(productos)
        } catch (e) {
            res.status(500).json({message: "Error", error: e})
        }
    }
}

export default ProductoController;