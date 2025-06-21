import { z } from 'zod';
import {
    carritoSchema,
    changePasswordSchema,
    loginSchema,
    recoverSchema,
    registerSchema,
    usuarioSchema
} from '../schemas/app.schemas';

export type UsuarioLoginDTO = z.infer<typeof loginSchema>;
export type UsuarioRegisterDTO = z.infer<typeof registerSchema>;
export type Usuario = z.infer<typeof usuarioSchema>;
export type UsuarioRecoverDTO = z.infer<typeof recoverSchema>;
export type UsuarioCambiarDTO = z.infer<typeof changePasswordSchema>;
export type ICarrito = z.infer<typeof carritoSchema>;

export type UsuarioLogin = {
    id: number;
    email: string;
    contrasena: string;
}
