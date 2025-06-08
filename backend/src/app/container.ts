import ProductoController from "../controllers/ProductoController";
import UsuarioController from "../controllers/UsuarioController";
import UsuarioService from "../services/UsuarioService";
import ProductoService from "../services/ProductoService";
import {prisma} from "./prisma";
import AuthService from "../services/AuthService";
import AuthController from "../controllers/AuthController";
import {IUsuarioRepository} from "../models/repositories-interfaces";
import UsuarioRepository from "../repositories/UsuarioRepository";

// Repositorios -> Lógica para comunicarse con la base de datos
const usuarioRepository: IUsuarioRepository = new UsuarioRepository(prisma);

// Servicios -> logica de negocio
const usuarioService: UsuarioService = new UsuarioService(usuarioRepository)
const productoService: ProductoService = new ProductoService()
const authService: AuthService = new AuthService(usuarioRepository);

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