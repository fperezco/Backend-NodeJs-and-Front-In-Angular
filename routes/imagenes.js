// Express
var express = require("express");
//me traigo el middleware de autenticacion del token
const { verificaToken } = require("../middlewares/autenticacion");
// File upload
var fileUpload = require("express-fileupload");
// Filessystem
var fs = require("fs");
// Schemas
var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

// Inicializar variables
var app = express();

//file upload
app.use(fileUpload());

// ====================================
// Rutas
// ====================================

/**
 * SUBIDA DE ARCHIVOS
 */
//lo hacemos por put pk se sube foto a recursos ya exitentes
app.get("/imagenes/:tipo/:nbrImagen", (req, res, next) => {
  let id = req.params.nbrImagen;
  let tipo = req.params.tipo;
  var tiposValidos = ["medicos", "usuarios", "hospitales"];
  if (tiposValidos.indexOf(tipo) < 0) {
    //-1 si no lo encuentra
    res.status(400).json({
      ok: false,
      mensaje: "Tipo no valido",
      errors: {
        message:
          "debe seleccionar tipo de coleccion tal que : " +
          tiposValidos.join(", ")
      }
    });
  }

  var path = `uploads/${tipo}/${id}`;

  fs.exists(path, existe => {
    if (!existe) {
      console.log("por akiii", path);
      path = "assets/noimage.png";
    }
    // si existe la devuelvo
    res.sendFile(path, { root: "." });
  });
});

//lo exporto para usarlo fuera
module.exports = app;
