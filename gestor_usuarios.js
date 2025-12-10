// ===============================
// Verificar que admin está logueado
// ===============================
if (localStorage.getItem("adminActivo") !== "true") {
  window.location.href = "admin_login.html";
}

// Mensaje de bienvenida
const adminBienvenida = document.getElementById("adminBienvenida");
adminBienvenida.textContent = "Bienvenido, Admin.";

// Botón cerrar sesión
const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
cerrarSesionBtn.addEventListener("click", () => {
  localStorage.removeItem("adminActivo");
  window.location.href = "admin_login.html";
});

// ===============================
// Cargar usuarios desde localStorage
// ===============================
const usuariosTabla = document.getElementById("usuariosTabla").querySelector("tbody");
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// ===============================
// Renderizar tabla
// ===============================
function renderUsuarios() {
  usuariosTabla.innerHTML = "";

  usuarios.forEach((u, index) => {

    // Tipo de documento
    const tipoDoc = u.tipo === "dni" ? "DNI" : "RUC";

    // Número de documento
    const documento = u.tipo === "dni" ? u.dni : u.ruc;

    // Nombres
    const nombres =
      u.tipo === "dni"
        ? `${u.nombres} ${u.apellidos}`
        : "—";

    // Empresa
    const empresa =
      u.tipo === "ruc"
        ? u.empresa
        : "—";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${tipoDoc}</td>
      <td>${documento}</td>
      <td>${nombres}</td>
      <td>${empresa}</td>
      <td>${u.email}</td>
      <td>
        <button data-index="${index}" class="eliminarBtn" 
          style="background:red;color:white;border:none;padding:6px 10px;cursor:pointer;">
          Eliminar
        </button>
      </td>
    `;

    usuariosTabla.appendChild(tr);
  });

  // Botones de eliminar
  document.querySelectorAll(".eliminarBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.dataset.index;

      usuarios.splice(idx, 1);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      renderUsuarios();
    });
  });
}

renderUsuarios();
