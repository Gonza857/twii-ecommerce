import {IUsuarioLogin} from "../models/usuario-model";
import {PrismaClient} from "@prisma/client";

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


}

export default UsuarioService;