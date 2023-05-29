const passport = require("passport")
const localstrategy = require("passport-local").Strategy

//manejador de bdatos en forma de pisicina
//mejor rendimiento al reultilizar conexiones ya establecidas
const pool = require("./connection.js")

//objeto de en/des - criptacion (comprobaciones de seguridad)
const encrypt = require("./encrypt.js")

console.log("estrategias")

//estrategia de resgistro
passport.use("local.signup", new localstrategy({
    
    usernameField: "nickname",
    passwordField: "password",
    passReqToCallback:true
    //propagar el req hacia siguiente funcion en cadena
    
}, async (req,name,password,done)=>{
    console.log(req.body)
    
    password = await encrypt.encriptasion(password)
    //como hemos propagado el req,podemos acceder a mas datos
    //para la creacion del objeto completo
    const {email} = req.body
    
    const new_user = {
        nickname:name,
        password,
        email:email,
    }
    
    console.log(new_user)
    
    console.log("despues encrypt")
    
    const [result] = await pool.query("insert into users set ?",[new_user])
    
    console.log(result.insertId)
    
    new_user.id = result.insertId
    
    return done(null, new_user)
}))


//login
passport.use("local.signin", new localstrategy({
    usernameField:"email",
    passwordField:"password",
    passReqToCallback:true
}, async (req,username,password,done) =>{

    console.log(username,password)

    const [result] = await pool.query("select * from users where email = ?",[username])
    
    return done(null,result[0])

}))

passport.serializeUser((user,done)=>{
    console.log("serial")
    done(null,user.id)
})

passport.deserializeUser(async(id,done) =>{

    console.log("deserializing")

    const [user] = await pool.query("select * from users where id = ?",[id])
    console.log(user[0])
    console.log(user)
    done(null,user[0])

} )
