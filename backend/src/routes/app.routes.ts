import {Router} from "express";
import {productoRouter} from "./productos.route";
import {usuariosRouter} from "./usuarios.route";

export class AppRoutes {
    static getRoutes(): Router {
        const router = Router();

        router.use("/api/producto", productoRouter)
        router.use("/api/usuario", usuariosRouter)

        return router;
    }
}