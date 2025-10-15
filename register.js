// Función para generar token único
function generarToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Convertir texto a mayúsculas automáticamente
document.getElementById("nombres").addEventListener("input", (e) => {
  e.target.value = e.target.value.toUpperCase();
});
document.getElementById("apellidos").addEventListener("input", (e) => {
  e.target.value = e.target.value.toUpperCase();
});

document.getElementById("formRegistro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const dni = document.getElementById("dni").value.trim();
  const nombres = document.getElementById("nombres").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const mensaje = document.getElementById("mensaje");

  // Validaciones básicas
  if (!dni || !nombres || !apellidos || !email || !password) {
    mensaje.textContent = "❌ Todos los campos son obligatorios.";
    mensaje.style.color = "red";
    return;
  }

  if (password.length > 8) {
    mensaje.textContent = "❌ La contraseña no puede tener más de 8 caracteres.";
    mensaje.style.color = "red";
    return;
  }

  // Obtener usuarios registrados
  const usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

  // Verificar si ya existe un usuario con el mismo DNI o correo
  const usuarioExistente = usuariosRegistrados.find(
    (u) => u.dni === dni || u.email.toLowerCase() === email.toLowerCase()
  );

  if (usuarioExistente) {
    mensaje.textContent = "⚠️ Ya existe un usuario registrado con este DNI o correo.";
    mensaje.style.color = "orange";
    return;
  }

  // Crear nuevo usuario con nombre.apellido123
  const username = `${nombres.split(" ")[0].toLowerCase()}.${apellidos.split(" ")[0].toLowerCase()}${dni.slice(-3)}`;
  const token = generarToken();

  const nuevoUsuario = {
    dni,
    nombres,
    apellidos,
    email,
    username,
    password,
    token,
    activo: true // ✅ ya activo directamente, sin verificación
  };

  // Guardar usuario en el array y en localStorage
  usuariosRegistrados.push(nuevoUsuario);
  localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosRegistrados));

  // Enviar correo con EmailJS
  emailjs
    .send("service_52ybfid", "template_iogpook", {
      nombre: nombres,
      username: username,
      email: email
    })
    .then(() => {
      mensaje.textContent = "✅ Registro exitoso. Se envió un correo con tus credenciales.";
      mensaje.style.color = "green";
      document.getElementById("formRegistro").reset();
    })
    .catch((error) => {
      console.error("Error al enviar el correo:", error);
      mensaje.textContent = "❌ Error al enviar el correo.";
      mensaje.style.color = "red";
    });
});
