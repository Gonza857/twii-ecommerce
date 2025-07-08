import {verificarToken} from "../utils/jwt";
import {NextFunction, Response} from "express";
import {AuthenticatedRequest} from "../models/main-models";

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies['access-token'];
        if (!token) {
            req.user = null;
            return next();
        }
        const payload: any = verificarToken(token);
        req.user = payload.id ?? null;
    } catch (e) {
        req.user = null;
    }

    next();
};