"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = void 0;
require("dotenv/config");
const env_var_1 = require("env-var");
exports.envConfig = {
    puerto: (0, env_var_1.get)("PUERTO").required().asPortNumber()
};
