import {Router} from "express";
import ProductoController from "../controllers/ProductoController";

export const productoRouter = Router();

const productoController = new ProductoController();

// Controladores

productoRouter.get('/', productoController.getProductos);

