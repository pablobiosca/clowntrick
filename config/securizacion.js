module.exports = {

    //si esta logueado ,seguimos con la ruta
    isloggedin( req,res,next ){
        if (req.isAuthenticated()){
            return next()
        }
        //si no esta logueado te redirige al login/registro
        return res.redirect("/access")
    }
}