document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminLoginForm");
  const mensaje = document.getElementById("adminMensaje");
  const logo = document.getElementById("logoCdp");

  // 🔹 Hacer clickeable el logo
  logo.style.cursor = "pointer";
  logo.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Credenciales válidas
  const ADMIN_CREDENCIALES = {
    usuario: "Admin1",
    password: "1234"
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = document.getElementById("adminUser").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    if (usuario === ADMIN_CREDENCIALES.usuario && password === ADMIN_CREDENCIALES.password) {
      // Guardar sesión
      localStorage.setItem("adminActivo", "true");

      // Mensaje visual
      mensaje.style.color = "lightgreen";
      mensaje.textContent = "✅ Acceso concedido. Redirigiendo...";

      // Redirigir tras 1 segundo
      setTimeout(() => {
        window.location.href = "gestor_usuarios.html";
      }, 1000);
    } else {
      mensaje.style.color = "#ff4d4d";
      mensaje.textContent = "❌ Usuario o contraseña incorrectos.";
    }
  });
});
