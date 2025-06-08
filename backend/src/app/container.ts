import ProductoController from "../controllers/ProductoController";
import UsuarioController from "../controllers/UsuarioController";
import UsuarioService from "../services/UsuarioService";
import ProductoService from "../services/ProductoService";
import {prisma} from "./prisma";
import AuthService from "../services/AuthService";
import AuthController from "../controllers/AuthController";
import {IUsuarioRepository} from "../models/repositories-interfaces";
import UsuarioRepository from "../repositories/UsuarioRepository";
import MailerService from "../services/MailerService";
import {IAuthService, IMailerService, IUsuarioService} from "../models/services-interfaces";

// Infra -> independiente de la lógica de negocio
const mailerService: IMailerService = new MailerService();

// Repositorios -> Lógica para comunicarse con la base de datos
const usuarioRepository: IUsuarioRepository = new UsuarioRepository(prisma);

// Servicios -> logica de negocio
const usuarioService: IUsuarioService = new UsuarioService(usuarioRepository)
const productoService: ProductoService = new ProductoService() // pasar tipo a interface
const authService: IAuthService = new AuthService(usuarioRepository, mailerService);

// Controladores -> Recbien petición y la pasan al servicio

const productoController: ProductoController = new ProductoController()
const usuarioController: UsuarioController = new UsuarioController(usuarioService)
const authController: AuthController = new AuthController(usuarioService, authService)


const container = {
    productoController,
    usuarioController,
    authController,
}

export default container;