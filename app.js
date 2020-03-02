// Importamos librerias
// My custom configuration
require("./config/config");
// Express
var express = require("express");
//CORS
const cors = require('cors');
//Mongoose
var mongoose = require("mongoose");
//Body parser para obtener parametros por get
var bodyParser = require("body-parser");

//--------------------------------------
// INICIALIZACION
//--------------------------------------

// Inicializar variables
var app = express();

//CORS
app.use(cors());


//Conectar a la BD
mongoose.connect(process.env.URLDB, (err, res) => {
  if (err) throw err;
  console.log("Base de datos: \x1b[32m%s\x1b[0m", "online");
});
//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Rutas
app.use(require("./routes/routes"));
//var usuarioRoutes = require('./routes/usuario');
//app.use(usuarioRoutes);


app.get("/", (req, res, next) => {
  res.status(200).json({
    ok: true,
    mensaje: "Petición oki"
  });
});

// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(
    "Express on port " + process.env.PORT + ": \x1b[32m%s\x1b[0m",
    "online"
  );
});
