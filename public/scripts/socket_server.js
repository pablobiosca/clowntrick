const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const pool = require("../../config/connection")

io.on("connection",(socket) => {
    
    console.log("nueva conexion",socket.id)

    socket.on("client:nuevo_hilo",async(nuevo_hilo)=>{
        console.log("hilo recibido por el cliente")
        console.log(nuevo_hilo)


        if (nuevo_hilo.titulo && nuevo_hilo.texto){
            console.log("datos integros")



            let new_hilo = {
                titulo:nuevo_hilo.titulo,
                texto:nuevo_hilo.texto,
                id_user:nuevo_hilo.id_user
            }

            const [hilo] = await pool.query("insert into hilos set ?",[new_hilo])

            await pool.query("update users set mensajes = mensajes+1 where id=?",[nuevo_hilo.id_user])

            const [info_pasar_socket] = await pool.query("select h.id,u.nickname,u.mensajes from users u inner join hilos h where h.id = ? and h.id_user = u.id and h.id_user =?",[hilo.insertId,nuevo_hilo.id_user])
            console.log("INFO PASAAAAR SOCKETTT")
            console.log(info_pasar_socket[0])
            
            new_hilo.id_hilo = hilo.insertId
            new_hilo.nickname = info_pasar_socket[0].nickname
            new_hilo.mensajes = info_pasar_socket[0].mensajes

            console.log(new_hilo)



            io.emit("server:nuevo_hilo",new_hilo)


        }else{
            console.log("no se emite este hilo,faltan datos")
        }

    })

})


module.exports = {app,server,express}

