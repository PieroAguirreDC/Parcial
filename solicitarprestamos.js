const montoInput = document.getElementById("monto");
const cuotasInput = document.getElementById("cuotas");
const interesInput = document.getElementById("interes");
const cuotaOutput = document.getElementById("cuota");
const fechaInicioInput = document.getElementById("fechaInicio");
const fechaFinInput = document.getElementById("fechaFin");
const mensaje = document.getElementById("mensaje");

// 🧮 Calcular cuota automáticamente con interés compuesto mensual
function calcularCuota() {
  const monto = parseFloat(montoInput.value);
  const cuotas = parseInt(cuotasInput.value);
  const interesAnual = parseFloat(interesInput.value);

  if (monto > 0 && cuotas > 0 && interesAnual >= 0) {
    const interesMensual = interesAnual / 100 / 12;
    const cuota = interesMensual === 0 
      ? monto / cuotas // si interés = 0
      : (monto * interesMensual) / (1 - Math.pow(1 + interesMensual, -cuotas));
    cuotaOutput.value = cuota ? cuota.toFixed(2) : "0.00";
  }
}

// 🗓️ Calcular fecha de finalización según cuotas
function calcularFechaFin() {
  const inicio = new Date(fechaInicioInput.value);
  const cuotas = parseInt(cuotasInput.value);
  if (inicio && cuotas > 0) {
    const fin = new Date(inicio);
    fin.setMonth(inicio.getMonth() + cuotas);
    fechaFinInput.value = fin.toISOString().split("T")[0];
  }
}

// 📅 Establecer fecha mínima de inicio = hoy
const hoy = new Date().toISOString().split("T")[0];
fechaInicioInput.setAttribute("min", hoy);

// Eventos para cálculo dinámico
[montoInput, cuotasInput, interesInput].forEach(el => el.addEventListener("input", calcularCuota));
fechaInicioInput.addEventListener("change", calcularFechaFin);
cuotasInput.addEventListener("input", calcularFechaFin);

// 📥 Guardar préstamo
document.getElementById("formPrestamo").addEventListener("submit", (e) => {
  e.preventDefault();

  const banco = document.getElementById("banco").value;
  const monto = parseFloat(montoInput.value);
  const cuotas = parseInt(cuotasInput.value);
  const interes = parseFloat(interesInput.value);
  const cuota = parseFloat(cuotaOutput.value); // ya con interés compuesto
  const fechaInicio = fechaInicioInput.value;
  const fechaFin = fechaFinInput.value;

  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!usuarioActivo) {
    mensaje.textContent = "⚠️ Debe iniciar sesión para registrar un préstamo.";
    mensaje.style.color = "red";
    return;
  }

  const nuevoPrestamo = {
    usuario: usuarioActivo.username,
    banco,
    monto,
    cuotas,
    interes,
    montoCuota: cuota, // 🔹 renombrado para consistencia con deudas.js
    fechaInicio,
    fechaFin,
    pagadas: 0
  };

  const prestamos = JSON.parse(localStorage.getItem("prestamos")) || [];
  prestamos.push(nuevoPrestamo);
  localStorage.setItem("prestamos", JSON.stringify(prestamos));

  mensaje.textContent = "✅ Préstamo guardado correctamente.";
  mensaje.style.color = "green";

  setTimeout(() => window.location.href = "prestamos.html", 1500);
});
