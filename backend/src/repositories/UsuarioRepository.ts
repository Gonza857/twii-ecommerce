import {PrismaClient} from "@prisma/client";
import {IUsuarioRepository} from "../models/repositories-interfaces";
import {IUsuario} from "../models/usuario-model";

class UsuarioRepository implements IUsuarioRepository {
    private readonly prisma!: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async obtenerPorEmail(email: string) {
        return this.prisma.usuario.findUnique({
            where: {email},
            select: {
                id: true,
                email: true,
                contrasena: true,
            },
        });
    }

    async obtenerPorId(id: number): Promise<IUsuario | null> {
        return this.prisma.usuario.findUnique({
            where: {id},
            include: {
                rol: true
            }
        });
    }

    async crear(usuario: any): Promise<void> {
        await this.prisma.usuario.create({data: usuario})
    }

    async actualizarContrasena(id: number, contrasena: string) {
        await this.prisma.usuario.update({
            where: {id},
            data: {
                contrasena: contrasena
            }
        })
    }

    async actualizarEstado(estado: boolean = false, id: number) {
        await this.prisma.usuario.update({
            where: {id},
            data: {
                validado: estado
            }
        })
    }

    async obtenerTodos(): Promise<IUsuario[]> {
        return this.prisma.usuario.findMany({
            include: {
                rol: true
            }
        });
    }
}

export default UsuarioRepository;