import {Request, Response} from "express";
import {IUsuario} from "../models/usuario-model";
import UsuarioService from "../services/UsuarioService";
import {IUsuarioService} from "../models/services-interfaces";

class UsuarioController {
    private usuarioService!: IUsuarioService;

    constructor(usuarioService: IUsuarioService) {
        this.usuarioService = usuarioService;
    }

    public async getResultadoTest(_req: Request, res: Response) {
        res.status(200).json("Hola desde Usuario Controller (BACKEND)")
    }

    public obtenerUsuarioPorId = async (_req: Request, res: Response) => {
        const {id} = _req.params
        // Validar que no sea undefined o nulo..
        // Convertir a numero...
        const usuarioEncontrado: IUsuario | null = await this.usuarioService.obtenerUsuarioPorId(id)
        res.status(200).json(usuarioEncontrado);
    }


}

export default UsuarioController;