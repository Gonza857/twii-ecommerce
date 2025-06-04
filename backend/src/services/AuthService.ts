import {PrismaClient} from "@prisma/client";
import {IRegister, IUsuario, IUsuarioLogin} from "../models/usuario-model";
import {CorreoExistenteException, DatosIncorrectoException} from "../exceptions/UsuarioExceptions";
import {IResultadoAccion} from "../models/main-models";
import bcrypt from "bcrypt";

class AuthService {
    private readonly prisma!: PrismaClient;

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

    public async registrarse(usuarioNuevo: IRegister,  usuarioExistente: IUsuarioLogin): Promise<IResultadoAccion> {
        if (usuarioExistente) throw new CorreoExistenteException("El correo ya existe.");

        usuarioNuevo.contrasena = await this.cifrarContrasena(usuarioNuevo.contrasena);

        const dataParaCrear = {
            email: usuarioNuevo.email,
            contrasena: usuarioNuevo.contrasena,
            nombre: usuarioNuevo.nombre,
            apellido: usuarioNuevo.apellido,
            direccion: usuarioNuevo.direccion,
            rol: {
                connect: { id: usuarioNuevo.rol }  // Aquí pasás el número como conexión
            }
        };

        try {
            await this.prisma.usuario.create({data: dataParaCrear})
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

export default AuthService