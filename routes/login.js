const express = require('express');
//importo el modelo
const Usuario = require('../models/usuario');
//encriptar pass
const bcrypt = require('bcrypt');
//el jwt
const jwt = require('jsonwebtoken');


//Inicializamos
const app = express();


//ruta de login, recibe por post mail y password
app.post('/login', function(req, res) {

    let body = req.body;

    //vemos si existe el mail
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        // peta la consulta a la bd
        if( err ){
            res.status(500).json({
                ok: false,
                mensaje : 'Error buscando usuario',
                errors: err
            });
        }

        //puede que no exista el usuario
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: '(Usuario) o contraseña incorrectos',
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        //en este punto existe el usuario y comprobamos la contraseña
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                mensaje: '(Usuario) o contraseña incorrectos',
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        } else {

            //generamos el jwt
            let token = jwt.sign({
                usuario: usuarioDB //es el payload
            }, process.env.JWT_SEED, { expiresIn: process.env.JWT_CADUCIDAD_TOKEN }); //expira en una hora

            res.json({
                ok: true,
                usuario: usuarioDB,
                token: token,
                id: usuarioDB.id
            });
        }

    });

});


module.exports = app;