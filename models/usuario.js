//Esquema del modelo del usuario

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

let rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol valido"
};

var usuarioSchema = new Schema({
  nombre: { type: String, required: [true, "Nbr es necesario"] },
  email: { type: String, unique: true, required: [true, "Email es necesario"] },
  password: { type: String, required: [true, "Pass es necesario"] },
  img: { type: String, required: false },
  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
    enum: rolesValidos
  }
});

//actualizamos este metodo automatico para que no devuelva el password
usuarioSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

//añadimos el mensaje de error para unique email con el plugin
//de mongoose unique validator
usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser unico" });

module.exports = mongoose.model("Usuario", usuarioSchema);
