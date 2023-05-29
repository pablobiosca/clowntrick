const {Router} = require("express")

const passport = require("passport")

const pool = require("../config/connection")

const encrypt = require("../config/encrypt")

const router = Router()

//ruta para los hilos ordenados por recientes
//ya que por defecto asi será
router.get("/",async(req,res) => {


    //consulta para sacar los hilos

    const [results] = await pool.query("select u.nickname,u.fecha_creacion as user_creacion,u.mensajes,h.id,h.titulo,h.texto,h.views,h.fecha_creacion as hilo_creacion,(SELECT COUNT(*) FROM replys WHERE id_hilo = h.id) as num_respuestas from users u inner join hilos h where h.id_user = u.id order by h.fecha_creacion desc")

    res.render("main",{results})
})

//ruta para las respuestas a un hilo

router.get("/hilo/:id",async(req,res) => {
    let id_hilo = req.params.id

    //vamos a updatear las visitas en +1 a este hilo
    await pool.query("update hilos set views = views +1 where id = ?",[id_hilo])

    const [results] = await pool.query("select u.nickname,u.fecha_creacion as user_creacion,u.mensajes,h.id,h.titulo,h.texto,h.views,h.fecha_creacion as hilo_creacion,(SELECT COUNT(*) FROM replys WHERE id_hilo = h.id) as num_respuestas from users u inner join hilos h where h.id_user = u.id and h.id=?",[id_hilo])
    
    const [respuestas_hilo] = await pool.query("select u.nickname,u.mensajes,r.texto from users u inner join replys r on r.id_user = u.id inner join hilos h on r.id_hilo=h.id")

    console.log(results)
    console.log(respuestas_hilo)

    res.render("hilo",{results,respuestas_hilo})
})

//ruta para agregar una respuesta a hilo

router.get("/responder/:id",(req,res) => {
    console.log(req.params)

    res.render("nueva_respuesta",{id:req.params.id})
})


//ruta para los hilos ordenados por recientes

router.get("/nuevo_hilo",(req,res) => {
    res.render("nuevo_hilo")
})

router.post("/nuevo_hilo",async (req,res) => {
    console.log(req.body)

    let hilo = {
        titulo:req.body.titulo,
        texto:req.body.texto,
        id_user:req.user.id
    }

    console.log(hilo)

    await pool.query("insert into hilos set ?",[hilo])

    await pool.query("update users set mensajes = mensajes+1 where id=?",[req.user.id])
    
    res.redirect("/")

})

router.get("/access", (req,res)=>{
    res.render("login.ejs")
})

router.get("/registro", (req,res)=>{
    res.render("registro.ejs")
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