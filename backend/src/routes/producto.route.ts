import { Router } from 'express';
import container from "../app/container";
import ProductoController from '../controllers/ProductoController';

export const productosRouter = Router();
const productoController: ProductoController = container.productoController;

productosRouter.get('/', (req, res) => productoController.getProductos(req, res));

