let express = require('express');
let nunjucks = require('nunjucks');
let mongoose = require('mongoose');

app = express();
nunjucks.configure({
    autoescape: true,
    express: app
});

app.use('/css', express.static(__dirname+'/node_modules/bootstrap/dist/css'));
app.get('/', (req, res)=>{
    res.render("views/layout.html");
});

console.log("Application lancée sur le port: 3000");
app.listen(3000);
