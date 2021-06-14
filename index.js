const express = require('express');
const routes = require('./routes');
const path = require('path');
// * const bodyParser = require('body-parser'); 
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// Extraer Valores de variables.env
require('dotenv').config({path: 'variables.env'});

// helpers con algunas funciones
const helpers = require('./helpers');

// Crear la base de datos
const db = require('./config/db');

// Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

// db.authenticate()   // Autencica la conexion a la base de datos
db.sync()  
    .then(() => console.log('Conectado al Servidor'))
    .catch(error => console.log(error));

// crear una app de express
const app = express();

// Donde cargar los archivos estáticos
app.use(express.static('public'));

// Habilitar PUG
app.set('view engine', 'pug');

// Habilitar bodyParser para leer los datos del formulario
// * Modificaciones propuestas por el desuso de bodyParser
// * app.use(bodyParser.json());
// * app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Agregamos Express Validator a toda la aplicación
app.use(expressValidator());

// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));
app.use(cookieParser());

// Sessiones (session) nos permiten navegar entre distintas paginas sin volvernos a autenticar 
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Agregar Flash Messages
app.use(flash());

// Pasar var dump a la aplicación  (Middlewere)
app.use((req, res, next) => {
    //console.log(req.user);
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
}); 

app.use('/', routes() );

// Servidor y Puerto
// * Modificaciones sugeridas sin solución
// * const host = process.env.HOST || '0.0.0.0';
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
});

// * app.listen(port, () => {
// *     console.log('El servidor esta funcionando');
// * });
//*** */

// require('./handlers/email'); 
