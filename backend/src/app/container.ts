import ProductoController from '../controllers/ProductoController';
import UsuarioController from '../controllers/UsuarioController';
import UsuarioService from '../services/UsuarioService';
import ProductoService from '../services/ProductoService';
import { prisma } from './prisma';
import AuthService from '../services/AuthService';
import AuthController from '../controllers/AuthController';
import {
    ICarritoRepository,
} from '../models/repositories-interfaces';
import UsuarioRepository from '../repositories/UsuarioRepository';
import MailerService from '../services/MailerService';
import {
    ICarritoService,
    IMailerService,
} from '../models/services-interfaces';
import CarritoRepository from '../repositories/CarritoRepository';
import CarritoService from '../services/CarritoService';
import CarritoController from '../controllers/CarritoController';
import { ProductoRepository } from '../repositories/ProductoRepository';
import {ProductoImageService} from "../services/ProductoImagesService";
import {IUsuarioRepository} from "../models/interfaces/repositories/usuario.repository.interface";
import {IProductoRepository} from "../models/interfaces/repositories/producto.repository.interface";
import {IUsuarioService} from "../models/interfaces/services/usuario.service.interface";
import {IProductoService} from "../models/interfaces/services/producto.service.interface";
import {IAuthService} from "../models/interfaces/services/auth.service.interface";
import {IImagenService} from "../models/interfaces/services/imagen.service.interface";

// Infra -> independiente de la lógica de negocio
const mailerService: IMailerService = new MailerService();

// Repositorios -> Lógica para comunicarse con la base de datos
const usuarioRepository: IUsuarioRepository = new UsuarioRepository(prisma);
const carritoRepository: ICarritoRepository = new CarritoRepository(prisma);
const productoRepository: IProductoRepository = new ProductoRepository(prisma);

// Servicios -> logica de negocio
const productoImagenService: IImagenService = new ProductoImageService('http://localhost:3000');
const carritoService: ICarritoService = new CarritoService(carritoRepository);
const usuarioService: IUsuarioService = new UsuarioService(usuarioRepository);
const productoService: IProductoService = new ProductoService(productoRepository, productoImagenService); // pasar tipo a interface
const authService: IAuthService = new AuthService(mailerService);

// Controladores -> Recbien petición y la pasan al servicio
const carritoController: CarritoController = new CarritoController(
    carritoService
);
const productoController: ProductoController = new ProductoController(
    productoService,
);
const usuarioController: UsuarioController = new UsuarioController(
    usuarioService
);
const authController: AuthController = new AuthController(
    usuarioService,
    authService
);

const container = {
    carritoController,
    productoController,
    usuarioController,
    authController
};

export const serviceContainer = {
    usuarioService
}

export default container;
