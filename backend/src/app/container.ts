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
import type { ICarritoService, IMailerService } from "../models/services-interfaces"
import CarritoRepository from "../repositories/CarritoRepository"
import CarritoService from "../services/CarritoService"
import CarritoController from "../controllers/CarritoController"
import { ProductoRepository } from "../repositories/ProductoRepository"
import { ProductoImageService } from "../services/ProductoImagesService"
import type { IUsuarioRepository } from "../models/interfaces/repositories/usuario.repository.interface"
import type { IProductoRepository } from "../models/interfaces/repositories/producto.repository.interface"
import type { IUsuarioService } from "../models/interfaces/services/usuario.service.interface"
import type { IProductoService } from "../models/interfaces/services/producto.service.interface"
import type { IAuthService } from "../models/interfaces/services/auth.service.interface"
import type { IImagenService } from "../models/interfaces/services/imagen.service.interface"
import PedidoRepository from "../repositories/PedidoRepository"
import PedidoService from "../services/PedidoService"
import PedidoController from "../controllers/PedidoController"
import type { IPedidoRepository } from "../models/interfaces/repositories/pedido.repository.interface"
import type { IPedidoService } from "../models/interfaces/services/pedido.service.interface"


const mailerService: IMailerService = new MailerService()

// Repositorios -> acceso a datos
const usuarioRepository: IUsuarioRepository = new UsuarioRepository(prisma)
const carritoRepository: ICarritoRepository = new CarritoRepository(prisma)
const productoRepository: IProductoRepository = new ProductoRepository(prisma)
const pedidoRepository: IPedidoRepository = new PedidoRepository(prisma)

// Servicios -> logica de negocio
const productoImagenService: IImagenService = new ProductoImageService("http://localhost:3000")
const carritoService: ICarritoService = new CarritoService(carritoRepository)
const usuarioService: IUsuarioService = new UsuarioService(usuarioRepository)
const productoService: IProductoService = new ProductoService(productoRepository, productoImagenService) 
const authService: IAuthService = new AuthService(mailerService)
const pedidoService: IPedidoService = new PedidoService(pedidoRepository, carritoRepository)

// Controladores -> Recbien petición y la pasan al servicio
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

export const serviceContainer = {
  usuarioService,
}

export default container
