module.exports = {

    isloggedin( req,res,next ){
        if (req.isAuthenticated()){
            return next()
        }

        return res.redirect("/access")
    },

    isnotelogged(req,res,next){
        if (!req.isAuthenticated()){
            return next()
        }
        return res.redirect("/mishilos")
    }

}