import {Request} from "express";

export interface IResultadoAccion {
    exito?: boolean;
    mensaje?: string;
    data?: any;
}

export interface AuthenticatedRequest extends Request {
    user?: any; // o mejor: `user?: IUsuario | null`
}