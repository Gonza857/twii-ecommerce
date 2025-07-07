import { Router } from 'express'
import { ClasificacionController } from '../controllers/ClasificacionController'
import container from '../app/container';

export const clasificacionRouter = Router();

const clasificacionController: ClasificacionController = container.clasificacionController;

clasificacionRouter.post('/', clasificacionController.crearClasificacion)
clasificacionRouter.get('/', clasificacionController.obtenerClasificaciones)
clasificacionRouter.put('/:id', clasificacionController.actualizarClasificacion)
clasificacionRouter.delete('/:id', clasificacionController.eliminarClasificacion)

