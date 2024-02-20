//Importaciones
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';

//Importar el servidor
import Server from './classes/server';
import userRoutes from './routes/usuario';
import postRoutes from './routes/post';

const server = new Server();

//Body parser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

//FileUpload
server.app.use(fileUpload({ useTempFiles: true}));

//Rutas de mi app
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);

//Configurar CORS
server.app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  // Send response
    res.sendStatus(200);
    next();
  });
server.app.use(cors());
//Conectar DB
// mongoose.connect('mongodb://localhost:27017/fotosgram', 
//                 { useNewUrlParser: true, useCreateIndex: true }, 
//                 (err) => {
//     if(err) throw err;
//     console.log('Base de datos ONLINE');
// });

mongoose.connect('mongodb://localhost:27017/fotosgram', ).then(async (err) => {
                    try {
                        console.log('Base de datos ONLINE');
                    } catch (error) {
                        console.log('Error al conectar a la base de datos');
                        throw error;
                    }
                });


//Levantar Express
server.start( () => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});