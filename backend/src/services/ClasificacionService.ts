import { ClasificacionRepository } from './../repositories/ClasificacionRepository';
import { clasificacionRouter } from './../routes/clasificacion.route';
import { Clasificacion } from "../models/entities/clasificacion";
import { IClasificacionRepository } from "../models/interfaces/repositories/clasificacion.repository.interface";
import { IClasificacionService } from "../models/interfaces/services/clasificacion.service.interface";

export class ClasificacionService implements IClasificacionService {

    private clasificacionRepository!: IClasificacionRepository;

    constructor(clasificacionRepository: IClasificacionRepository) {
        this.clasificacionRepository = clasificacionRepository;
     }

    crear(nombre: string): Promise<Clasificacion> {
        return this.clasificacionRepository.crearClasificacion(nombre);
    }

    obtenerTodas(): Promise<Clasificacion[]> {
        return this.clasificacionRepository.obtenerClasificaciones();
    }

    actualizar(id: number, nombre: string): Promise<Clasificacion | null> {
        return this.clasificacionRepository.actualizarClasificacion(id, nombre);
    }

    eliminar(id: number): Promise<void> {
        return this.clasificacionRepository.eliminarClasificacion(id);
    }
}