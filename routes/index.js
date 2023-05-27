const {Router} = require("express")

const passport = require("passport")

const pool = require("../config/connection")

const encrypt = require("../config/encrypt")

const router = Router()

router.get("/",(req,res) => {
    res.render("main")
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