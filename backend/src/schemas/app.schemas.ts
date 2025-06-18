import {z} from "zod"

const registerSchema = z.object({
    id: z.number().optional(),
    email: z.string().email(),
    contrasena: z.string().min(6),
    nombre: z.string(),
    apellido: z.string(),
    direccion: z.string(),
    rolid: z.preprocess(
        (val) => (val === undefined ? 2 : val),
        z.number()
    ),
    validado: z.boolean().default(false),
})

const recoverSchema = z.object({
    email: z.string().email(),
})

const changePasswordSchema = z.object({
    token: z.string(),
    contrasena: z.string().min(6),
})

const loginSchema = z.object({
    id: z.number().optional(),
    email: z.string().email(),
    contrasena: z.string().min(6),
})

const usuarioSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    nombre: z.string(),
    apellido: z.string(),
    direccion: z.string().nullable(),
    rol: z.object({
        id: z.number(),
        nombre: z.string()
    }),
    validado: z.boolean().nullable()
})

export {
    registerSchema,
    loginSchema,
    usuarioSchema,
    recoverSchema,
    changePasswordSchema
}