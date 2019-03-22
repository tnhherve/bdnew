let router = require('express').Router();

let Consommateur = require("./../models/Consommateur");
let Indexe = require("./../models/Indexe");
let Facture = require('./../models/Facture');
let Payer = require('./../models/Payer');

router.get('/electricite', (req, res)=>{
    Facture.find({type_facture:'electricite'}).then(factures=>{
        let fac = factures[factures.length-1];
        let id ={};
        Indexe.find({}).populate('id_consommateur').then(indexConso=>{    
            res.render('consommations/addElec.html',{
                conso:indexConso, 
                fac:fac, 
                endpoint:"/consommation/electricite"
            });
        });
    });
    
});

router.post('/electricite', (req,res)=>{
    Indexe.find({}).populate("id_consommateur").then(ids=>{
        Consommateur.find({etat:"present"}).then(conso=>{
            Payer.find({}).populate('id_facture').then(facpayer=>{
                let idc = req.body.index;
                let periode = req.body.periode;
                let prix_kwh = req.body.prix_kwh;
                let id_facture = req.body.id_facture;
                let cpt = 0;
                console.log(facpayer[0]);
                //Insertion des nouvelles index pour chaque consommateurs
                if (facpayer[0]==undefined) {
                    for (let i = 0; i < conso.length; i++) {
                        Indexe.update({_id:ids[i]._id}, {$set: {
                            ancien_index: ids[i].nouvelle_index,
                            nouvelle_index:idc[i],
                            difference_index: idc[i]-ids[i].nouvelle_index
                        }})
                        .exec()
                        .then(doc=>{
                            console.log(doc);
                        }).catch(err=>{
                            console.log("Failled update"+err);
                        });  
                    }
                    for (let i = 0; i < conso.length; i++) {
                        //console.log("_id:"+ids[i]._id+" ,{$set: {nouvelle_index:"+idc[i]+"}}");
                        let payer = new Payer({
                            id_consommateur: conso[i]._id,
                            id_facture: id_facture,
                            annee: (new Date).getFullYear(),
                            montant: (idc[i]-ids[i].nouvelle_index)*prix_kwh,
                            periode: periode
                        });
                        payer.save().then(result=>{
                            console.log(result);
                        }).catch(err=>{
                            console.log("Payer failed: "+err);
                        });
                        
                    }
                } else {
                    for (let i = 0; i < facpayer.length; i++) {
                        if (facpayer[i].id_facture._id!=id_facture){    
                            cpt+=1;
                        }    
                    }
                    console.log(cpt);
                    if(cpt!=0){  
                        for (let i = 0; i < conso.length; i++) {
                            Indexe.update({_id:ids[i]._id}, {$set: {
                                ancien_index: ids[i].nouvelle_index,
                                nouvelle_index:idc[i],
                                difference_index: idc[i]-ids[i].nouvelle_index
                            }})
                            .exec()
                            .then(doc=>{
                                console.log(doc);
                            }).catch(err=>{
                                console.log("Failled update"+err);
                            });  
                        }      
                        for (let i = 0; i < conso.length; i++) {
                            //console.log("_id:"+ids[i]._id+" ,{$set: {nouvelle_index:"+idc[i]+"}}");
                            let payer = new Payer({
                                id_consommateur: conso[i]._id,
                                id_facture: id_facture,
                                annee: (new Date).getFullYear(),
                                montant: (idc[i]-ids[i].nouvelle_index)*prix_kwh,
                                periode: periode
                            });
                            payer.save().then(result=>{
                                console.log(result);
                            }).catch(err=>{
                                console.log("Payer failed: "+err);
                            });            
                        }
                    }else{
                        res.redirect('/fac/add');
                    }    
                }
                res.redirect('/index');
            });
        });  
    });
    
});

//consommation de l'eau
router.get('/eau', (req, res)=>{
    Facture.find({type_facture:'eau'}).then(factures=>{
        let fac = factures[factures.length-1];
        let id ={};
        Indexe.find({}).populate('id_consommateur').then(indexConso=>{    
            res.render('consommations/addEau.html',{
                conso:indexConso, 
                fac:fac, 
                endpoint:"/consommation/eau"
            });
        });
    });
    
});

router.post('/eau', (req,res)=>{
    let montant_bayeur = req.body.bayeur;
    let montant_facture = req.body.montant;
    let periode = req.body.periode;
    let id_facture = req.body.id_facture;
    Payer.find({}).populate('id_facture').then(facpayer=>{
        Consommateur.find({etat:"present"}).then(conso=>{
            Facture.findById({_id:id_facture}).then(fac=>{
                let cpt = 0;
                let nbre = 0;
                for (let i = 0; i < conso.length; i++) {
                    nbre += conso[i].nbre;    
                }
                let montant = (montant_facture-montant_bayeur)/nbre;
                for (let i = 0; i < conso.length; i++) {
                                       
                    for (let i = 0; i < facpayer.length; i++) {
                        if (facpayer==null || facpayer[i].id_facture._id!=id_facture){    
                            cpt+=1;
                        }    
                    }
                    
                    if(cpt!=0){
                        let payer = new Payer({
                            id_consommateur: conso[i]._id,
                            id_facture: id_facture,
                            annee: (new Date).getFullYear(),
                            montant: Math.round(montant)*conso[i].nbre,
                            periode: periode
                        });
                        payer.save().then(result=>{
                            console.log(result);
                        }).catch(err=>{
                            console.log("Payer failed: "+err);
                        });
                    }    
                }
                res.redirect('/eau');
                
            });
        });  
    });
    
});

module.exports = router;