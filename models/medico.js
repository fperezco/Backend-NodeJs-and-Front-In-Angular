const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let medicoSchema = new Schema({
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
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true,'Es necesario indicar un hospital']
    }
});

//se exporta indicando el nombre del modelo
module.exports = mongoose.model('Medico', medicoSchema);