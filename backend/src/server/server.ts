import express, {Router} from "express"
import cors from "cors"

interface Options {
    puerto: number,
    routes: Router,
}

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
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cors())
        this.app.use(this.routes)

        const callback = () => console.log(`Escuchando en el puerto ${this.puerto}`)
        this.app.listen(this.puerto, callback)
    }

}