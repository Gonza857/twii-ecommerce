import {Request, Response} from 'express';
import {IProductoService} from '../models/services-interfaces';
import {safe} from "../utils/safe";

class ProductoController {
    private readonly productoService!: IProductoService;

    constructor(productoService: IProductoService) {
        this.productoService = productoService;
    }

    public getProductos = async (req: Request, res: Response) => {
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
            res.status(500).json({message: 'Error al obtener productos', error});
        }
    }

    public obtenerPorId = async (_req: Request, res: Response) => {
        const {id} = _req.params;
        if (isNaN(Number(id))) return res.status(500).json({mensaje: "NaN"})

        const [producto, errorProducto] = await safe(
            this.productoService.obtenerPorId(Number(id))
        );
        if (errorProducto) return res.status(500).json({mensaje: "errorProducto"});

        if (!producto) return res.status(404).json(producto)

        res.status(200).json(producto);
    }
}

export default ProductoController;