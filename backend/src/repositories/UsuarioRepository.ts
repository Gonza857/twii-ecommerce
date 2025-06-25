import {PrismaClient} from "@prisma/client";
import {Usuario, UsuarioRegisterDTO} from "../models/usuario-model";
import {IUsuarioRepository} from "../models/interfaces/repositories/usuario.repository.interface";

class UsuarioRepository implements IUsuarioRepository {
    private readonly prisma!: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async obtenerPorEmailParaLogin(email: string) {
        return this.prisma.usuario.findUnique({
            where: {email},
            select: {
                id: true,
                email: true,
                contrasena: true,
            },
        });
    }

    async obtenerPorId(id: number): Promise<Usuario | null> {
        return this.prisma.usuario.findUnique({
            where: {id},
            include: {
                rol: true
            }
        });
    }

    async crear(usuario: UsuarioRegisterDTO): Promise<number | null> {
        const usuarioCreado = await this.prisma.usuario.create({data: usuario});
        return usuarioCreado.id;
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

    async obtenerTodos(): Promise<Usuario[]> {
        return this.prisma.usuario.findMany({
            include: {
                rol: true
            }
        });
    }
}

export default UsuarioRepository;