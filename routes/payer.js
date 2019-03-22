let router = require('express').Router();
const Nexmo = require('nexmo');

const nexmo =  new  Nexmo ( { 
    apiKey :  '0b2276d2' , 
    apiSecret :  '6IKVzJA4lHLwX1cs' 
});

const from = 'Dankaly City';

let Consommateur = require("./../models/Consommateur");
let Indexe = require("./../models/Indexe");
let Facture = require('./../models/Facture');
let Payer = require('./../models/Payer');

router.get('/', (req, res)=>{
    Facture.find({type_facture:"electricite"}).then(facId=>{
        
        if(facId[0]._id==undefined){
            req.toastr.success('Successfully logged in.', "You're in!");
            res.redirect('/index');
        }else{
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
                        net:0,
                        telephone:0
                    };
                    let d = Object.create(facture);
                    if (indexes[i].id_consommateur.etat=="present") {
                        d.name = indexes[i].id_consommateur.nom_consommateur;
                        d.nbre = indexes[i].id_consommateur.nbre;
                        d.ancien_index = indexes[i].ancien_index;
                        d.nouvelle_index =indexes[i].nouvelle_index-indexes[i].ancien_index;
                        d.diff_index = indexes[i].difference_index;
                        d.telephone = indexes[i].id_consommateur.telephone_consommateur;
                        d.montant = Math.round(indexes[i].difference_index*fac.prix_kwh);
                        sum_montant+=Math.round(indexes[i].difference_index*fac.prix_kwh);
                    }
                    if(d.name!=""){
                        data.push(d);
                    }            
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
                let total_tva = fac.montant_facture-sum_montant;
                let tva = Math.round(total_tva/payer.length);
                for (let i = 0; i < data.length; i++) {
                    data[i].tva = tva;
                    data[i].net = Math.round(data[i].montant+tva+50); 
                    let message = "Votre consomme de l'electricité pour la période "+
                    fac.periode_facture+" est de: "+data[i].net+" à payer avant le: "+date_limite;
                    let to = "237"+data[i].telephone.toString();
                    //nexmo.message.sendSms(from, to, message);
                    console.log(from+":"+to+":"+message+"\n");
                    sum_total += data[i].net;  
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

        }
        
    });
});

router.get('/eau', (req,res)=>{
    
    Consommateur.find({etat:"present"}).then(conso=>{
        Facture.find({type_facture:"eau"}).then(factures=>{
            if (factures!=null) {    
                let fac = factures[factures.length-1];    
                let montant_bayeur = 100;
                let factureEau = {
                    name:'',
                    nbre:0,
                    montant:0,
                    net:0
                };
                
                let data =[];
                let nbre = 0;
                for (let i = 0; i < conso.length; i++) {
                    nbre += conso[i].nbre;    
                }
                let total_montant = 0;
                let montant = (fac.montant_facture-montant_bayeur)/nbre;
                for (let i = 0; i < conso.length; i++) {
                    let da = Object.create(factureEau);
                    da.name = conso[i].nom_consommateur;
                    da.nbre = conso[i].nbre;
                    da.montant =  Math.round(montant)*conso[i].nbre;
                    da.net = Math.round(montant)+50;
                    total_montant+=da.montant;
                    
                    if (da.name!="") {
                        data.push(da)
                    }
                }
                let date_limite = "";
                let d = new Date(fac.date_limite);
                if (d.getDate()<10 && d.getMonth()<9)  {
                    date_limite="0"+d.getDate()+"/0"+(d.getMonth()+1)+"/"+d.getFullYear();
                }else if(d.getDate()>9 && d.getMonth()<9){
                    date_limite= d.getDate()+"/0"+(d.getMonth()+1)+"/"+d.getFullYear();
                }else if(d.getDate()<10 && d.getMonth()>9){
                    date_limite="0"+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
                }else{
                    date_limite=d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
                }
                
                res.render('payer/factureEau.html', {
                    datas:data,
                    nbre: nbre,
                    nbre_chambre: conso.length,
                    date_limite: date_limite,
                    montant_facture: fac.montant_facture,
                    periode: fac.periode_facture,
                    total_montant: total_montant
                });
            }
            
        });

    });  
   
});

module.exports = router;