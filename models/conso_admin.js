let mongoose = require('mongoose');

let conso_adminSchema = new mongoose.Schema({
    id_consommateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consommateur'
    },
    id_admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    date_admin: Date
});

let Conso_admin = mongoose.model("Conso_admin", conso_adminSchema);

module.exports = Conso_admin;