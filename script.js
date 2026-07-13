const boton = document.getElementById("generar");
const colores = document.querySelectorAll(".color");
const radios = document.querySelectorAll(".radio-input");

function generarColor() {
    return "#" + Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
        .toUpperCase();
}

function colorTexto(hex) {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);

    const brillo = (r * 299 + g * 587 + b * 114) / 1000;

    return brillo > 150 ? "#000" : "#FFF";
}

// Genera la paleta
function generarPaleta() {

    colores.forEach(color => {

        // Si está oculto, no genera color
        if (color.style.display === "none") return;

        // Si está bloqueado, tampoco
        if (color.classList.contains("bloqueado")) return;

        const nuevoColor = generarColor();

        color.style.background = nuevoColor;
        color.style.color = colorTexto(nuevoColor);
        color.querySelector("span").textContent = nuevoColor;

    });

}

// Muestra la cantidad elegida
function actualizarCantidadColores(cantidad) {

    colores.forEach((color, indice) => {

        if (indice < cantidad) {
            color.style.display = "flex";
        } else {
            color.style.display = "none";
        }

    });

}

// Botón Generar
boton.addEventListener("click", generarPaleta);

// Bloquear colores
colores.forEach(color => {

    color.addEventListener("click", () => {

        color.classList.toggle("bloqueado");

    });

});

// Cambiar entre 6, 8 y 9 colores
radios.forEach(radio => {

    radio.addEventListener("change", () => {

        actualizarCantidadColores(Number(radio.value));
        generarPaleta(); // genera nuevos colores automáticamente

    });

});

// Configuración inicial
const seleccionado = document.querySelector(".radio-input:checked");

actualizarCantidadColores(Number(seleccionado.value));
generarPaleta();