<?php
session_start();

header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Expires: 0');

$sesionValida = isset($_SESSION['tipo']) && (isset($_SESSION['usuario_id']) || isset($_SESSION['id_alumno']));

if (!$sesionValida) {
    session_unset();
    session_destroy();
    header('Location: login.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Panel ABC - Matrícula OnLine</title>
    <!-- FRAMEWORK BOOTSTRAP -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <!-- LIBRERÍA DE ICONOS -->
    <script src="https://kit.fontawesome.com/812c8ee19a.js" crossorigin="anonymous"></script>
    <!-- FAVICON DE LA APLICACIÓN DE MATRICULA -->
    <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon">

    <!-- FUENTES DE GOOGLE FONTS -->
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
    <!-- LIBRERÍA AJAX -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- HOJA DE ESTILOS -->
    <link rel="stylesheet" href="css/style-dashboard.css">

    <!-- LIBRERÍA JQUERY -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>

<body>
    <div class="containers">
        <aside class="sidebar">
            <div class="sidebar-header">
                <i class="fa-solid fa-graduation-cap"></i>
                <h2>SISTEMA DE MATRÍCULA</h2>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="#"><i class="fa-solid fa-house"></i>Dashboard</a></li>
                    <li class="active"><a href="dashboard2.php"><i class="fa-solid fa-user-graduate"></i>
                            Estudiantes</a></li>
                    <li><a href="cursos.html"><i class="fa-solid fa-book"></i>Cursos</a></li>
                    <li><a href="aulas.html"><i class="fa-solid fa-school"></i>Aulas</a></li>
                    <li><a href="#"><i class="fa-solid fa-money-bill-wave"></i> Matricula</a></li>
                    <li><a href="#"><i class="fa-solid fa-money-bill-wave"></i> Pagos</a></li>
                    <li><a href="#"><i class="fa-solid fa-gear"></i>Configuración</a></li>
                </ul>
            </nav>
            <div class="sidebar-footer">
                <div class="user-profile">
                    <img src="img/ico_blanco-removebg-preview.png" width="40PX" alt="Avatar">
                    <div class="user-info">
                        <h3>Administración</h3>
                        <a href="#">Ver perfil</a>
                    </div>
                </div>
            </div>
        </aside>
        <main class="main-content">
            <header class="top-header">
                <div class="header-left">
                    <h2>Panel de Administración</h2>
                </div>
                <div class="header-right">
                    <i class="fa-solid fa-bell"></i>
                    <div class="search-bar">
                        <input type="text" placeholder="Buscar...">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <button id="btnLogOut" class="btn btn-danger" onclick="cerrarSesion()">Cerrar Sesión</button>
                    <div class="user-dropdown">
                        <img src="img/ico_blanco-removebg-preview.png" alt="ADMIN" width="40px" height="40px">
                        <h3>Administración <i class="fa-solid fa-chevron-down"></i></h3>
                    </div>
                </div>
            </header>
            <div id="moduloEstudiantes">
                <div class="content-body">
                    <div class="card table-card">
                        <div class="card-header">
                            <h2>Estudiantes Recientes</h2>
                            <button class="btn btn-primary"><i class="fa-solid fa-plus"></i> Registrar Nuevo</button>
                        </div>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>DNI</th>
                                    <th>Fecha de Nacimiento</th>
                                    <th>Celular</th>
                                    <th>Correo</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tablaAlumnos">
                            </tbody>
                        </table>
                        <div class="card-footer">
                            <p>Mostrando 2 de 50 registros</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="moduloDashboard" style="display: none">
                <div class="kpi-grid">
                    <div class="kpi-card">
                        <div class="kpi-icon alumno">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <div class="kpi-info">
                            <h3>Total Alumnos</h3>
                            <h2 id="kpiTotalAlumnos">0</h2>
                        </div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon aulas">
                            <i class="fa-solid fa-school"></i>
                        </div>
                        <div class="kpi-info">
                            <h3>Aulas Activas</h3>
                            <h2 id="kpiTotalAulas">0</h2>
                        </div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon vacantes">
                            <i class="fa-solid fa-ticket"></i>
                        </div>
                        <div class="kpi-info">
                            <h3>Vacantes Disp.</h3>
                            <h2 id="kpiVacantesDisp">0</h2>
                        </div>
                    </div>
                </div>
                <div class="charts-grid">
                    <div class="card chart-card">
                        <div class="card-header">
                            <h2>Alumnos por Género</h2>
                        </div>
                        <div class="card-body">
                            <canvas id="graficoGenero"></canvas>
                        </div>
                    </div>
                    <div class="card chart-card">
                        <div class="card-header">
                            <h2>Vacantes por Nivel Educativo</h2>
                        </div>
                        <div class="card-body">
                            <canvas id="graficoNiveles"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div id="moduloCursos" style="display: none">
                <div class="content-body">
                    <div class="card table-card">
                        <div class="card-header">
                            <h2>CURSOS DISPONIBLES</h2>

                        </div>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Codigo de curso</th>
                                    <th>Curso</th>
                                    <th>Creditos</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tablaCursos">
                            </tbody>
                        </table>
                        <div class="card-footer">
                            <p>Mostrando 2 de 50 registros</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="moduloAulas" style="display: none">
                <div class="content-body">
                    <div class="card table-card">
                        <div class="card-header">
                            <h2>AULAS DISPONIBLES</h2>
                        </div>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nivel</th>
                                    <th>Grado</th>
                                    <th>Sección</th>
                                    <th>Vacantes Totales</th>
                                    <th>Vacantes Disponibles</th>
                                </tr>
                            </thead>
                            <tbody id="tablaAulas">
                            </tbody>
                        </table>
                        <div class="card-footer">
                            <p>Mostrando aulas disponibles</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="moduloMatricula" style="display: none">
                <div class="content-body">
                    <div class="card table-card">
                        <div class="card-header">
                            <h2>Matrícula de Alumnos</h2>
                        </div>
                        <div class="card-body">
                            <form id="formMatricula">
                                <div class="form-grid">
                                    <select id="alumnoMatricula" name="alumno" required>
                                        <option value="">Seleccione Alumno...</option>
                                    </select>
                                    <select id="cursoMatricula" name="curso" required>
                                        <option value="">Seleccione Curso...</option>
                                    </select>
                                    <select id="aulaMatricula" name="aula" required>
                                        <option value="">Seleccione Aula...</option>
                                    </select>
                                    <button type="button" id="btnMatricular" class="btn ">Matricular</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div id="moduloPagos" style="display: none">
                <div class="content-body">
                    <div class="card table-card">
                        <div class="card-header">
                            <h2>Gestión de Pagos</h2>
                        </div>
                        <div class="card-body">
                            <input type="text" id="buscarAlumnoPago" placeholder="Buscar alumno por nombre o DNI">
                            <button id="btnBuscarPago" class="btn btn-secondary">Buscar</button>
                            <div id="resultadoBusqueda" style="margin-top: 20px;">
                                <!-- Resultados de búsqueda -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="moduloConfiguracion" style="display: none;">
                <div class="content-body">
                    <div class="card table-card">
                        <div class="card-header">
                            <h2>Actualizar Informacion</h2>
                        </div>
                        <form id="formAlumno">
                            <input type="hidden" id="id_alumno" name="id_alumno">
                            <input type="hidden" id="opcion" name="opcion" value="1">
                            <div class="form-grid">
                                <input type="text" id="dni" name="dni" placeholder="DNI (8 dígitos)" maxlength="8"
                                    required>
                                <input type="text" id="nombres" name="nombres" placeholder="Nombres" required>
                                <input type="text" id="apellidos" name="apellidos" placeholder="Apellidos" required>
                                <input type="date" id="fecha_nac" name="fecha_nac" required>
                                <input type="number" id="edad" name="edad" placeholder="Edad" required>
                                <select id="genero" name="genero" required>
                                    <option value="">Seleccione Género...</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                                <input type="text" id="direccion" name="direccion" placeholder="Dirección" required>
                                <input type="text" id="celular" name="celular" placeholder="Celular" maxlength="9"
                                    required>
                                <input type="email" id="correo" name="correo" placeholder="Correo Electrónico" required>
                                <input type="text" id="apoderado" name="apoderado" placeholder="Nombre Apoderado"
                                    required>
                                <input type="text" id="cel_apoderado" name="cel_apoderado"
                                    placeholder="Celular Apoderado" maxlength="9" required>
                                <input type="text" id="username" name="username" placeholder="Nombre de Usuario"
                                    required>
                                <input type="password" id="password" name="password" placeholder="Contraseña">
                                <select id="estado" name="estado" required>
                                    <option value="">Seleccione Estado...</option>
                                    <option value="ACTIVO">Activo</option>
                                    <option value="INACTIVO">Inactivo</option>
                                    <option value="EN PROCESO">En Proceso</option>
                                </select>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary btn-cerrar-modal">Cancelar</button>
                                <button type="submit" class="btn btn-save">Guardar Datos</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <div id="modalAlumno" class="modal-overlay" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modalTitulo">Registrar Nuevo Alumno</h2>
                <i class="fa-solid fa-xmark btn-cerrar-modal"></i>
            </div>
            <form id="formAlumno">
                <input type="hidden" id="id_alumno" name="id_alumno">
                <input type="hidden" id="opcion" name="opcion" value="1">
                <div class="form-grid">
                    <input type="text" id="dni" name="dni" placeholder="DNI (8 dígitos)" maxlength="8" required>
                    <input type="text" id="nombres" name="nombres" placeholder="Nombres" required>
                    <input type="text" id="apellidos" name="apellidos" placeholder="Apellidos" required>
                    <input type="date" id="fecha_nac" name="fecha_nac" required>
                    <input type="number" id="edad" name="edad" placeholder="Edad" required>
                    <select id="genero" name="genero" required>
                        <option value="">Seleccione Género...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                    <input type="text" id="direccion" name="direccion" placeholder="Dirección" required>
                    <input type="text" id="celular" name="celular" placeholder="Celular" maxlength="9" required>
                    <input type="email" id="correo" name="correo" placeholder="Correo Electrónico" required>
                    <input type="text" id="apoderado" name="apoderado" placeholder="Nombre Apoderado" required>
                    <input type="text" id="cel_apoderado" name="cel_apoderado" placeholder="Celular Apoderado"
                        maxlength="9" required>
                    <input type="text" id="username" name="username" placeholder="Nombre de Usuario" required>
                    <input type="password" id="password" name="password" placeholder="Contraseña">
                    <select id="estado" name="estado" required>
                        <option value="">Seleccione Estado...</option>
                        <option value="ACTIVO">Activo</option>
                        <option value="INACTIVO">Inactivo</option>
                        <option value="EN PROCESO">En Proceso</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-cerrar-modal">Cancelar</button>
                    <button type="submit" class="btn btn-save">Guardar Datos</button>
                </div>
            </form>
        </div>
    </div>
    <!-- ARCHIVO JAVASCRIPT -->
    <script src="JS/dashboard2.js"></script>
    <!-- LIBRERIA CHART.JS -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- LIBRERIA SWEETALERT -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- LIBRERIA JS DE BOOTSTRAP -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
</body>

</html>
