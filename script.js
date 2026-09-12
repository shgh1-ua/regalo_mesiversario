// Capturamos los elementos que necesitamos
const btnNo = document.getElementById('btn-no');
const btnSi = document.getElementById('btn-si');
const seccionTrampa = document.querySelector('.pregunta-trampa');

// Función que calcula posiciones aleatorias y mueve el botón
function moverBoton() {
    // Calculamos el espacio disponible basándonos en la sección, no en la ventana
    const maxX = seccionTrampa.clientWidth - btnNo.clientWidth - 20;
    const maxY = seccionTrampa.clientHeight - btnNo.clientHeight - 20;

    // Generamos coordenadas X e Y aleatorias
    const randomX = Math.max(0, Math.floor(Math.random() * maxX));
    const randomY = Math.max(0, Math.floor(Math.random() * maxY));

    // Cambiamos 'fixed' por 'absolute'
    btnNo.style.position = 'absolute';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
}

// Escuchamos el evento: en cuanto el ratón entra en el botón, huye
btnNo.addEventListener('mouseover', moverBoton);

// (Opcional para móvil) Si intenta tocarlo con el dedo, también huye
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    moverBoton();
});

// Interacción del botón Sí
btnSi.addEventListener('click', () => {
    alert("Sabía que dirías que sí. (Aquí podemos hacer que la pantalla baje automáticamente hasta el vídeo final)");
    
    // Hace scroll suave hasta la última sección
    document.getElementById('historia').scrollIntoView({ behavior: 'smooth' });
});



// Lógica de los regalos ocultos
const regalos = document.querySelectorAll('.regalo-oculto');
const slots = document.querySelectorAll('.slot');
let regalosEncontrados = 0;

regalos.forEach(regalo => {
    regalo.addEventListener('click', function() {
        // Obtenemos el emoji del regalo
        const emoji = this.textContent;
        
        // Llenamos el siguiente slot disponible
        if (regalosEncontrados < slots.length) {
            slots[regalosEncontrados].textContent = emoji;
            slots[regalosEncontrados].classList.add('lleno');
            
            // Ocultamos el regalo de la página
            this.classList.add('ocultar-elemento');
            
            regalosEncontrados++;

            // Comprobamos si ha encontrado todos
            if (regalosEncontrados === slots.length) {
                setTimeout(() => {
                    alert("¡Has encontrado todos los vales sorpresa! Se ha desbloqueado algo especial al final del hilo...");
                    // Aquí podríamos hacer visible la sección final o cambiar algún estilo
                }, 500);
            }
        }
    });
});