const montoInput = document.getElementById("monto");
const cuotasInput = document.getElementById("cuotas");
const interesInput = document.getElementById("interes");
const cuotaOutput = document.getElementById("cuota");
const fechaInicioInput = document.getElementById("fechaInicio");
const fechaFinInput = document.getElementById("fechaFin");
const mensaje = document.getElementById("mensaje");

// 🔍 Validar campos numéricos (no negativos, no cero, no vacíos)
function validarNumero(input) {
  let valor = parseFloat(input.value);

  if (isNaN(valor) || valor <= 0) {
    input.value = "";
    return false;
  }
  return true;
}

// 🧮 Calcular cuota automáticamente
function calcularCuota() {
  if (!validarNumero(montoInput) || !validarNumero(cuotasInput) || !validarNumero(interesInput)) {
    cuotaOutput.value = "";
    return;
  }

  const monto = parseFloat(montoInput.value);
  const cuotas = parseInt(cuotasInput.value);
  const interes = parseFloat(interesInput.value);

  const i = interes / 100 / 12;
  const cuota = i === 0
    ? monto / cuotas
    : (monto * i) / (1 - Math.pow(1 + i, -cuotas));

  cuotaOutput.value = cuota.toFixed(2);
}

// 🗓️ Calcular fecha final
function calcularFechaFin() {
  const inicio = new Date(fechaInicioInput.value);
  const cuotas = parseInt(cuotasInput.value);

  if (!isNaN(inicio) && cuotas > 0) {
    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + cuotas);
    fechaFinInput.value = fin.toISOString().split("T")[0];
  }
}

// Eventos
[montoInput, cuotasInput, interesInput].forEach(input => {
  input.addEventListener("input", () => {
    validarNumero(input);
    calcularCuota();
    calcularFechaFin();
  });
});

fechaInicioInput.addEventListener("change", calcularFechaFin);

// 🔹 Guardar deuda con validación estricta
document.getElementById("formDeuda").addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    !validarNumero(montoInput) ||
    !validarNumero(cuotasInput) ||
    !validarNumero(interesInput)
  ) {
    mensaje.textContent = "⚠️ Todos los valores deben ser mayores a 0.";
    mensaje.style.color = "red";
    return;
  }

  // ⬅️ AHORA SÍ: sincronizado con login.js
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (!usuario) {
    mensaje.textContent = "⚠️ Inicia sesión para registrar deudas.";
    mensaje.style.color = "red";
    return;
  }

  const nuevaDeuda = {
    usuario: usuario.usuario,  // DNI o RUC
    banco: document.getElementById("banco").value,
    monto: parseFloat(montoInput.value),
    cuotas: parseInt(cuotasInput.value),
    interes: parseFloat(interesInput.value),
    cuota: parseFloat(cuotaOutput.value),
    fechaInicio: fechaInicioInput.value,
    fechaFin: fechaFinInput.value,
    pagadas: 0,
    estado: "pendiente"
  };

  const deudas = JSON.parse(localStorage.getItem("deudas")) || [];
  deudas.push(nuevaDeuda);
  localStorage.setItem("deudas", JSON.stringify(deudas));

  mensaje.textContent = "✅ Deuda registrada correctamente.";
  mensaje.style.color = "green";

  setTimeout(() => {
    window.location.href = "prestamos.html";
  }, 1500);
});
