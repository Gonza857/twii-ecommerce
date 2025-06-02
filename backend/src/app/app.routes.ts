import {Router} from "express";
import {productoRouter} from "../routes/productos.route";
import {usuariosRouter} from "../routes/usuarios.route";

export class AppRoutes {
    static getRoutes(): Router {
        const router = Router();

        router.use("/api/producto", productoRouter)
        router.use("/api/usuario", usuariosRouter)

        return router;
    }
}










