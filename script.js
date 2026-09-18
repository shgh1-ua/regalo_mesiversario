// Elementos de la Fase 1
const btnNo = document.getElementById('btn-no');
const btnSi = document.getElementById('btn-si');
const pantallaInicio = document.getElementById('pantalla-inicio');
const webPrincipal = document.getElementById('web-principal');

// Función que calcula posiciones aleatorias y mueve el botón NO
function moverBoton() {
    // Calculamos el espacio disponible basándonos en la pantalla de inicio
    const maxX = pantallaInicio.clientWidth - btnNo.clientWidth - 20;
    const maxY = pantallaInicio.clientHeight - btnNo.clientHeight - 20;

    const randomX = Math.max(0, Math.floor(Math.random() * maxX));
    const randomY = Math.max(0, Math.floor(Math.random() * maxY));

    btnNo.style.position = 'absolute';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
}

btnNo.addEventListener('mouseover', moverBoton);
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    moverBoton();
});

// Interacción del botón Sí (Transición de pantalla)
btnSi.addEventListener('click', () => {
    // Desvanecemos la pantalla inicial
    pantallaInicio.style.opacity = '0';
    
    setTimeout(() => {
        // Ocultamos la pantalla inicial del DOM
        pantallaInicio.classList.add('oculto');
        pantallaInicio.style.display = 'none'; // ESTO ELIMINA EL ESPACIO BLANCO
        
        // Mostramos la web principal
        webPrincipal.classList.remove('oculto');
        webPrincipal.classList.add('web-visible');
        
        // Hacemos scroll suave a la sección de mensajes
        document.getElementById('mensajes').scrollIntoView({ behavior: 'smooth' });
    }, 1000); // Espera 1 segundo a que termine el fade-out
});

// Lógica de los regalos ocultos
const regalos = document.querySelectorAll('.regalo-oculto');
const slots = document.querySelectorAll('.slot');
let regalosEncontrados = 0;

regalos.forEach(regalo => {
    regalo.addEventListener('click', function() {
        const emoji = this.textContent;
        
        if (regalosEncontrados < slots.length) {
            slots[regalosEncontrados].textContent = emoji;
            slots[regalosEncontrados].classList.add('lleno');
            
            this.classList.add('ocultar-elemento');
            regalosEncontrados++;

            if (regalosEncontrados === slots.length) {
                setTimeout(() => {
                    alert("¡Has encontrado todos los vales sorpresa! Se ha desbloqueado algo especial al final del hilo...");
                    document.getElementById('seccion-final').scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        }
    });
});

// --- Efectos Interactivos en la Sección de Luces (Motor de Físicas) ---
const seccionLuces = document.getElementById('luces-recuerdos');
const linterna = document.getElementById('foco-linterna');
const fotosColgadas = document.querySelectorAll('.foto-colgada');

// 1. Preparamos las fotos anulando el CSS para evitar tirones
fotosColgadas.forEach(foto => {
    foto.style.animation = 'none'; // Apagamos el CSS
    foto.dataset.viento = 0;       // Viento actual aplicado
    foto.dataset.vientoObjetivo = 0; // Fuerza del viento que queremos alcanzar
});

let tiempo = 0;

// 2. Bucle de físicas fluido (se ejecuta 60 veces por segundo)
function animarFisicas() {
    tiempo += 0.02; // Velocidad del balanceo natural
    
    fotosColgadas.forEach((foto, index) => {
        // A. Balanceo natural suave usando una onda senoidal
        // Sumamos el 'index' para que cada foto se balancee a un ritmo ligeramente distinto
        const balanceoNatural = Math.sin(tiempo + index) * 4; 

        // B. Suavizado del viento (Inercia)
        let vientoActual = parseFloat(foto.dataset.viento);
        let vientoObjetivo = parseFloat(foto.dataset.vientoObjetivo);
        
        // El viento se acerca al objetivo progresivamente, creando el efecto "ráfaga"
        vientoActual += (vientoObjetivo - vientoActual) * 0.05; 
        foto.dataset.viento = vientoActual;

        // C. Aplicamos la mezcla perfecta de ambos movimientos
        foto.style.transform = `rotate(${balanceoNatural + vientoActual}deg)`;
    });

    requestAnimationFrame(animarFisicas);
}

// Iniciamos el motor de físicas
animarFisicas();

if (seccionLuces && linterna) {
    seccionLuces.addEventListener('mousemove', (e) => {
        // Mover la linterna
        linterna.style.opacity = '1';
        const rect = seccionLuces.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        linterna.style.left = `${x}px`;
        linterna.style.top = `${y}px`;

        // Calcular el viento de forma individual
        fotosColgadas.forEach((foto) => {
            const fotoRect = foto.getBoundingClientRect();
            // Calculamos el centro de la foto
            const fotoCenterX = fotoRect.left + (fotoRect.width / 2);
            
            // Distancia del ratón al centro de la foto
            const distanciaX = e.clientX - fotoCenterX;
            const rangoViento = 250; // Área de influencia del cursor

            if (Math.abs(distanciaX) < rangoViento) {
                // Más cerca = más fuerza (de 0 a 1)
                const fuerza = 1 - (Math.abs(distanciaX) / rangoViento);
                const anguloMaximo = 35; // Grados de inclinación por el viento
                
                // CORRECCIÓN DEL IMÁN:
                // Si el ratón está a la izquierda (negativo), empujamos hacia la derecha (ángulo negativo)
                const direccion = distanciaX < 0 ? -1 : 1;
                
                // Actualizamos el objetivo, el bucle de físicas hará el resto suavemente
                foto.dataset.vientoObjetivo = fuerza * anguloMaximo * direccion;
            } else {
                // Si el ratón está lejos, el viento sobre esta foto es 0
                foto.dataset.vientoObjetivo = 0;
            }
        });
    });

    seccionLuces.addEventListener('mouseleave', () => {
        // Ocultar linterna y apagar el viento al salir de la sección
        linterna.style.opacity = '0';
        fotosColgadas.forEach(foto => {
            foto.dataset.vientoObjetivo = 0;
        });
    });
}

// --- Generador de Partículas Flotantes ---
function iniciarParticulas(idContenedor, arraySimbolos, intervaloMs) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    setInterval(() => {
        // Crear el elemento
        const particula = document.createElement('div');
        particula.classList.add('particula');
        
        // Elegir un símbolo aleatorio
        const simbolo = arraySimbolos[Math.floor(Math.random() * arraySimbolos.length)];
        particula.innerText = simbolo;

        // Propiedades aleatorias (posición, tamaño, velocidad)
        const leftPos = Math.random() * 100; // Posición horizontal (0% a 100%)
        const tamano = Math.random() * 15 + 10; // Tamaño entre 10px y 25px
        const duracion = Math.random() * 4 + 4; // Tardan entre 4 y 8 segundos en subir

        particula.style.left = `${leftPos}%`;
        particula.style.fontSize = `${tamano}px`;
        particula.style.animationDuration = `${duracion}s`;

        // Añadirla al DOM
        contenedor.appendChild(particula);

        // Limpiar el DOM: Borrar la partícula cuando termine su animación para no saturar la memoria
        setTimeout(() => {
            particula.remove();
        }, duracion * 1000);

    }, intervaloMs);
}

// 1. Partículas para la pantalla oscura (Estrellas y corazones rojos)
iniciarParticulas('particulas-oscuras', ['✨', '❤️', '⭐'], 400);

// 2. Partículas para la web clara (Corazoncitos sutiles, aparecen menos a menudo)
iniciarParticulas('particulas-claras', ['🤍', '❤️', '💕'], 800);

// --- CONSTELACIÓN DEL DESTINO (tsParticles) ---
// Esperamos a que todo cargue para evitar errores
window.addEventListener('DOMContentLoaded', () => {
    
    // Verificamos si existe el contenedor antes de iniciar
    if (document.getElementById("tsparticles")) {
        tsParticles.load("tsparticles", {
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "grab", // Este es el modo mágico: conecta el cursor a las estrellas
                    },
                    onClick: {
                        enable: true,
                        mode: "push", // Un pequeño estallido de estrellas extra al hacer clic
                    },
                    resize: true,
                },
                modes: {
                    grab: {
                        distance: 250, // Distancia del "hilo"
                        links: {
                            opacity: 0.8,
                            color: "#d90429" // Color del Hilo Rojo
                        }
                    },
                    push: {
                        quantity: 4, // Añade 4 estrellas en el punto de clic
                    }
                },
            },
            particles: {
                color: { value: "#ffffff" }, // Estrellas blancas
                links: {
                    color: "#ffffff",
                    distance: 120,
                    enable: true,
                    opacity: 0.1, // Líneas grises súper tenues entre estrellas de fondo
                    width: 1,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: { default: "bounce" }, // Rebotan suavemente en los bordes
                    random: true,
                    speed: 0.8, // Movimiento muy lento, flotante
                    straight: false,
                },
                number: {
                    density: { enable: true, area: 800 },
                    value: 90, // Cantidad de estrellas en el cielo
                },
                opacity: {
                    value: 0.6,
                    animation: {
                        enable: true, // Efecto de titilar
                        speed: 1,
                        minimumValue: 0.1,
                        sync: false
                    }
                },
                shape: { type: "circle" },
                size: {
                    value: { min: 1, max: 3 },
                },
            },
            detectRetina: true,
        });

        // --- LÓGICA DEL CLÍMAX (El Clic) ---
        const canvasContainer = document.getElementById('tsparticles');
        const corazonFinal = document.getElementById('corazon-final');
        const tituloConstelacion = document.querySelector('.titulo-constelacion');
        const instruccionConstelacion = document.querySelector('.instruccion-constelacion');

        canvasContainer.addEventListener('click', () => {
            // Mostramos el corazón latiendo con el texto "TÚ Y YO"
            corazonFinal.classList.remove('oculto-inicialmente');
            corazonFinal.classList.add('visible-corazon');
            
            // Hacemos desaparecer los textos iniciales de instrucciones
            tituloConstelacion.style.transition = "opacity 1s";
            tituloConstelacion.style.opacity = "0";
            instruccionConstelacion.style.transition = "opacity 1s";
            instruccionConstelacion.style.opacity = "0";
        });
    }
});