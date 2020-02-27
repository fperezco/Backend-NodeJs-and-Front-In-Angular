//Esquema del modelo del usuario

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true,'Nbr es necesario'] },
    email: { type: String, unique: true, required: [true,'Email es necesario'] },
    password: { type: String, required: [true,'Pass es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default:'USER_ROLE' },
    
});

module.exports = mongoose.model('Usuario',usuarioSchema);