const createError = require('http-errors');

const path = require("path")
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const flash = require("connect-flash")
// const passport = require("passport")
// const express_session = require("express-session")

const pool = require("./config/connection")

// const express = require("express");
// const app = express();
// const server = require("http").Server(app);
// const io = require("socket.io")(server);



//configuracion socket.io back-side

const {app,server,express} = require("./public/scripts/socket_server")


// require("./public/scripts/socket_server.js")

// const SQL_session = require("express-mysql-session")(express_session)

// require("./config/users_passport/passport_serialize")

// app.use(express_session({
    //     key:"active_user",
    //     secret: "jamrock",
    //     store: new SQL_session({},pool),
    //     resave: false,
    //     saveUninitialized:false
    // }))
    
    
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

    
    
    
    
    
    
    
    
    //inicializamos passport y usamos sesiones a traves de passport
    // app.use(passport.initialize())
    
    // //controlamos la recuperacion de login
    // app.use(passport.session())
    
    // app.use(flash())
    
    // app.use( (req,res,next) =>{
        //     app.locals.success = req.flash("success")
        //     app.locals.message = req.flash("message")
        //     app.locals.user = req.user
        //     next()
        // })
        

// io.on("connection",(socket) => {
//     console.log("nueva conexion",socket.id)

//     // socket.emit("server:loadnotes",notes)

//     socket.emit("ping")

//     socket.on("pong",()=>{
//         console.log("pong recibido")
//     })

// })

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

