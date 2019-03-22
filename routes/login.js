let router = require('express').Router();
let passwordHash = require('password-hash');
let Admin = require('./../models/Admin');

router.post('/', (req, res)=>{
    let data = {
        login: req.body.login
    };
    let pass = req.body.password;
    Admin.find(data).then(admin=>{
        if (admin!=[]){
            if(passwordHash.verify(pass, admin[0].password)){
                req.session.userId = admin[0]._id;
                req.session.login = admin[0].login;
                res.redirect('/home');
            } else {
                res.redirect('/');    
            }
        }    
    });

});



module.exports = router;