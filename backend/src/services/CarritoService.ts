import { ILogin, IRegister, IUsuario } from '../models/usuario-model';
import { DatosIncorrectoException } from '../exceptions/UsuarioExceptions';
import {
    ICarritoRepository,
    IUsuarioRepository
} from '../models/repositories-interfaces';
import { IResultadoAccion } from '../models/main-models';
import {
    ICarritoService,
    IUsuarioService
} from '../models/services-interfaces';
import CarritoRepository from '../repositories/CarritoRepository';
import { Carrito } from '../models/carrito-model';

class CarritoService implements ICarritoService {
    private carritoRepository!: ICarritoRepository;

    constructor(carritoRepository: ICarritoRepository) {
        this.carritoRepository = carritoRepository;
    }

    public async obtenerCarritoPorUsuario(id: number): Promise<Carrito | null> {
        return await this.carritoRepository.obtenerCarritoPorUsuario(id);
    }

    public async agregarProductoAlCarrito(
        id: number,
        productoId: number,
        cantidad: number
    ): Promise<Carrito | null> {
        return await this.carritoRepository.agregarProductoAlCarrito(
            id,
            productoId,
            cantidad
        );
    }
    public async eliminarProductoDelCarrito(
        id: number,
        productoId: number
    ): Promise<Carrito | null> {
        return await this.carritoRepository.eliminarProductoDelCarrito(
            id,
            productoId
        );
    }

    public async vaciarCarrito(id: number): Promise<any> {
        return await this.carritoRepository.vaciarCarrito(id);
    }
}

export default CarritoService;
