import {Request, Response} from "express";

class UsuarioController {
    constructor() {
        console.log("Usuario Controller");
    }

    public async getResultadoTest(_req: Request, res: Response) {
        res.status(200).json("Hola desde Usuario Controller (BACKEND)")
    }

}

export default UsuarioController;