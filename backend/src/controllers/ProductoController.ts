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

    async crearProducto(req: Request, res: Response) {
      try {
      const nuevo = await this.productoService.crearProducto(req.body);
      res.status(201).json(nuevo);
    } catch (e) {
      res.status(500).json({ mensaje: 'Error al crear producto' });
    }
  }

  async modificarProducto(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    console.log('ID:', id);
    console.log('BODY:', JSON.stringify(req.body, null, 2));

    const { id: _id, ...dataWithoutId } = req.body;

    const actualizado = await this.productoService.actualizarProducto(id, dataWithoutId);
    res.json(actualizado);
  } catch (e) {
    console.error('Error al actualizar producto:', e);
    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
}

  async eliminarProducto(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.productoService.eliminarProducto(Number(id));
      res.sendStatus(204);
    } catch (e) {
      res.status(500).json({ mensaje: 'Error al eliminar producto' });
    }
  }
}

export default ProductoController;