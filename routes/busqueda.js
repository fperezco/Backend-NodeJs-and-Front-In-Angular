// Express
var express = require("express");
//me traigo el middleware de autenticacion del token
const { verificaToken } = require("../middlewares/autenticacion");
// Schema hospital
var Hospital = require("../models/hospital");
// Schema hospital
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

// Inicializar variables
var app = express();

// ====================================
// Rutas
// ====================================
/**
 * BUSQUEDAS ESPECIFICAS
 */
app.get("/coleccion/:tabla/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i");
  var tabla = req.params.tabla;

  if (tabla == "hospitales") {
    promesa = buscarHospitales(regex);
  } else if (tabla == "medicos") {
    promesa = buscarMedicos(regex);
  } else if (tabla == "usuarios") {
    promesa = buscarUsuarios(regex);
  } else {
    res.status(400).json({
      ok: false,
      mensaje: "Error en busqueda, coleccion no existente"
    });
  }

  //si llega aki => tenemos promesa
  promesa
    .then(respuesta => {
      res.json({
        ok: true,
        [tabla]: respuesta
      });
    })
    .catch(error => {
      res.status(500).json({
        ok: false,
        mensaje: "Error en busqueda",
        errors: error
      });
    });
});

/**
 * BUSQUEDA GENERAL
 */
app.get("/todo/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;
  // busco ojo al query con la expresion regular
  // insensible a mayusculas y minusculas
  var regex = new RegExp(busqueda, "i");

  // Forma limpia de ejecutar promesas de forma simultanea
  // y esperar a que todas terminen, devuelve un array de respuestas
  // en el orden que se invocaron idem para errores mejor y mas claro
  // que la version 1.0 de abajo
  Promise.all([
    buscarHospitales(regex),
    buscarMedicos(regex),
    buscarUsuarios(regex)
  ])
    .then(respuestas => {
      res.json({
        ok: true,
        hospitales: respuestas[0],
        medicos: respuestas[1],
        usuarios: respuestas[2]
      });
    })
    .catch(error => {
      res.status(500).json({
        ok: false,
        mensaje: "Error en busqueda",
        errors: error
      });
    });

  //version válida pero más liosa pk se anidan promesas
  /* buscarHospitales(regex)
    .then(hospitales => {
      buscarMedicos(regex)
      .then(medicos => {
          res.json({
            ok: true,
            hospitales, //es igual a hospitales:hospitales
            medicos
          });
        } 
      );
    } 
  )
  .catch( error => {
    res.status(500).json({
      ok: false,
      mensaje: "Error en busqueda",
      errors: error
    });
  });*/
});

/**
 * Funcion que devuelve una promesa para buscar hospitales
 * @param {} busqueda
 * @param {*} regex
 */
function buscarHospitales(regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex }).exec((err, hospitales) => {
      if (err) {
        reject("Error buscando hospitales", err);
      }
      resolve(hospitales);
    });
  });
}

function buscarMedicos(regex) {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex }).exec((err, medicos) => {
      if (err) {
        reject("Error buscando medicos", err);
      }
      resolve(medicos);
    });
  });
}

function buscarUsuarios(regex) {
  return new Promise((resolve, reject) => {
    Usuario.find()
      .or([{ nombre: regex }, { email: regex }])
      .exec((err, usuarios) => {
        if (err) {
          reject("Error buscando usuarios", err);
        }
        resolve(usuarios);
      });
  });
}

//lo exporto para usarlo fuera
module.exports = app;
