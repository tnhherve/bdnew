let mongoose = require('mongoose');

let indexSchema = new mongoose.Schema({
    ancien_index: {
        type:Number,
        required: true
    },
    nouvelle_index: {
        type:Number,
        required: true
    },
    difference_index: {
        type:Number,
        required: true
    },
    id_consommateur:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Consommateur'
    }
});

let Indexe = mongoose.model('Indexe', indexSchema);

module.exports = Indexe;