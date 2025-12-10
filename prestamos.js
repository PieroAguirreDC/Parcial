document.addEventListener("DOMContentLoaded", () => {
    const saludo = document.getElementById("saludoUsuario");
    const logoutBtn = document.getElementById("logoutBtn");

    // Leer usuario guardado por login.js
    let usuarioActual = localStorage.getItem("usuarioActivo");

    if (!usuarioActual) {
        saludo.textContent = "Bienvenido";
        return;
    }

    try {
        usuarioActual = JSON.parse(usuarioActual);
    } catch {
        saludo.textContent = "Bienvenido, " + usuarioActual;
        return;
    }

    let nombreMostrar = "usuario";

    if (usuarioActual.tipo === "dni") {
        nombreMostrar = usuarioActual.nombres || usuarioActual.usuario;
    } 
    else if (usuarioActual.tipo === "ruc") {
        nombreMostrar = usuarioActual.empresa || usuarioActual.usuario;
    }

    saludo.textContent = "Bienvenido, " + nombreMostrar;

    // Cerrar sesión
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("usuarioActivo");
        window.location.href = "index.html";
    });
});
