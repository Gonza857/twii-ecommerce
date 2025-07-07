import { Clasificacion } from "../../entities/clasificacion";

export interface IClasificacionRepository {
  crearClasificacion(nombre: string): Promise<Clasificacion>;
  obtenerClasificaciones(): Promise<Clasificacion[]>;
  actualizarClasificacion(id: number, nombre: string): Promise<Clasificacion | null>;
  eliminarClasificacion(id: number): Promise<void>;
}