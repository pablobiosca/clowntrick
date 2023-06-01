const passport = require("passport")
const localstrategy = require("passport-local").Strategy
const nodemailer = require("nodemailer")
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

    // transportador mediante SMTP
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "fary.torito.66@gmail.com",
            pass: process.env.EMAIL,
        }
    });
    
    let info = await transporter.sendMail({
        from: email + ' <fary.torito.66@gmail.com>',
        to: email,
        subject: `¡Bienvenido ${name}!`,
        html: `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Bienvenido al Foro de Ciberseguridad</title>
          <style>
            /* Estilos generales */
            body {
              font-family: Arial, sans-serif;
              background-color: #f1f1f1;
            }
        
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
        
            h1 {
              color: #444;
              margin-bottom: 20px;
            }
        
            p {
              color: #777;
              margin-bottom: 20px;
            }
        
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #9fef00;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
            }
        
            /* Estilos específicos */
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
        
            .logo {
              width: 80px;
            }
        
            .welcome-message {
              font-size: 24px;
              color: #333;
              margin-bottom: 30px;
              text-align: center;
            }
        
            .instructions {
              margin-bottom: 30px;
            }
        
            .footer {
              text-align: center;
            }
        
            .footer p {
              color: #888;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://www.olympusweb.com/wp-content/uploads/2023/01/white-hat.png" alt="Logo" class="logo">
              <h1>Bienvenido a ClownTrick, ${name}</h1>
            </div>
            <p class="welcome-message">¡Gracias por unirte a nuestra comunidad!</p>
            <p class="instructions">Aquí encontrarás información, consejos y discusiones sobre ciberseguridad.</p>
            <p class="instructions">¡Comienza explorando los hilos y participando en las conversaciones!</p>
            <p class="instructions">Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
            <p class="instructions">¡Disfruta tu experiencia en el foro!</p>
            <a style="color:blue;" href="https://clowntrickkk.onrender.com/"><p class="instructions">Ir al foro</p></a>
            <div class="footer">
              <p>No respondas a este correo. Para contactarnos, visita nuestro sitio web.</p>
            </div>
          </div>
        </body>
        </html>`,
      });
    
    console.log("Message sent: ", info.messageId);
    
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
