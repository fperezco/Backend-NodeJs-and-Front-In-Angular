const express = require("express");
const app = express();

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  next();
});


//rutas a exportar
app.use(require("./usuario"));
app.use(require("./login"));
app.use(require("./hospital"));
app.use(require("./medico"));
app.use(require("./busqueda"));
app.use(require("./upload"));
app.use(require("./imagenes"));

app.get("/", (req, res, next) => {
  res.status(200).json({
    ok: true,
    mensaje: "Petición oki"
  });
});

module.exports = app;
