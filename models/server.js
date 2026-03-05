// Importaciones de Libreias
const express = require('express');  
const cors = require('cors');
const mongoose = require('mongoose');
// Colores Consola
const blue = '\x1b[34m';
const white = '\x1b[0m';
const yellow = '\x1b[33m';

class Server {
    constructor() {
        this.app = express();
        this.middleware();
        this.conectarMongo();
        this.host = process.env.HOST;
        this.port = process.env.PORT;
    }

    middleware() {
        //Inicializa el directorio público
        this.app.use(express.static('./public'));
        this.app.use(express.json());
        this.app.use(cors());
    }

    conectarMongo(){
        mongoose.connect('mongodb://localhost:27017/MinecraftDB')
        .then(() => {
            console.log('\n✅ MongoDB Conectado');
        })
        .catch(error => {
            console.log('\n❌ Error conectando a MongoDB: ', error.message);
        });
        
        let Schema = mongoose.Schema;
        //Las claves y tipos coinciden con la BD
        const schemaArma = new Schema({
            nombre: String,
            tipo: String,
            danio: String,
            especial: String,
            encantamiento: String,
            durabilidad: String,
            descripcion: String
        });
        //Generamos el modelo
        this.Model = mongoose.model('arma', schemaArma);
    }

    routes() {
        // Ruta para Consultar
        this.app.get('/consultarArma',  async(req, res) => {
            let  consulta = await this.Model.find({});
            res.json(consulta);
        });

        // Ruta para Eliminar
        this.app.delete('/eliminarArma', async(req, res) => {
            let id = req.query._id;
            await this.Model.deleteMany({_id:id});
            console.log("🗑️ Mod Eliminado de MongoDB")
            res.send('eliminado');
        });

        // Ruta para Actualizar
        this.app.patch('/actualizarArma', async(req, res) => {
            let id = req.query._id;
            let valores = req.body;
            await this.Model.findOneAndUpdate(
                {_id: id},
                {$set: valores},
                {new: true}
            );
            console.log("🔄 Mod Actualizado de MongoDB");
            res.send('actualizado');
        });

        // Ruta para Registrar
        this.app.post('/registrarArma', (req, res) => {
            //Datos recibidos del body o inputs
            let nombre = req.body.nombre;
            let tipo = req.body.tipo;
            let danio = req.body.danio;
            let especial = req.body.especial;
            let encantamiento = req.body.encantamiento;
            let durabilidad = req.body.durabilidad;
            let descripcion = req.body.descripcion;

            //Objeto con los datos del arma
            let arma = {
                nombre: nombre,
                tipo: tipo,
                danio: danio,
                especial: especial,
                encantamiento: encantamiento,
                durabilidad: durabilidad,
                descripcion: descripcion
            }

            //Guardar en MongoDB
            let guardar = new this.Model(arma);
            guardar.save(); 
            console.log('✅ Mod Registrado en MongoDB');
            res.send('Mod Registrado');
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('\nLocal:',  blue + `http://${this.host}:${this.port}/`+ white);
            console.log(yellow + 'Use Ctrl+C to quit this process'+  white); }  
        );
    }

}
module.exports = Server; 
