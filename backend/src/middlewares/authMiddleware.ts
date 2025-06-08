import {verificarToken} from "../utils/jwt";
import {NextFunction, Request, Response} from "express";
import {AuthenticatedRequest} from "../models/main-models";

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    console.log("middleware ejecutado");
    try {
        const token = req.cookies['access-token'];
        if (!token) {
            req.user = null;
            return next();
        }

        const payload: any = verificarToken(token);
        console.log("payload", payload);
        req.user = payload.id ?? null;
    } catch (e) {
        req.user = null;
    }

    next();
};