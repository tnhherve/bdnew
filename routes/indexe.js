router = require('express').Router();

let Indexe = require('./../models/Indexe');
let Facture = require('./../models/Facture'); 

router.get('/', (req, res)=>{
    Indexe.find({}).populate('id_consommateur').then(indexes=>{
            res.render('indexes/show.html',{
                indexes:indexes
            });
    });
});

router.get('/edit/:id', (req, res)=>{
    Indexe.findById(req.params.id).populate('id_consommateur').then(index=>{
        res.render('indexes/edit.html',{
            index:index,
            endpoint:'/index/'+index._id
        });
    });
});

router.post('/:id', (req, res)=>{
    let id = req.params.id;
    let data = {
        ancien_index: req.body.ancien,
        nouvelle_index: req.body.new,
        difference_index: req.body.new - req.body.ancien
    };
    Indexe.update({_id:id}, {$set:data}).then(success=>{
        console.log("Update success: "+success);
    }).catch(err=>{
        console.log("Update failed: "+err);
    });
    res.redirect('/index');
});

module.exports = router;