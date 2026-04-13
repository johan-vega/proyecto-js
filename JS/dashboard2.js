/* ========================================================
1. NAVEGACIÓN DEL MENÚ LATERAL (SPA)
======================================================== */

// Variables globales para los gráficos
let chartGenero = null;
let chartNiveles = null;
$('.sidebar-nav li').on('click', function (e) {
    e.preventDefault();

    // Quitar 'active' de todos y ponérselo al actual
    $('.sidebar-nav li').removeClass('active');
    $(this).addClass('active');

    // Lógica para mostrar/ocultar módulos basada en el texto del menú
    let menuTexto = $(this).text().trim(); // Ej: "Dashboard" o "Estudiantes"
    if (menuTexto === 'Dashboard') {
        $('#moduloEstudiantes').hide();
        $('#moduloCursos').hide();
        $('#moduloAulas').hide();
        $('#moduloDashboard').fadeIn();
        cargarDatosDashboard(); // Función que crearemos abajo
    }
    else if (menuTexto === 'Estudiantes') {
        $('#moduloDashboard').hide();
        $('#moduloCursos').hide();
        $('#moduloAulas').hide();
        $('#moduloEstudiantes').fadeIn();
    }
    else if (menuTexto === 'Cursos') {
        $('#moduloDashboard').hide();
        $('#moduloEstudiantes').hide();
        $('#moduloAulas').hide();
        $('#moduloCursos').fadeIn();
    }
    else if (menuTexto === 'Aulas') {
        $('#moduloDashboard').hide();
        $('#moduloEstudiantes').hide();
        $('#moduloCursos').hide();
        $('#moduloAulas').fadeIn();
    }

    else {
        // Para menús aún no construidos (Cursos, Pagos, etc.)
        $('#moduloDashboard').hide();
        $('#moduloEstudiantes').hide();
        Swal.fire('Módulo en Desarrollo', 'Esta sección estará disponible pronto.', 'info');
    }

});

/* ========================================================
FUNCIÓN PARA CARGAR DATOS DEL DASHBOARD
======================================================== */
function cargarDatosDashboard() {
    $.ajax({
        url: "php/dashboard-datos.php",
        type: "GET",
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.exito) {
                let datos = respuesta.datos;

                // Actualizar KPIs
                $('#kpiTotalAlumnos').text(datos.kpis.totalAlumnos);
                $('#kpiTotalAulas').text(datos.kpis.totalAulas);
                $('#kpiVacantesDisp').text(datos.kpis.vacantesDisp);

                // Preparar datos para gráfico de género
                let etiquetasGenero = [];
                let datosGenero = [];
                $.each(datos.graficos.genero, function (index, item) {
                    etiquetasGenero.push(item.GENERO);
                    datosGenero.push(item.cantidad);
                });

                // Preparar datos para gráfico de niveles
                let etiquetasNiveles = [];
                let totalesNiveles = [];
                let disponiblesNiveles = [];
                $.each(datos.graficos.niveles, function (index, item) {
                    etiquetasNiveles.push(item.NIVEL);
                    totalesNiveles.push(item.totales);
                    disponiblesNiveles.push(item.disponibles);
                });

                // Dibujar gráficos
                dibujarGraficoGenero(etiquetasGenero, datosGenero);
                dibujarGraficoNiveles(etiquetasNiveles, totalesNiveles, disponiblesNiveles);
            } else {
                console.log("Error al cargar datos del dashboard:", respuesta.mensaje);
                Swal.fire('Error', 'No se pudieron cargar los datos del dashboard.', 'error');
            }
        },
        error: function (xhr, status, error) {
            console.log("Error AJAX al cargar dashboard:", error);
            Swal.fire('Error', 'Error de conexión al cargar el dashboard.', 'error');
        }
    });
}

$(document).ready(function () {
    // 1. ABRIR MODAL PARA NUEVO REGISTRO
    $('.btn-primary').on('click', function () {
        $('#formAlumno')[0].reset(); // Limpiar formulario
        $('#opcion').val('1'); // Configurar acción: CREAR
        $('#modalTitulo').text('Registrar Nuevo Alumno');
        $('#password').attr('required', true); // Contraseña obligatoria al crear
        $('#modalAlumno').fadeIn();
    });
    // 2. CERRAR MODAL
    $('.btn-cerrar-modal').on('click', function () {
        $('#modalAlumno').fadeOut();
    });
    // 3. ENVIAR FORMULARIO (CREAR O EDITAR)
    $('#formAlumno').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "php/crud_alumnos.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize(), // Empaqueta todos los 14 campos automáticamente
            success: function (respuesta) {
                if (respuesta.exito) {
                    $('#modalAlumno').fadeOut();
                    Swal.fire('¡Éxito!', respuesta.mensaje, 'success').then(() => {
                        location.reload(); // Recargar para ver los cambios en la tabla
                    });
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });
    // 4. ELIMINAR REGISTRO (Click en el basurero)
    $(document).on('click', '.fa-trash', function () {
        // Obtenemos la fila y buscamos el ID del alumno (que está en la primera columna < td >)
        let fila = $(this).closest('tr');
        let idAlumno = fila.find('td:eq(0)').text();
        Swal.fire({
            title: '¿Eliminar Alumno?',
            text: "Se borrará permanentemente de la Base de Datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "php/crud_alumnos.php",
                    type: "POST",
                    dataType: "json",
                    data: { opcion: 3, id_alumno: idAlumno }, // Enviamos opción 3(Eliminar) y el ID
                    success: function (respuesta) {
                        if (respuesta.exito) {
                            fila.fadeOut(400, function () {
                                $(this).remove();
                            });
                            Swal.fire('Eliminado', respuesta.mensaje, 'success');
                        }
                    }
                });
            }
        });
    });
    // 5. EDITAR REGISTRO (Botón de Lápiz)
    $(document).on('click', '.fa-pen-to-square', function () {
        let idAlumno = $(this).closest('tr').find('td:eq(0)').text();

        $.ajax({
            url: 'php/crud_alumnos.php',
            type: 'POST',
            dataType: 'json',
            data: { opcion: 5, id_alumno: idAlumno },
            success: function (alumno) {
                if (!alumno || !alumno.ID_ALUMNO) {
                    Swal.fire('Error', 'No se pudo cargar la información del alumno.', 'error');
                    return;
                }

                $('#id_alumno').val(alumno.ID_ALUMNO);
                $('#opcion').val('2'); // Configurar acción: EDITAR
                $('#modalTitulo').text('Editar Alumno');
                $('#password').removeAttr('required'); // Contraseña opcional al editar

                $('#dni').val(alumno.DNI_ALUMNO);
                $('#nombres').val(alumno.NOMBRES);
                $('#apellidos').val(alumno.APELLIDOS);
                $('#fecha_nac').val(alumno.FECHA_NACIMIENTO);
                $('#edad').val(alumno.EDAD);
                $('#genero').val(alumno.GENERO);
                $('#direccion').val(alumno.DIRECCION);
                $('#celular').val(alumno.CELULAR);
                $('#correo').val(alumno.CORREO);
                $('#apoderado').val(alumno.NOMBRE_APODERADO);
                $('#cel_apoderado').val(alumno.CELULAR_APODERADO);
                $('#username').val(alumno.USERNAME);
                $('#password').val('');
                $('#estado').val(alumno.ESTADO);

                $('#modalAlumno').fadeIn();
            },
            error: function () {
                Swal.fire('Error', 'Hubo un problema al cargar los datos del alumno.', 'error');
            }
        });
    });

    /* ========================================================
    FUNCIÓN PARA CARGAR LA TABLA DESDE MYSQL
    ======================================================== */
    function cargarAlumnos() {
        $.ajax({
            url: "php/crud_alumnos.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 }, // Le pedimos a PHP que ejecute el case 4

            success: function (data) {
                let tbody = $('#tablaAlumnos');
                tbody.empty(); // Limpiamos la tabla por si había algo antes
                // Usamos un bucle para recorrer cada alumno que llego desde la Base de Datos
                $.each(data, function (index, alumno) {
                    // Construimos la fila (tr) inyectando las variables de la base de datos
                    let estado = (alumno.ESTADO || 'ACTIVO').toString().trim().toUpperCase();
                    let estadoClass = 'status-active';

                    if (estado === 'INACTIVO') {
                        estadoClass = 'status-inactive';
                    } else if (estado === 'EN PROCESO' || estado === 'PROCESO') {
                        estadoClass = 'status-pending';
                    }

                    let fila = `
                        <tr>
                        <td>${alumno.ID_ALUMNO}</td>
                        <td>${alumno.NOMBRES}</td>
                        <td>${alumno.APELLIDOS}</td>
                        <td>${alumno.DNI_ALUMNO}</td>
                        <td>${alumno.FECHA_NACIMIENTO}</td>
                        <td>${alumno.CELULAR}</td>
                        <td>${alumno.CORREO}</td>
                
                        <td><span class="status-badge ${estadoClass}"> ${estado} </span></td>
                        <td class="action-icons">
                        <i class="fa-solid fa-pen-to-square"></i>
                        <i class="fa-solid fa-eye"></i>
                        <i class="fa-solid fa-trash"></i>
                        </td>
                        </tr>
                        `;
                    // Agregamos la fila recién creada a nuestra tabla
                    tbody.append(fila);
                });
            },
            error: function () {
                console.log("Error al cargar los datos de la tabla.");
            }
        });
    }
    // ¡MUY IMPORTANTE! Ejecutar la función apenas cargue la página
    cargarAlumnos();
});
// --- FUNCIONES AUXILIARES PARA DIBUJAR ---
function dibujarGraficoGenero(etiquetas, datos) {
    let ctx = document.getElementById('graficoGenero').getContext('2d');
    // Destruir gráfico anterior si existe (evita superposición al cambiar de pestaña)
    if (chartGenero) { chartGenero.destroy(); }
    chartGenero = new Chart(ctx, {
        type: 'doughnut', // Gráfico circular tipo "Dona"
        data: {
            labels: etiquetas,
            datasets: [{
                data: datos,
                backgroundColor: ['#3498DB', '#E74C3C', '#F1C40F'],

                // Colores corporativos

                borderWidth: 2,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permite que se adapte a nuestro CSS

            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}
function dibujarGraficoNiveles(etiquetas, totales, disponibles) {
    let ctx =
        document.getElementById('graficoNiveles').getContext('2d');
    if (chartNiveles) { chartNiveles.destroy(); }
    chartNiveles = new Chart(ctx, {
        type: 'bar', // Gráfico de barras
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: 'Vacantes Totales',
                    data: totales,
                    backgroundColor: '#95A5A6', // Gris
                    borderRadius: 4
                },
                {
                    label: 'Vacantes Disponibles',
                    data: disponibles,
                    backgroundColor: '#2ECC71', // Verde
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// funcion para el modulo de CURSOS
$(document).ready(function () {
    cargarCursos();
});

function cargarCursos() {
    $.ajax({
        url: "php/crud_cursos.php",
        type: "POST",
        dataType: "json",
        data: { opcion: 4 }, // LISTAR CURSOS
        success: function (data) {
            let tbody = $('#tablaCursos');
            tbody.empty();

            // También cargar cursos inscritos para marcar
            $.ajax({
                url: "php/crud_cursos.php",
                type: "POST",
                dataType: "json",
                data: { opcion: 7 }, // CURSOS INSCRITOS
                success: function (inscritos) {
                    let inscritosIds = inscritos.map(c => c.ID_CURSO);

                    $.each(data, function (index, curso) {
                        let estaInscrito = inscritosIds.includes(curso.ID_CURSO);
                        let boton = estaInscrito ?
                            '<button class="btn btn-danger btn-sm eliminar" data-id="' + curso.ID_CURSO + '">Eliminar</button>' :
                            '<button class="btn btn-primary btn-sm inscribir" data-id="' + curso.ID_CURSO + '">Inscribirse</button>';

                        let fila = `<tr>
                            <td>${curso.CODIGO_CURSO}</td>
                            <td>${curso.NOM_CURSO}</td>
                            <td>${curso.CREDITO}</td>
                            <td>${boton}</td>
                        </tr>`;
                        tbody.append(fila);
                    });
                },
                error: function () {
                    // Si no hay sesión, mostrar todos sin marcar
                    $.each(data, function (index, curso) {
                        let fila = `<tr>
                            <td>${curso.CODIGO_CURSO}</td>
                            <td>${curso.NOM_CURSO}</td>
                            <td>${curso.CREDITO}</td>
                            <td><button class="btn btn-primary btn-sm inscribir" data-id="${curso.ID_CURSO}">Inscribirse</button></td>
                        </tr>`;
                        tbody.append(fila);
                    });
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar cursos:", error);
            Swal.fire('Error', 'No se pudieron cargar los cursos.', 'error');
        }
    });
}

// Evento para inscribirse
$(document).on('click', '.inscribir', function () {
    let idCurso = $(this).data('id');
    let fila = $(this).closest('tr');
    let nombreCurso = fila.find('td:eq(1)').text();

    Swal.fire({
        title: '¿Inscribirse al curso?',
        text: `¿Desea inscribirse en ${nombreCurso}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, inscribirme',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "php/crud_cursos.php",
                type: "POST",
                dataType: "json",
                data: { opcion: 6, id_curso: idCurso }, // INSCRIBIR
                success: function (respuesta) {
                    if (respuesta.exito) {
                        Swal.fire('¡Éxito!', respuesta.mensaje, 'success')
                            .then(() => cargarCursos()); // Recargar tabla
                    } else {
                        Swal.fire('Error', respuesta.mensaje, 'error');
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error al inscribir:", error);
                    Swal.fire('Error', 'No se pudo realizar la inscripción.', 'error');
                }
            });
        }
    });
});

// Evento para eliminar inscripción
$(document).on('click', '.eliminar', function () {
    let idCurso = $(this).data('id');
    let fila = $(this).closest('tr');
    let nombreCurso = fila.find('td:eq(1)').text();

    Swal.fire({
        title: '¿Eliminar inscripción?',
        text: `¿Desea eliminar su inscripción en ${nombreCurso}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "php/crud_cursos.php",
                type: "POST",
                dataType: "json",
                data: { opcion: 8, id_curso: idCurso }, // ELIMINAR INSCRIPCION
                success: function (respuesta) {
                    if (respuesta.exito) {
                        Swal.fire('¡Eliminado!', respuesta.mensaje, 'success')
                            .then(() => cargarCursos()); // Recargar tabla
                    } else {
                        Swal.fire('Error', respuesta.mensaje, 'error');
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error al eliminar:", error);
                    Swal.fire('Error', 'No se pudo eliminar la inscripción.', 'error');
                }
            });
        }
    });
});

//  FUNCION PARA MODULO DE AULAS

$(document).ready(function () {
    cargarAulas();
});

function cargarAulas() {
    $.ajax({
        url: "php/crud_aulas.php",
        type: "POST",
        dataType: "json",
        data: { opcion: 4 }, // LISTAR AULAS
        success: function (data) {
            let tbody = $('#tablaAulas');
            tbody.empty();

            $.each(data, function (index, aula) {
                let fila = `<tr>
                    <td>${aula.ID_AULA}</td>
                    <td>${aula.NIVEL}</td>
                    <td>${aula.GRADO}</td>
                    <td>${aula.SECCION}</td>
                    <td>${aula.VACANTES_TOTALES}</td>
                    <td>${aula.VACANTES_DISPONIBLES}</td>
                </tr>`;
                tbody.append(fila);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar aulas:", error);
            Swal.fire('Error', 'No se pudieron cargar las aulas.', 'error');
        }
    });
}



// Función para cerrar sesión
function cerrarSesion() {
    $.ajax({
        url: "php/login.php",
        type: "POST",
        data: { action: 'logout' },
        success: function (response) {
            window.location.href = "login.html";
        },
        error: function () {
            alert("Error al cerrar sesión");
        }
    });
}