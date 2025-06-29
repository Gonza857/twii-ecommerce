import { clasificacion } from './../../node_modules/.prisma/client/index.d';
import { Request, Response } from 'express';
import { safe, safeSync } from "../utils/safe";
import { IProductoService } from "../models/interfaces/services/producto.service.interface";
import { imagenProductoSchema, productoEditarSchema, productoSchema } from "../schemas/producto.schema";
import { validate } from "../utils/zod-validator";
import { ProductoCrearDTO, ProductoEditarDTO } from "../models/entities/producto";
import { ArchivoDTO } from "../models/DTO/archivo.dto";

class ProductoController {
    private readonly productoService!: IProductoService;

    constructor(productoService: IProductoService,) {
        this.productoService = productoService;
    }

    public getProductos = async (req: Request, res: Response) => {
        try {
            const filtros = {
                clasificacion: req.query.clasificacion ? parseInt(req.query.clasificacion as string, 10) : undefined,
                precioMin: req.query.precioMin ? parseFloat(req.query.precioMin as string) : undefined,
                precioMax: req.query.precioMax ? parseFloat(req.query.precioMax as string) : undefined,
                nombre: req.query.nombre as string
            };

            let productos;
            if (filtros) {
                productos = await this.productoService.obtenerProductosFiltrados(filtros);
            } else {
                productos = await this.productoService.obtenerTodos();
            }

            res.status(200).json(productos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener productos', error });
        }
    }

    async getClasificaciones(req: Request, res: Response) {
        const clasificaciones = await this.productoService.obtenerClasificaciones();
        res.json(clasificaciones);
    }

    public obtenerPorId = async (_req: Request, res: Response) => {
        const { id } = _req.params;
        if (isNaN(Number(id))) return res.status(500).json({ mensaje: "NaN" })

        const [producto, errorProducto] = await safe(
            this.productoService.obtenerPorId(Number(id))
        );
        if (errorProducto) return res.status(500).json({ mensaje: "errorProducto" });

        if (!producto) return res.status(404).json(producto)

        res.status(200).json(producto);
    }

    public crearProducto = async (_req: Request, res: Response) => {
        // Validar archivo de imagen
        let imagenProductoDTO = null, errorImagenProductoDTO;
        if (_req.file) {
            [imagenProductoDTO, errorImagenProductoDTO] = safeSync<ArchivoDTO>(
                () => validate(imagenProductoSchema, _req.file)
            );
            if (errorImagenProductoDTO) return res.status(400).send();
        }

        // Validar cuerpo de petición
        const [productoCrearDTO, errorProductoCrearDTO] = safeSync<ProductoCrearDTO>(
            () => validate(productoSchema, _req.body)
        );
        if (errorProductoCrearDTO) return res.status(400).send();

        // Crear producto y obtener su id para asiginar a imagen
        const [resultadoCrear, errorCrearProducto] = await safe(
            this.productoService.crearProducto(productoCrearDTO!, imagenProductoDTO!)
        );
        if (errorCrearProducto) return res.status(500).json({ mensaje: "error al guardar producto" })

        res.status(201).send();
    }

    public modificarProducto = async (_req: Request, res: Response) => {
        // Validar cuerpo de petición
        const [productoValidado, errorValidacionProducto] = safeSync<ProductoEditarDTO>(
            () => validate(productoEditarSchema, _req.body)
        );
        if (errorValidacionProducto) return res.status(400).send();

        // Validar ID de req.params
        const { id } = _req.params
        if (isNaN(Number(id))) return res.status(400).json({ mensaje: "ID incorrecto" })

        let imagenProducto: ArchivoDTO | null = null, errorValidarImagenNueva;
        if (_req.file) {
            // Validar archivo de imagen
            [imagenProducto, errorValidarImagenNueva] = safeSync<ArchivoDTO>(
                () => validate(imagenProductoSchema, _req.file)
            );
            if (errorValidarImagenNueva) return res.status(400).send();
        }

        const [resultadoActualizarProducto, errorActualizarProducto] = await safe(
            this.productoService.actualizarProducto(Number(id), productoValidado!, imagenProducto)
        );
        if (errorActualizarProducto) return res.status(500).json({ mensaje: "error al guardar producto" })

        res.status(200).send();
    }

    async eliminarProducto(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.productoService.eliminarProducto(Number(id));
            res.sendStatus(204);
        } catch (e) {
            res.status(500).json({ mensaje: 'Error al eliminar producto' });
        }
    }
}

export default ProductoController;