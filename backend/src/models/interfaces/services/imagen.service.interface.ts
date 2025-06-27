import {ImagenProductoDTO} from "../../entities/producto";
import {ArchivoDTO} from "../../DTO/archivo.dto";

export interface IImagenService {
    // guardarImagen(productoId: number, archivo: Express.Multer.File): Promise<string | null>
    guardarImagen(productoId: number, archivo: ArchivoDTO): Promise<string | null>
    eliminarImagen(productoId: number): Promise<void>
}