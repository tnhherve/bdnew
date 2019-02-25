let mongoose = require("mongoose");

let factureSchema = new mongoose.Schema({
    periode_facture:{
        type:String,
        required: true
    },
    montant_facture: {
        type:Number,
        required: true
    },
    prix_kwh: {
        type:Number
    },
    date_limite: {
        type:Date,
        required: true
    },
    type_facture: {
        type:String,
        required: true
    },
    annee_facture: {
        type:Number,
        required: true
    }
});

factureSchema.virtual('penalites',{
    ref:'Penalite',
    localField: '_id',
    foreignField: 'id_facture'
});

factureSchema.virtual('payers', {
    ref: 'Payer',
    localField: '_id',
    foreignField: 'id_consommateur'
});

let Facture = mongoose.model("Facture", factureSchema);
module.exports = Facture;