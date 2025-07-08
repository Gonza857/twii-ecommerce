import { PrismaClient } from "@prisma/client";
import { Clasificacion } from "../models/entities/clasificacion";
import { IClasificacionRepository } from "../models/interfaces/repositories/clasificacion.repository.interface";

export class ClasificacionRepository implements IClasificacionRepository {
    private readonly prisma!: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async crearClasificacion(nombre: string): Promise<Clasificacion> {
    return await this.prisma.clasificacion.create({
      data: { nombre },
    });
  }

  public async obtenerClasificaciones(): Promise<Clasificacion[]> {
        return this.prisma.clasificacion.findMany({
            orderBy: {nombre: 'asc'}
        });
    }

  async actualizarClasificacion(id: number, nombre: string): Promise<Clasificacion | null> {
    return await this.prisma.clasificacion.update({
      where: { id },
      data: { nombre },
    });
  }

  async eliminarClasificacion(id: number): Promise<void> {
    await this.prisma.clasificacion.delete({
      where: { id },
    });
  }
}