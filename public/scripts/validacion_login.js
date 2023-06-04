//validar los campos del login desde una peticion en el client side hacia
//el back side ,de esta manera no renderizamos y lo hacemos todo desde el cliente

const text_fill = document.getElementById("text_fill")

const btonsico = document.getElementById("bt_login")


//en cuanto de pulse el boton de acceder pasamos al back las credenciales para validar

btonsico.addEventListener("click",async () => {
    
    const email = document.getElementById("email").value

    const password = document.getElementById("password").value
    
    console.log(email,password)
    
    try {

        await fetch("/login",{
            method:"POST",
            headers: { "Content-Type" : "application/json" },
            body : JSON.stringify({
                email,password
            })
        }).then(  (response) => response.json()) 
        .then( (json_data) => {
            console.log(json_data)

            if (json_data.logged ==2){
                console.log("contraseña incorrecta")
                text_fill.textContent = "Contraseña Incorrecta"
            }else if (json_data.logged ==3){
                console.log("Este usuario no existe")
                text_fill.textContent = "No existe este usuario"
            }
        } )

    }catch (e){
        console.log(e)

        //si todo ha salido bien redirigimos a el inicio 
        //con la cookie ya creada

        window.location.href = "/"
    }  
})