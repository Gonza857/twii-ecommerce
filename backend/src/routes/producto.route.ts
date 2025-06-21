import { Router } from 'express';
import container from "../app/container";
import ProductoController from '../controllers/ProductoController';

export const productosRouter = Router();
const productoController: ProductoController = container.productoController;

productosRouter.get('/', (req, res) => productoController.getProductos(req, res));
productosRouter.post('/', (req, res) => productoController.crearProducto(req, res));
productosRouter.put('/:id', (req, res) => productoController.modificarProducto(req, res));
productosRouter.delete('/:id', (req, res) => productoController.eliminarProducto(req, res));
