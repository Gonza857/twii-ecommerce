import path from "path";
import fs from "fs";
import {promisify} from "util";
import {ArchivoDTO} from "../models/DTO/archivo.dto";

const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);
const rename = promisify(fs.rename);
const unlink = promisify(fs.unlink);

export class FileSystem {

    private readonly baseUrl: string = "http://localhost:3000"
    private uploadDir!: string;

    constructor(directorioSubida: string) {
        this.uploadDir = path.resolve(__dirname, `../uploads/${directorioSubida}`);
    }

    public async upload(ruta: string, archivo: ArchivoDTO, nombreArchivo: string) {
        console.log("FILE SYSTEM: imagen entrante", archivo)
        await this.ensureUploadDir();

        const ext = path.extname(archivo.originalname).toLowerCase();
        const nombreArchivoConExtension = `${nombreArchivo}${ext}`
        const rutaDestino = path.join(this.uploadDir, nombreArchivoConExtension);

        try {
            await access(rutaDestino, fs.constants.F_OK);
            await unlink(rutaDestino);
        } catch {
        }

        if (archivo.buffer) {
            await fs.promises.writeFile(rutaDestino, archivo.buffer);
        } else if (archivo.path) {
            await rename(archivo.path, rutaDestino);
        } else {
            // throw new Error('Archivo sin buffer ni path');
            return null
        }

        return `${this.baseUrl}/uploads/${ruta}/${nombreArchivoConExtension}`;
    }

    public async delete(nombreArchivo: string): Promise<boolean> {
        await this.ensureUploadDir();

        // Obtener todos los archivos que empiecen con producto-{id}
        const archivos = await fs.promises.readdir(this.uploadDir);
        const archivoEncontrado = archivos.find(nombre => nombre.startsWith(nombreArchivo));
        if (!archivoEncontrado) return false;

        const rutaArchivo = path.join(this.uploadDir, archivoEncontrado);

        try {
            await unlink(rutaArchivo);
            console.log(`Imagen ${archivoEncontrado} eliminada correctamente.`);
        } catch (error) {
            // throw new Error('No se pudo eliminar la imagen');
            return false;
        }

        return true;
    }

    private async ensureUploadDir() {
        try {
            await access(this.uploadDir, fs.constants.F_OK);
        } catch {
            await mkdir(this.uploadDir, {recursive: true});
        }
    }
}