import {Request, Response} from 'express';
import {safe, safeSync} from "../utils/safe";
import {ProductoImageService} from "../services/ProductoImagesService";
import {IProductoService} from "../models/interfaces/services/producto.service.interface";
import {imagenProductoSchema, productoEditarSchema, productoSchema} from "../schemas/producto.schema";
import {validate} from "../utils/zod-validator";
import {ImagenProductoDTO, ProductoCrearDTO, ProductoEditarDTO} from "../models/entities/producto";

class ProductoController {
    private readonly productoService!: IProductoService;
    private readonly productoImagenService!: ProductoImageService

    constructor(productoService: IProductoService, productoImagenService: ProductoImageService) {
        this.productoService = productoService;
        this.productoImagenService = productoImagenService;
    }

    public getProductos = async (req: Request, res: Response) => {
        try {
            const filtros = {
                clasificacion: req.query.clasificacion as string,
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
            res.status(500).json({message: 'Error al obtener productos', error});
        }
    }

    public obtenerPorId = async (_req: Request, res: Response) => {
        const {id} = _req.params;
        if (isNaN(Number(id))) return res.status(500).json({mensaje: "NaN"})

        const [producto, errorProducto] = await safe(
            this.productoService.obtenerPorId(Number(id))
        );
        if (errorProducto) return res.status(500).json({mensaje: "errorProducto"});

        if (!producto) return res.status(404).json(producto)

        res.status(200).json(producto);
    }

    public crearProducto = async (_req: Request, res: Response) => {
        console.log("[CREANDO PRODUCTO]")
        // Validar archivo de imagen
        const [imagenProductoDTO, errorImagenProductoDTO] = safeSync<ImagenProductoDTO>(
            () => validate(imagenProductoSchema, _req.file)
        );
        if (errorImagenProductoDTO) return res.status(400).send();
        console.log("CREAR PRODUCTO: nueva imagen validada correctamante")

        // Validar cuerpo de petición
        const [productoCrearDTO, errorProductoCrearDTO] = safeSync<ProductoCrearDTO>(
            () => validate(productoSchema, _req.body)
        );
        if (errorProductoCrearDTO) return res.status(400).send();
        console.log("CREAR PRODUCTO: validación de producto correcta")


        // Crear producto y obtener su id para asiginar a imagen
        const [idProductoCreado, errorCrearProducto] = await safe<number | null>(
            this.productoService.crearProducto(productoCrearDTO!)
        );
        console.log("CREAR PRODUCTO ERRROR: ", errorCrearProducto)
        if (errorCrearProducto) return res.status(500).json({mensaje: "error al guardar producto"})
        console.log("CREAR PRODUCTO: crear producto correcto")


        // Guardar Imagen son ID de producto asociada en servidor y obtener URL
        const [urlImagen, errorGuardarImagen] = await safe<string>(
            this.productoImagenService.guardarImagen(idProductoCreado!, _req.file!)
        );
        if (errorGuardarImagen) return res.status(500).json({mensaje: "error al generar la url de imagen"})
        console.log("CREAR PRODUCTO: url imagen nueva obtenida")

        // Asignar URL a producto ya creado
        const [resultado, errorActualizarImagenProducto] = await safe(
            this.productoService.guardarImagenProducto(urlImagen!, idProductoCreado!)
        );
        if (errorActualizarImagenProducto) return res.status(500).json({mensaje: "erroro al actualizar la imagen al producto"})
        console.log("CREAR PRODUCTO: url actualizada al producto correcto")

        res.status(201).send();
    }

    public modificarProducto = async (_req: Request, res: Response) => {
        console.log(_req.file)

        // Validar cuerpo de petición
        const [productoValidado, errorValidacionProducto] = safeSync<ProductoEditarDTO>(
            () => validate(productoEditarSchema, _req.body)
        );
        if (errorValidacionProducto) return res.status(400).send();

        // Validar ID de req.params
        const {id} = _req.params
        if (isNaN(Number(id))) return res.status(400).json({mensaje: "ID incorrecto"})

        // Validar si el producto tenia imagen
        const tieneImagen = await this.productoService.saberSiProductoTieneImagen(Number(id));

        // Si no tiene, se guarda en el servidor
        if (!tieneImagen) {
            // Validar archivo de imagen
            const [imagenNueva, errorValidarImagenNueva] = safeSync<ImagenProductoDTO>(
                () => validate(imagenProductoSchema, _req.file)
            );
            if (errorValidarImagenNueva) return res.status(400).send();
            console.log("MODIFICAR PRODUCTO: nueva imagen validada correctamante")

            // Guardar Imagen son ID de producto asociada en servidor y obtener URL
            const [urlImagen, errorGuardarImagen] = await safe<string>(
                this.productoImagenService.guardarImagen(Number(id), _req.file!)
            );
            if (errorGuardarImagen) return res.status(500).json({mensaje: "error al generar la url de imagen"})

            console.log("MODIFICAR PRODUCTO: nueva imagen guardada correctamante")
            productoValidado!.imagen = urlImagen
        } else {
            // Tenia una imágen y la cambió por otra
            if (productoValidado!.cambioImagen) {
                // Eliminamos vieja
                const [resultadoElimianarImagen, errorEliminarImagenVieja] = await safe(
                    this.productoImagenService.eliminarImagen(Number(id))
                );
                if (errorEliminarImagenVieja) return res.status(400).send();
                console.log("MODIFICAR PRODUCTO: imagen vieja eliminada correctamante")

                // Validar archivo de imagen
                const [imagenNueva, errorValidarImagenNueva] = safeSync<ImagenProductoDTO>(
                    () => validate(imagenProductoSchema, _req.file)
                );
                if (errorValidarImagenNueva) return res.status(400).send();
                console.log("MODIFICAR PRODUCTO: imagen nueva validada correctamante")

                // Guardar Imagen son ID de producto asociada en servidor y obtener URL
                const [urlImagen, errorGuardarImagen] = await safe<string>(
                    this.productoImagenService.guardarImagen(Number(id), _req.file!)
                );
                if (errorGuardarImagen) return res.status(500).json({mensaje: "error al generar la url de imagen"})
                console.log("MODIFICAR PRODUCTO: imagen nueva guardada correctamante")

                productoValidado!.imagen = urlImagen;

            } else {
                // Tenía pero no la cambió
            }
        }

        // Crear producto y obtener su id para asiginar a imagen
        const [resultadoActualizarProducto, errorActualizarProducto] = await safe(
            this.productoService.actualizarProducto(Number(id), productoValidado!)
        );
        if (errorActualizarProducto) return res.status(500).json({mensaje: "error al guardar producto"})

        console.log("MODIFICAR PRODUCTO: producto actualizado correctamente")

        res.status(200).send();
    }

    async eliminarProducto(req: Request, res: Response) {
        try {
            const {id} = req.params;
            await this.productoService.eliminarProducto(Number(id));
            res.sendStatus(204);
        } catch (e) {
            res.status(500).json({mensaje: 'Error al eliminar producto'});
        }
    }
}

export default ProductoController;