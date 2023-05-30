const fechaElements = document.querySelectorAll('.fecha');
    
fechaElements.forEach(function (element) {
    const fecha = element.textContent;

    // Obtener la fecha actual
    const fechaActual = new Date();

    // Convertir la fecha de texto a objeto de fecha
    const fechaPasada = new Date(fecha);

    // Calcular la diferencia entre la fecha pasada y la fecha actual
    const diferencia = fechaActual.getTime() - fechaPasada.getTime();

    // Función personalizada para obtener el formato relativo en español
    function obtenerFormatoRelativo(diferencia) {
        const segundos = Math.floor(diferencia / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        const dias = Math.floor(horas / 24);
        const meses = Math.floor(dias / 30);
        const años = Math.floor(meses / 12);

        if (años > 0) {
            return `Hace ${años} ${años === 1 ? 'año' : 'años'}`;
        } else if (meses > 0) {
            return `Hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
        } else if (dias > 0) {
            return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
        } else if (horas > 0) {
            return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
        } else if (minutos > 0) {
            return `Hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
        } else {
            return 'Hace un momento';
        }
    }

    const formatoRelativo = obtenerFormatoRelativo(diferencia);

    element.textContent = formatoRelativo;
});