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
class ProductoController {
    constructor(productoService) {
        this.getProductos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filtros = {
                    clasificacion: req.query.clasificacion,
                    precioMin: req.query.precioMin ? parseFloat(req.query.precioMin) : undefined,
                    precioMax: req.query.precioMax ? parseFloat(req.query.precioMax) : undefined
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
        this.productoService = productoService;
    }
}
exports.default = ProductoController;
