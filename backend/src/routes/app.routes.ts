import {Router} from "express";
import {productoRouter} from "./productos.route";

export class AppRoutes {
    static getRoutes(): Router {
        const router = Router();

        router.use("/api/producto", productoRouter)
        // router.use("/api/usuario", null)

        return router;
    }
}