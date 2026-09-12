const btnNo = document.getElementById('btn-no');
const btnSi = document.getElementById('btn-si');
const pantallaInicio = document.getElementById('pantalla-inicio');
const webPrincipal = document.getElementById('web-principal');

// Lógica del botón que huye (Botón NO)
function moverBoton() {
    const contenedor = btnNo.parentElement;
    const maxX = contenedor.clientWidth - btnNo.clientWidth;
    const maxY = 200; // Límite vertical para que no se vaya muy lejos

    const randomX = Math.max(0, Math.floor(Math.random() * maxX));
    const randomY = Math.floor(Math.random() * maxY) - (maxY/2);

    btnNo.style.position = 'absolute';
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

btnNo.addEventListener('mouseover', moverBoton);
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    moverBoton();
});

// Transición al hacer clic en SÍ
btnSi.addEventListener('click', () => {
    // Desvanecemos la pantalla inicial
    pantallaInicio.style.opacity = '0';
    
    setTimeout(() => {
        // Ocultamos la pantalla inicial del todo
        pantallaInicio.classList.add('oculto');
        // Mostramos la web principal
        webPrincipal.classList.remove('oculto');
        
        // Hacemos scroll arriba del todo
        window.scrollTo(0, 0);
    }, 1000); // Esperamos 1 segundo a que termine el fade-out
});