const {Router} = require("express")

const passport = require("passport")

const pool = require("../config/connection")

const encrypt = require("../config/encrypt")

const router = Router()

const {isloggedin,isnotelogged} = require("../config/securizacion")

//ruta para los hilos ordenados por recientes
//ya que por defecto asi será
router.get("/",async(req,res) => {


    //consulta para sacar los hilos

    const [results] = await pool.query("select u.nickname,u.fecha_creacion as user_creacion,u.mensajes,h.id,h.titulo,h.texto,h.views,h.fecha_creacion as hilo_creacion,(SELECT COUNT(*) FROM replys WHERE id_hilo = h.id) as num_respuestas from users u inner join hilos h where h.id_user = u.id order by h.fecha_creacion desc")

    //tiene menos gasto un booleano que un strign que indique la seccion 
    // ja ja ja ...no tiene gracia
    res.render("main",{results,seccion:true})

})

router.get("/populares",async(req,res) => {


    //consulta para sacar los hilos

    const [results] = await pool.query("select u.nickname,u.fecha_creacion as user_creacion,u.mensajes,h.id,h.titulo,h.texto,h.views,h.fecha_creacion as hilo_creacion,(SELECT COUNT(*) FROM replys WHERE id_hilo = h.id) as num_respuestas from users u inner join hilos h where h.id_user = u.id order by h.views desc")

    res.render("main",{results,seccion:false})
})

//ruta para las respuestas a un hilo

router.get("/hilo/:id",async(req,res) => {
    let id_hilo = req.params.id

    //vamos a updatear las visitas en +1 a este hilo
    await pool.query("update hilos set views = views +1 where id = ?",[id_hilo])

    const [results] = await pool.query("select u.nickname,u.fecha_creacion as user_creacion,u.mensajes,u.id as id_user,h.id,h.titulo,h.texto,h.views,h.fecha_creacion as hilo_creacion,(SELECT COUNT(*) FROM replys WHERE id_hilo = h.id) as num_respuestas from users u inner join hilos h where h.id_user = u.id and h.id=?",[id_hilo])
    
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

router.post("/nueva_respuesta/:id",async(req,res) => {
    console.log(req.params)

await pool.query("update users set mensajes = mensajes + 1 where id = ?",[req.user.id])

    let respuesta = {
        texto:req.body.texto,
        id_hilo:req.params.id,
        id_user:req.user.id
    }

    await pool.query("insert into replys set ?",[respuesta])

    res.redirect("/hilo/"+req.params.id)

})

//ruta para los hilos ordenados por recientes

router.get("/nuevo_hilo",(req,res) => {
    res.render("nuevo_hilo")
})

router.post("/nuevo_hilo",async (req,res) => {
    
    res.redirect("/")

})

router.get("/access", (req,res)=>{
    res.render("login.ejs")
})

router.get("/registro", (req,res)=>{
    res.render("registro.ejs")
})

router.get("/mishilos", isloggedin ,async(req,res)=>{

    const [results] = await pool.query("select u.nickname,u.fecha_creacion as user_creacion,u.mensajes,h.id,h.titulo,h.texto,h.views,h.fecha_creacion as hilo_creacion,(SELECT COUNT(*) FROM replys WHERE id_hilo = h.id) as num_respuestas from users u inner join hilos h where h.id_user = u.id and u.id = ? order by h.fecha_creacion desc",[req.user.id])

    res.render("mishilos",{results})
})

router.get("/delete/:id", async(req,res)=>{

    console.log(req.params)

    let hilo_deleteadojaja = req.params.id

    await pool.query("delete from hilos where id = ?",[hilo_deleteadojaja])

    res.redirect("/mishilos")

})

//recogida de datos

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

// router.post("/registro", (req,res)=>{
//     console.log(req.body)
// })

router.get("/logout" ,(req,res) =>{
    req.logOut( function(err){
      if(err){
        return next(err)
      }
    })
    res.redirect("/")
})

router.post('/registro',passport.authenticate("local.signup", {
    successRedirect:"/",
    failureRedirect:"/registro",
    failureFlash:true
}))


module.exports = router