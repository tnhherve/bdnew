let mongoose = require('mongoose');

let payerSchema = new mongoose.Schema({
    id_consommateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consommateur'
    },
    id_facture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facture'
    },
    annee: {
        type:Number,
        required: true
    },
    montant: {
        type:Number,
        required: true
    },
    periode: {
        type:String,
        required: true
    }
});

let Payer = mongoose.model("Payer", payerSchema);
module.exports = Payer;