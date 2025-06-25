import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);
const rename = promisify(fs.rename);
const unlink = promisify(fs.unlink);

export class ProductoImageService {
    private uploadDir = path.resolve(__dirname, '../uploads/productos');
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl; // Ejemplo: 'http://localhost:3000'
    }

    private async ensureUploadDir() {
        try {
            await access(this.uploadDir, fs.constants.F_OK);
        } catch {
            await mkdir(this.uploadDir, { recursive: true });
        }
    }

    async guardarImagen(productoId: number, archivo: Express.Multer.File): Promise<string> {
        await this.ensureUploadDir();

        const ext = path.extname(archivo.originalname).toLowerCase();
        const nombreArchivo = `producto-${productoId}${ext}`;
        const rutaDestino = path.join(this.uploadDir, nombreArchivo);

        try {
            await access(rutaDestino, fs.constants.F_OK);
            await unlink(rutaDestino);
        } catch {}

        if (archivo.buffer) {
            await fs.promises.writeFile(rutaDestino, archivo.buffer);
        } else if (archivo.path) {
            await rename(archivo.path, rutaDestino);
        } else {
            throw new Error('Archivo sin buffer ni path');
        }

        // Retornamos la URL pública
        return `${this.baseUrl}/uploads/productos/${nombreArchivo}`;
    }

    async eliminarImagen(productoId: number): Promise<void> {
        await this.ensureUploadDir();

        // Obtener todos los archivos que empiecen con producto-{id}
        const archivos = await fs.promises.readdir(this.uploadDir);

        const nombreParcial = `producto-${productoId}`;
        const archivoEncontrado = archivos.find(nombre => nombre.startsWith(nombreParcial));

        if (!archivoEncontrado) {
            console.warn(`No se encontró imagen para el producto ${productoId}`);
            return;
        }

        const rutaArchivo = path.join(this.uploadDir, archivoEncontrado);

        try {
            await unlink(rutaArchivo);
            console.log(`Imagen ${archivoEncontrado} eliminada correctamente.`);
        } catch (error) {
            console.error(`Error al eliminar la imagen del producto ${productoId}:`, error);
            throw new Error('No se pudo eliminar la imagen');
        }
    }
}
