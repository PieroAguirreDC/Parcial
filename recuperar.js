let codigoGenerado = "";
let emailUsuario = "";

// Generar código de 6 dígitos
function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* 🔹 ETAPA 1: ENVIAR CÓDIGO */
document.getElementById("formCorreo").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("msgCorreo");

  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const user = usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    msg.style.color = "red";
    msg.textContent = "❌ Este correo no está registrado.";
    return;
  }

  emailUsuario = email;
  codigoGenerado = generarCodigo();

  // Enviar código por correo con EmailJS
  emailjs.send("service_52ybfid", "template_iogpook", {
    nombre: user.nombres,
    email: email,
    codigo: codigoGenerado
  })
  .then(() => {
    msg.style.color = "green";
    msg.textContent = "✔ Código enviado al correo.";

    document.getElementById("formCorreo").style.display = "none";
    document.getElementById("formCodigo").style.display = "block";
  })
  .catch(() => {
    msg.style.color = "red";
    msg.textContent = "❌ No se pudo enviar el código.";
  });
});

/* 🔹 ETAPA 2: VALIDAR EL CÓDIGO */
document.getElementById("formCodigo").addEventListener("submit", (e) => {
  e.preventDefault();

  const codigoIngresado = document.getElementById("codigo").value.trim();
  const msg = document.getElementById("msgCodigo");

  if (codigoIngresado !== codigoGenerado) {
    msg.style.color = "red";
    msg.textContent = "❌ Código incorrecto.";
    return;
  }

  msg.style.color = "green";
  msg.textContent = "✔ Código verificado.";

  document.getElementById("formCodigo").style.display = "none";
  document.getElementById("formNuevaPass").style.display = "block";
});

/* 🔹 ETAPA 3: ACTUALIZAR CONTRASEÑA */
document.getElementById("formNuevaPass").addEventListener("submit", (e) => {
  e.preventDefault();

  const pass1 = document.getElementById("newPass").value.trim();
  const pass2 = document.getElementById("newPass2").value.trim();
  const msg = document.getElementById("msgPass");

  if (pass1 !== pass2) {
    msg.style.color = "red";
    msg.textContent = "❌ Las contraseñas no coinciden.";
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const user = usuarios.find((u) => u.email.toLowerCase() === emailUsuario.toLowerCase());

  user.password = pass1;

  localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));

  msg.style.color = "green";
  msg.textContent = "✔ Contraseña actualizada. Redirigiendo...";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
});
