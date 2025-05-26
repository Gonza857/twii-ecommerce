"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const productos_route_1 = require("./productos.route");
class AppRoutes {
    static getRoutes() {
        const router = (0, express_1.Router)();
        router.use("/api/producto", productos_route_1.productoRouter);
        // router.use("/api/usuario", null)
        return router;
    }
}
exports.AppRoutes = AppRoutes;
