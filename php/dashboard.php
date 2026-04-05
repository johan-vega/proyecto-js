<?php
session_start();

// Encabezados para evitar caché del navegador
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Expires: 0');

// Validar sesión activa
if (!isset($_SESSION['usuario_id'])) {
    session_destroy();
    header('Location: ../login.html');
    exit;
}
?>

<!DOCTYPE html>

<html lang="es">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal Estudiantil</title>
    <!-- Framework de booTstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <!-- LIBRERIA DE ICONOS -->
    <script src="https://kit.fontawesome.com/812c8ee19a.js" crossorigin="anonymous"></script>
    <!-- FAVICON DE LA APLICACION DE MATRICULA -->
    <link rel="shortcut icon" href="../img/ico_blanco-removebg-preview.png" type="image/x-icon">
    <!-- FUENTES  -->
    <link
        href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">


    <!-- HOJA DE ESTILOS  -->
    <link rel="stylesheet" href="../css/dashboard.css">
    <!-- LIBRERIA JQUERY -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <!--vinculamos con el archivo de scripts -->
    <script src="../JS/login.js"></script>
</head>

<body>

    <nav>
        <h1>Portal Estudiantil</h1>
        <button id="btnLogOut" type="button" class="btn btn-light" onclick="cerrarSesion()">Cerrar Sesión</button>
    </nav>

    <script>
        function cerrarSesion() {
            fetch('../php/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'action=logout'
                }).then(response => response.json())
                .then(data => {
                    if (data.exito) {
                        window.location.href = '../login.html';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    window.location.href = '../login.html';
                });
        }
    </script>

    <main class="container mt-5 pt-5">
        <section class="text-center mb-5">
            <h2 class="display-4">¡Bienvenido!</h2>
            <p class="lead">Accede a tus recursos académicos de manera fácil y segura. Aquí encontrarás todo lo que
                necesitas para tu educación.</p>
        </section>

        <section class="row">
            <div class="col-md-4 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <i class="fas fa-graduation-cap fa-3x mb-3 text-primary"></i>
                        <h5 class="card-title">Calificaciones</h5>
                        <p class="card-text">Revisa tus notas y progreso académico.</p>
                        <a href="#" class="btn btn-primary">Ver Calificaciones</a>
                    </div>
                </div>
            </div>

            <div class="col-md-4 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <i class="fas fa-calendar-alt fa-3x mb-3 text-success"></i>
                        <h5 class="card-title">Horarios</h5>
                        <p class="card-text">Consulta tu horario de clases y actividades.</p>
                        <a href="#" class="btn btn-success">Ver Horarios</a>
                    </div>
                </div>
            </div>

            <div class="col-md-4 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <i class="fas fa-book fa-3x mb-3 text-info"></i>
                        <h5 class="card-title">Recursos</h5>
                        <p class="card-text">Accede a materiales educativos y recursos.</p>
                        <a href="#" class="btn btn-info">Ver Recursos</a>
                    </div>
                </div>
            </div>

            <div class="col-md-4 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <i class="fas fa-bell fa-3x mb-3 text-warning"></i>
                        <h5 class="card-title">Avisos</h5>
                        <p class="card-text">Entérate de noticias y anuncios importantes.</p>
                        <a href="#" class="btn btn-warning">Ver Avisos</a>
                    </div>
                </div>
            </div>

            <div class="col-md-4 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <i class="fas fa-user fa-3x mb-3 text-secondary"></i>
                        <h5 class="card-title">Perfil</h5>
                        <p class="card-text">Actualiza tu información personal.</p>
                        <a href="#" class="btn btn-secondary">Ver Perfil</a>
                    </div>
                </div>
            </div>

            <div class="col-md-4 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <i class="fas fa-envelope fa-3x mb-3 text-danger"></i>
                        <h5 class="card-title">Contacto</h5>
                        <p class="card-text">Comunícate con profesores y administradores.</p>
                        <a href="#" class="btn btn-danger">Contactar</a>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!--LIBRERIA SWEET ALERT  -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- LIBRERIA JS DE BOOTSTRAP -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
</body>

</html>