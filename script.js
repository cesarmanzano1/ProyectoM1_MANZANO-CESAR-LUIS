const boton = document.getElementById("generar");
const colores = document.querySelectorAll(".color");
const radios = document.querySelectorAll(".colores-input");
const botonGuardar = document.querySelector(".boton_guardar_color");
const listaGuardados = document.getElementById("lista-guardados");
const botonEliminar = document.querySelector(".button_eliminar");
const infoColor = document.getElementById("info-color");
const modoColor = document.getElementById("color_mode");

const botonMenu = document.getElementById("menu-toggle");
const menu = document.querySelector(".menu");

botonMenu.addEventListener("click", () => {
    menu.classList.toggle("active");
});

colores.forEach(color => {

    color.addEventListener("mouseenter", () => {

        actualizarEstadoBloqueos();


    });

    color.addEventListener("mouseleave", () => {

        if (!color.classList.contains("bloqueado")) {
            infoColor.textContent = "Más de 5000 colores guardados";
        }

    });

});
colores.forEach(color => {

    color.addEventListener("dblclick", async () => {

        // Valor a copiar según el modo seleccionado
        const valor = modoColor.checked
            ? color.dataset.hex
            : color.dataset.hsl;

        // Guardar siempre el HEX
        if (!coloresGuardados.some(c => c.hex === color.dataset.hex)) {
            /* coloresGuardados.push(color.dataset.hex);*/
            coloresGuardados.push({
                hex: color.dataset.hex,
                hsl: color.dataset.hsl
            });
            mostrarGuardados();
        }

        // Copiar al portapapeles
        try {

            await navigator.clipboard.writeText(valor);

            infoColor.textContent = `✅ ${valor} COPIADO`;

            setTimeout(() => {
                infoColor.textContent = "Más de 5000 colores guardados";
            }, 1200);

        } catch (error) {
            console.error("Error al copiar:", error);
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

function actualizarEstadoBloqueos() {

    const stats = document.getElementById("stats");
    const texto = document.getElementById("info-color");

    const hayBloqueados = [...colores].some(color =>
        color.classList.contains("bloqueado")
    );

    if (hayBloqueados) {
        texto.textContent = "🔓 DESBLOQUEAR TODO";
        stats.classList.add("desbloquear");
    } else {
        texto.textContent = "Más de 5000 colores guardados";
        stats.classList.remove("desbloquear");
    }

}

document.getElementById("stats").addEventListener("click", () => {

    const hayBloqueados = [...colores].some(color =>
        color.classList.contains("bloqueado")
    );

    if (!hayBloqueados) return;

    colores.forEach(color => {
        color.classList.remove("bloqueado");
    });

    actualizarEstadoBloqueos();

});

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
    actualizarCodigos();

}
function actualizarCodigos() {

    const mostrarHex = modoColor.checked;

    colores.forEach(color => {

        if (color.style.display === "none") return;

        const codigo = color.querySelector(".codigo");

        if (mostrarHex) {

            codigo.textContent = color.dataset.hex;

        } else {

            const hsl = color.dataset.hsl
                .replace(/[()]/g, "")
                .split(",");

            codigo.textContent =
                `${hsl[0].trim()}°
${hsl[1].trim()}
${hsl[2].trim()}`;

        }

    });

}
modoColor.addEventListener("change", () => {

    actualizarCodigos();
    mostrarGuardados();

});// Muestra la cantidad elegida
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

        actualizarEstadoBloqueos();


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
actualizarBotonEliminar();/**************************************************** */



botonGuardar.addEventListener("click", () => {

    console.log("Guardando...");

    document.querySelectorAll(".color.bloqueado").forEach(color => {

        console.log(color.dataset.hex);

        const hex = color.dataset.hex;

        if (!coloresGuardados.some(c => c.hex === hex)) {

            coloresGuardados.push({
                hex: color.dataset.hex,
                hsl: color.dataset.hsl
            });

        }
    });

    console.log(coloresGuardados);

    mostrarGuardados();
});
function actualizarBotonEliminar() {

    const hayColores = coloresGuardados.length > 0;

    botonEliminar.disabled = !hayColores;
    botonEliminar.classList.toggle("deshabilitado", !hayColores);

}
function mostrarGuardados() {

    listaGuardados.innerHTML = "";

    coloresGuardados.forEach(color => {

        const item = document.createElement("button");

        item.className = "item-color";
        item.style.setProperty("--color", color.hex);
        item.style.setProperty("--text-color", colorTexto(color.hex));

        const valor = modoColor.checked ? color.hex : color.hsl;

        item.setAttribute("aria-color", valor);
        // Seleccionar
        item.addEventListener("click", () => {
            item.classList.toggle("seleccionado");
        });

        // Copiar con doble clic
        item.addEventListener("dblclick", async (e) => {

            e.preventDefault();
            e.stopPropagation();

            try {
                const valor = modoColor.checked
                    ? color.hex
                    : color.hsl;

                await navigator.clipboard.writeText(valor);
                item.classList.remove("seleccionado");

                item.setAttribute("aria-color", "✅ Copiado");

                setTimeout(() => {
                    item.setAttribute("aria-color", valor);
                }, 1200);

            } catch (error) {
                console.error(error);
            }

        });

        listaGuardados.appendChild(item);

    });
    actualizarBotonEliminar();

}
botonEliminar.addEventListener("click", () => {

    const seleccionados = document.querySelectorAll(".item-color.seleccionado");

    seleccionados.forEach(item => {

        const hex = item.style.getPropertyValue("--color");

        coloresGuardados = coloresGuardados.filter(c => c.hex !== hex);
    });

    mostrarGuardados();

});