import {IUsuarioLogin} from "../models/usuario-model";
import {PrismaClient} from "@prisma/client";
import {CorreoExistenteException} from "../exceptions/UsuarioExceptions";

interface IResultadoAccion {
    exito?: boolean;
    mensaje?: string;
    data?: any;
}


interface IUsuarioService {
    iniciarSesion(usuario: any): Promise<IResultadoAccion>;

    obtenerUsuarioPorId(id: string): Promise<IUsuarioLogin>

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

        if (!usuarioEncontrado) {
            return {
                exito: false,
            }
        }

        return {
            exito: true,
            mensaje: "Se inició sesión correctamente.",
        }
    }

    public async obtenerUsuarioPorId(id: string): Promise<IUsuarioLogin> {
        // Lógica para buscar usuario en la BD
        return {email: "test@test.com", contrasena: "passsword"}
    }

    public async registrarse(usuario: any): Promise<IResultadoAccion> {
        const usuarioBuscado = await this.buscarPorCorreo(usuario.email)
        if (usuarioBuscado) throw new CorreoExistenteException("El correo ya existe.");

        console.log("El correo no existe", usuario)

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

    private async buscarPorCorreo(emailBuscado: string): Promise<IUsuarioLogin | null> {
        try {
            return await this.prisma.usuario.findUnique({
                where: {
                    email: emailBuscado
                }
            }) as IUsuarioLogin;
        } catch (error) {
            console.error(error);
            return null
        }
    }


}

export default UsuarioService;