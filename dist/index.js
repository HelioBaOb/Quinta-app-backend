"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importaciones
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
//Importar el servidor
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const post_1 = __importDefault(require("./routes/post"));
const server = new server_1.default();
//Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//FileUpload
server.app.use((0, express_fileupload_1.default)({ useTempFiles: true }));
//Rutas de mi app
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_1.default);
//Configurar CORS
server.app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // Send response
    res.sendStatus(200);
    next();
});
server.app.use((0, cors_1.default)());
//Conectar DB
// mongoose.connect('mongodb://localhost:27017/fotosgram', 
//                 { useNewUrlParser: true, useCreateIndex: true }, 
//                 (err) => {
//     if(err) throw err;
//     console.log('Base de datos ONLINE');
// });
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram').then((err) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Base de datos ONLINE');
    }
    catch (error) {
        console.log('Error al conectar a la base de datos');
        throw error;
    }
}));
//Levantar Express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
