let mongoose = require('mongoose');

let penaliteSchema = new mongoose.Schema({
    montant_penalite: Number,
    etat: String,
    id_facture:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facture'
    },
    id_consommateur:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consommateur'
    }
});


let Penalite = mongoose.model("Penalite", penaliteSchema);

module.exports = Penalite;