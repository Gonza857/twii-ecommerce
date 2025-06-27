import {AuthenticatedRequest} from "../models/main-models";
import {NextFunction, Response} from "express";
import {Usuario} from "../models/usuario-model";
import {serviceContainer} from "../app/container";

const usuarioService = serviceContainer.usuarioService

export const roleMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    console.log(req.user)

    const idUsuario = req.user; // asumimos que viene del middleware de auth

    if (!idUsuario) {
        res.status(401).json({mensaje: "No autenticado"})
        return;
    }

    const usuario: Usuario | null = await usuarioService.obtenerUsuarioPorId(idUsuario);
    console.log("Usuario BD", usuario)
    if (!usuario) {
        res.status(401).json({mensaje: "No autenticado"})
        return
    }
    if (usuario.rol.id !== 1) {
        res.status(403).json({mensaje: "Sin permisos"})
        return;
    }

    next();
};

