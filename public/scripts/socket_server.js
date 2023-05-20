const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

let notes = []

io.on("connection",(socket) => {
    
    console.log("nueva conexion",socket.id)

    socket.emit("server:loadnotes",notes)

    socket.emit("ping")

    socket.on("pong",()=>{
        console.log("pong recibido")
    })

})


module.exports = {app,server,express}

