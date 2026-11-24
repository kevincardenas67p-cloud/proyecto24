
const historias = document.getElementById("historias");
const inputImagen = document.getElementById("imagen");
const visor = document.getElementById("visor");
const imagenGrande = document.getElementById("imagenGrande");

// Tiempo de duración de las historias
// Para probar: 1 minuto
// Para producción: 24 horas

const TIEMPO_HISTORIA = 24 * 60 * 60 * 1000;

// Para hacer pruebas, cambia la línea anterior por:
// const TIEMPO_HISTORIA = 60 * 1000;

let listaHistorias = [];
let posicion = 0;

// Cargar historias guardadas
function cargarHistorias() {

    listaHistorias = JSON.parse(localStorage.getItem("historias")) || [];

    const ahora = Date.now();

    // Eliminar historias vencidas
    listaHistorias = listaHistorias.filter(historia => {
        return ahora - historia.fecha < TIEMPO_HISTORIA;
    });

    guardarHistorias();
    mostrarHistorias();
}

// Guardar en localStorage
function guardarHistorias() {
    localStorage.setItem("historias", JSON.stringify(listaHistorias));
}

// Subir imagen
inputImagen.addEventListener("change", function () {

    const archivo = this.files[0];

    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
        alert("Selecciona una imagen válida");
        return;
    }

    const lector = new FileReader();

    lector.onload = function (evento) {

        const imagen = new Image();

        imagen.onload = function () {

            const canvas = document.createElement("canvas");

            let ancho = imagen.width;
            let alto = imagen.height;

            // Limitar imagen a 1080 x 1920
            const escala = Math.min(
                1080 / ancho,
                1920 / alto,
                1
            );

            ancho = Math.round(ancho * escala);
            alto = Math.round(alto * escala);

            canvas.width = ancho;
            canvas.height = alto;

            const contexto = canvas.getContext("2d");

            contexto.drawImage(imagen, 0, 0, ancho, alto);

            const imagenBase64 = canvas.toDataURL("image/jpeg", 0.8);

            const nuevaHistoria = {
                imagen: imagenBase64,
                fecha: Date.now()
            };

            listaHistorias.push(nuevaHistoria);

            guardarHistorias();
            mostrarHistorias();

            alert("¡Historia publicada!");
        };

        imagen.src = evento.target.result;
    };

    lector.readAsDataURL(archivo);

    this.value = "";
});

// Mostrar historias
function mostrarHistorias() {

    historias.innerHTML = `
        <div class="historia agregar"
        onclick="document.getElementById('imagen').click()">

            <div class="circulo">
                <span>+</span>
            </div>

            <p>Agregar</p>
        </div>
    `;

    listaHistorias.forEach((historia, indice) => {

        const elemento = document.createElement("div");

        elemento.className = "historia";

        elemento.innerHTML = `
            <div class="circulo">
                <img src="${historia.imagen}" alt="Historia">
            </div>
            <p>Historia ${indice + 1}</p>
        `;

        elemento.onclick = function () {
            abrirHistoria(indice);
        };

        historias.appendChild(elemento);
    });
}

// Abrir historia
function abrirHistoria(indice) {

    posicion = indice;

    imagenGrande.src = listaHistorias[posicion].imagen;

    visor.style.display = "flex";
}

// Cerrar historia
function cerrarHistoria() {
    visor.style.display = "none";
}

// Historia siguiente
function siguiente() {

    if (posicion < listaHistorias.length - 1) {
        posicion++;
    } else {
        posicion = 0;
    }

    abrirHistoria(posicion);
}

// Historia anterior
function anterior() {

    if (posicion > 0) {
        posicion--;
    } else {
        posicion = listaHistorias.length - 1;
    }

    abrirHistoria(posicion);
}

// Revisar historias cada segundo
setInterval(cargarHistorias, 1000);

// Iniciar aplicación
cargarHistorias();
