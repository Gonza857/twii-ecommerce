"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const safe_1 = require("../utils/safe");
const producto_schema_1 = require("../schemas/producto.schema");
const zod_validator_1 = require("../utils/zod-validator");
class ProductoController {
    constructor(productoService) {
        this.getProductos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filtros = {
                    clasificacion: req.query.clasificacion ? parseInt(req.query.clasificacion, 10) : undefined,
                    precioMin: req.query.precioMin ? parseFloat(req.query.precioMin) : undefined,
                    precioMax: req.query.precioMax ? parseFloat(req.query.precioMax) : undefined,
                    nombre: req.query.nombre
                };
                let productos;
                if (filtros) {
                    productos = yield this.productoService.obtenerProductosFiltrados(filtros);
                }
                else {
                    productos = yield this.productoService.obtenerTodos();
                }
                res.status(200).json(productos);
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener productos', error });
            }
        });
        this.obtenerPorId = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = _req.params;
            if (isNaN(Number(id)))
                return res.status(500).json({ mensaje: "NaN" });
            const [producto, errorProducto] = yield (0, safe_1.safe)(this.productoService.obtenerPorId(Number(id)));
            if (errorProducto)
                return res.status(500).json({ mensaje: "errorProducto" });
            if (!producto)
                return res.status(404).json(producto);
            res.status(200).json(producto);
        });
        this.crearProducto = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            // Validar archivo de imagen
            let imagenProductoDTO = null, errorImagenProductoDTO;
            if (_req.file) {
                [imagenProductoDTO, errorImagenProductoDTO] = (0, safe_1.safeSync)(() => (0, zod_validator_1.validate)(producto_schema_1.imagenProductoSchema, _req.file));
                if (errorImagenProductoDTO)
                    return res.status(400).send();
            }
            // Antes de validar:
            if (_req.body.clasificacion && typeof _req.body.clasificacion === 'string') {
                _req.body.clasificacion = parseInt(_req.body.clasificacion, 10);
            }
            // Validar cuerpo de petición
            const [productoCrearDTO, errorProductoCrearDTO] = (0, safe_1.safeSync)(() => (0, zod_validator_1.validate)(producto_schema_1.productoSchema, _req.body));
            if (errorProductoCrearDTO)
                return res.status(400).send();
            // Crear producto y obtener su id para asiginar a imagen
            const [resultadoCrear, errorCrearProducto] = yield (0, safe_1.safe)(this.productoService.crearProducto(productoCrearDTO, imagenProductoDTO));
            if (errorCrearProducto)
                return res.status(500).json({ mensaje: "error al guardar producto" });
            res.status(201).send();
        });
        this.modificarProducto = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            // Antes de validar:
            if (_req.body.clasificacion && typeof _req.body.clasificacion === 'string') {
                _req.body.clasificacion = parseInt(_req.body.clasificacion, 10);
            }
            // Validar cuerpo de petición
            const [productoValidado, errorValidacionProducto] = (0, safe_1.safeSync)(() => (0, zod_validator_1.validate)(producto_schema_1.productoEditarSchema, _req.body));
            if (errorValidacionProducto)
                return res.status(400).send();
            // Validar ID de req.params
            const { id } = _req.params;
            if (isNaN(Number(id)))
                return res.status(400).json({ mensaje: "ID incorrecto" });
            let imagenProducto = null, errorValidarImagenNueva;
            if (_req.file) {
                // Validar archivo de imagen
                [imagenProducto, errorValidarImagenNueva] = (0, safe_1.safeSync)(() => (0, zod_validator_1.validate)(producto_schema_1.imagenProductoSchema, _req.file));
                if (errorValidarImagenNueva)
                    return res.status(400).send();
            }
            const [resultadoActualizarProducto, errorActualizarProducto] = yield (0, safe_1.safe)(this.productoService.actualizarProducto(Number(id), productoValidado, imagenProducto));
            if (errorActualizarProducto)
                return res.status(500).json({ mensaje: "error al guardar producto" });
            res.status(200).send();
        });
        this.obtenerEstadisticas = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            const [estadisticas, errorEstadisticas] = yield (0, safe_1.safe)(this.productoService.obtenerEstadisticas());
            if (errorEstadisticas)
                return res.status(500).send();
            res.status(200).json(estadisticas);
        });
        this.productoService = productoService;
    }
    getClasificaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clasificaciones = yield this.productoService.obtenerClasificaciones();
            res.json(clasificaciones);
        });
    }
    eliminarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.productoService.eliminarProducto(Number(id));
                res.sendStatus(204);
            }
            catch (e) {
                res.status(500).json({ mensaje: 'Error al eliminar producto' });
            }
        });
    }
}
exports.default = ProductoController;
