import {z} from "zod";
import {loginSchema, recoverSchema, registerSchema, usuarioSchema} from "../schemas/app.schemas";

export interface IUsuarioLogin {
    email: string,
    contrasena: string,
    direccion: string | null,
    nombre?: string,
    apellido?: string,
    rol?: any,
}

export type ILogin = z.infer<typeof loginSchema>;
export type IRegister = z.infer<typeof registerSchema>;
export type IUsuario = z.infer<typeof usuarioSchema>;
export type IRecover = z.infer<typeof recoverSchema>;