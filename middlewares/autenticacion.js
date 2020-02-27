//creamos una fx que ejecuta la verificacion del token
const jwt = require('jsonwebtoken');

//next => continuar con la ejecucion del programa
//module.exports.verificaToken = (req, res, next) => {
let verificaToken = (req, res, next) => {

    //leemos el token que viene por el header con nombre "token",
    // se usa el metodo get del request para obtener el header
    let token = req.get('token');
    console.log(req);

    //si lo quieres recibir por el authorization bearer
    //var token1 = req.headers.authorization.split(" ")[1];
    //var token1 = req.get('authorization'); y hacer el split
    console.log("EL TOKEN ES",token1);

    jwt.verify(token, process.env.JWT_SEED, (err, decode) => {

        if (err) {
            //401 => no autorizado
            return res.status(401).json({
                ok: false,
                mensaje: 'No autorizado',
                err
            });
        }

        //=> si sigo por aki => el decode contiene info del usuario => no error
        //pk se que en l payload viene el usuario pk yo lo encripte
        //en el request meto una variable usuario aunke despues no la devuelva...
        //vale la idea de esto es tener en todos los request presente quien es el que esta haciendo las cosas
        //quien inserta, quien consulta, etc...
        req.usuario = decode.usuario;
        next(); //continua la ejecucion de la peticion


    });
};

/**
 * pàra verificar token por url
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
/*let verificaTokenImg = (req, res, next) => {

    //leemos el token que viene url 
    let token = req.query.token;

    jwt.verify(token, process.env.JWT_SEED, (err, decode) => {

        if (err) {
            //401 => no autorizado
            return res.status(401).json({
                ok: false,
                err
            });
        }

        //=> si sigo por aki => el decode contiene info del usuario => no error
        //pk se que en l payload viene el usuario pk yo lo encripte
        //en el request meto una variable usuario aunke despues no la devuelva...
        //vale la idea de esto es tener en todos los request presente quien es el que esta haciendo las cosas
        //quien inserta, quien consulta, etc...
        req.usuario = decode.usuario;
        next(); //continua la ejecucion de la peticion


    });
};*/



/**
 * VERIFICA ADMIN ROLE
 */

//SOLO ADMIN PUEDE HACER DETERMINADAS TAREAS COMO CREAR O BORRAR USUARIOS
//creamos este nuevo middelware y lo inyectamos en el create y delete
/*let verificaAdminRol = (req, res, next) => {

    let usuario = req.usuario;

    //SOLO ADMIN PUEDE HACER DETERMINADAS COSAS
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: 'No autorizado'
            }
        });


    }

};*/



//si aqui lo exporto con llaves => luego he de importarlo con desestructuracion
module.exports = {
    verificaToken,
    //verificaAdminRol,
    //verificaTokenImg
};