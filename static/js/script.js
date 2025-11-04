document.addEventListener('DOMContentLoaded', () => {

    const btn = document.getElementById("button");
    const form = document.getElementById("form");
    const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateForm = () => {
        const title = document.getElementById('title')?.value.trim() || '';
        const name = document.getElementById('name')?.value.trim() || '';
        const message = document.getElementById('message')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';

        const errors = [];

        if (title === '') errors.push('El campo Título es obligatorio.');
        if (name === '') errors.push('El campo Nombre es obligatorio.');
        if (message === '') errors.push('El campo Mensaje es obligatorio.');
        if (email === '') {
            errors.push('El campo Email es obligatorio.');
        } else if (!emailRegExp.test(email)) {
            errors.push('El formato del Email no es válido. Debe ser: usuario@dominio.com');
        }

        if (errors.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Errores de Validación',
                html: errors.join('<br>'),
                confirmButtonText: 'Corregir'
            });
            return false;
        }

        return true;
    };

    if (form && btn) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            if (!validateForm()) return;

            btn.value = "Enviando...";
            const serviceID = "default_service";
            const templateID = "template_jfpjh7b";

            emailjs.sendForm(serviceID, templateID, this).then(
                () => {
                    btn.value = "Enviar Mensaje";
                    Swal.fire({
                        title: "Mensaje Enviado, Gracias por su Contacto",
                        icon: "success",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            form.reset();
                            window.location.href = "../index.html";
                        }
                    });
                },
                (err) => {
                    btn.value = "Enviar Mensaje";
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: 'Error al enviar el mensaje: ' + JSON.stringify(err),
                    });
                }
            );
        });
    }

    const menus = document.querySelectorAll('.menu');
    const infoBox = document.getElementById('infoBox');
    const infoText = document.getElementById('infoText');
    const infoTitle = document.getElementById('infoTitle');
    const infoImg = document.getElementById('infoImg');
    const hideBtn = document.getElementById('hideBtn');

    if (infoImg) {
        infoImg.addEventListener('error', () => {
            infoImg.style.display = 'none';
        });
    }

    function getURLParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function updateURL(sectionId) {
        const url = new URL(window.location);
        if (sectionId) {
            url.searchParams.set('section', sectionId);
        } else {
            url.searchParams.delete('section');
        }
        window.history.replaceState({}, '', url);
    }

    function smoothScrollTo(targetY, duration = 1000) {
        const startY = window.scrollY;
        const diff = targetY - startY;
        let start;

        function step(timestamp) {
            if (!start) start = timestamp;
            const time = timestamp - start;
            const percent = Math.min(time / duration, 1);

            const easing = percent < 0.5
                ? 2 * percent * percent
                : -1 + (4 - 2 * percent) * percent;

            window.scrollTo(0, startY + diff * easing);

            if (time < duration) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    let modoBionicoActivo = false;
    const contenidosOriginales = new Map();

    function guardarContenidoOriginal(elemento) {
        if (!contenidosOriginales.has(elemento)) {
            contenidosOriginales.set(elemento, elemento.innerHTML);
        }
    }

    function aplicarLecturaBionicaATexto(texto) {
        const partes = texto.split(/(\s+)/);
        return partes.map(parte => {
            if (parte.match(/^\s+$/) || parte.trim() === '') return parte;
            const longitud = parte.length;
            const puntoCorte = Math.ceil(longitud * 0.40);
            const parteNegrita = parte.substring(0, puntoCorte);
            const parteNormal = parte.substring(puntoCorte);
            return `<strong>${parteNegrita}</strong>${parteNormal}`;
        }).join('');
    }

    function procesarNodosTexto(contenedor) {
        const excluidos = [
            'STRONG', 'B', 'EM', 'I',
            'A', 'BUTTON', 'SCRIPT', 'STYLE',
            'SELECT', 'TEXTAREA', 'INPUT'
        ];

        const walker = document.createTreeWalker(contenedor, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;

                const parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;

                if (excluidos.includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
                
                if (parent.classList.contains('tooltip')) return NodeFilter.FILTER_REJECT;
                
                if (parent.closest('.tooltip')) return NodeFilter.FILTER_REJECT;

                if (parent.closest('a') || parent.closest('button')) return NodeFilter.FILTER_REJECT;

                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const nodos = [];
        let nodo;
        while (nodo = walker.nextNode()) {
            nodos.push(nodo);
        }

        nodos.forEach(nodoTexto => {
            const texto = nodoTexto.textContent;
            const nuevoHTML = aplicarLecturaBionicaATexto(texto);
            const span = document.createElement('span');
            span.innerHTML = nuevoHTML;
            nodoTexto.parentNode.replaceChild(span, nodoTexto);
        });
    }

    function restaurarInfoBox() {
        if (infoTitle && contenidosOriginales.has(infoTitle)) {
            infoTitle.innerHTML = contenidosOriginales.get(infoTitle);
            contenidosOriginales.delete(infoTitle);
        }
        if (infoText && contenidosOriginales.has(infoText)) {
            infoText.innerHTML = contenidosOriginales.get(infoText);
            contenidosOriginales.delete(infoText);
        }
    }

    function limpiarSelecciones() {
        menus.forEach(menu =>
            [...menu.children].forEach(li => li.classList.remove('selected'))
        );
    }

    function smoothScrollTo(targetY, duration = 1000) {
        const startY = window.scrollY;
        const diff = targetY - startY;
        let start;

        function step(timestamp) {
            if (!start) start = timestamp;
            const time = timestamp - start;
            const percent = Math.min(time / duration, 1);

            const easing = percent < 0.5
                ? 2 * percent * percent
                : -1 + (4 - 2 * percent) * percent;

            window.scrollTo(0, startY + diff * easing);

            if (time < duration) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    function aplicarBionicoAElemento(elemento) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = elemento.innerHTML;
        procesarNodosTexto(tempDiv);
        elemento.innerHTML = tempDiv.innerHTML;
    }

    function restaurarContenidoOriginal(elemento) {
        if (contenidosOriginales.has(elemento)) {
            elemento.innerHTML = contenidosOriginales.get(elemento);
            contenidosOriginales.delete(elemento);
        }
    }

    function aplicarBionicoATodosLosContenedores() {
        const contenedores = [
            document.querySelector('header h1'),
            document.querySelector('header h3'),
            ...document.querySelectorAll('.amenu'),
            document.querySelector('#nota'),
            ...document.querySelectorAll('.tarjeta'),
            ...document.querySelectorAll('.tarjeta2')
        ].filter(el =>
            el !== null &&
            !el.classList.contains('botonPerfil') &&
            !el.classList.contains('tooltip') &&
            el.tagName !== 'A' &&
            el.tagName !== 'BUTTON'
        );

        const unicos = Array.from(new Set(contenedores));
        unicos.forEach(c => {
            guardarContenidoOriginal(c);
            aplicarBionicoAElemento(c);
        });

        if (infoBox && infoBox.style.display !== 'none') {
            if (infoText && infoText.innerHTML) {
                guardarContenidoOriginal(infoText);
                aplicarBionicoAElemento(infoText);
            }
            if (infoTitle && infoTitle.innerHTML) {
                guardarContenidoOriginal(infoTitle);
                aplicarBionicoAElemento(infoTitle);
            }
        }
        document.body.classList.add('bionic-active');
        modoBionicoActivo = true;
    }

    function desactivarBionicoEnTodosLosContenedores() {
        const contenedores = [
            document.querySelector('header h1'),
            document.querySelector('header h3'),
            ...document.querySelectorAll('.amenu'),
            document.querySelector('#nota'),
            ...document.querySelectorAll('.tarjeta'),
            ...document.querySelectorAll('.tarjeta2'),
            document.getElementById('infoText'),
            document.getElementById('infoTitle')
        ].filter(el => el !== null);

        const unicos = Array.from(new Set(contenedores));
        unicos.forEach(c => restaurarContenidoOriginal(c));
        document.body.classList.remove('bionic-active');
        modoBionicoActivo = false;
    }

    menus.forEach(menu => {
        menu.addEventListener('click', e => {
            if (!(e.target.tagName === 'BUTTON' || e.target.classList.contains('seleccion'))) return;

            limpiarSelecciones();
            e.target.classList.add('selected');

            restaurarInfoBox();

            const contenidoOriginal = e.target.dataset.info;
            const tituloOriginal = e.target.textContent;

            if (infoTitle) infoTitle.innerHTML = tituloOriginal;
            if (infoText) infoText.innerHTML = contenidoOriginal;

            const sectionId = e.target.dataset.section;
            if (sectionId) updateURL(sectionId);

            const url = e.target.dataset.img;
            if (url && infoImg) {
                infoImg.style.display = 'block';
                infoImg.src = url;
            } else if (infoImg) {
                infoImg.style.display = 'none';
                infoImg.removeAttribute('src');
            }

            if (modoBionicoActivo) {
                setTimeout(() => {
                    if (infoText && contenidoOriginal) {
                        guardarContenidoOriginal(infoText);
                        aplicarBionicoAElemento(infoText);
                    }
                    if (infoTitle && tituloOriginal) {
                        guardarContenidoOriginal(infoTitle);
                        aplicarBionicoAElemento(infoTitle);
                    }
                }, 100);
            }

            if (infoBox) {
                infoBox.style.display = 'block';
                setTimeout(() => {
                    infoBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    infoBox.focus();
                }, 100);
            }
        });
    });

    if (hideBtn) {
        hideBtn.addEventListener('click', () => {
            if (infoBox) infoBox.style.display = 'none';
            limpiarSelecciones();
            updateURL(null);
            restaurarInfoBox();

            const tarjeta = document.getElementById('tarjeta');
            if (tarjeta) {
                const y = tarjeta.getBoundingClientRect().top + window.scrollY;
                smoothScrollTo(y, 1200);
                tarjeta.focus();
            }
        });
    }

    const fuenteSelect = document.getElementById('fuente-select');
    const cuerpo = document.body;

    if (fuenteSelect) {
        fuenteSelect.addEventListener('change', (event) => {
            const valorFuente = (event.target.value || '').trim();
            cuerpo.style.fontFamily = valorFuente;

            const esPredefinida = valorFuente.includes('Noto Sans');
            const esBionica = valorFuente.includes('Gill Sans');
            const esAtkinson = valorFuente.includes('Atkinson Hyperlegible');
            const esDilexia = valorFuente.includes('OpenDyslexic');

            if (esPredefinida) {
                cuerpo.classList.remove('fuente-alternativa');
                cuerpo.style.fontSize = '';
                cuerpo.style.fontWeight = '';
                desactivarBionicoEnTodosLosContenedores();
            } else {
                cuerpo.classList.add('fuente-alternativa');
                
                if (esAtkinson) {
                    cuerpo.style.fontSize = '1.5em';
                    cuerpo.style.fontWeight = 'bold';
                } else {
                    cuerpo.style.fontSize = '';
                    cuerpo.style.fontWeight = '';
                }
            }

            if (esBionica) {
                aplicarBionicoATodosLosContenedores();
            }
            if (esDilexia || esAtkinson) {
                desactivarBionicoEnTodosLosContenedores();
            }
        });
    }

    const btnModoInverso = document.getElementById('modoInversoBtn');
    const root = document.documentElement;
    let modoInverso = false;

    const coloresOriginales = {
        '--slate-blue': getComputedStyle(root).getPropertyValue('--slate-blue'),
        '--eminence': getComputedStyle(root).getPropertyValue('--eminence'),
        '--licorice': getComputedStyle(root).getPropertyValue('--licorice'),
        '--raisin-black': getComputedStyle(root).getPropertyValue('--raisin-black'),
        '--space-cadet-2': getComputedStyle(root).getPropertyValue('--space-cadet-2'),
        '--delft-blue': getComputedStyle(root).getPropertyValue('--delft-blue'),
        '--dark-purple': getComputedStyle(root).getPropertyValue('--dark-purple'),
        '--green-blue': getComputedStyle(root).getPropertyValue('--green-blue'),
        '--red-purple': getComputedStyle(root).getPropertyValue('--red-purple'),
        '--red-purple2': getComputedStyle(root).getPropertyValue('--red-purple2'),
        '--blue-dark': getComputedStyle(root).getPropertyValue('--blue-dark'),
        '--negro': getComputedStyle(root).getPropertyValue('--negro'),
        '--blanco': getComputedStyle(root).getPropertyValue('--blanco')
    };

    if (btnModoInverso) {
        btnModoInverso.addEventListener('click', () => {
            modoInverso = !modoInverso;

            // ✅ Activar/desactivar clase en <body>
            document.body.classList.toggle('inverso', modoInverso);

            if (modoInverso) {
                // Cambiar colores a tonos claros/invertidos
                root.style.setProperty('--slate-blue', '#ffb3c1');
                root.style.setProperty('--eminence', '#ff9bff');
                root.style.setProperty('--licorice', '#7b41b6ff');
                root.style.setProperty('--raisin-black', '#dddddd');
                root.style.setProperty('--space-cadet-2', '#222222');
                root.style.setProperty('--dark-purple', '#f4d9ff');
                root.style.setProperty('--negro', 'whitesmoke');
                root.style.setProperty('--blanco', 'black');
            } else {
                Object.entries(coloresOriginales).forEach(([variable, valor]) => {
                    root.style.setProperty(variable, valor);
                });
            }
        });
    }
});