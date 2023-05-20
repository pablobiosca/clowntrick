const socket = io()
const bt = document.getElementById("publicar")

const publicar = () => {
    socket.emit("pong")
}


bt.addEventListener("click", () => {
    console.log("hola")
    publicar()
})

