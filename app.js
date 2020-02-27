// Importamos librerias
// My custom configuration
require('./config');
// Express
var express = require('express');
//Mongoose
var mongoose = require('mongoose');



//--------------------------------------
// INICIALIZACION
//--------------------------------------

// Inicializar variables
var app = express();
//Conectar a la BD
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});
    



// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje : "Petición oki"
    });

});

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log('Express on port '+process.env.PORT+': \x1b[32m%s\x1b[0m', 'online');
});


