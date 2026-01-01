document.addEventListener('DOMContentLoaded', function () {
    const botonSi = document.getElementById('acepto');
    const botonNo = document.getElementById('no-acepto');
    const modal = document.querySelector('.modal');
    const cerrarModal = document.querySelector('.cerrar-modal');
    const mensajePersuasion = document.getElementById('mensaje-persuasion');
    const audioControl = document.getElementById('audio-control');
    const backgroundMusic = document.getElementById('background-music');
    const celebrationMusic = document.getElementById('celebration-music');

    // Smooth volume transition
    function fadeAudio(audioOut, audioIn) {
        let vol = 1;
        const fadeOut = setInterval(() => {
            if (vol > 0) {
                vol -= 0.1;
                audioOut.volume = vol.toFixed(1);
            } else {
                clearInterval(fadeOut);
                audioOut.pause();
                audioOut.volume = 1; // Reset for next time
                audioIn.volume = 0;
                audioIn.play();
                let volIn = 0;
                const fadeIn = setInterval(() => {
                    if (volIn < 1) {
                        volIn += 0.1;
                        audioIn.volume = volIn.toFixed(1);
                    } else {
                        clearInterval(fadeIn);
                    }
                }, 100);
            }
        }, 100);
    }
    const rosesDecoration = document.getElementById('roses-decoration');
    const floresEfecto = document.getElementById('flores-efecto');
    const imagenesItems = document.querySelectorAll('.imagen-item');
    const imagenTexto = document.querySelector('.imagen-texto');
    const introOverlay = document.getElementById('intro-overlay');
    const mainContainer = document.querySelector('.container');
    const h1Titulo = document.querySelector('h1');

    // Sparkle Canvas Logic
    const canvas = document.getElementById('sparkles-canvas');
    const ctx = canvas.getContext('2d');
    let sparkles = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    function createSparkle(x, y) {
        sparkles.push({
            x: x,
            y: y,
            size: Math.random() * 3 + 1,
            speedY: Math.random() * 1 - 0.5,
            speedX: Math.random() * 1 - 0.5,
            opacity: 1,
            color: `hsl(${Math.random() * 60 + 300}, 100%, 80%)` // Pink/Purple hues
        });
    }

    function animateSparkles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sparkles.forEach((s, index) => {
            s.y += s.speedY;
            s.x += s.speedX;
            s.opacity -= 0.02;
            s.size *= 0.95;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = s.opacity;
            ctx.fill();

            if (s.opacity <= 0) {
                sparkles.splice(index, 1);
            }
        });
        requestAnimationFrame(animateSparkles);
    }
    animateSparkles();

    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.5) createSparkle(e.clientX, e.clientY);
    });
    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        if (Math.random() > 0.5) createSparkle(touch.clientX, touch.clientY);
    });

    // Intro & Typewriter Logic
    const fullTitleText = "¿Maria Angelita, quieres ser mi novia?";
    h1Titulo.innerText = ""; // Clear initial text

    function typeWriter(text, i, fnCallback) {
        if (i < (text.length)) {
            h1Titulo.innerHTML = text.substring(0, i + 1) + '<span class="typewriter-text"></span>';
            setTimeout(function () {
                typeWriter(text, i + 1, fnCallback)
            }, 100);
        } else if (typeof fnCallback == 'function') {
            setTimeout(fnCallback, 700);
        }
    }

    introOverlay.addEventListener('click', () => {
        introOverlay.classList.add('hidden');
        mainContainer.classList.add('visible');

        // Start Music confidently
        backgroundMusic.play().then(() => {
            musicaReproduciendo = true;
            audioControl.innerHTML = '<i class="fas fa-volume-up"></i>';
        }).catch(e => console.log("Audio play failed", e));

        // Start Typewriter
        setTimeout(() => {
            typeWriter(fullTitleText, 0, function () {
                // Remove cursor after done
                h1Titulo.innerHTML = fullTitleText;
            });
        }, 500);
    });

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }

    let musicaReproduciendo = false;
    let musicaInicialReproducida = false;
    let imagenesUsadas = [0];
    let contadorNoClicks = 0;
    let corazonesInterval;

    // Preload Images
    const imageUrls = [
        "https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/GIF/Gatito1.gif",
        "https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/GIF/no_2.gif",
        "https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/GIF/no_1.gif",
        "https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/GIF/no_4.gif",
        "https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/GIF/no_3.gif",
        "https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/GIF/Gatitosi.gif"
    ];
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });

    const textosPersuasion = [
        "Mi vida sería más completa contigo a mi lado, Angelita",
        "Eres la mujer más hermosa que he conocido, Maria",
        "Tu sonrisa ilumina mis días, mi Angelita",
        "No imagino mi futuro sin ti, Maria Angelita",
        "Mi corazón late por ti, preciosa",
        "¡Ahora eres oficialmente mi novia, Angelita! Te amo"
    ];

    function mostrarImagen(id) {
        imagenesItems.forEach(img => img.classList.remove('activa'));
        const imagen = document.querySelector(`.imagen-item[data-id="${id}"]`);
        imagen.classList.add('activa');
        imagenTexto.textContent = textosPersuasion[id];
    }

    function obtenerImagenUnica() {
        // Optimization: Simple random if all used to avoid recursion stack issues in theory, 
        // though with 6 images it's fine. Logic kept simple.
        const disponibles = Array.from(imagenesItems)
            .map(img => parseInt(img.getAttribute('data-id')))
            .filter(id => !imagenesUsadas.includes(id));

        if (disponibles.length === 0) {
            imagenesUsadas = [0]; // Reset history leaving current one would be better but this works
            return 0; // Fallback
        }

        const indiceAleatorio = Math.floor(Math.random() * disponibles.length);
        const idSeleccionado = disponibles[indiceAleatorio];

        imagenesUsadas.push(idSeleccionado);
        return idSeleccionado;
    }

    function reproducirMusicaInicial() {
        if (!musicaInicialReproducida) {
            backgroundMusic.play().then(() => {
                musicaReproduciendo = true;
                audioControl.innerHTML = '<i class="fas fa-volume-up"></i>';
                musicaInicialReproducida = true;
            }).catch(error => {
                console.log("La reproducción automática fue prevenida:", error);
            });
        }
    }

    // Auto-play removed in favor of Intro Interaction (more reliable)
    // reproducirMusicaInicial();

    function crearRosasDecorativas() {
        for (let i = 0; i < 15; i++) {
            const rose = document.createElement('div');
            rose.classList.add('rose');
            rose.innerHTML = '❀';
            rose.style.left = `${Math.random() * 100}%`;
            rose.style.top = `${Math.random() * 100}%`;
            rose.style.fontSize = `${Math.random() * 20 + 15}px`;
            rose.style.opacity = `${Math.random() * 0.3 + 0.1}`;
            rosesDecoration.appendChild(rose);
        }
    }

    function iniciarLluviaCorazones() {
        corazonesInterval = setInterval(crearCorazon, 250);
    }

    function detenerLluviaCorazones() {
        clearInterval(corazonesInterval);
    }

    function crearCorazon() {
        const corazon = document.createElement('div');
        corazon.classList.add('corazon');

        const tamaño = Math.random() * 25 + 15;
        corazon.style.width = `${tamaño}px`;
        corazon.style.height = `${tamaño}px`;

        corazon.style.left = `${Math.random() * 100}vw`;

        const colores = ['#ff9ec3', '#ffc6d9', '#ff70a0', '#ffb6c1', '#ffd1dc'];
        const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
        corazon.style.background = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${colorAleatorio}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>') no-repeat center center`;
        corazon.style.backgroundSize = 'contain';

        document.body.appendChild(corazon);

        corazon.style.animation = `caer ${Math.random() * 4 + 3}s linear forwards`;

        setTimeout(() => {
            if (corazon.parentNode) {
                corazon.remove();
            }
        }, 7000);
    }

    function crearFlores() {
        const flor = document.createElement('div');
        flor.classList.add('flor');
        flor.innerHTML = '❀';
        flor.style.left = `${Math.random() * 100}vw`;
        flor.style.fontSize = `${Math.random() * 15 + 10}px`;
        flor.style.color = ['#ff9ec3', '#ffc6d9', '#ff70a0'][Math.floor(Math.random() * 3)];
        floresEfecto.appendChild(flor);
        setTimeout(() => {
            if (flor.parentNode) {
                flor.remove();
            }
        }, 10000);
    }

    function crearFuegosArtificiales(x, y) {
        const colores = ['#ff9ec3', '#ffc6d9', '#ff70a0', '#ffb6c1', '#ffd1dc'];
        for (let i = 0; i < 50; i++) {
            const firework = document.createElement('div');
            firework.classList.add('firework');

            const angulo = Math.random() * Math.PI * 2;
            const distancia = Math.random() * 150 + 50;
            const tx = Math.cos(angulo) * distancia;
            const ty = Math.sin(angulo) * distancia;

            firework.style.setProperty('--tx', `${tx}px`);
            firework.style.setProperty('--ty', `${ty}px`);

            firework.style.left = `${x}px`;
            firework.style.top = `${y}px`;
            firework.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];

            document.body.appendChild(firework);

            firework.style.animation = `explode ${Math.random() * 0.5 + 0.5}s ease-out forwards`;
            setTimeout(() => {
                if (firework.parentNode) {
                    firework.remove();
                }
            }, 2000);
        }
    }

    function mostrarMensajePersuasion() {
        mensajePersuasion.textContent = [
            "¿Estás segura? ¡Piénsalo bien!",
            "¡Vamos, dale otra oportunidad!",
            "Mi corazón se romperá si dices que no",
            "Eres la mujer de mis sueños",
            "¡No me rechaces! Te amo"
        ][contadorNoClicks - 1];

        mensajePersuasion.classList.add('mostrar');

        setTimeout(() => {
            mensajePersuasion.classList.remove('mostrar');
        }, 2000);
    }

    audioControl.addEventListener('click', function () {
        if (musicaReproduciendo) {
            backgroundMusic.pause();
            celebrationMusic.pause();
            audioControl.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            if (modal.classList.contains('activo')) {
                celebrationMusic.play();
            } else {
                backgroundMusic.play();
            }
            audioControl.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        musicaReproduciendo = !musicaReproduciendo;
    });

    function moverBotonNo() {
        if (isTouchDevice) {
            const contenedor = document.querySelector('.botones-contenedor');
            const contenedorRect = contenedor.getBoundingClientRect();
            // Safer bounds
            const maxX = contenedorRect.width - botonNo.offsetWidth;
            const maxY = contenedorRect.height - botonNo.offsetHeight;

            const x = Math.max(0, Math.random() * maxX);
            const y = Math.max(0, Math.random() * maxY);

            botonNo.style.position = 'absolute';
            botonNo.style.left = `${x}px`;
            botonNo.style.top = `${y}px`;
        } else {
            // Safer screen bounds with padding
            const padding = 50;
            const maxX = window.innerWidth - botonNo.offsetWidth - padding;
            const maxY = window.innerHeight - botonNo.offsetHeight - padding;

            const x = Math.max(padding, Math.random() * maxX);
            const y = Math.max(padding, Math.random() * maxY);

            botonNo.style.position = 'fixed';
            botonNo.style.left = `${x}px`;
            botonNo.style.top = `${y}px`;
        }
        contadorNoClicks++;
        mostrarMensajePersuasion();

        const imagenId = obtenerImagenUnica();
        mostrarImagen(imagenId);

        if (contadorNoClicks >= 5) {
            botonNo.style.display = 'none';
            botonSi.style.padding = '25px 70px';
            botonSi.style.fontSize = '1.6rem';
            setTimeout(() => {
                mensajePersuasion.textContent = "¡Ahora no tienes opción! ¡Tienes que decir que sí!";
                mensajePersuasion.classList.add('mostrar');
                setTimeout(() => {
                    mensajePersuasion.classList.remove('mostrar');
                }, 3000);
            }, 1000);
        }
    }

    botonSi.addEventListener('click', function () {
        mostrarImagen(6);
        modal.classList.add('activo');
        if (musicaReproduciendo) {
            fadeAudio(backgroundMusic, celebrationMusic);
            audioControl.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        detenerLluviaCorazones();

        // Canvas Confetti Effect
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        if (!musicaReproduciendo) {
            celebrationMusic.play();
            musicaReproduciendo = true;
            audioControl.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    });

    if (isTouchDevice) {
        let lastMoveTime = 0;
        botonNo.addEventListener('touchstart', function (e) {
            e.preventDefault();
            const currentTime = new Date().getTime();
            if (currentTime - lastMoveTime > 300) {
                moverBotonNo();
                lastMoveTime = currentTime;
            }
        });
    } else {
        botonNo.addEventListener('mouseover', moverBotonNo);
    }

    botonNo.addEventListener('click', function (e) {
        if (!isTouchDevice) {
            e.preventDefault();
            moverBotonNo();
        }
    });

    cerrarModal.addEventListener('click', function () {
        // Redirección a WhatsApp
        const numeroTelefono = "51906954985";
        const fecha = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });
        const mensaje = `¡Hola! Soy Maria Angelita y... ¡SÍ, ACEPTO SER TU NOVIA! 💖 (Fecha: ${fecha})`;
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroTelefono}&text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, '_blank');

        modal.classList.remove('activo');
        if (musicaReproduciendo) {
            celebrationMusic.pause();
            backgroundMusic.play();
        }
    });

    crearRosasDecorativas();
    iniciarLluviaCorazones();
    setInterval(crearFlores, 1000);

    audioControl.innerHTML = '<i class="fas fa-volume-mute"></i>';
});