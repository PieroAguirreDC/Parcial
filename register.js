// ========================================
// MOSTRAR CAMPOS SEGÚN EL TIPO SELECCIONADO
// ========================================
document.getElementById("tipoDoc").addEventListener("change", () => {
    const tipo = document.getElementById("tipoDoc").value;

    document.getElementById("grupoDNI").style.display = tipo === "dni" ? "block" : "none";
    document.getElementById("grupoRUC").style.display = tipo === "ruc" ? "block" : "none";
});

// ========================================
// MAYÚSCULAS
// ========================================
["nombres", "apellidos", "empresa"].forEach(id => {
    const campo = document.getElementById(id);
    if (campo) campo.addEventListener("input", e => {
        e.target.value = e.target.value.toUpperCase();
    });
});

// ========================================
// API PERÚ - TOKEN OFICIAL
// ========================================
const TOKEN = "5cfcd56dcb11cc3ebee5812dad1ef0a48f3da29708b0729fb3b7e3b6d586951a";

// ========= CONSULTA DNI =========
async function validarDNI(dni) {
    try {
        const r = await fetch("https://apiperu.dev/api/dni", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${TOKEN}`
            },
            body: JSON.stringify({ dni })
        });

        const data = await r.json();
        return data.data ? data.data : null;

    } catch (err) {
        return null;
    }
}

// ========= CONSULTA RUC =========
async function validarRUC(ruc) {
    try {
        const r = await fetch("https://apiperu.dev/api/ruc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${TOKEN}`
            },
            body: JSON.stringify({ ruc })
        });

        const data = await r.json();
        return data.data ? data.data : null;

    } catch (err) {
        return null;
    }
}

// ========================================
// AUTOCOMPLETAR DNI
// ========================================
document.getElementById("dni").addEventListener("blur", async () => {
    const dni = document.getElementById("dni").value.trim();
    const mensaje = document.getElementById("mensaje");

    if (dni.length !== 8) return;

    mensaje.style.color = "orange";
    mensaje.textContent = "⏳ Consultando DNI...";

    const info = await validarDNI(dni);

    if (!info) {
        mensaje.style.color = "red";
        mensaje.textContent = "❌ No se encontraron datos para este DNI.";
        return;
    }

    document.getElementById("nombres").value = info.nombres;
    document.getElementById("apellidos").value = info.apellido_paterno + " " + info.apellido_materno;

    mensaje.textContent = "";
});

// ========================================
// AUTOCOMPLETAR RUC
// ========================================
document.getElementById("ruc").addEventListener("blur", async () => {
    const ruc = document.getElementById("ruc").value.trim();
    const mensaje = document.getElementById("mensaje");

    if (ruc.length !== 11) return;

    mensaje.style.color = "orange";
    mensaje.textContent = "⏳ Consultando RUC...";

    const info = await validarRUC(ruc);

    if (!info) {
        mensaje.style.color = "red";
        mensaje.textContent = "❌ No se encontraron datos para este RUC.";
        return;
    }

    document.getElementById("empresa").value = info.nombre_o_razon_social || "";

    mensaje.textContent = "";
});

// ========================================
// REGISTRO FINAL
// ========================================
document.getElementById("formRegistro").addEventListener("submit", async (e) => {
    e.preventDefault();

    const tipo = document.getElementById("tipoDoc").value;
    const dni = document.getElementById("dni")?.value.trim();
    const ruc = document.getElementById("ruc")?.value.trim();
    const nombres = document.getElementById("nombres")?.value.trim();
    const apellidos = document.getElementById("apellidos")?.value.trim();
    const empresa = document.getElementById("empresa")?.value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const mensaje = document.getElementById("mensaje");

    if (!tipo) {
        mensaje.style.color = "red";
        mensaje.textContent = "❌ Selecciona tipo de registro.";
        return;
    }

    mensaje.textContent = "⏳ Validando...";
    mensaje.style.color = "orange";

    let datosValidados = {};

    if (tipo === "dni") {

        if (!dni || dni.length !== 8) {
            mensaje.textContent = "❌ DNI inválido.";
            mensaje.style.color = "red";
            return;
        }

        const info = await validarDNI(dni);
        if (!info) {
            mensaje.textContent = "❌ DNI no encontrado.";
            mensaje.style.color = "red";
            return;
        }

        datosValidados = {
            tipo,
            dni,
            nombres,
            apellidos,
            usuario: dni // usuario = dni
        };

    } else if (tipo === "ruc") {

        if (!ruc || ruc.length !== 11) {
            mensaje.textContent = "❌ RUC inválido.";
            mensaje.style.color = "red";
            return;
        }

        const info = await validarRUC(ruc);
        if (!info) {
            mensaje.textContent = "❌ RUC no encontrado.";
            mensaje.style.color = "red";
            return;
        }

        datosValidados = {
            tipo,
            ruc,
            empresa,
            usuario: ruc // usuario = ruc
        };
    }

    // ===============================
    // GUARDAR EN LOCALSTORAGE
    // ===============================
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const existe = usuarios.find(
        (u) =>
            (dni && u.dni === dni) ||
            (ruc && u.ruc === ruc) ||
            u.email === email
    );

    if (existe) {
        mensaje.style.color = "red";
        mensaje.textContent = "⚠️ Ya existe un usuario con estos datos.";
        return;
    }

    const nuevoUsuario = {
        ...datosValidados,
        email,
        password,
        activo: true
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mensaje.style.color = "green";
    mensaje.textContent = "✔ Registro exitoso. Ya puedes iniciar sesión.";

    document.getElementById("formRegistro").reset();
});
