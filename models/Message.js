let mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({
    contenu_message: String
});

let Message = mongoose.model('Message', messageSchema);
module.exports = Message;