import { Clasificacion } from "../../entities/clasificacion";

export interface IClasificacionService {
  crear(nombre: string): Promise<Clasificacion>;
  obtenerTodas(): Promise<Clasificacion[]>;
  actualizar(id: number, nombre: string): Promise<Clasificacion | null>;
  eliminar(id: number): Promise<void>;
}