let router = require('express').Router();

let Facture = require('./../models/Facture');
router.get('/', (req, res)=>{
    let annee = (new Date()).getFullYear();
    Facture.find({annee_facture:annee, type_facture:"electricite"}).then(factures=>{
        res.render('historiques/add.html',{
            endpoint:'/histo',
            factures:factures
        });
    });
});

module.exports = router;