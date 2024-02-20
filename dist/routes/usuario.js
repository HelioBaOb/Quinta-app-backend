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
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = (0, express_1.Router)();
// userRoutes.get('/prueba', (req: Request, res: Response) => {
//     res.json({
//         ok: true,
//         mensaje: 'Todo funciona bien'
//     });
// });
//Log in
userRoutes.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    //para que funcione el CORS
    // La función findOne ya noa cepta callback, ahora es una promesa, sin embargo, 
    // aquí está el ejemplo con callback
    // Usuario.findOne({email: body.email}, (err: any, userDB: any) => {
    //     if(err) throw err;
    //     if (!userDB) {
    //         return res.json({
    //             ok: false,
    //             mensaje: 'Usuario/contraseña no son correctos'
    //         });
    //     }
    //     if(userDB.compararPassword(body.password) ) {
    //         res.json({
    //             ok: true,
    //             mensaje: 'Todo está bien',
    //             token: 'AHSXNRHR78S93NDYFCTEWWJ'
    //         });
    //     } else {
    //         res.json({
    //             ok: false,
    //             mensaje: 'Usuario/contraseña no son correctos ***'
    //         });
    //     };
    // });
    try {
        const userDB = yield usuario_model_1.Usuario.findOne({ email: body.email });
        res.header('Access-Control-Allow-Origin', '*');
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }
        if (userDB.compararPassword(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            res.json({
                ok: true,
                mensaje: 'Todo está bien',
                token: tokenUser
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos ***'
            });
        }
        ;
    }
    catch (err) {
        throw err;
    }
}));
//Crear un usuario
userRoutes.post('/create', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); //para que funcione el CORS
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    usuario_model_1.Usuario.create(user).then(userDB => {
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            mensaje: 'Todo está bien',
            token: tokenUser
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//Actualizar usuario   
userRoutes.post('/update', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.header('Access-Control-Allow-Origin', '*'); //para que funcione el CORS
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    };
    // Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true}, (err, userDB) => {
    // });
    try {
        const userDB = yield usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true });
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    }
    catch (err) {
        throw err;
    }
}));
userRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); //para que funcione el CORS
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
exports.default = userRoutes;
