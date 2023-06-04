//librerias y funciones necesarias

//easter egg
var josefrancisco;

//manejador de errores
const createError = require('http-errors');


const path = require("path")
const cookieParser = require('cookie-parser');

//prompt logger ,para ver lo que ocurre en el back side
const logger = require('morgan');

//libreria que nos ayuda con el tema de sesiones de usuario
const passport = require("passport")

//para que express pueda usar sesiones
const express_session = require("express-session")


//nos traemos una conexión que es reultilizable por todos los modulos que la importen
//a esto se le denomina piscina de conexiones
const pool = require("./config/connection")


//de paso que creamos el servidor de socket.io,lo conectamos a nuestro server back
//el cual va a estar listening,el socket claro
const {app,server,express} = require("./public/scripts/socket_server")


//configuramos una instancia para guardar las sesiones en mysql
const SQL_session = require("express-mysql-session")(express_session)

//para que cada vez que haya una renderizacion ,se deserealice el usuario presente en la
//cookie 
require("./config/passport_serialize")


//configuracion de guardado de sesiones en mysql utilizando esa famosa pool
app.use(express_session({
        key:"white_user",
        secret: "welcometojamrock",
        store: new SQL_session({},pool),
        resave: false,
        saveUninitialized:false
}))
    
//localizacion vistas
app.set("views",path.join(__dirname, "views"))

//motor de renderizado = ejs
app.set('view engine', 'ejs');


//logger por consola
app.use(logger("dev"))
    
//middlewares que facilitaran el tratado de datos
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//cookies
app.use(cookieParser());

//archivos estaticos
app.use(express.static(path.join(__dirname,"public")))

// inicializamos passport y usamos sesiones a traves de passport
app.use(passport.initialize())

//controlamos la recuperacion de login
app.use(passport.session())


app.use( (req,res,next) =>{
    app.locals.user = req.user
    next()
})
    

//rutas
app.use(require("./routes/index.js"))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

 // error handler
app.use(function(err, req, res, next) {
// set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get('env') === 'development' ? err : {};

// render the error page
res.status(err.status || 500);
res.render('error');
});
  

server.listen(3000, () => {
    console.log("servidor en el puerto 3000")
})

