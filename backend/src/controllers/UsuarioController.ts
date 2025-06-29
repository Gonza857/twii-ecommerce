import {Request, Response} from "express";
import {AuthenticatedRequest} from "../models/main-models";
import {Usuario} from "../models/usuario-model";
import {IUsuarioService} from "../models/interfaces/services/usuario.service.interface";
import {safe} from "../utils/safe";

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

    public obtenerEstadisticas = async (_req: Request, res: Response) => {
        console.log("obteniendo estadisticas")
        const [estadisticas, errorEstadisticas] = await safe(
            this.usuarioService.obtenerEstadisticas()
        )
        if (errorEstadisticas) return res.status(401).send();

        console.log("Estadisticas obtenidas", estadisticas)
        res.status(200).json(estadisticas);
    }


}

export default UsuarioController;