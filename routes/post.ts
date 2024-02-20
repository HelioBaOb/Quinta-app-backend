import { Router, Response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Post } from "../models/post.model";
import { FileUpload } from "../interfaces/file-upload";
import FileSystem from "../classes/file-system";



const postRoutes = Router();
const fileSystem = new FileSystem();


//Obtener POST paginados
postRoutes.get('/', async (req: any, res: Response) =>{

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const posts = await Post.find()
                            .sort({_id: -1})
                            .skip(skip)
                            .limit(10)
                            .populate('usuario', '-password')
                            .exec();
    res.header('Access-Control-Allow-Origin', '*'); //para que funcione el CORS

    res.json({
        ok: true,
        pagina,
        posts
    });
});



//Crear POST
postRoutes.post('/', [ verificaToken ], (req: any, res: Response) =>{

     res.header('Access-Control-Allow-Origin', '*'); //para que funcione el CORS

    const body = req.body;
    body.usuario = req.usuario._id;

    const imagenes = fileSystem.imagenesDeTempHaciaPost( req.usuario._id );
    body.imgs = imagenes;

    Post.create( body ).then( async postDB => {

        try {
            await postDB.populate('usuario', '-password');
            res.json({
                ok: true,
                post: postDB
            });

        } catch (err) {
            res.json(err);
        }

    })
});

//Servicio para subir archivos
postRoutes.post('/upload', [ verificaToken ], async (req: any, res: Response) =>{

    res.header('Access-Control-Allow-Origin', '*'); //para que funcione el CORS

    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo'
        });
    }

    const file: FileUpload = req.files.image;

    if(!file){
        return res.status(400).json({ 
            ok: false,
            mensaje: 'No se subió ningún archivo de tipo image'
        });
    }

    if(!file.mimetype.includes('image')){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio una imagen'
        });
    }

    await fileSystem.guardarImagenTemporal( file, req.usuario._id)

    return res.status(200).json({
        ok: true,
        mensaje: 'Se subieron los archivos correctamente',
        file: file.mimetype
    });
});


postRoutes.get('/imagen/:userid/:img', (req: any, res: Response) =>{

    res.header('Access-Control-Allow-Origin', '*'); //para que funcione el CORS

    const userId = req.params.userid;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl( userId, img );

    res.sendFile( pathFoto );

});

export default postRoutes;