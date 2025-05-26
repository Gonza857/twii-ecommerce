"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productoRouter = void 0;
const express_1 = require("express");
const ProductoController_1 = __importDefault(require("../controllers/ProductoController"));
exports.productoRouter = (0, express_1.Router)();
const productoController = new ProductoController_1.default();
// Controladores
exports.productoRouter.get('/', productoController.getProductos);
