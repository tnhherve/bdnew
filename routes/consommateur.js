let router = require('express').Router();
let mongoose = require('mongoose');
let Consommateur = require('../models/Consommateur');
let Indexe = require('./../models/Indexe'); 
let Admin = require('./../models/Admin');
let Conso_admin = require('./../models/conso_admin');
let passwordHash = require('password-hash');

router.get('/', (req, res)=>{
    Consommateur.find({}).then(consommateur=>{
        res.render('consommateurs/index.html',{conso:consommateur});
    }).catch(err=>{
        console.log("Erreur "+err);
        res.status(500);
    });
});

router.get('/edit/:id', (req, res)=>{
    Consommateur.findById(req.params.id).then(conso=>{
        res.render('consommateurs/edit.html',{conso:conso,title:'Edit',endpoint:'/conso/edit/'+conso._id.toString()});
        console.log(conso._id.toString());
    });
});

router.get('/add', (req, res)=>{
    conso = new Consommateur();
    res.render('consommateurs/edit.html',{conso:conso,title:'Add',endpoint:'/conso'});
});

router.post('/', (req, res)=>{
    
        Consommateur._id = new mongoose.Types.ObjectId();
            let index = new Indexe({
            ancien_index:0.0,    
            nouvelle_index:0.0,
            difference_index:0.0,
            id_consommateur: Consommateur._id
        });
        index.save();      
        Consommateur.nom_consommateur = req.body.nom;
        Consommateur.email_consommateur = req.body.email;
        Consommateur.telephone_consommateur = req.body.tel;
        Consommateur.nbre = req.body.nbre;
        Consommateur.etat = req.body.etat;
        Consommateur.save();
    
    
});

router.post('/edit/:id', (req, res)=>{
    id = req.params.id;
    c = {
        'nom_consommateur' : req.body.nom,
        'email_consommateur' : req.body.email,
        'telephone_consommateur' : req.body.tel,
        'nbre' : req.body.nbre,
        'etat' : req.body.etat 
    };
    Consommateur.updateOne({_id:id}, {$set:c}).then(succes=>{
        console.log("sucess: "+succes);    
    }).catch(err=>{
        console.log("Upade conso FAILED: "+err);
    });
    res.redirect('/conso');
});

router.delete('/delete/:id', (req, res)=>{
    console.log(req.params.id);
    res.json(req.params.id);
    Consommateur.deleteOne({_id:req.params.id}).then(err=>{
        console.log("error: "+err);
    });
    res.redirect('/conso');
});

router.post('/admin/:id', (req, res)=>{
    let id = req.params.id;
    Conso_admin.find({id_consommateur:id}).then(conso_admin=>{
        
        if (conso_admin[0]!=undefined) {
            console.log(conso_admin[0]);
            res.redirect('/conso');
        } else {
            let admin = new Admin();
            admin.login = req.body.login;
            admin.password =  passwordHash.generate(req.body.pass);
            admin.save();
            console.log(admin);
            let date = new Date();
            let conso_a = new Conso_admin();
            conso_a.id_consommateur = id;
            conso_a.id_admin = admin._id;
            conso_a.date_admin = date;
            console.log(conso_a);
            conso_a.save();
            res.redirect('/home');
            
        }
    });
    
});
module.exports = router;