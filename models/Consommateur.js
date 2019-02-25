
let mongoose = require('mongoose');

let consommateurSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nom_consommateur: {
        type:String,
        required: true
    },
    email_consommateur:{
        type:String,
        required: true
    },
    telephone_consommateur: {
        type:Number,
        required: true
    },
    nbre:{
        type:Number,
        required: true
    },
    etat: {
        type:String,
        required: true
    }
});

consommateurSchema.virtual('indexes',{
    ref:'Indexe',
    localField: '_id',
    foreignField:'id_consommateur'
});

consommateurSchema.virtual('penalites', {
    ref: 'Penalite',
    localField: '_id',
    foreignField: 'id_consommateur'
});

consommateurSchema.virtual('payers', {
    ref: 'Payer',
    localField: '_id',
    foreignField: 'id_consommateur'
});

consommateurSchema.virtual('conso_admins',{
    ref: 'Conso_admin',
    localField: '_id',
    foreignField: 'id_consommateur'
});

let Consommateur = mongoose.model('Consommateur',consommateurSchema);
module.exports = Consommateur;