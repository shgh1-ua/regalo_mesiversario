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
                // Hacemos visible la sección oculta
                const seccionFinal = document.getElementById('seccion-final');
                seccionFinal.style.display = 'flex'; 
                
                setTimeout(() => {
                    alert("¡Has encontrado todos los vales sorpresa! Se ha desbloqueado algo especial al final del hilo...");
                    seccionFinal.scrollIntoView({ behavior: 'smooth' });
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
        foto.style.transform = `translateX(-50%) rotate(${balanceoNatural + vientoActual}deg)`;
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

// --- MOTOR FÍSICO: Constelación, Telaraña y Explosión ---
const canvas = document.getElementById('lienzo-estrellas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particulas = [];
    const numParticulas = 150; 
    let corazonFormado = false; // Interruptor de estado

    let mouse = { x: null, y: null, radius: 200, grabRadius: 250 };

    function redimensionar() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', redimensionar);
    redimensionar();

    // Ecuación matemática del corazón
    function obtenerPuntoCorazon(t, escala) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        return {
            x: (x * escala) + (width / 2),
            y: (y * escala) + (height / 2) - 30
        };
    }

   class Particula {
        constructor(indice) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.radio = Math.random() * 1.5 + 1;
            
            this.indice = indice; // ESTA ES LA LÍNEA CRÍTICA QUE FALTABA

            const t = (indice / numParticulas) * Math.PI * 2;
            const objetivo = obtenerPuntoCorazon(t, 15);
            this.objetivoX = objetivo.x;
            this.objetivoY = objetivo.y;
        }

        actualizar() {
            if (corazonFormado) {
                // EL LATIDO DEL CORAZÓN
                let tiempoLatido = Date.now() * 0.004; 
                let latido = Math.pow(Math.abs(Math.sin(tiempoLatido)), 4); 
                let escalaDinamica = 14 + latido * 2.5; 
                
                // Al tener this.indice guardado, este cálculo ya funciona
                const t = (this.indice / numParticulas) * Math.PI * 2;
                const objetivo = obtenerPuntoCorazon(t, escalaDinamica);

                this.x += (objetivo.x - this.x) * 0.05;
                this.y += (objetivo.y - this.y) * 0.05;     
            } else {
                // MODO LIBRE: Fricción
                this.vx *= 0.92;
                this.vy *= 0.92;

                if (Math.abs(this.vx) < 0.1) this.vx += (Math.random() - 0.5) * 0.05;
                if (Math.abs(this.vy) < 0.1) this.vy += (Math.random() - 0.5) * 0.05;

                this.x += this.vx;
                this.y += this.vy;

                // Rebotar contra las paredes
                if (this.x < 0) { this.x = 0; this.vx *= -1; }
                if (this.x > width) { this.x = width; this.vx *= -1; }
                if (this.y < 0) { this.y = 0; this.vy *= -1; }
                if (this.y > height) { this.y = height; this.vy *= -1; }

                // Atracción magnética del cursor
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distancia = Math.sqrt(dx * dx + dy * dy);

                    if (distancia < mouse.radius) {
                        let fuerza = (mouse.radius - distancia) / mouse.radius;
                        this.vx += (dx / distancia) * fuerza * 0.6;
                        this.vy += (dy / distancia) * fuerza * 0.6;
                    }
                }
            }
        }

        dibujar() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
        }
    }

    for (let i = 0; i < numParticulas; i++) {
        particulas.push(new Particula(i));
    }

    function animar() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particulas.length; i++) {
            particulas[i].actualizar();
            particulas[i].dibujar();
            
            // Hilos blancos sutiles entre estrellas cercanas
            // CONEXIONES ENTRE PARTÍCULAS
            for (let j = i + 1; j < particulas.length; j++) {
                let dx = particulas[i].x - particulas[j].x;
                let dy = particulas[i].y - particulas[j].y;
                let distancia = Math.sqrt(dx * dx + dy * dy);

                if (corazonFormado) {
                    // MODO CORAZÓN: Hilos cruzando el interior
                    // 1. Distancia enorme para que los hilos crucen de lado a lado
                    if (distancia < 600) {
                        // 2. Filtro de caos: Solo dibujamos la línea si cumple esta fórmula.
                        // Esto selecciona ~1 de cada 13 conexiones posibles, rompiendo la perfección 
                        // geométrica y creando un efecto de hilo enredado súper orgánico y estable.
                        if ((i + j * 3) % 13 === 0) {
                            ctx.beginPath();
                            // 3. Opacidad más alta (0.25) para un brillo más intenso
                            ctx.strokeStyle = `rgba(217, 4, 41, 0.35)`;
                            ctx.lineWidth = 1.0; // Hilo ligeramente más grueso
                            ctx.moveTo(particulas[i].x, particulas[i].y);
                            ctx.lineTo(particulas[j].x, particulas[j].y);
                            ctx.stroke();
                        }
                    }
                } else {
                    // MODO LIBRE: Constelación blanca tenue de fondo
                    if (distancia < 80) {
                        ctx.beginPath();
                        let opacidad = 0.2 - (distancia / 80) * 0.2;
                        ctx.strokeStyle = `rgba(217, 4, 41, ${opacidad})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particulas[i].x, particulas[i].y);
                        ctx.lineTo(particulas[j].x, particulas[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // EL EFECTO TSPARTICLES: Telaraña roja desde el cursor
        if (mouse.x != null && !corazonFormado) {
            for (let i = 0; i < particulas.length; i++) {
                let dx = mouse.x - particulas[i].x;
                let dy = mouse.y - particulas[i].y;
                let distancia = Math.sqrt(dx * dx + dy * dy);

                if (distancia < mouse.grabRadius) {
                    ctx.beginPath();
                    let opacidad = 1 - (distancia / mouse.grabRadius);
                    ctx.strokeStyle = `rgba(217, 4, 41, ${opacidad})`;
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(mouse.x, mouse.y);
                    ctx.lineTo(particulas[i].x, particulas[i].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animar);
    }
    animar();

    const seccionConstelacion = document.getElementById('constelacion-destino');
    const titulo = document.querySelector('.titulo-constelacion');
    const instruccion = document.querySelector('.instruccion-constelacion');
    const textoFinal = document.getElementById('texto-corazon-final');
    
    seccionConstelacion.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    seccionConstelacion.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Clic para Formar o Explotar el corazón
    seccionConstelacion.addEventListener('click', () => {
        if (!corazonFormado) {
            // FORMAR CORAZÓN
            corazonFormado = true;
            titulo.style.opacity = '0';
            instruccion.style.opacity = '0';
            
            setTimeout(() => {
                if(corazonFormado) {
                    textoFinal.classList.remove('oculto-inicialmente');
                    textoFinal.classList.add('visible-corazon');
                }
            }, 800);
            
        } else {
            // EXPLOTAR CORAZÓN
            corazonFormado = false;
            textoFinal.classList.remove('visible-corazon');
            textoFinal.classList.add('oculto-inicialmente');
            
            setTimeout(() => {
                titulo.style.opacity = '1';
                instruccion.style.opacity = '1';
                // Cambiar el texto para dar la pista de que se puede volver a formar
                instruccion.innerText = "El hilo rojo siempre vuelve a unirse...";
            }, 500);

            // Calculamos el centro de la pantalla para la explosión radial
            const centroX = width / 2;
            const centroY = height / 2;

            particulas.forEach(p => {
                // Dirección desde el centro hasta la partícula
                let dx = p.x - centroX;
                let dy = p.y - centroY;
                let distanciaAlCentro = Math.sqrt(dx * dx + dy * dy) || 1; 
                
                // Inyectamos una fuerza brutal hacia afuera, con un poco de aleatoriedad
                let fuerzaExplosion = Math.random() * 25 + 15; // Velocidad entre 15 y 40
                p.vx = (dx / distanciaAlCentro) * fuerzaExplosion;
                p.vy = (dy / distanciaAlCentro) * fuerzaExplosion;
            });
        }
    });
}

// --- Contador de Aniversario ---
// Formato: Año-Mes-Día. Puedes ajustar la hora exacta si la sabes (ej: "2024-09-14T18:30:00")
const fechaInicio = new Date("2026-07-21T00:00:00").getTime();

function actualizarContador() {
    const ahora = new Date().getTime();
    const diferencia = ahora - fechaInicio;

    // Matemáticas para calcular los días, horas, minutos y segundos
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    // Actualizamos el DOM (padStart asegura que siempre haya 2 dígitos, ej: "09" en vez de "9")
    document.getElementById("timer-dias").innerText = dias;
    document.getElementById("timer-horas").innerText = horas.toString().padStart(2, '0');
    document.getElementById("timer-minutos").innerText = minutos.toString().padStart(2, '0');
    document.getElementById("timer-segundos").innerText = segundos.toString().padStart(2, '0');
}

// Actualizar cada segundo
setInterval(actualizarContador, 1000);
actualizarContador(); // Ejecución inmediata al cargar la página

// --- Reproductor de Música ---
const audio = document.getElementById('audio-player');
const btnPlay = document.getElementById('btn-play');
const progresoActual = document.getElementById('progreso-actual');
const puntoProgreso = document.getElementById('punto-progreso');

if (audio && btnPlay) {
    // 1. Reproducir / Pausar
    btnPlay.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            btnPlay.innerText = '⏸'; // Cambia el icono a pausa
        } else {
            audio.pause();
            btnPlay.innerText = '▶️'; // Cambia el icono a play
        }
    });

    // 2. Actualizar la barra de progreso en tiempo real
    audio.addEventListener('timeupdate', () => {
        // Calculamos el porcentaje de la canción que ya ha sonado
        const porcentaje = (audio.currentTime / audio.duration) * 100;
        
        // Si hay un valor válido, actualizamos el CSS
        if (!isNaN(porcentaje)) {
            progresoActual.style.width = `${porcentaje}%`;
            puntoProgreso.style.left = `${porcentaje}%`;
        }
    });

    // 3. Reiniciar cuando termine la canción
    audio.addEventListener('ended', () => {
        btnPlay.innerText = '▶️';
        progresoActual.style.width = '0%';
        puntoProgreso.style.left = '0%';
    });
}