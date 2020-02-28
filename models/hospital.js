const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let hospitalSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    img: {
        type: String,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
},{collection: 'hospitales'}); //indico explicitamente el nombre de la coleccion

//se exporta indicando el nombre del modelo
module.exports = mongoose.model('Hospital', hospitalSchema);