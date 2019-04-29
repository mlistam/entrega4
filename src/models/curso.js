const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const cursoSchema =  new Schema({    
    id_curso: {
        type: Number,
        required: true,
        index: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    modalidad: {
        type: String
    },
    intensidad: {
        type: String
    },
    estado: {
        type: String,
        default: 'disponible'
    }

});

cursoSchema.plugin(uniqueValidator, { message: '{VALUE} ya existe.' });
const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;
