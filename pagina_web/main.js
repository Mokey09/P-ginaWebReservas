
function buscar() {
    const entrada = document.getElementById("entrada");
    const salida = document.getElementById("salida");
    const personas = document.getElementById("personas");

    if (!entrada || !salida) {
        alert("Selecciona fechas");
        return;
    }

    localStorage.setItem("entrada", entrada.value);
    localStorage.setItem("salida", salida.value);
    localStorage.setItem("personas", personas.value || 1);

    window.location.href = "reservas.html";
}

function actualizarContador() {
    const cartCountElement = document.getElementById("cartCount");
    if (cartCountElement) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        cartCountElement.textContent = carrito.length;
    }
}

function mostrarCarritoNavbar() {
    const contenedor = document.getElementById("carritoDropdown");
    if (contenedor) {
        contenedor.style.display = contenedor.style.display === "none" ? "block" : "none";
        renderCarritoNavbar();
    }
}

function renderCarritoNavbar() {

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const contenedor = document.getElementById("carritoContenido");

    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>No hay habitaciones en el carrito.</p>";
        return;
    }

    let totalFinal = 0;

    carrito.forEach((item, index) => {

        totalFinal += Number(item.totalNumero) || 0;

        contenedor.innerHTML += `
            <div class="border p-2 mb-2 bg-white">
                <strong>${item.nombre}</strong><br>
                ${item.entrada} -> ${item.salida}<br>
                Pensión: ${item.pension}<br>
                ${item.noches}<br>
                ${item.total}<br>

                <button class="btn btn-sm btn-danger mt-1"
                    onclick="eliminarDelCarrito(${index})">
                    Eliminar
                </button>
            </div>
        `;
    });

    contenedor.innerHTML += `
        <div class="border p-3 mt-3 bg-warning-subtle">
            <h5>Total carrito: ${totalFinal}€</h5>
        </div>
        <button class="btn btn-success w-100 mt-2" onclick="finalizarReserva()">
            Finalizar reserva
        </button>
    `;
}

function finalizarReserva(){
    window.location.href = "finalizacionReserva.html";
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarritoNavbar();
    actualizarContador();
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. Siempre actualizar el contador al cargar CUALQUIER página
    actualizarContador();

    // 2. Si estamos en una página con inputs de búsqueda, rellenarlos
    const entrada = document.getElementById("entrada");
    const salida = document.getElementById("salida");
    const personas = document.getElementById("personas");

    const hoy = new Date().toISOString().split('T')[0];
    if (entrada) entrada.setAttribute("min", hoy);
    if (salida) salida.setAttribute("min", hoy);

    if (entrada && salida) {
        entrada.value = localStorage.getItem("entrada") || "";
        salida.value = localStorage.getItem("salida") || "";
        if(personas) personas.value = localStorage.getItem("personas") || 1;
        
        // Solo llamar a actualizarTodo si la función existe (solo en reservas.html)
        if (typeof actualizarTodo === "function") {
            actualizarTodo(); 
        }
    }
});