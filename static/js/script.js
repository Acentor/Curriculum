document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById("button");
    const form = document.getElementById("form");
    
    // Expresión regular simple para validar el formato básico de un email
    // Esta expresión comprueba: algo@algo.dominio
    const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    // Función de validación de formulario
    const validateForm = () => {
        // Obtener los valores de los campos
        const title = document.getElementById('title').value.trim();
        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();
        const email = document.getElementById('email').value.trim();
        
        // Array para almacenar los errores
        const errors = [];

        // 1. Comprobar campos vacíos (Obligatorios)
        if (title === '') {
            errors.push('El campo Título es obligatorio.');
        }
        if (name === '') {
            errors.push('El campo Nombre es obligatorio.');
        }
        if (message === '') {
            errors.push('El campo Mensaje es obligatorio.');
        }
        if (email === '') {
            errors.push('El campo Email es obligatorio.');
        } else {
            // 2. Comprobar formato de email (solo si no está vacío)
            if (!emailRegExp.test(email)) {
                errors.push('El formato del Email no es válido. Debe ser: usuario@dominio.com');
            }
        }
        
        // Si hay errores, mostrar una alerta y detener el envío
        if (errors.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Errores de Validación',
                html: errors.join('<br>'), // Muestra cada error en una línea nueva
                confirmButtonText: 'Corregir'
            });
            return false; // Validación fallida
        }

        return true; // Validación exitosa
    };


    if (form && btn) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            if (!validateForm()) {
                return;
            }
            btn.value = "Sending...";

            const serviceID = "default_service";
            const templateID = "template_jfpjh7b";

            emailjs.sendForm(serviceID, templateID, this).then(
                () => {
                    btn.value = "Send Email";
                    Swal.fire({
                    title: "Mensaje Enviado",
                    icon: "success",
                    }).then((result) => {
                    if (result.isConfirmed) {
                        form.reset(); 
                        window.location.href = "../index.html";
                    }
                    });
                },
                (err) => {
                    btn.value = "Send Email";
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

    menus.forEach(menu => {
        menu.addEventListener('click', e => {
            if (!(e.target.tagName === 'BUTTON' || e.target.classList.contains('seleccion'))) return;

            limpiarSelecciones();
            e.target.classList.add('selected');

            if (infoTitle) infoTitle.textContent = e.target.textContent;
            if (infoText) infoText.innerHTML = e.target.dataset.info;

            const sectionId = e.target.dataset.section;
            if (sectionId) {
                updateURL(sectionId);
            }

            const url = e.target.dataset.img;
            if (url && infoImg) {
                infoImg.style.display = 'block';
                infoImg.src = url;
            } else if (infoImg) {
                infoImg.style.display = 'none';
                infoImg.removeAttribute('src');
            }

            if (infoBox) {
                infoBox.style.display = 'block';
                setTimeout(() => {
                    infoBox.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
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
});