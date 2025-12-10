document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuario) {
        alert("Debes iniciar sesión primero.");
        window.location.href = "login.html";
        return;
    }

    let deudas = JSON.parse(localStorage.getItem("deudas")) || [];
    deudas = deudas.filter(d => d.usuario === usuario.usuario);

    const hoy = new Date();
    const lista = document.getElementById("listaDeudas");
    lista.innerHTML = "";

    deudas.forEach((d, i) => {

        // ⭐ CORRECCIÓN: evitar desfase de zona horaria
        const fechaFin = new Date(d.fechaFin + "T23:59:59");
        const fechaInicio = new Date(d.fechaInicio + "T00:00:00");

        let estado = "";
        let color = "";

        if (d.pagadas >= d.cuotas) {
            estado = "Pagada";
            color = "verde";
        } else {
            const hoySinTiempo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
            const fechaFinSinTiempo = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate());

            const diasRestantes = Math.ceil(
                (fechaFinSinTiempo - hoySinTiempo) / (1000 * 60 * 60 * 24)
            );

            if (diasRestantes < 0) {
                estado = "Vencida";
                color = "rojo";

            } else if (diasRestantes === 0) {
                estado = "Vence esta semana";
                color = "amarillo";

            } else if (diasRestantes <= 7) {
                estado = "Vence esta semana";
                color = "amarillo";

            } else {
                estado = "Pendiente";
                color = "naranja";
            }
        }

        lista.innerHTML += `
            <div class="deuda-card ${color}">
                <h3>${d.banco}</h3>

                <div class="info">
                    <p><strong>Monto total:</strong> S/ ${d.monto.toFixed(2)}</p>
                    <p><strong>Cuota mensual:</strong> S/ ${d.cuota.toFixed(2)}</p>
                    <p><strong>Cuotas pagadas:</strong> ${d.pagadas} / ${d.cuotas}</p>
                    <p><strong>Tasa de interés:</strong> ${d.interes}%</p>
                    <p><strong>Fecha inicio:</strong> ${d.fechaInicio}</p>
                    <p><strong>Fecha fin:</strong> ${d.fechaFin}</p>
                    <p><strong>Estado:</strong> <span class="estado ${color}">${estado}</span></p>
                </div>

                <div class="acciones">
                    <select class="metodo" id="metodo-${i}">
                        <option value="">Método de pago</option>
                        <option value="Plin">Plin</option>
                        <option value="Yape">Yape</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Efectivo">Efectivo</option>
                    </select>

                    <button onclick="pagarCuota(${i})">Pagar cuota</button>
                    <button class="pagar-todo" onclick="pagarTodo(${i})">Pagar todo</button>
                </div>
            </div>
        `;
    });
});

// Obtener método seleccionado
function getMetodo(i) {
    return document.getElementById(`metodo-${i}`).value;
}

// Pagar cuota
function pagarCuota(i) {
    let deudas = JSON.parse(localStorage.getItem("deudas"));
    let d = deudas[i];

    const metodo = getMetodo(i);
    if (!metodo) return alert("Seleccione un método de pago.");

    if (d.pagadas < d.cuotas) {
        d.pagadas++;
        alert(`Cuota pagada con ${metodo}.`);
    }

    localStorage.setItem("deudas", JSON.stringify(deudas));
    location.reload();
}

// Pagar todo
function pagarTodo(i) {
    let deudas = JSON.parse(localStorage.getItem("deudas"));
    let d = deudas[i];

    const metodo = getMetodo(i);
    if (!metodo) return alert("Seleccione un método de pago.");

    d.pagadas = d.cuotas;
    alert(`Deuda pagada completamente con ${metodo}.`);

    localStorage.setItem("deudas", JSON.stringify(deudas));
    location.reload();
}
