const express = require('express');
//importo el modelo
const Usuario = require('../models/usuario');
//encriptar pass
const bcrypt = require('bcrypt');
//el jwt
const jwt = require('jsonwebtoken');

//para login con google
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


//Inicializamos
const app = express();


//ruta de login, recibe por post mail y password
//login standard
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



//esta fx devuelve una promesa
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    console.log("EEEEEEEEEEEOOOOOOOOOOOOO");
    console.log(payload.name);
    console.log(payload.email);

    //devuelvo un objeto parecido al de mi sistema sin password
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}



//login con google
app.post('/google', async(req, res) => {

    //recojo el id_token despues del login con google
    let token = req.body.token;

    let googleUser = await verify(token)
        .catch(error => {
            return res.status(403).json({
                ok: false,
                err: error
            });
        });

    //logueo ok de un user de google
    //HE DE VERIFICAR SI YA EXISTE UN TIO CON ESE MAIL
    //PUEDE SER K YA EXISTA => HA DE LOGUEARSE CON SU CUENTA NORMAL NO GOOGLE
    //O SI NO EXISTE, LO CREO COMO USER Y DIGO K ES DE GOOGLE => GOOGLE = TRUE    

    //1 verificar que ese email no esta en conflico con uno de mi sistema
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //un tio k tiene ese mail pero no se autentico con google
        if (usuarioDB) {
            if (!usuarioDB.google) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "debe usar su autenticacion normal y no la de google ya que es usuario del sistema con ese mail"
                    }
                });
            } else { //ES UN USER DE GOOGLE K SE LOGUEA => RENUEVO SU TOKEN COMO EN UN LOGIN NORMAL SIN GOOGLE
                //generamos el jwt
                let token = jwt.sign({
                    usuario: usuarioDB //es el payload
                }, process.env.JWT_SEED, { expiresIn: process.env.JWT_CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })


            }
        } else //el usuario no existe => se loguea y he de crearlo en mi BD
        {
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.picture;
            usuario.google = true;
            usuario.password = ':)';

            //guardamos el user
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                // si no hay error => creo el token y devuelvo el user y el token
                let token = jwt.sign({
                    usuario: usuarioDB //es el payload
                }, process.env.JWT_SEED, { expiresIn: process.env.JWT_CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            });



        }


    })

});


module.exports = app;