let express = require('express');
let nunjucks = require('nunjucks');
const mongoose = require('mongoose');
let bodyParser = require('body-parser');
let flash = require('express-flash-notification');
let cookieParser = require('cookie-parser');
let session = require('express-session');


mongoose.connect('mongodb://localhost:27017/facturation', {useNewUrlParser: true},err=>{
    if(!err){
        console.log("Connexion a MongoDB reussie")
    }else{
        console.log("erreur: "+err);
    }
});
require('./models/Consommateur');
require('./models/Indexe');
require('./models/Facture');
require('./models/Payer');

let app = express();
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

//app.use(session({}));
//app.use(cookieParser());
//app.use(flash(app));

app.use(bodyParser.urlencoded());
app.use('/css', express.static(__dirname+'/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname+'/node_modules/bootstrap/dist/js'));
app.use('/style', express.static(__dirname+'/views/style'));

app.get('/home', (req, res)=>{
    res.render('home.html');
});
app.get('/', (req, res)=>{
    res.render('login.html');
});
app.use('/conso', require('./routes/consommateur'));
app.use('/index', require('./routes/indexe'));
app.use('/fac', require('./routes/facture'));
app.use('/consommation', require('./routes/consommation'));
app.use('/facture', require('./routes/payer'));

console.log("Application lancée sur le port: 3000");
app.listen(3000);
