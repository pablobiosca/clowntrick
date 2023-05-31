const socket = io()

socket.on("server:nuevo_hilo",(nuevo_hilo)=>{
    console.log("HILO RECIBIDO")
    console.log(nuevo_hilo)

    let container_hilos = document.getElementById("container_hilos")

    let hilo = `
    <div class="hilo">
                    
        <div class="user">
            <div class="user_info">
                <p>@${nuevo_hilo.nickname}</p>
                <p class="participaciones">Participaciones : ${nuevo_hilo.mensajes}</p>
            </div>
            <a href="/hilo/${nuevo_hilo.id_hilo}" class="hilo_titulo">
                <p class="titulo">${nuevo_hilo.titulo}</p>
                <p class="fecha">Hace un momento</p>
            </a>
        </div>

        <div class="hilo_info">
            <p>0</p>
            <p>0</p>
        </div>

    </div>
    `



    container_hilos.insertAdjacentHTML('afterbegin', hilo);

})