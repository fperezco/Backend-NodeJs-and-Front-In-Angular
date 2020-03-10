// Express
var express = require("express");
//me traigo el middleware de autenticacion del token
const { verificaToken } = require("../middlewares/autenticacion");
// File upload
var fileUpload = require("express-fileupload");
// Filessystem
var fs = require("fs");
//CORS
const cors = require('cors');
// Schemas
var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

// Inicializar variables
var app = express();

//file upload
app.use(fileUpload());

//CORS
app.use(cors());

// ====================================
// Rutas
// ====================================

/**
 * SUBIDA DE ARCHIVOS
 */
//lo hacemos por put pk se sube foto a recursos ya exitentes
app.put("/upload/:tipo/:id", (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).json({
      ok: false,
      mensaje: "No selecciono nada",
      errors: { message: "debe seleccionar imagen" }
    });
  }

  let id = req.params.id;
  let tipo = req.params.tipo;
  var tiposValidos = ["medicos", "usuarios", "hospitales"];
  if (tiposValidos.indexOf(tipo) < 0) {
    //-1 si no lo encuentra
    res.status(400).json({
      ok: false,
      mensaje: "Tipo no validad",
      errors: {
        message:
          "debe seleccionar tipo de coleccion tal que : " +
          tiposValidos.join(", ")
      }
    });
  }

  // The name of the input field (i.e. "sampleFile")
  // is used to retrieve the uploaded file
  let file = req.files.imagen;
  var fullFile = file.name.split(".");
  var fileExtension = fullFile[fullFile.length - 1];

  //solo estas extensiones permitidas
  var extensionesValidas = ["png", "jpg", "gif", "jpeg"];
  if (extensionesValidas.indexOf(fileExtension) < 0) {
    //-1 si no lo encuentra
    res.status(400).json({
      ok: false,
      mensaje: "Extension no validad",
      errors: {
        message:
          "debe seleccionar imagen con extension: " +
          extensionesValidas.join(", ")
      }
    });
  }

  //nombre archivo personalizado
  var fileName = `${id}-${new Date().getMilliseconds()}.${fileExtension}`;

  //mover el archivo
  var path = `./uploads/${tipo}/${fileName}`;

  // Use the mv() method to place the file somewhere on your server
  file.mv(path, function(err) {
    if (err) {
      res.status(500).json({
        ok: false,
        mensaje: "Erro mover archivo",
        errors: { message: err }
      });
    }

    //una vez que ya esta subido el archivo =>
    //actualizar el registro en la BD y responder//
    console.log("subiendo imagen:",tipo,id,fileName);
    subirPorTipo(tipo, id, fileName, res);
  });
});

function subirPorTipo(tipo, id, fileName, res) {
  if (tipo == "usuarios") {
    Usuario.findById(id, (err, usuario) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error actualizando usuario",
          errors: {
            message: "Error actualizando usuario"
          }
        });
      }

      if (!usuario) {
        return res.status(404).json({
          ok: false,
          mensaje: "ID de medico no encontrado",
          errors: {
            message: "ID de medico no encontrado"
          }
        });
      }

      var pathViejo = "./uploads/usuarios/" + usuario.img;
      console.log("path viejo = ", pathViejo);

      //si existe una imagen antigua => eliminala
      if (fs.existsSync(pathViejo)) {
        fs.unlinkSync(pathViejo);
      }

      //actualizo datos de la imagen del usuario
      usuario.img = fileName;
      usuario.save((err, usuarioActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen usuario actualizada",
          usuario: usuarioActualizado
        });
      });
    });
  }
  if (tipo == "medicos") {
    Medico.findById(id, (err, medico) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error actualizando medico",
          errors: {
            message: "Error actualizando medico"
          }
        });
      }

      if (!medico) {
        return res.status(404).json({
          ok: false,
          mensaje: "ID de medico no encontrado",
          errors: {
            message: "ID de medico no encontrado"
          }
        });
      }

      var pathViejo = "./uploads/medicos/" + medico.img;

      //si existe una imagen antigua => eliminala
      if (fs.existsSync(pathViejo)) {
        fs.unlinkSync(pathViejo);
      }

      //actualizo datos de la imagen del usuario
      console.log("vamos a actualizar medico..");
      medico.img = fileName;
      medico.save((err, medicoActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen medico actualizada",
          medico: medicoActualizado
        });
      });
    });
  }
  if (tipo == "hospitales") {
    Hospital.findById(id, (err, hospital) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          mensaje: "ID de hospital no encontrado",
          errors: {
            message: "ID de hospital no encontrado"
          }
        });
      }

      var pathViejo = "./uploads/hospitales/" + hospital.img;

      //si existe una imagen antigua => eliminala
      if (fs.existsSync(pathViejo)) {
        console.log("existe una imagen antigua en" + pathViejo + " intento borrarla");
        fs.unlinkSync(pathViejo);
        console.log("borrada");
      }

      //actualizo datos de la imagen del usuario
      console.log("vamos a actualizar hospital");
      hospital.img = fileName;
      hospital.save((err, hospitalActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen hospital actualizada ",
          hospital: hospitalActualizado
        });

      });
    });
  }
}

//lo exporto para usarlo fuera
module.exports = app;
