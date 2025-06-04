import {z} from "zod"

const registerSchema = z.object({
    email: z.string().email(),
    contrasena: z.string().min(6),
    nombre: z.string(),
    apellido: z.string(),
    direccion: z.string(),
    rol: z.preprocess(
        (val) => (val === undefined ? 2 : val),
        z.number()
    ),
})

const loginSchema = z.object({
    email: z.string().email(),
    contrasena: z.string().min(6),
})

const usuarioSchema = z.object({
    email: z.string().email(),
    nombre: z.string(),
    apellido: z.string(),
    direccion: z.string().nullable(),
    rol: z.string()
})

export {
    registerSchema,
    loginSchema,
    usuarioSchema
}