import { Request, Response } from 'express';
import { IClasificacionService } from '../models/interfaces/services/clasificacion.service.interface';

export class ClasificacionController {

  private clasificacionService!: IClasificacionService;

  constructor(clasificacionService: IClasificacionService) {
    this.clasificacionService = clasificacionService;
  }

  public obtenerClasificaciones = async (req: Request, res: Response) => {
    const clasificaciones = await this.clasificacionService.obtenerTodas();
    res.json(clasificaciones);
  };

  public crearClasificacion = async (req: Request, res: Response) => {
    const { nombre } = req.body;
    const nueva = await this.clasificacionService.crear(nombre);
    res.status(201).json(nueva);
  };

  public actualizarClasificacion = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { nombre } = req.body;
    const actualizada = await this.clasificacionService.actualizar(id, nombre);
    res.json(actualizada);
  };

  public eliminarClasificacion = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.clasificacionService.eliminar(id);
    res.status(204).send();
  };
}