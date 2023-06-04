const {Router} = require("express")

const passport = require("passport")

const pool = require("../config/connection")

//mediante esta libreria podremos encriptar y desencriptar las contrseñas de manera segura
const encrypt = require("../config/encrypt")

const router = Router()

//nos traemos esta funcion middleware para las rutas
//que deja seguir con su curso normal con la siguiente callback si
//estas autorizado y si no te redirige a una ruta determinada
const {isloggedin} = require("../config/securizacion")

//ruta para los hilos ordenados por recientes
//ya que por defecto asi será
router.get("/",async(req,res) => {


    //consulta para sacar los hilos

    const [results] = await pool.query("select u.nickname,u.fecha_creacion as user_creacion,u.mensajes,h.id,h.titulo,h.texto,h.views,h.fecha_creacion as hilo_creacion,(SELECT COUNT(*) FROM replys WHERE id_hilo = h.id) as num_respuestas from users u inner join hilos h where h.id_user = u.id order by h.fecha_creacion desc")

    //tiene menos gasto un booleano que un string que indique la seccion 
    // ja ja ja ...no tiene gracia
    res.render("main",{results,seccion:true})

})

router.get("/populares",async(req,res) => {


    //consulta para sacar los hilos
    //lo mismo que en / pero ordenado por numero de visitas en descendente

    const [results] = await pool.query("select u.nickname,u.fecha_creacion as user_creacion,u.mensajes,h.id,h.titulo,h.texto,h.views,h.fecha_creacion as hilo_creacion,(SELECT COUNT(*) FROM replys WHERE id_hilo = h.id) as num_respuestas from users u inner join hilos h where h.id_user = u.id order by h.views desc")

    res.render("main",{results,seccion:false})
})


//ruta para las respuestas a un hilo

router.get("/hilo/:id",async(req,res) => {

    let id_hilo = req.params.id

    //vamos a updatear las visitas en +1 a este hilo
    await pool.query("update hilos set views = views +1 where id = ?",[id_hilo])


    //nos traemos el hilo padre

    const [results] = await pool.query("select u.nickname,u.fecha_creacion as user_creacion,u.mensajes,u.id as id_user,h.id,h.titulo,h.texto,h.views,h.fecha_creacion as hilo_creacion,(SELECT COUNT(*) FROM replys WHERE id_hilo = h.id) as num_respuestas from users u inner join hilos h where h.id_user = u.id and h.id=?",[id_hilo])
    

    //nos traemos las respuestas asignadas a este hilo

    const [respuestas_hilo] = await pool.query("select u.nickname,u.mensajes,u.id,r.texto,r.fecha_creacion as reply_creacion from users u inner join replys r on r.id_user = u.id inner join hilos h on r.id_hilo=h.id where h.id=? order by r.fecha_creacion desc",[id_hilo])

    console.log(results)
    console.log(respuestas_hilo)

    res.render("hilo",{results,respuestas_hilo})
})


//ruta para agregar una respuesta a hilo

router.get("/responder/:id",isloggedin,(req,res) => {
    console.log(req.params)

    res.render("nueva_respuesta",{id:req.params.id})
})


//ruta para recibir los datos de la respuesta a un determinado hilo

router.post("/nueva_respuesta/:id",async(req,res) => {

    const {io} = require("../public/scripts/socket_server")
            
    console.log(req.params)
    
    //le agregamos una participacion mas al usuario por haber respondido a un hilo
    await pool.query("update users set mensajes = mensajes + 1 where id = ?",[req.user.id])
    
    //configuramos el objeto de entrada para la respuesta en bd
    let respuesta = {
        texto:req.body.texto,
        id_hilo:req.params.id,
        id_user:req.user.id
    }

    await pool.query("insert into replys set ?",[respuesta])

    const [datos_user] = await pool.query("select u.nickname,u.mensajes from users u inner join replys r where u.id = r.id_user and r.texto = ?",[req.body.texto])

    //configuramos el body para el soccket del cliente especifico
    let reply_client = {
        id_hilo:req.params.id,
        texto:req.body.texto,
        nickname:datos_user[0].nickname,
        mensajes:datos_user[0].mensajes
    }
    
    io.emit("server:nueva_reply",reply_client)

    //volvemos a el hilo en concreto
    res.redirect("/hilo/"+req.params.id)
    
})
        
        
router.get("/nuevo_hilo",(req,res) => {
    res.render("nuevo_hilo")
})

router.post("/nuevo_hilo",async (req,res) => {
    
    //toda la logica esta en las configuraciones de socket.io jijiji
    res.redirect("/")

})

router.get("/access", (req,res)=>{
    res.render("login.ejs")
})

router.get("/registro", (req,res)=>{
    res.render("registro.ejs")
})


//vista protegida para el usuario ,con sus hilos
router.get("/mishilos", isloggedin ,async(req,res)=>{

    //consulta para mostrar unicamente los hilos de el suso dicho

    const [results] = await pool.query("select u.nickname,u.fecha_creacion as user_creacion,u.mensajes,h.id,h.titulo,h.texto,h.views,h.fecha_creacion as hilo_creacion,(SELECT COUNT(*) FROM replys WHERE id_hilo = h.id) as num_respuestas from users u inner join hilos h where h.id_user = u.id and u.id = ? order by h.fecha_creacion desc",[req.user.id])

    res.render("mishilos",{results})
})


//ruta para eliminar determinado hilo de usuario

router.get("/delete/:id", async(req,res)=>{

    console.log(req.params)

    let hilo_deleteadojaja = req.params.id

    await pool.query("delete from hilos where id = ?",[hilo_deleteadojaja])

    res.redirect("/mishilos")

})

//recogida de datos login por parte del back side
//recibimos los datos de client side y le mandamos una respuesta

//MUY IMPORTANTE ,NO RENDERIZAMOS A NINGÚN SITIO,solo validamos al cliente y creamos
//cookie si todo esta ok

router.post("/login", async (req,res,next)=>{

    console.log(req.body)

    const [result] = await pool.query("select * from users where email = ?",[req.body.email])

    if (result.length>0){

        const user = result[0]
        const comprobacion = await encrypt.desencriptasion(req.body.password,user.password)

        console.log(comprobacion)

        if (comprobacion){
            console.log("existe!!")

            // res.json({"logged":1})
            
            await passport.authenticate("local.signin"
              // successRedirect:"/",
              // failureRedirect:"/#login-form",
              // failureFlash:true}
            )
            (req,res,next)

            // return res.json({"logged":1})
            
        }else{
            console.log("intento de inicio de sesion fallido por in-passwd para",req.body.email)
            res.json({"logged":2})
            // res.redirect("/")
        }
        
    }else{
      console.log("no existe nigun usuario con el mail : ",req.body.email)
      res.json({"logged":3})
      // res.redirect("/")
    }
})


//ruta para desloguear al cliente

router.get("/logout" ,(req,res) =>{
    req.logOut( function(err){
      if(err){
        return next(err)
      }
    })
    res.redirect("/")
})

//ruta recibe datos de formulario registro y se los pasa a mi estrategia de 
//passport para que cree la sesion y el usuario en bd

router.post('/registro',passport.authenticate("local.signup", {
    successRedirect:"/",
    failureRedirect:"/registro",
    failureFlash:true
}))


module.exports = router