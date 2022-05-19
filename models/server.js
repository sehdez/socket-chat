const express = require("express");
const cors    = require('cors');
const  fileUpload  = require('express-fileUpload');
const { dbConection } = require("../database/config");
const { socketController } = require("../sockets/controller");


class Server {

    constructor(){
        this.app    = express();
        this.port   = process.env.PORT
        this.server = require('http').createServer( this.app )
        this.io     = require('socket.io')(this.server)

        this.paths = {
            auth      : '/api/auth',
            buscar    : '/api/buscar',
            upload    : '/api/upload',
            usuarios  : '/api/usuarios',
            categorias: '/api/categorias',
            productos : '/api/productos'
        }        

        //Conectar base de datos
        this.conectarBD();

        //Middlewares
        this.middlewares();

       // Sockets
       this.sockets();

        //Rutas de la app
        this.routes();
    }

    //Metodo para conectar la base de datos
    async conectarBD(){
        await dbConection();
    }

    middlewares(){

        // Cors
        this.app.use( cors() )

        //Directorio Publico
        this.app.use( express.static('public') );

         // Lectura y Parseo del body
         this.app.use( express.json() );

        // carga de archivos
        this.app.use(fileUpload ({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }


    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.upload, require('../routes/uploads'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios') );
        this.app.use(this.paths.categorias, require('../routes/categorias') );
        this.app.use(this.paths.productos, require('../routes/productos') );
    }


    sockets(){
        this.io.on('connection', socketController )
    }




    listen(){
        this.server.listen(this.port, ()=> {
            console.log(`Servidor corriendo en puerto ${ this.port } `);
        });


    }





}


module.exports = Server;