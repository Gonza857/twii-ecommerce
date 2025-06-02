import ProductoController from "../controllers/ProductoController";
import UsuarioController from "../controllers/UsuarioController";
import UsuarioService from "../services/UsuarioService";
import ProductoService from "../services/ProductoService";
import {prisma} from "./prisma";

// Repositorios -> Lógica para comunicarse con la base de datos
// const pruebaRepository: PruebaRepository = new PruebaRepository()

// Servicios -> logica de negocio
// const pruebaService: PruebaService = new PruebaService(pruebaRepository)
const usuarioService: UsuarioService = new UsuarioService(prisma)
const productoService: ProductoService = new ProductoService()

// Controladores -> Recbien petición y la pasan al servicio

const productoController: ProductoController = new ProductoController()
const usuarioController: UsuarioController = new UsuarioController(usuarioService)


const container = {
    productoController,
    usuarioController
}

export default container;