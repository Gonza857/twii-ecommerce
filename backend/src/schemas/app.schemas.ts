import {z} from "zod"

const usuarioSchema = z.object({
    email: z.string().email(),
    contrasena: z.string().min(6),
    nombre: z.string(),
    apellido: z.string(),
    direccion: z.string(),
    rol: z.object({
        connect: z.object({
            id: z.number(),
        }),
    }).optional().default({ connect: { id: 2 } }),
})

export {
    usuarioSchema
}