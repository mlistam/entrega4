const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const estudianteSchema =  new Schema({
    usuario: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    documento: {
        type: Number,
        required: true,
        index: true,
        unique: true
    },
    telefono: {
        type: Number,
        required: true
    },
    correo: {
        type: String,
        required: true,
        trim: true
    },
    rol: {
        type: String,
        default: 'aspirante'
    },
    avatar: {
        type: Buffer
    }

});

estudianteSchema.plugin(uniqueValidator, { message: '{VALUE} ya existe.' });
const Estudiante = mongoose.model('Estudiante', estudianteSchema);

module.exports = Estudiante;
