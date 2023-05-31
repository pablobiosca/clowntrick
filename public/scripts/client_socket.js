const socket = io()
const bt = document.getElementById("socket_client")

const publicar = () => {
    let titulo = document.getElementById("titulo").value
    let texto = document.getElementById("texto").value
    let id_user = document.getElementById("info_crack").value
    console.log("info user",id_user)
    socket.emit("client:nuevo_hilo",{
        titulo,texto,"id_user":id_user
    })
}


bt.addEventListener("click", () => {
    console.log("hola")
    publicar()
})

