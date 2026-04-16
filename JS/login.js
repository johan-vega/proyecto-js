$(document).ready(function () {
    $.ajaxSetup({
        cache: false
    });

    verificarSesionActiva();

    $("#loginForm").submit(function (evento) {
        evento.preventDefault();

        let usuario = $("#txtUsuario").val();
        let password = $("#txtPassword").val();

        $.ajax({
            url: "php/login.php",
            type: "POST",
            dataType: "json",
            data: {
                user: usuario,
                pass: password,
            },
            beforeSend: function () {
                Swal.fire({
                    title: "Validando credenciales...",
                    html: "Por favor, espere un momento.",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
            },
            success: function (respuesta) {
                if (respuesta.exito) {
                    Swal.fire({
                        icon: "success",
                        title: "Acceso concedido",
                        text: "Redirigiendo al sistema...",
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(() => {
                        window.location.replace("dashboard2.php");
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Acceso denegado",
                        text: "El usuario o la contrasena son incorrectos.",
                        confirmButtonColor: "#d33",
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Error de conexion",
                    text: "No se pudo conectar con el servidor.",
                    confirmButtonColor: "#3085d6",
                });
            },
        });
    });
});

function verificarSesionActiva() {
    $.ajax({
        url: "php/api_usuario.php",
        type: "GET",
        dataType: "json",
        data: { t: Date.now() },
        success: function (respuesta) {
            if (!respuesta.error) {
                window.location.replace("dashboard2.php");
            }
        }
    });
}
