import {Request, RequestHandler, Response} from "express";
import {IUsuarioLogin} from "../models/usuario-model";
import UsuarioService from "../services/UsuarioService";
import {usuarioSchema} from "../schemas/app.schemas";
import {validate} from "../utils/zod-validator";
import {ZodSchema} from "zod";

class UsuarioController {
    private usuarioService!: UsuarioService;

    constructor(usuarioService: UsuarioService) {
        this.usuarioService = usuarioService;
    }

    public async getResultadoTest(_req: Request, res: Response) {
        res.status(200).json("Hola desde Usuario Controller (BACKEND)")
    }

    public iniciarSesion = async (_req: Request<{}, {}, IUsuarioLogin>, res: Response): Promise<void> => {
        const body = _req.body
        let resultadoValidacion = this.validarFormatoUsuario(usuarioSchema, body, true);
        if (typeof resultadoValidacion === "boolean") {
            res.status(400).send();
            return;
        }

        try {
            const resultado = await this.usuarioService.iniciarSesion(resultadoValidacion);
            res.status(200).json(resultado)
        } catch (e) {
            console.log(e)
            res.status(400).send()
        }
    }

    public registrarse = async (_req: Request<{}, {}, IUsuarioLogin>, res: Response) : Promise<void> => {
        const body = _req.body
        let resultadoValidacion = this.validarFormatoUsuario(usuarioSchema, body, false);
        if (typeof resultadoValidacion === "boolean") {
            res.status(400).send();
            return;
        }

        try {
            const resultado = await this.usuarioService.registrarse(resultadoValidacion);
            res.status(200).json(resultado)
        } catch (e) {
            console.log(e)
            res.status(400).send()
        }
    }

    public obtenerUsuarioPorId = async (_req: Request<{ id: string }>, res: Response): Promise<void> => {
        const {id} = _req.params
        // Validar que no sea undefined o nulo..
        // Convertir a numero...
        const usuarioEncontrado: IUsuarioLogin | null = await this.usuarioService.obtenerUsuarioPorId(id)
        res.status(200).json(usuarioEncontrado);
    }

    private validarFormatoUsuario (
        usuarioSchema: ZodSchema,
        cuerpo: IUsuarioLogin,
        partial: boolean,
    ): IUsuarioLogin | boolean {
        try {
            return validate(usuarioSchema, cuerpo, {partial: partial});
        } catch (e) {
            console.log(e)
            return false;
        }
    }

}

export default UsuarioController;