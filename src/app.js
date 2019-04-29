const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const mongoose = require('mongoose');
const session = require('express-session');
mongoose.set('useFindAndModify', false)
const bodyParser = require('body-parser');
require ('./helpers');
//require('./config');


const directoriopublico = path.join(__dirname,'../public');
const directoriopartials = path.join(__dirname,'../partials');
const directoriobootstrapcss = path.join(__dirname,'../node_modules/bootstrap/dist/css');
const directoriojquery = path.join(__dirname,'../node_modules/jquery/dist');
const directoriopopper = path.join(__dirname,'../node_modules/popper.js/dist');
const directoriobootstrapjs = path.join(__dirname,'../node_modules/bootstrap/dist/js');

app.use(express.static(directoriopublico));
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialed: true
}))

app.use((req, res, next) => {
	if (req.session.usuario){
		res.locals.session = true;
		res.locals.nombre = req.session.nombre;
	}
	next();
});  
app.use(bodyParser.urlencoded({extended:false}));
hbs.registerPartials(directoriopartials);
//console.log(__dirname);
app.set('view engine', 'hbs');
app.use('/css', express.static(directoriobootstrapcss));
app.use('/js', express.static(directoriojquery));
app.use('/js', express.static(directoriopopper));
app.use('/js', express.static(directoriobootstrapjs));
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

app.use(require ('./index'));

mongoose.connect(process.env.URLDB, {useNewUrlParser: true},(err, resultado)=> {
	if (err) {
		return console.log('Error de conexion a la BD '+err)
	}
	
	console.log("Conectado")
  
});

app.listen(process.env.PORT, () => {
	console.log("servidor en el puerto "+process.env.PORT);

})
