let router = require('express').Router();

let Consommateur = require("./../models/Consommateur");
let Indexe = require("./../models/Indexe");
let Facture = require('./../models/Facture');
let Payer = require('./../models/Payer');

router.get('/', (req, res)=>{
    Facture.find({type_facture:"electricite"}).then(facId=>{
        let fac = facId[facId.length-1];
        let annee = (new Date).getFullYear()
        Indexe.find({}).populate('id_consommateur').then(indexes=>{      
            Payer.find({id_facture:fac._id, annee:annee}).populate('id_consommateur').populate('id_facture').then(payer=>{
                let data =[];
                let sum_montant=0;
                let sum_total=0;
                for (let i = 0; i < indexes.length; i++) {
                    let facture = {
                        name:'',
                        nbre:0,
                        ancien_index:0,
                        nouvelle_index:0,
                        diff_index:0,
                        montant:0,
                        tva:0,
                        net:0
                    };
                    let d = Object.create(facture);
                    if (indexes[i].id_consommateur.etat=="present") {
                        d.name = indexes[i].id_consommateur.nom_consommateur;
                        d.nbre = indexes[i].id_consommateur.nbre;
                        d.ancien_index = indexes[i].ancien_index;
                        d.nouvelle_index =indexes[i].nouvelle_index-indexes[i].ancien_index;
                        d.diff_index = indexes[i].difference_index;
                        d.montant = Math.round(indexes[i].difference_index*fac.prix_kwh);
                        sum_montant+=Math.round(indexes[i].difference_index*fac.prix_kwh);
                    }
                    if(d.name!=""){
                        data.push(d);
                    }            
                }
                let total_tva = fac.montant_facture-sum_montant;
                let tva = Math.round(total_tva/payer.length);
                for (let i = 0; i < data.length; i++) {
                    data[i].tva = tva;
                    data[i].net = Math.round(data[i].montant+tva+50); 
                    sum_total += data[i].net;  
                }
                let d = new Date(fac.date_limite);
                let date_limite="";
                if (d.getDate()<10 && d.getMonth()<9)  {
                    date_limite="0"+d.getDate()+"/0"+(d.getMonth()+1)+"/"+d.getFullYear();
                }else if(d.getDate()>9 && d.getMonth()<9){
                    date_limite= d.getDate()+"/0"+(d.getMonth()+1)+"/"+d.getFullYear();
                }else if(d.getDate()<10 && d.getMonth()>9){
                    date_limite="0"+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
                }else{
                    date_limite=d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
                }
                res.render("payer/facture.html",{
                    datas: data,
                    nbres: payer.length,
                    montant_facture: fac.montant_facture,
                    total_montant: sum_montant,
                    total_net: sum_total,
                    total_tva: total_tva,
                    date_limite: date_limite,
                    periode: fac.periode_facture,
                    prix_kwh: fac.prix_kwh 
                });
            }); 
         });
    });
});

router.post('/', (req,res)=>{
    
});

module.exports = router;