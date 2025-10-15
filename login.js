document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();
  const mensajeError = document.getElementById("mensajeError");

  // 🔹 Recuperar los usuarios guardados correctamente
  const usuariosGuardados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

  // 🔹 Buscar por username
  const usuarioEncontrado = usuariosGuardados.find(
    (u) => u.username === usuario
  );

  if (!usuarioEncontrado) {
    mensajeError.style.color = "red";
    mensajeError.textContent = "❌ Usuario no encontrado.";
    return;
  }

  // Si eliminaste la verificación por correo, quitamos este bloque
  /*
  if (!usuarioEncontrado.activo) {
    mensajeError.style.color = "orange";
    mensajeError.textContent = "⚠️ Cuenta no confirmada. Revisa tu correo.";
    return;
  }
  */

  if (usuarioEncontrado.password !== password) {
    mensajeError.style.color = "red";
    mensajeError.textContent = "❌ Contraseña incorrecta.";
    return;
  }

  // ✅ Inicio de sesión correcto
  mensajeError.style.color = "#4cd964";
  mensajeError.textContent = "✅ Inicio de sesión exitoso. Redirigiendo...";
  localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));

  setTimeout(() => {
  window.location.href = "prestamos.html";
}, 1500);
});
