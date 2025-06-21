import { RequestHandler, Router } from 'express';
import container from '../app/container';
import UsuarioController from '../controllers/UsuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';
import CarritoController from '../controllers/CarritoController';

export const carritoRouter = Router();

const carritoController: CarritoController = container.carritoController;

carritoRouter.get(
    '/:id',
    authMiddleware,
    carritoController.obtenerCarritoPorUsuario
);

carritoRouter.post(
    '/:id/agregar',
    authMiddleware,
    carritoController.agregarProductoAlCarrito
);

carritoRouter.delete(
    '/:id/eliminar',
    authMiddleware,
    carritoController.eliminarProductoDelCarrito
);

carritoRouter.delete(
    '/:id/vaciar',
    authMiddleware,
    carritoController.vaciarCarrito
);
