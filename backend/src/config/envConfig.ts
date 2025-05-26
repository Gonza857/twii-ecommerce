import "dotenv/config"
import {get} from "env-var"

export const envConfig = {
    puerto: get("PUERTO").required().asPortNumber()
}