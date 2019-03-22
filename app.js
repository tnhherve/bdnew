let express = require('express');
let nunjucks = require('nunjucks');
const mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let toastr = require('express-toastr');
let flash = require('connect-flash');

require('./models/Consommateur');
require('./models/Indexe');
require('./models/Facture');
require('./models/Payer');
require('./models/Admin');

let app = express();
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

mongoose.connect('mongodb://localhost:27017/facturation', {useNewUrlParser: true},err=>{
    if(err){
        console.log("erreur: "+err);
    }
});

const SESS_HOURS = 10000*60*60*2;
const {
    PORT = 3000,
    SESS_LIFETIMES = SESS_HOURS,
    SESS_SECRET = 'ssh!quiert,it\'asecret!',
    SESS_NAME = 'sid',
    NODE_ENV = "development"
} = process.env

const IN_PROD = NODE_ENV === 'production'
app.use(cookieParser(SESS_SECRET));
app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie:{
        maxAge: SESS_LIFETIMES,
        sameSite: true,
        secure: IN_PROD
    }    
}));
app.use(flash());
app.use(toastr());

const redirectLogin = (req, res, next)=>{
    if (!req.session.userId) {
        res.redirect('/');
    } else {
        next();
    }
}

const redirectHome = (req, res, next)=>{
    if (req.session.userId) {
        res.redirect('/home');
    } else {
        next();
    }
}
//app.use(flash(app));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/css', express.static(__dirname+'/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname+'/node_modules/bootstrap/dist/js'));
app.use('/chart',express.static(__dirname+'/node_modules/chart.js/dist'));
app.use('/style', express.static(__dirname+'/views/style'));

app.use('/home', redirectLogin, require('./routes/admin'));
app.get('/', redirectHome, (req, res)=>{
    res.render('login.html');
});
app.post('/', (req, res)=>{
    req.session.destroy(err=>{
        console.log(err);
    });
    res.redirect('/');
});
app.use('/login', redirectHome, require('./routes/login'));
app.use('/conso', redirectLogin, require('./routes/consommateur'));
app.use('/index', redirectLogin, require('./routes/indexe'));
app.use('/fac', redirectLogin, require('./routes/facture'));
app.use('/consommation', redirectLogin, require('./routes/consommation'));
app.use('/facture', redirectLogin, require('./routes/payer'));
app.use('/histo', redirectLogin, require('./routes/historique'));

app.listen(PORT,()=>console.log(
    `http://localhost:${PORT}`
));
