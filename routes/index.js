const {Router} = require("express")

const router = Router()

router.get("/",(req,res) => {
    res.render("main")
})

router.get("/access", (req,res)=>{
    res.render("login.ejs")
})

module.exports = router