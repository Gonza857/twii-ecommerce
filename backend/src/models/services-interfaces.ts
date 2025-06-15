import { IResultadoAccion } from './main-models';
import { Producto } from './producto-model';
import { ILogin, IRegister, IUsuario } from './usuario-model';

export interface IAuthService {
    iniciarSesion(
        usuario: ILogin | null,
        inputContrasena: string
    ): Promise<IResultadoAccion>;
    registrarse(
        usuarioNuevo: IRegister,
        usuarioExistente: ILogin | null
    ): Promise<IResultadoAccion>;
    recuperarContrasena(usuario: ILogin | null): Promise<IResultadoAccion>;
    cambiarContrasena(
        usuario: IUsuario | null,
        contrasenaNueva: string
    ): Promise<IResultadoAccion>;
    enviarCorreoConfirmacion(correo: string, token: string): Promise<string>;
}

export interface IUsuarioService {
    obtenerUsuarioPorId(id: string): Promise<IUsuario | null>;
    obtenerUsuarioPorCorreo(email: string): Promise<ILogin | null>;
    actualizarContrasena(
        id: string,
        contrasena: string
    ): Promise<IResultadoAccion>;
    guardar(usuario: IRegister): Promise<IResultadoAccion>;
    obtenerTodos(): Promise<IUsuario[]>;
    cambiarEstadoCuenta(email: string): Promise<string>;
    verificarCuentaValidada(id: number | undefined): Promise<void>;
}

export interface IMailerService {
    enviarCorreo(to: string, subject: string, html: string): any;
}

export interface ICarritoService {
    obtenerCarritoPorUsuario(id: number): Promise<any>;
    agregarProductoAlCarrito(
        id: number,
        productoId: number,
        cantidad: number
    ): Promise<any>;
    eliminarProductoDelCarrito(id: number, productoId: number): Promise<any>;
    vaciarCarrito(id: number): Promise<any>;
}

export interface ICarritoService {
    obtenerCarritoPorUsuario(id: number): Promise<any>;
    agregarProductoAlCarrito(
        id: number,
        productoId: number,
        cantidad: number
    ): Promise<any>;
    eliminarProductoDelCarrito(id: number, productoId: number): Promise<any>;
    vaciarCarrito(id: number): Promise<any>;
}

export interface IProductoService {
    obtenerTodos(): Promise<Producto[]>;
    obtenerProductosFiltrados(filtros: {
        clasificacion?: string;
        precioMin?: number;
        precioMax?: number;
    }): Promise<Producto[]>;
}
