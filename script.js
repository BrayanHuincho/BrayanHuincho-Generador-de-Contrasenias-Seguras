const longitudInput = document.getElementById("longitud");
const slider = document.getElementById("slider");
const incluirMayusculas = document.getElementById("mayusculas");
const incluirMinusculas = document.getElementById("minusculas");
const incluirNumeros = document.getElementById("numeros");
const incluirSimbolos = document.getElementById("simbolos");
const generarBtn = document.getElementById("generar");
const contraseñaOutput = document.getElementById("contraseña");
const iconoCopiar = document.getElementById("icono-copiar");
const palabraFraseInput = document.getElementById("nombre-contrasena");
const facilidadDecir = document.getElementById("facil-decir");
const facilidadLeer = document.getElementById("facil-leer");
const todosCaracteres = document.getElementById("todos-caracteres");
const themeToggle = document.getElementById('theme-toggle');
const passwordStrength = document.getElementById("password-strength");
const validationMessage = document.getElementById("validation-message");

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    const longitudInicial = Math.max(parseInt(longitudInput.value), 4); 
    longitudInput.value = longitudInicial;
    slider.value = longitudInicial;
    actualizarOpcionesFacilidad();
});

palabraFraseInput.addEventListener("input", () => {
    if (palabraFraseInput.value.length > 0 && palabraFraseInput.value.length < 4) {
        validationMessage.textContent = "La frase debe tener al menos 4 caracteres";
    } else {
        validationMessage.textContent = "";
    }
    actualizarLongitudMinima();
});

function actualizarFuerzaContraseña(contraseña) {
    const longitud = contraseña.length;
    const tieneMayusculas = /[A-Z]/.test(contraseña);
    const tieneNumeros = /[0-9]/.test(contraseña);
    const tieneSimbolos = /[!@#$%^&*]/.test(contraseña);

    if (longitud >= 20 && tieneMayusculas && tieneNumeros && tieneSimbolos) {
        passwordStrength.textContent = "Fuerza: Fuerte";
        passwordStrength.style.color = "green";
    } else if (longitud >= 10 && longitud <= 19 && ((tieneMayusculas && tieneNumeros) || (tieneMayusculas && tieneSimbolos) || (tieneNumeros && tieneSimbolos))) {
        passwordStrength.textContent = "Fuerza: Media";
        passwordStrength.style.color = "orange";
    } else if (longitud >= 4 && longitud <= 9) {
        passwordStrength.textContent = "Fuerza: Débil";
        passwordStrength.style.color = "red";
    } else {
        passwordStrength.style.display = "none";
    }
}

longitudInput.disabled = true; 

slider.addEventListener("input", (e) => {
    longitudInput.value = e.target.value;
});

function actualizarLongitudMinima() {
    const longitudFrase = palabraFraseInput.value.length;
    const longitudMinima = longitudFrase > 0 ? longitudFrase + 1 : 4;
    longitudInput.min = longitudMinima;
    slider.min = longitudMinima;

    if (parseInt(longitudInput.value) < longitudMinima) {
        longitudInput.classList.add("input-warning");
        slider.classList.add("slider-warning");
        mostrarErrorPopup("La longitud de la contraseña debe ser mayor que la frase incluida");
    } else {
        longitudInput.classList.remove("input-warning");
        slider.classList.remove("slider-warning");
        const errorMessage = document.getElementById("error-popup");
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

function mostrarErrorPopup(mensaje) {
    if (!document.getElementById("error-popup")) {
        const errorPopup = document.createElement("div");
        errorPopup.id = "error-popup";
        errorPopup.classList.add("error-popup");
        
        const icon = document.createElement("span");
        icon.classList.add("icon");
        icon.textContent = "⚠️";
        
        errorPopup.appendChild(icon);
        errorPopup.appendChild(document.createTextNode(mensaje));
        document.body.appendChild(errorPopup);

        setTimeout(() => {
            errorPopup.style.opacity = "0";
            errorPopup.style.transform = "translateX(-50%) translateY(-10px)";
        }, 3000);

        setTimeout(() => {
            errorPopup.remove();
        }, 3500);
    }
}

function actualizarOpcionesFacilidad() {
    if (facilidadDecir.checked) {
        incluirMayusculas.checked = true;
        incluirMinusculas.checked = true;
        incluirNumeros.checked = false;
        incluirSimbolos.checked = false;
        incluirMayusculas.disabled = false;
        incluirMinusculas.disabled = false;
        incluirNumeros.disabled = true;
        incluirSimbolos.disabled = true;
    } else if (facilidadLeer.checked || todosCaracteres.checked) {
        incluirMayusculas.checked = true;
        incluirMinusculas.checked = true;
        incluirNumeros.checked = true;
        incluirSimbolos.checked = true;
        incluirMayusculas.disabled = false;
        incluirMinusculas.disabled = false;
        incluirNumeros.disabled = false;
        incluirSimbolos.disabled = false;
    }
}

// Event listeners para opciones de facilidad
facilidadDecir.addEventListener("change", actualizarOpcionesFacilidad);
facilidadLeer.addEventListener("change", actualizarOpcionesFacilidad);
todosCaracteres.addEventListener("change", actualizarOpcionesFacilidad);

// Función para generar la contraseña
function generarContraseña(longitud, usarMayusculas, usarMinusculas, usarNumeros, usarSimbolos, palabraFrase) {
    const minusculas = "abcdefghijklmnopqrstuvwxyz";
    const mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numeros = "0123456789";
    const simbolos = "!@#$%^&*()_+{}:<>?";
    let caracteresDisponibles = "";

    if (usarMayusculas) caracteresDisponibles += mayusculas;
    if (usarMinusculas) caracteresDisponibles += minusculas;
    if (usarNumeros) caracteresDisponibles += numeros;
    if (usarSimbolos) caracteresDisponibles += simbolos;

    if (!caracteresDisponibles) {
        return "Selecciona al menos una opción";
    }

    let contraseña = "";
    for (let i = 0; i < longitud - palabraFrase.length; i++) {
        const indexAleatorio = Math.floor(Math.random() * caracteresDisponibles.length);
        contraseña += caracteresDisponibles[indexAleatorio];
    }

    const posicionAleatoria = Math.floor(Math.random() * (contraseña.length + 1));
    contraseña = contraseña.slice(0, posicionAleatoria) + palabraFrase + contraseña.slice(posicionAleatoria);
    return contraseña;
}

generarBtn.addEventListener("click", () => {
    const longitud = parseInt(longitudInput.value);
    const usarMayusculas = incluirMayusculas.checked;
    const usarMinusculas = incluirMinusculas.checked;
    const usarNumeros = incluirNumeros.checked;
    const usarSimbolos = incluirSimbolos.checked;
    const palabraFrase = palabraFraseInput.value;

    if (longitud <= palabraFrase.length) {
        actualizarLongitudMinima();
        return;
    }

    const contraseña = generarContraseña(longitud, usarMayusculas, usarMinusculas, usarNumeros, usarSimbolos, palabraFrase);
    contraseñaOutput.textContent = contraseña;

    passwordStrength.style.display = "block";
    actualizarFuerzaContraseña(contraseña);
});

iconoCopiar.addEventListener("click", () => {
    const texto = contraseñaOutput.textContent;
    if (texto && texto !== "Aquí aparecerá tu contraseña generada") {
        navigator.clipboard.writeText(texto).then(() => {
            mostrarMensaje("Copiado", "copy-message");
        });
    } else {
        mostrarMensaje("Primero genera una contraseña", "error-message");
    }
});

function mostrarMensaje(texto, clase) {
    const mensaje = document.createElement("span");
    mensaje.textContent = texto;
    mensaje.className = clase;
    iconoCopiar.parentElement.appendChild(mensaje);

    setTimeout(() => {
        mensaje.style.opacity = "0";
        setTimeout(() => mensaje.remove(), 300);
    }, 1500);
}