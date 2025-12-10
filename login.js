document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const usuarioIngresado = document.getElementById("usuario").value.trim();
  const passwordIngresado = document.getElementById("password").value.trim();
  const mensajeError = document.getElementById("mensajeError");

  // 🔹 Recuperar usuarios guardados por el register.js
  const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

  // 🔹 Buscar usuario por DNI, RUC o correo
  const usuarioEncontrado = usuariosGuardados.find(
    (u) =>
      u.usuario === usuarioIngresado ||   // DNI o RUC (campo generado por register.js)
      u.email === usuarioIngresado        // También permitir ingreso con correo
  );

  if (!usuarioEncontrado) {
    mensajeError.style.color = "red";
    mensajeError.textContent = "❌ Usuario no encontrado.";
    return;
  }

  // Validar contraseña
  if (usuarioEncontrado.password !== passwordIngresado) {
    mensajeError.style.color = "red";
    mensajeError.textContent = "❌ Contraseña incorrecta.";
    return;
  }

  // ✅ Inicio correcto
  mensajeError.style.color = "#4cd964";
  mensajeError.textContent = "✅ Inicio de sesión exitoso. Redirigiendo...";

  // Guardar usuario activo
  localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));

  setTimeout(() => {
    window.location.href = "prestamos.html";
  }, 1500);
});
