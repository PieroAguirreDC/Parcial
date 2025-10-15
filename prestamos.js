// Mostrar saludo personalizado
document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogeado = localStorage.getItem("usuarioActual");

  const saludo = document.getElementById("saludoUsuario");
  if (usuarioLogeado) {
    saludo.textContent = `Bienvenido, ${usuarioLogeado}`;
  } else {
    saludo.textContent = "Bienvenido";
  }

  // Cerrar sesión
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuarioActual");
    window.location.href = "login.html";
  });
});
