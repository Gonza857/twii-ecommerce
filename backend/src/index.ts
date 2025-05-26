import {Server} from "./server/server";
import {envConfig} from "./config/envConfig";
import {AppRoutes} from "./routes/app.routes";

(async ()=>{
    main();
})();

function main(){
    const config = {
        puerto: envConfig.puerto,
        routes: AppRoutes.getRoutes()
    }
    const server = new Server(config);
    server.start()
}