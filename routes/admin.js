let router = require('express').Router();
let passwordHash = require('password-hash');

let Admin = require('./../models/Admin');
let Consommateur = require('./../models/Consommateur');
let Facture = require('./../models/Facture');

router.get('/', (req, res)=>{
    Admin.find({}).then(admins=>{
        Consommateur.find({}).then(conso=>{
            Facture.find({}).then(fac=>{
                req.toastr.success('Successfully logged in.', "You're in!");
                res.render('admins/home.html',{
                    admins:admins,
                    name:req.session.login,
                    nbreAdmin: admins.length,
                    nbreConso: conso.length,
                    nbreFacture: fac.length
                });
            });
        });
    });
});

router.post('/', (req, res)=>{
    let admin = new Admin();
    admin.login = req.body.login;
    admin.password =  passwordHash.generate(req.body.pass);
    admin.save();
    res.redirect('/home');
});

router.post('/:id', (req, res)=>{
    let id = req.params.id;
    let admin = {
        login: req.body.login,
        password: passwordHash.generate(req.body.pass) 
    };
    Admin.updateOne({_id:id},{$set:admin});
    res.redirect('/home');
});

router.post('/delete/:id', (req, res)=>{
    let id = req.params.id;
    Admin.deleteOne({_id:id});
    res.redirect('/home');
});
module.exports = router;