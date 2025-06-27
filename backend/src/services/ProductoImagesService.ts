import {IImagenService} from "../models/interfaces/services/imagen.service.interface";
import {FileSystem} from "../utils/file-system";
import {ImagenProductoDTO} from "../models/entities/producto";
import {ArchivoDTO} from "../models/DTO/archivo.dto";

export class ProductoImageService implements IImagenService{
    private baseUrl: string;
    private fileSystem = new FileSystem("productos")

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl; // Ejemplo: 'http://localhost:3000'
    }

    async guardarImagen(productoId: number, archivo: ArchivoDTO): Promise<string | null> {
        const ruta = "productos"
        const nombre = `producto-${productoId}`;
        return await this.fileSystem.upload(ruta, archivo, nombre)
    }

    async eliminarImagen(productoId: number): Promise<void> {
        const nombreParcial = `producto-${productoId}`;
        await this.fileSystem.delete(nombreParcial)
    }
}
