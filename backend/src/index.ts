import {Server} from "./app/server";
import {envConfig} from "./config/envConfig";
import {AppRoutes} from "./app/app.routes";

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