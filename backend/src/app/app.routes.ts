import {Router} from "express";
import {productoRouter} from "../routes/producto.route";
import {usuariosRouter} from "../routes/usuario.route";
import {authRouter} from "../routes/auth.route";

export class AppRoutes {
    static getRoutes(): Router {
        const router = Router();

        router.use("/api/producto", productoRouter)
        router.use("/api/usuario", usuariosRouter)
        router.use("/api/auth", authRouter)

        return router;
    }
}










