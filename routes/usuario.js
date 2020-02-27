// Express
var express = require('express');
// Schema usuario
var Usuario = require('../models/usuario');
//encriptar pass
const bcrypt = require('bcrypt');
//me traigo el middleware de autenticacion del token
const { verificaToken } = require('../middlewares/autenticacion');
//tb con esta sintaxis
//var mdAutenticacion = require('../middlewares/autenticacion');
//y en la ruta mdAutenticacion.verificaToken

// Inicializar variables
var app = express();

// ====================================
// Rutas
// ====================================

/**
 * Get listado de usuarios
 */
app.get('/usuarios', (req, res, next) => {

    // listado de campos a devolver
    Usuario.find({},'nombre email img role')
        .exec( (err, usuarios) => {

                if( err ){
                    res.status(500).json({
                        ok: false,
                        mensaje : 'Error cargando usuarios',
                        errors: err
                    });
                }
        
                //sino hay errores => 
        
                res.status(200).json({
                    ok: true,
                    //usuarios : usuarios es lo mismo que lo de abajo
                    usuarios
                });

            }    
        );

});


/**
 * Almacenar un usuario
 */
app.post('/usuarios',[verificaToken], (req, res) => {
    //recogemos los parametros por post haciendo uso de un paquete llamado
    //npm body-parser
    let body = req.body;


    //o usar try catch....
    //verificarInput(res,body);
    

    //creamos el objeto
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //el segundo arg es el numero de vueltas ¿?¿
        //password: body.password, //el segundo arg es el numero de vueltas ¿?¿
        img: body.img,
        role: body.role
    });

    //lo guardamos a la BD
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                err
            });
        }

        //kitamos el pass del usuario que devuelvo 
        // => lo hago en el usuarioSchema.methods.toJSON del modelo
        //usuarioDB.password = null;

        res.status(201).json({
            ok: true,
            usuario: usuarioDB
        });

    });
    
});


/**
 * Actualizar usuario
 */
app.put('/usuarios/:id',[verificaToken], function(req, res) {

    let id = req.params.id;

    let body = req.body;
    //filtramos los campos actualizables
    //let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'password'])

    Usuario.findById( id, (err, usuario) => {

        if(err){

            return res.status(500).json({
                ok: false,
                mensaje: 'Error update usuario',
                errors: err
            });
        }

        if( !usuario ){
            return res.status(404).json({
                ok: false,
                mensaje: 'Error update usuario not found:' + id,
                errors: err
            });
        }

        //si llega a este punto si hay un usuario valido para actualizar
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        
        usuario.save( (err,usuarioGuardado) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizar usuario',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });


        });




    });



    //el id, los campos, true => devuelve el registro actualizado y no el nuevo "entre llaves pk es un objeto"
    //runvalidators para que sea de acorde a las validaciones del schema del objeto
    /*Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });

    });*/



});


app.delete('/usuarioS/:id',[verificaToken], function(req, res) {
    
    let id = req.params.id;

    //delete duro
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con ese id',
                err: {
                    message: "No existe usuario con ese id"
                }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});



function verificarInput(res,body){

    /*if (body.password === undefined) {
        //especificamos un bad request pk faltan parametros
        res.status(400).json({
            ok: false,
            mensaje: "El password es necesario"
        });
    } else {
        res.json({
            body
        });
    }*/

   /* if (Object.entries(body).length === 0 && body.constructor === Object) {
        //especificamos un bad request pk faltan parametros
        res.status(400).json({
            ok: false,
            mensaje: "Necesarios parámetros"
        });
    } */

}



//lo exporto para usarlo fuera
module.exports = app;