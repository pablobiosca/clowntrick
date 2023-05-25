const {Router} = require("express")

const passport = require("passport")

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

router.post("/login", (req,res)=>{
    console.log(req.body)
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