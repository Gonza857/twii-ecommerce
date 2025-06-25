import express, {Router} from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import {setupSwagger} from "../config/swagger";
import path from 'path';
import multer from 'multer';

interface Options {
    puerto: number,
    routes: Router,
}

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export class Server {
    private app = express()
    private readonly puerto!: number;
    private readonly routes!: Router;

    constructor(options: Options) {
        const {puerto, routes} = options
        this.puerto = puerto
        this.routes = routes
    }

    async start() {
        this.app.use(cookieParser())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cors({
            origin: 'http://localhost:4200',
            credentials: true
        }))

        this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

        setupSwagger(this.app)
        this.app.use(this.routes)

        const callback = () => console.log(`Escuchando en el puerto ${this.puerto}`)
        this.app.listen(this.puerto, callback)
    }

}