import { Router } from "express"
import { productosRouter } from "../routes/producto.route"
import { usuariosRouter } from "../routes/usuario.route"
import { authRouter } from "../routes/auth.route"
import { carritoRouter } from "../routes/carrito.route"
import { pedidoRouter } from "../routes/pedido.route" 

export class AppRoutes {
  static getRoutes(): Router {
    const router = Router()

    router.use("/api/carrito", carritoRouter)
    router.use("/api/producto", productosRouter)
    router.use("/api/usuarios", usuariosRouter)
    router.use("/api/auth", authRouter)
    router.use("/api/pedidos", pedidoRouter)

    return router
  }
}
