let mongoose = require('mongoose');

let adminSchema = new mongoose.Schema({
    login: String,
    password: String,
});

adminSchema.virtual('conso_admins', {
    ref: 'Conso_admin',
    localField: '_id',
    foreignField: 'id_admin'
});

let Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;