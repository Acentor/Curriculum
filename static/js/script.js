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

    const menus     = document.querySelectorAll('.menu');
    const infoBox   = document.getElementById('infoBox');
    const infoText  = document.getElementById('infoText');
    const infoTitle = document.getElementById('infoTitle');
    const infoImg   = document.getElementById('infoImg');
    const hideBtn   = document.getElementById('hideBtn');

    if (infoImg) {
        infoImg.addEventListener('error', () => {
            infoImg.style.display = 'none';
        });
    }

    function getURLParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function loadSection(sectionId) {
        const targetButton = document.querySelector(`[data-section="${sectionId}"]`);
        if (targetButton) {
            targetButton.click();
            return true;
        }
        return false;
    }

    function handleDirectNavigation() {
        const section = getURLParameter('section');
        if (section) {
            setTimeout(() => {
                loadSection(section);
            }, 100);
        }
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

    function aplicarBionicoAElemento(elemento) {
        const elementosExcluidos = ['SCRIPT', 'STYLE', 'SELECT', 'TEXTAREA', 'IMG', 'INPUT', 'BR', 'HR', 'A'];
        if (elementosExcluidos.includes(elemento.tagName)) return;

        const htmlActual = elemento.innerHTML;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlActual;
        procesarNodosTexto(tempDiv);
        elemento.innerHTML = tempDiv.innerHTML;
    }

    function procesarNodosTexto(contenedor) {
        const elementosDeFormatoExcluidos = ['STRONG', 'B', 'EM', 'I', 'A'];
        
        const walker = document.createTreeWalker(
            contenedor,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
                    const parentTagName = node.parentElement.tagName;
                    
                    const elementosExcluidosGenerales = ['SCRIPT', 'STYLE', 'SELECT', 'TEXTAREA'];
                    if (elementosExcluidosGenerales.includes(parentTagName)) return NodeFilter.FILTER_REJECT;
                    
                    if (elementosDeFormatoExcluidos.includes(parentTagName)) return NodeFilter.FILTER_REJECT;
                    
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodosAReemplazar = [];
        let nodo;
        while (nodo = walker.nextNode()) {
            nodosAReemplazar.push(nodo);
        }

        nodosAReemplazar.forEach(nodoTexto => {
            const texto = nodoTexto.textContent;
            const nuevoHTML = aplicarLecturaBionicaATexto(texto);
            const span = document.createElement('span');
            span.innerHTML = nuevoHTML;
            nodoTexto.parentNode.replaceChild(span, nodoTexto);
        });
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
        ].filter(el => 
            el !== null && 
            !el.classList.contains('botonPerfil') &&
            el.tagName !== 'A'
        );

        const contenedoresUnicos = Array.from(new Set(contenedores));

        contenedoresUnicos.forEach(contenedor => {
            guardarContenidoOriginal(contenedor);
            aplicarBionicoAElemento(contenedor);
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
        modoBionicoActivo = true;
    }

    function desactivarBionicoEnTodosLosContenedores() {
        const contenedores = [
            document.querySelector('header h1'),
            document.querySelector('header h3'),
            ...document.querySelectorAll('.botonPerfil'), 
            ...document.querySelectorAll('.amenu'),
            document.querySelector('#nota'),
            document.getElementById('infoText'),
            document.getElementById('infoTitle'),
            ...document.querySelectorAll('a')
        ].filter(el => el !== null);

        const contenedoresUnicos = Array.from(new Set(contenedores));

        contenedoresUnicos.forEach(contenedor => {
            restaurarContenidoOriginal(contenedor);
        });
        modoBionicoActivo = false;
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
    handleDirectNavigation();

    const fuenteSelect = document.getElementById('fuente-select');
    const cuerpo = document.body;
    const COMIC_SANS_VALUE = "'Gill Sans', Arial";
    const BIONIC_ACTIVE_CLASS = 'bionic-active';

    if (fuenteSelect) {
        fuenteSelect.addEventListener('change', (event) => {
            const valorFuente = event.target.value;
            cuerpo.style.fontFamily = valorFuente;

            if (valorFuente === COMIC_SANS_VALUE) {
                if (!modoBionicoActivo) {
                    aplicarBionicoATodosLosContenedores();
                }
                cuerpo.classList.add(BIONIC_ACTIVE_CLASS);
                cuerpo.style.fontSize = ''; 
                cuerpo.style.fontWeight = '';
            } else {
                if (modoBionicoActivo) {
                    desactivarBionicoEnTodosLosContenedores();
                }
                cuerpo.classList.remove(BIONIC_ACTIVE_CLASS);
                
                if (valorFuente === "'Atkinson Hyperlegible', sans-serif") {
                    cuerpo.style.fontSize = '1.35em';
                    cuerpo.style.fontWeight = 'bold';
                } else {
                    cuerpo.style.fontSize = ''; 
                    cuerpo.style.fontWeight = '';
                }
            }
        });
    }
});