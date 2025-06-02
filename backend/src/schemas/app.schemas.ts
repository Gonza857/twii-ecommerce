import {z} from "zod"

const usuarioSchema = z.object({
    email: z.string().email(),
    contrasena: z.string().min(6)
})

export {
    usuarioSchema
}