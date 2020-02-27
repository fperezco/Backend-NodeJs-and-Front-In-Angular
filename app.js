// Importamos librerias
// My custom configuration
require('./config/config');
// Express
var express = require('express');
//Mongoose
var mongoose = require('mongoose');
//Body parser para obtener parametros por get
var bodyParser = require('body-parser');

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
//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
//app.use(bodyParser.json())

    
// Rutas
app.use(require('./routes/routes'));

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log('Express on port '+process.env.PORT+': \x1b[32m%s\x1b[0m', 'online');
});


