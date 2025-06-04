import {ILogin, IUsuario, IUsuarioLogin} from "../models/usuario-model";
import {PrismaClient} from "@prisma/client";
import {
    CorreoExistenteException,
    DatosIncorrectoException,
} from "../exceptions/UsuarioExceptions";
import bcrypt from "bcrypt";

interface IResultadoAccion {
    exito?: boolean;
    mensaje?: string;
    data?: any;
}

interface IUsuarioService {
    iniciarSesion(usuario: any): Promise<IResultadoAccion>;

    obtenerUsuarioPorId(id: string): Promise<IUsuario | null>

    registrarse(usuario: any): Promise<IResultadoAccion>;
}

class UsuarioService implements IUsuarioService {
    private prisma!: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async iniciarSesion(usuario: any): Promise<IResultadoAccion> {
        const usuarioEncontrado: IUsuarioLogin | null = await this.prisma.usuario.findUnique({
            where: {
                email: usuario.email
            }
        })

        if (!usuarioEncontrado)
            throw new DatosIncorrectoException("Datos incorrectos.")

        if (!await this.verificarContrasena(usuario.contrasena, usuarioEncontrado.contrasena))
            throw new DatosIncorrectoException("Datos incorrectos.")


        return {
            exito: true,
            mensaje: "Se inició sesión correctamente.",
        }
    }

    public async obtenerUsuarioPorId(id: string): Promise<IUsuario | null> {
        // Lógica para buscar usuario en la BD
        const usuario = await this.prisma.usuario.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                rol: true
            }
        });

        if (!usuario) return null;

        return {
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            direccion: usuario.direccion,
            rol: usuario.rol,
        };
    }

    public async obtenerUsuarioPorCorreo (email: string): Promise<IUsuario | null> {
        return await this.buscarPorCorreo(email);
    }

    public async registrarse(usuario: any): Promise<IResultadoAccion> {
        const usuarioBuscado = await this.buscarPorCorreo(usuario.email)
        if (usuarioBuscado) throw new CorreoExistenteException("El correo ya existe.");

        usuario.contrasena = await this.cifrarContrasena(usuario.contrasena);

        try {
            await this.prisma.usuario.create({data: usuario})
            return {
                exito: true,
                mensaje: "Te registraste correctamente.",
            }
        } catch (error) {
            console.error(error);
            return {
                exito: false,
                mensaje: "Error al registrarse",
            }
        }
    }

    private async buscarPorCorreo(emailBuscado: string): Promise<IUsuario | null> {
        try {
            return await this.prisma.usuario.findUnique({
                where: {
                    email: emailBuscado
                },
                include: {
                    rol: true
                }
            });
        } catch (error) {
            console.error(error);
            return null
        }
    }

    private cifrarContrasena = async (plainPassword: string): Promise<string> => {
        const saltRounds = 10;
        return await bcrypt.hash(plainPassword, saltRounds);
    };

    private verificarContrasena = async (
        plainPassword: string,
        hashedPassword: string
    ): Promise<boolean> => {
        return await bcrypt.compare(plainPassword, hashedPassword);
    };


}

export default UsuarioService;