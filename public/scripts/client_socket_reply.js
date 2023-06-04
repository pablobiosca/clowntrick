const socket = io()


socket.on("server:nueva_reply",(nueva_reply)=>{
    
    const hilo_id = document.getElementById("info_hilo").value

    if (hilo_id == nueva_reply.id_hilo){
        
        console.log("Reply RECIBIDa")
        console.log(nueva_reply)
    
        let container_hilos = document.getElementById("container_hilos")
    
        let reply = `
            <div class="hilo">
                <div class="user">
                    <div class="user_info">
                        <p class="nick">@${nueva_reply.nickname}</p>
                        <p>Participaciones : ${nueva_reply.mensajes}</p>
                    </div>
                    <div class="hilo_titulo">
                        <div>
                            <p>${nueva_reply.texto}</p>
                            <h6 class="fecha">Hace un momento</h6>
                        </div>
                    </div>
                </div>
    
            </div>
        `
        

        //funcionalidad de que se meta debajo de el primer elemento (padre_hilo)
        //como respuesta "mas reciente"
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = reply.trim();
    
        const primerElemento = container_hilos.firstElementChild;
    
        container_hilos.insertBefore(tempDiv.firstChild, primerElemento.nextSibling);

    }else{
        console.log("no gfe")
    }
    

})