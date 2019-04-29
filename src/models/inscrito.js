const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const inscritoSchema =  new Schema({    
    id_curso: {
        type: Number,
        required: true
    },
    documento: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    telefono: {
        type: Number,
        required: true
    },
    correo: {
        type: String,
        required: true
    }
});

const Inscrito = mongoose.model('Inscrito', inscritoSchema);

module.exports = Inscrito;
