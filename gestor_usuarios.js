// Verificar que admin está logueado
if (localStorage.getItem("adminActivo") !== "true") {
  window.location.href = "admin_login.html";
}

// Mostrar mensaje de bienvenida
const adminBienvenida = document.getElementById("adminBienvenida");
adminBienvenida.textContent = "Bienvenido, Admin.";

// Botón cerrar sesión
const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
cerrarSesionBtn.addEventListener("click", () => {
  localStorage.removeItem("adminActivo");
  window.location.href = "admin_login.html";
});

// Cargar usuarios desde localStorage
const usuariosTabla = document.getElementById("usuariosTabla").querySelector("tbody");
let usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

// Renderizar la tabla
function renderUsuarios() {
  usuariosTabla.innerHTML = "";
  usuarios.forEach((u, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.username}</td>
      <td>${u.dni}</td>
      <td>${u.email}</td>
      <td>${u.verificadoEn || "—"}</td>
      <td>${u.activo ? "✅ Sí" : "❌ No"}</td>
      <td><button data-index="${index}" class="eliminarBtn">Eliminar</button></td>
    `;
    usuariosTabla.appendChild(tr);
  });

  document.querySelectorAll(".eliminarBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.dataset.index;
      usuarios.splice(idx, 1);
      localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));
      renderUsuarios();
    });
  });
}

renderUsuarios();
