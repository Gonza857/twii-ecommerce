import {z} from "zod";
import {changePasswordSchema, loginSchema, recoverSchema, registerSchema, usuarioSchema} from "../schemas/app.schemas";

export type ILogin = z.infer<typeof loginSchema>;
export type IRegister = z.infer<typeof registerSchema>;
export type IUsuario = z.infer<typeof usuarioSchema>;
export type IRecover = z.infer<typeof recoverSchema>;
export type IChangePassword = z.infer<typeof changePasswordSchema>;