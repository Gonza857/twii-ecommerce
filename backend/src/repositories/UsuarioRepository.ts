import {PrismaClient} from "@prisma/client";
import {IUsuarioRepository} from "../models/repositories-interfaces";
import { IUsuario} from "../models/usuario-model";

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
}

export default UsuarioRepository;