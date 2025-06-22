import ProductoController from "../controllers/ProductoController"
import UsuarioController from "../controllers/UsuarioController"
import UsuarioService from "../services/UsuarioService"
import ProductoService from "../services/ProductoService"
import { prisma } from "./prisma"
import AuthService from "../services/AuthService"
import AuthController from "../controllers/AuthController"
import type { ICarritoRepository } from "../models/repositories-interfaces"
import UsuarioRepository from "../repositories/UsuarioRepository"
import MailerService from "../services/MailerService"
import type { ICarritoService, IMailerService, IProductoService } from "../models/services-interfaces"
import CarritoRepository from "../repositories/CarritoRepository"
import CarritoService from "../services/CarritoService"
import CarritoController from "../controllers/CarritoController"
import { ProductoRepository } from "../repositories/ProductoRepository"
import type { IUsuarioRepository } from "../models/interfaces/usuario.repository.interface"
import type { IUsuarioService } from "../models/interfaces/usuario.service.interface"
import type { IAuthService } from "../models/interfaces/auth.service.interface"
import type { IProductoRepository } from "../models/interfaces/producto.repository.interface"
import type { IPedidoRepository } from "../models/interfaces/pedido.repository.interface"
import type { IPedidoService } from "../models/interfaces/pedido.service.interface"
import PedidoRepository from "../repositories/PedidoRepository"
import PedidoService from "../services/PedidoService"
import PedidoController from "../controllers/PedidoController"

// Infra -> independiente de la lógica de negocio
const mailerService: IMailerService = new MailerService()

// Repositorios -> Lógica para comunicarse con la base de datos
const usuarioRepository: IUsuarioRepository = new UsuarioRepository(prisma)
const carritoRepository: ICarritoRepository = new CarritoRepository(prisma)
const productoRepository: IProductoRepository = new ProductoRepository(prisma)
const pedidoRepository: IPedidoRepository = new PedidoRepository(prisma)

// Servicios -> logica de negocio
const carritoService: ICarritoService = new CarritoService(carritoRepository)
const usuarioService: IUsuarioService = new UsuarioService(usuarioRepository)
const productoService: IProductoService = new ProductoService(productoRepository)
const pedidoService: IPedidoService = new PedidoService(pedidoRepository)
const authService: IAuthService = new AuthService(mailerService)

// Controladores -> Reciben petición y la pasan al servicio
const carritoController: CarritoController = new CarritoController(carritoService)
const productoController: ProductoController = new ProductoController(productoService)
const usuarioController: UsuarioController = new UsuarioController(usuarioService)
const authController: AuthController = new AuthController(usuarioService, authService)
const pedidoController: PedidoController = new PedidoController(pedidoService)

const container = {
  carritoController,
  productoController,
  usuarioController,
  authController,
  pedidoController,
}

export default container
