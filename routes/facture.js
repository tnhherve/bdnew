let router = require('express').Router();

Facture = require('./../models/Facture');

router.get('/', (req, res)=>{
    Facture.find({}).then(factures=>{
        let date = [];
        for (let i = 0; i < factures.length; i++) {
            let d = new Date(factures[i].date_limite);
            if (d.getDate()<10 && d.getMonth()<9)  {
                date.push("0"+d.getDate()+"/0"+(d.getMonth()+1)+"/"+d.getFullYear());
            }else if(d.getDate()>9 && d.getMonth()<9){
                date.push(d.getDate()+"/0"+(d.getMonth()+1)+"/"+d.getFullYear());
            }else if(d.getDate()<10 && d.getMonth()>9){
                date.push("0"+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear());
            }else{
                date.push(d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear());
            }    
        }
        let facture = {
            _id:"",
            periode_facture:"",
            montant_facture:0,
            prix_kwh:0,
            date_limite:"",
            type_facture:"",
            annee_facture:0
        };

        let data = [];
        for (let i = 0; i < factures.length; i++) {
            let d = Object.create(facture);
            d._id = factures[i]._id;
            d.periode_facture = factures[i].periode_facture;
            d.montant_facture = factures[i].montant_facture;
            d.prix_kwh = factures[i].prix_kwh;
            d.date_limite = date[i];
            d.type_facture = factures[i].type_facture;
            d.annee_facture = factures[i].annee_facture;
            data.push(d);
        }
        //res.json(data);
        res.render('factures/index.html', {
            factures:data,
            date:date
        });
    });
});


router.get('/edit/:id', (req, res)=>{
    Facture.findById(req.params.id).then(facture=>{
        res.render('factures/edit.html',{facture:facture,action:'Editer',endpoint:'/fac/'+facture._id.toString()});
    });
});

router.get('/add', (req, res)=>{
     let fac = new Facture();
    res.render('factures/edit.html',{facture:fac,action:'Ajouter',endpoint:'/fac'});
});

router.get('/fash',(req, res)=>{
    req.flash('info', 'if cats ruled the world', false);
    
});

router.post('/:id?', (req, res)=>{
    new Promise((resolve, reject)=>{
        if(req.params.id){
            Facture.findById(req.params.id).then(resolve, reject);
        }else{
            resolve(new Facture);
        }
    }).then(Facture=>{
        if (req.body.type_facture=="electricite") {
            Facture.prix_kwh = req.body.prix_kwh;
        }

        Facture.periode_facture = req.body.periode;
        Facture.montant_facture = req.body.montant;
        Facture.date_limite = req.body.date_limite;
        Facture.type_facture = req.body.type_facture;
        Facture.annee_facture = (new Date).getFullYear();
        //res.json(Facture);
        console.log(Facture);
        //Facture.save();
        console.log(Facture);
    }).then(()=>{
        res.redirect('/fac');
    }).catch(err=>{console.log("Failed add facture: "+err);});
});
module.exports = router;