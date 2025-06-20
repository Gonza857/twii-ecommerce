import {Request, Response} from "express";
import {AuthenticatedRequest} from "../models/main-models";
import {IUsuarioService} from "../models/interfaces/usuario.service.interface";
import {Usuario} from "../models/usuario-model";

class UsuarioController {
    private usuarioService!: IUsuarioService;

    constructor(usuarioService: IUsuarioService) {
        this.usuarioService = usuarioService;
    }

    public obtenerUsuarioPorId = async (_req: Request, res: Response) => {
        const {id} = _req.params
        // Validar que no sea undefined o nulo..
        // Convertir a numero...
        const usuarioEncontrado: Usuario | null = await this.usuarioService.obtenerUsuarioPorId(id)
        res.status(200).json(usuarioEncontrado);
    }

    public obtenerTodos = async (_req: AuthenticatedRequest, res: Response) => {
        // TODO: validar si tiene permiso con el rol y token...
        const usuario = await this.usuarioService.obtenerUsuarioPorId(_req.user);
        if (!usuario) return res.status(401).send();
        const usuarios: Usuario[] = await this.usuarioService.obtenerTodos();
        res.status(200).json(usuarios);
    }


}

export default UsuarioController;