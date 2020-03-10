// Express
var express = require("express");
// Schema medico
var Medico = require("../models/medico");
//me traigo el middleware de autenticacion del token
const { verificaToken } = require("../middlewares/autenticacion");

// Inicializar variables
var app = express();

// ====================================
// Rutas
// ====================================

/**
 * Get listado de medicos
 */
app.get("/medicos", (req, res, next) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  // listado de campos a devolver
  Medico.find({}, "nombre img hospital usuario")
    .skip(desde)
    .limit(limite)
    .populate("usuario", ["nombre", "email"]) //envio tb el usuario asociado
    .populate("hospital", ["nombre"]) //envio tb el hospital asociado
    .exec((err, medicos) => {
      if (err) {
        res.status(500).json({
          ok: false,
          mensaje: "Error cargando medicos",
          errors: err
        });
      }

      //sino hay errores =>

      Medico.count({}, (err, conteo) => {
        //numero de registros de usuarios en la BD he puesto una condicion para que no cuente los eliminados
        res.json({
          ok: true,
          medicos,
          total: conteo //num hospitales
        });
      });


    });
});

/**
 * Almacenar un medico
 */
app.post("/medicos", [verificaToken], (req, res) => {
  //recogemos los parametros por post haciendo uso de un paquete llamado
  //npm body-parser
  let body = req.body;

  console.log("creando medico");
  console.log(body);
  //o usar try catch....
  //verificarInput(res,body);

  //creamos el objeto
  let medico = new Medico({
    nombre: body.nombre,
    img: body.img,
    usuario: req.usuario.id,
    hospital: body.hospital
  });

  //lo guardamos a la BD
  medico.save((err, medicoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear el medico",
        err
      });
    }

    //kitamos el pass del medico que devuelvo
    // => lo hago en el medicoschema.methods.toJSON del modelo
    //medicoDB.password = null;

    res.status(201).json({
      ok: true,
      medico: medicoDB
    });
  });
});

/**
 * Actualizar medico
 */
app.put("/medicos/:id", [verificaToken], function(req, res) {
  let id = req.params.id;

  let body = req.body;
  //filtramos los campos actualizables
  //let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'password'])

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error update medico",
        errors: err
      });
    }

    if (!medico) {
      return res.status(404).json({
        ok: false,
        mensaje: "Error update medico not found:" + id,
        errors: err
      });
    }

    //si llega a este punto si hay un medico valido para actualizar
    medico.nombre = body.nombre;
    medico.usuario = req.usuario._id;
    medico.hospital = body.hospital;
    //usuario? hospital?

    medico.save((err, medicoGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error actualizar medico",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        medico: medicoGuardado
      });
    });
  });

  //el id, los campos, true => devuelve el registro actualizado y no el nuevo "entre llaves pk es un objeto"
  //runvalidators para que sea de acorde a las validaciones del schema del objeto
  /*medico.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, medicoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoDB
        });

    });*/
});

/**
 * Get un medico concreto
 */
app.get("/medicos/:id", [verificaToken], function(req, res) {
  let id = req.params.id;

  let body = req.body;
  //filtramos los campos actualizables
  //let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'password'])

  Medico.findById(id)
  .populate("hospital") //populate diciendo los campos a mostrar
  .exec((err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error server get medico",
        errors: err
      });
    }

    if (!medico) {
      return res.status(404).json({
        ok: false,
        mensaje: "Error medico not found:" + id,
        errors: err
      });
    }

    //si llega a este punto si hay un medico valido para actualizar
    res.status(200).json({
      ok: true,
      medico: medico
    });


  });

  //el id, los campos, true => devuelve el registro actualizado y no el nuevo "entre llaves pk es un objeto"
  //runvalidators para que sea de acorde a las validaciones del schema del objeto
  /*medico.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, medicoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoDB
        });

    });*/
});




app.delete("/medicos/:id", [verificaToken], function(req, res) {
  let id = req.params.id;

  //delete duro
  Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error borrar medico",
        errors: err
      });
    }

    if (!medicoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe medico con ese id",
        err: {
          message: "No existe medico con ese id"
        }
      });
    }

    res.status(200).json({
      ok: true,
      medico: medicoBorrado
    });
  });
});

//lo exporto para usarlo fuera
module.exports = app;
