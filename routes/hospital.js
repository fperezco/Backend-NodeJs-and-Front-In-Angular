// Express
var express = require("express");
// Schema hospital
var Hospital = require("../models/hospital");
//me traigo el middleware de autenticacion del token
const { verificaToken } = require("../middlewares/autenticacion");

// Inicializar variables
var app = express();

// ====================================
// Rutas
// ====================================

/**
 * Get listado de hospitales
 */
app.get("/hospitales", (req, res, next) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  // listado de campos a devolver
  Hospital.find({}, "nombre img usuario")
    .skip(desde)
    .limit(limite)
    //populate, gracias a que en el modelo categoria pusimos el ref Usuario mongoose es capaz de inyectar aki el modelo a partir de su id
    //.populate('usuario') //muestro el usuario entero
    .populate("usuario", ["nombre", "email"]) //populate diciendo los campos a mostrar
    .exec((err, hospitales) => {
      if (err) {
        res.status(500).json({
          ok: false,
          mensaje: "Error cargando hospitales",
          errors: err
        });
      }

      Hospital.count({}, (err, conteo) => {
        //numero de registros de usuarios en la BD he puesto una condicion para que no cuente los eliminados
        res.json({
          ok: true,
          hospitales, //es igual a hospitales:hospitales
          total: conteo //num hospitales
        });
      });
      
    });
});


/**
 * Get un hospital concreto
 */
app.get("/hospitales/:id", [verificaToken], function(req, res) {
  let id = req.params.id;

  let body = req.body;
  //filtramos los campos actualizables
  //let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'password'])

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error server get hospital",
        errors: err
      });
    }

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        mensaje: "Error hospital not found:" + id,
        errors: err
      });
    }

    //si llega a este punto si hay un medico valido para actualizar
    res.status(200).json({
      ok: true,
      hospital: hospital
    });


  });

});



/**
 * Almacenar un hospital
 */
app.post("/hospitales", [verificaToken], (req, res) => {
  //recogemos los parametros por post haciendo uso de un paquete llamado
  //npm body-parser
  let body = req.body;
  console.log("CREANDO HOSPITAL EL USUARIO QUE LO INTENTA ES ", req.usuario);

  //creamos el objeto
  let hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id
  });

  //lo guardamos a la BD
  hospital.save((err, hospitalDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear el hospital",
        err
      });
    }

    //kitamos el pass del hospital que devuelvo
    // => lo hago en el hospitaleschema.methods.toJSON del modelo
    //hospitalDB.password = null;

    res.status(201).json({
      ok: true,
      hospital: hospitalDB
    });
  });
});

/**
 * Actualizar hospital
 */
app.put("/hospitales/:id", [verificaToken], function(req, res) {
  let id = req.params.id;

  let body = req.body;
  //filtramos los campos actualizables
  //let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'password'])

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error update hospital",
        errors: err
      });
    }

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        mensaje: "Error update hospital not found:" + id,
        errors: err
      });
    }

    //si llega a este punto si hay un hospital valido para actualizar
    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;

    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error actualizar hospital",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
      });
    });
  });

  //el id, los campos, true => devuelve el registro actualizado y no el nuevo "entre llaves pk es un objeto"
  //runvalidators para que sea de acorde a las validaciones del schema del objeto
  /*hospital.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, hospitalDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalDB
        });

    });*/
});

app.delete("/hospitales/:id", [verificaToken], function(req, res) {
  let id = req.params.id;

  //delete duro
  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error borrar hospital",
        errors: err
      });
    }

    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe hospital con ese id",
        err: {
          message: "No existe hospital con ese id "
        }
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado
    });
  });
});

//lo exporto para usarlo fuera
module.exports = app;
