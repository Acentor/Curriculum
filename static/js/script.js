const menus     = document.querySelectorAll('.menu');
const infoBox   = document.getElementById('infoBox');
const infoText  = document.getElementById('infoText');
const infoTitle = document.getElementById('infoTitle');
const infoImg   = document.getElementById('infoImg');
const hideBtn   = document.getElementById('hideBtn');

infoImg.addEventListener('error', () => {
    infoImg.style.display = 'none';
});


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

        infoTitle.textContent = e.target.textContent;
        infoText.innerHTML = e.target.dataset.info;

        const sectionId = e.target.dataset.section; 
        if (sectionId) {
            updateURL(sectionId); 
        }

        const url = e.target.dataset.img;
        if (url) {
            infoImg.style.display = 'block';
            infoImg.src = url;
        } else {
            infoImg.style.display = 'none';
            infoImg.removeAttribute('src');
        }

        infoBox.style.display = 'block';

        setTimeout(() => {
            infoBox.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            infoBox.focus();
        }, 100);
    });
});

hideBtn.addEventListener('click', () => {
    infoBox.style.display = 'none';
    limpiarSelecciones();
    
    updateURL(null);
    
    const tarjeta = document.getElementById('tarjeta');
    if (tarjeta) {
        const y = tarjeta.getBoundingClientRect().top + window.scrollY;
        smoothScrollTo(y, 1200);
        tarjeta.focus();
    }
});

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

document.addEventListener('DOMContentLoaded', handleDirectNavigation);


const btn = document.getElementById("button");

document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();

  btn.value = "Sending...";

  const serviceID = "default_service";
  const templateID = "template_jfpjh7b";

  emailjs.sendForm(serviceID, templateID, this).then(
    () => {
      btn.value = "Send Email";
      alert("Sent!");
    },
    (err) => {
      btn.value = "Send Email";
      alert(JSON.stringify(err));
    },
  );
});