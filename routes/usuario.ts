import { Router, Request, Response } from "express";
import { Usuario } from "../models/usuario.model";
import bcrypt from 'bcrypt';
import Token from "../classes/token";
import { verificaToken } from "../middlewares/autenticacion";


const userRoutes = Router();

// userRoutes.get('/prueba', (req: Request, res: Response) => {
//     res.json({
//         ok: true,
//         mensaje: 'Todo funciona bien'
//     });
// });

//Log in
userRoutes.post('/login', async (req: Request, res: Response) => {
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

        const userDB = await Usuario.findOne({email: body.email});

        res.header('Access-Control-Allow-Origin', '*');

        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }

        if(userDB.compararPassword(body.password) ) {

            const tokenUser = Token.getJwtToken({
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

        } else {
            res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos ***'
            });
        };
    } catch (err) {
        throw err;
    }
});

//Crear un usuario
userRoutes.post('/create', (req: Request, res: Response) => {

    res.header('Access-Control-Allow-Origin', '*'); //para que funcione el CORS
    
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };

    Usuario.create(user).then( userDB => {

        const tokenUser = Token.getJwtToken({
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

    }).catch( err => {
        res.json({
            ok: false,
            err
        });
    });
});


//Actualizar usuario   
    userRoutes.post('/update', verificaToken, async (req: any, res: Response) => {

        res.header('Access-Control-Allow-Origin', '*'); //para que funcione el CORS

        const user = {
            nombre: req.body.nombre || req.usuario.nombre,
            email: req.body.email || req.usuario.email,
            avatar: req.body.avatar || req.usuario.avatar
        };

        // Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true}, (err, userDB) => {
        // });

        try {
            
            const userDB = await Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true});

            if(!userDB) {
                return res.json({
                    ok: false,
                    mensaje: 'No existe un usuario con ese ID'
                });
            }

            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                ok: true,
                token: tokenUser
            });


        } catch (err) {
            throw err;  
        }

    });

    userRoutes.get('/', [verificaToken], (req: any, res: Response) => {

        res.header('Access-Control-Allow-Origin', '*'); //para que funcione el CORS
        
        const usuario = req.usuario;

        res.json({
            ok: true,
            usuario
        })
    });

export default userRoutes;