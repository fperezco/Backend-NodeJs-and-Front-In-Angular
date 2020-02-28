const express = require("express");
const app = express();

//rutas a exportar
app.use(require("./usuario"));
app.use(require("./login"));
app.use(require("./hospital"));
app.use(require("./medico"));

app.get("/", (req, res, next) => {
  res.status(200).json({
    ok: true,
    mensaje: "Petición oki"
  });
});

module.exports = app;
