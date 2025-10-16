document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioActivo'));
  if (!usuarioLogeado) {
    alert("Debes iniciar sesión primero.");
    window.location.href = "login.html";
    return;
  }

  const listaDeudas = document.getElementById('listaDeudas');

  let prestamos = JSON.parse(localStorage.getItem('prestamos')) || [];
  prestamos = prestamos.filter(p => p.usuario === usuarioLogeado.username);

  if (prestamos.length === 0) {
    listaDeudas.innerHTML = "<p>No tienes deudas registradas.</p>";
    return;
  }

  listaDeudas.innerHTML = prestamos.map((prestamo, index) => {
    const cuotasRestantes = prestamo.cuotas - (prestamo.pagadas || 0);

    // Calcular cuota si no existe
    const montoCuota = prestamo.montoCuota !== undefined
      ? prestamo.montoCuota
      : (() => {
          const i = (prestamo.interes / 100) / 12;
          return i === 0
            ? prestamo.monto / prestamo.cuotas
            : prestamo.monto * i / (1 - Math.pow(1 + i, -prestamo.cuotas));
        })();

    // Estado del préstamo
    const estado = cuotasRestantes > 0 ? "Pendiente" : "Completado";

    return `
      <div style="background:#f5f5f5; padding:15px; margin-bottom:15px; border-radius:12px;">
        <h3>${prestamo.banco}</h3>
        <p><strong>Monto total:</strong> S/ ${prestamo.monto}</p>
        <p><strong>Interés:</strong> ${prestamo.interes}%</p>
        <p><strong>Cuotas totales:</strong> ${prestamo.cuotas}</p>
        <p><strong>Cuotas restantes:</strong> ${cuotasRestantes}</p>
        <p><strong>Monto por cuota:</strong> S/ ${montoCuota.toFixed(2)}</p>
        <p><strong>Fecha de inicio:</strong> ${prestamo.fechaInicio}</p>
        <p><strong>Fecha de vencimiento:</strong> ${prestamo.fechaFin}</p>
        <p><strong>Estado:</strong> ${estado}</p>
        <button onclick="pagarCuota(${index})" ${cuotasRestantes <= 0 ? 'disabled' : ''}>
          💸 Pagar cuota
        </button>
        <button onclick="pagarTodasCuotas(${index})" ${cuotasRestantes <= 0 ? 'disabled' : ''}>
          💰 Pagar todas las cuotas
        </button>
      </div>
    `;
  }).join('');
});

// Pagar una sola cuota
function pagarCuota(index) {
  const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioActivo'));
  let prestamos = JSON.parse(localStorage.getItem('prestamos')) || [];
  const prestamosUsuario = prestamos.filter(p => p.usuario === usuarioLogeado.username);
  const prestamo = prestamosUsuario[index];

  if (!prestamo.pagadas) prestamo.pagadas = 0;

  if (prestamo.pagadas < prestamo.cuotas) {
    prestamo.pagadas++;
    alert(`✅ Has pagado una cuota. Quedan ${prestamo.cuotas - prestamo.pagadas} cuotas.`);

    if (prestamo.pagadas === prestamo.cuotas) {
      alert("🎉 ¡Has terminado de pagar este préstamo!");
    }

    const indexGlobal = prestamos.findIndex(
      p => p.usuario === prestamo.usuario && p.fechaInicio === prestamo.fechaInicio
    );
    prestamos[indexGlobal] = prestamo;
    localStorage.setItem('prestamos', JSON.stringify(prestamos));

    location.reload();
  }
}

// Pagar todas las cuotas restantes
function pagarTodasCuotas(index) {
  const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioActivo'));
  let prestamos = JSON.parse(localStorage.getItem('prestamos')) || [];
  const prestamosUsuario = prestamos.filter(p => p.usuario === usuarioLogeado.username);
  const prestamo = prestamosUsuario[index];

  if (!prestamo.pagadas) prestamo.pagadas = 0;

  const cuotasRestantes = prestamo.cuotas - prestamo.pagadas;
  if (cuotasRestantes > 0) {
    prestamo.pagadas = prestamo.cuotas;
    alert(`✅ Has pagado todas las cuotas restantes (${cuotasRestantes}). ¡Préstamo completado!`);

    const indexGlobal = prestamos.findIndex(
      p => p.usuario === prestamo.usuario && p.fechaInicio === prestamo.fechaInicio
    );
    prestamos[indexGlobal] = prestamo;
    localStorage.setItem('prestamos', JSON.stringify(prestamos));

    location.reload();
  }
}

