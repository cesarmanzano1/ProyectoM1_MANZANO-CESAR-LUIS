const boton = document.getElementById("generar");
const colores = document.querySelectorAll(".color");
const radios = document.querySelectorAll(".colores-input");
const botonGuardar = document.querySelector(".boton_guardar_color");
const listaGuardados = document.getElementById("lista-guardados");
const botonEliminar = document.querySelector(".button_eliminar");
const infoColor = document.getElementById("info-color");


   colores.forEach(color => {

    color.addEventListener("mouseenter", () => {

        infoColor.textContent =
            `HEX: ${color.dataset.hex} | HSL: ${color.dataset.hsl}`;

    });

    color.addEventListener("mouseleave", () => {

        if (!color.classList.contains("bloqueado")) {
            infoColor.textContent = "Más de 5000 colores guardados";
        }

    });

});

let coloresGuardados = [];

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


function hexAHSL(hex) {

    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);

    let h, s;
    let l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {

        let d = max - min;

        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {

            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;

            case g:
                h = (b - r) / d + 2;
                break;

            case b:
                h = (r - g) / d + 4;
                break;

        }

        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `(${h}, ${s}%, ${l}%)`;
}

// Genera la paleta
function generarPaleta() {

    colores.forEach(color => {

        // Si está oculto, no genera color
        if (color.style.display === "none") return;

        // Si está bloqueado, tampoco
        if (color.classList.contains("bloqueado")) return;

        const nuevoColor = generarColor();
        const hsl = hexAHSL(nuevoColor);


        color.style.background = nuevoColor;
        color.style.color = colorTexto(nuevoColor);

   

        // Guardamos los datos en atributos
        color.dataset.hex = nuevoColor;
        color.dataset.hsl = hsl;

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

        if (color.classList.contains("bloqueado")) {

            infoColor.textContent =
                `HEX: ${color.dataset.hex} | HSL: ${color.dataset.hsl}`;

        } else {

            infoColor.textContent = "Más de 5000 colores guardados";

        }

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
const seleccionado = document.querySelector(".colores-input:checked");

actualizarCantidadColores(Number(seleccionado.value));
generarPaleta();


/*/ Guardar colores bloqueados
botonGuardar.addEventListener("click", () => {

    document.querySelectorAll(".color.bloqueado").forEach(color => {

        const hex = color.dataset.hex;

        // Evita repetir colores
        if (!coloresGuardados.includes(hex)) {
            coloresGuardados.push(hex);
        }

    });

    mostrarGuardados();

});*/
botonGuardar.addEventListener("click", () => {

    console.log("Guardando...");

    document.querySelectorAll(".color.bloqueado").forEach(color => {

        console.log(color.dataset.hex);

        const hex = color.dataset.hex;

        if (!coloresGuardados.includes(hex)) {
            coloresGuardados.push(hex);
        }
    });

    console.log(coloresGuardados);

    mostrarGuardados();
});

function mostrarGuardados() {

    listaGuardados.innerHTML = "";

    coloresGuardados.forEach(hex => {

        const item = document.createElement("button");

        item.className = "item-color";
        item.style.setProperty("--color", hex);
        item.style.setProperty("--text-color", colorTexto(hex));

        item.setAttribute("aria-color", hex);

        // Seleccionar
        item.addEventListener("click", () => {
            item.classList.toggle("seleccionado");
        });

        // Copiar con doble clic
        item.addEventListener("dblclick", async (e) => {

            e.preventDefault();
            e.stopPropagation();

            try {
                await navigator.clipboard.writeText(hex);

                item.classList.remove("seleccionado");

                item.setAttribute("aria-color", "✅ Copiado");

                setTimeout(() => {
                    item.setAttribute("aria-color", hex);
                }, 1200);

            } catch (error) {
                console.error(error);
            }

        });

        listaGuardados.appendChild(item);

    });

}
botonEliminar.addEventListener("click", () => {

    const seleccionados = document.querySelectorAll(".item-color.seleccionado");

    seleccionados.forEach(item => {

        const hex = item.getAttribute("aria-color");

        coloresGuardados = coloresGuardados.filter(c => c !== hex);

    });

    mostrarGuardados();

});